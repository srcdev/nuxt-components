# Adding a Unit Test

## Overview

Unit tests use Vitest with `mountSuspended` from `@nuxt/test-utils`. They verify props,
slots, classes, ARIA attributes, and computed internals. Snapshot tests catch unintended
HTML structure changes.

## File location

```url
app/components/<component-folder>/tests/<ComponentName>.spec.ts
```

## Standard structure

```ts
import { describe, it, expect, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentName from "../ComponentName.vue";

// --- Types (for accessing vm internals) ---
interface ComponentNameInstance {
  computedProp: string;
}

// --- Helper ---
const createWrapper = async (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
  return mountSuspended(ComponentName, {
    props: { requiredProp: "default", ...props },
    slots,
  });
};

describe("ComponentName", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  // -------------------------
  // Snapshots
  // -------------------------
  describe("Snapshots", () => {
    it("default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("variant-a", async () => {
      wrapper = await createWrapper({ variant: "a" });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  // -------------------------
  // Rendering
  // -------------------------
  describe("Rendering", () => {
    it("mounts without error", async () => {
      wrapper = await createWrapper();
      expect(wrapper.vm).toBeTruthy();
    });

    it("renders expected element", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".component-name").exists()).toBe(true);
    });
  });

  // -------------------------
  // Props
  // -------------------------
  describe("Props", () => {
    it("applies variant class", async () => {
      wrapper = await createWrapper({ variant: "secondary" });
      expect(wrapper.find(".component-name").classes()).toContain("secondary");
    });

    it("applies styleClassPassthrough", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["extra"] });
      expect(wrapper.find(".component-name").classes()).toContain("extra");
    });

    it("applies data-theme attribute", async () => {
      wrapper = await createWrapper({ theme: "secondary" });
      expect(wrapper.find(".component-name").attributes("data-theme")).toBe("secondary");
    });
  });

  // -------------------------
  // Accessibility
  // -------------------------
  describe("Accessibility", () => {
    it("has correct aria attribute by default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".component-name").attributes("aria-label")).toBeDefined();
    });
  });

  // -------------------------
  // Slots
  // -------------------------
  describe("Slots", () => {
    it("renders default slot content", async () => {
      wrapper = await createWrapper({}, { default: "<span>Content</span>" });
      expect(wrapper.find("span").exists()).toBe(true);
    });

    it("exposes scoped slot prop and it matches the rendered element", async () => {
      // Import h from vue at the top of the file (not auto-imported in test files)
      wrapper = await mountSuspended(ComponentName, {
        props: { ...defaultProps },
        slots: {
          slotName: (props: Record<string, unknown>) =>
            h("h2", { id: props.exposedId, class: "target" }, "Content"),
        },
      });
      const attrValue = wrapper.find(".component-name").attributes("aria-labelledby");
      expect(wrapper.find(".target").attributes("id")).toBe(attrValue);
    });
  });

  // -------------------------
  // Computed properties
  // -------------------------
  describe("Computed properties", () => {
    it("computedProp returns expected value", async () => {
      wrapper = await createWrapper({ someProp: "value" });
      expect((wrapper.vm as unknown as ComponentNameInstance).computedProp).toBe("expected");
    });
  });
});
```

## Scoped slots

When a component exposes data via slot props (e.g. an internally-generated `headingId`),
import `h` from `vue` explicitly — it is **not** auto-imported in test files — and use a
render function as the slot value so VTU receives a real VNode:

```ts
import { h } from "vue";

it("exposes headingId via scoped slot", async () => {
  const wrapper = await mountSuspended(ProfileSection, {
    props: { tag: "section", ...defaultProps },
    slots: {
      heroText: (props: Record<string, unknown>) =>
        h("h2", { id: props.headingId, class: "hero-heading" }, "Heading"),
    },
  });
  const labelledBy = wrapper.find(".profile-section").attributes("aria-labelledby");
  expect(labelledBy).toBeTruthy();
  expect(wrapper.find(".hero-heading").attributes("id")).toBe(labelledBy);
});
```

> Returning a plain string from a slot function does **not** produce DOM — always use `h()`.

## Key rules

- Always `mountSuspended` — never `mount` or `shallowMount` from `@vue/test-utils` directly.
- Always `afterEach(() => wrapper?.unmount())` to prevent test leaks.
- Use a `createWrapper` helper to keep individual tests short.
- Include at least one snapshot test per meaningful visual state.
- `nextTick` is **not** auto-imported in test files — always import it explicitly: `import { nextTick } from "vue"`.

## Fake timers

`vitest.setup.ts` calls `vi.useFakeTimers()` globally and resets in `afterEach`. **Never** call `vi.useFakeTimers()`, `vi.useRealTimers()`, or `vi.runAllTimers()` inside a test file — it conflicts with the global setup and can cause infinite loops or bleed between tests.

Use `vi.advanceTimersByTime(ms)` to move time forward by a specific amount. Avoid `vi.runAllTimers()` — it fires all queued timers including any that re-queue themselves, which loops infinitely.

```ts
// ✅
vi.advanceTimersByTime(500);
await nextTick();

// ❌ — can loop infinitely if a timer re-queues itself
vi.runAllTimers();
```

## Hyphenated prop attributes in tests

When a component uses a hyphenated Vue prop like `:tab-index` or `:aria-label`, Vue renders it as the literal hyphenated DOM attribute. Assert with the hyphenated form — not the camelCase equivalent:

```ts
// ✅ — prop :tab-index renders as the DOM attribute "tab-index"
expect(wrapper.find(".el").attributes("tab-index")).toBe("2");

// ❌ — "tabindex" won't match
expect(wrapper.find(".el").attributes("tabindex")).toBe("2");
```

## Snapshot testing

```ts
expect(wrapper.html()).toMatchSnapshot();
```

- Run `npm run test:update` after **intentional** component changes to regenerate snapshots.
- Never update snapshots to fix a failing test without first verifying the change is intentional.
- Snapshot files are committed alongside tests.

## Accessing component internals (vm)

```ts
interface ComponentInstance {
  computedProp: string;
  refElement: HTMLElement | null;
}
const vm = wrapper.vm as unknown as ComponentInstance;
expect(vm.computedProp).toBe("expected");
```

## Testing CSS custom properties

```ts
const el = wrapper.find(".component-name");
const style = (el.element as HTMLElement).style;
expect(style.getPropertyValue("--custom-prop")).toBe("expected-value");
```

**`v-bind()` in CSS — root component only.** Vue's `v-bind(propName)` in a component's `<style>` block sets `--v-bind-propName` on that component's root element in JSDOM. This only works when the component under test **is** the root wrapper. When the component is rendered as a **child** inside a parent, JSDOM does not apply those inline styles — `getPropertyValue` returns `""`.

```ts
// ❌ Won't work — StepperList is a child; JSDOM doesn't apply its v-bind() styles
const list = wrapper.find(".stepper-list");
expect((list.element as HTMLElement).style.getPropertyValue("--v-bind-indicatorSize")).toBe("4rem");

// ✅ Use findComponent + props() to test prop pass-through to a child component
expect(wrapper.findComponent(StepperList).props("indicatorSize")).toBe("4rem");
```

## Testing prop pass-through to child components

When a parent component forwards a prop to a child, use `findComponent` + `.props()` rather than inspecting the DOM:

```ts
import ChildComponent from "../../child/ChildComponent.vue";

it("passes myProp to ChildComponent", async () => {
  const wrapper = await mountSuspended(ParentComponent, {
    props: { myProp: "value" },
  });
  expect(wrapper.findComponent(ChildComponent).props("myProp")).toBe("value");
});
```

Import the child component directly in the test file — it is not auto-imported there.

## Mocking browser APIs

Mock before the `describe` block if the component uses ResizeObserver, IntersectionObserver, etc.:

```ts
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("ResizeObserver", mockResizeObserver);
```

## Describe section conventions

Use these section names consistently so tests are easy to scan:

| Section               | What it covers                                 |
| --------------------- | ---------------------------------------------- |
| `Snapshots`           | `toMatchSnapshot()` per visual state           |
| `Rendering`           | mounts, expected elements exist                |
| `Props`               | each prop produces the right class/attr/output |
| `Accessibility`       | ARIA attributes, sr-only, roles                |
| `Slots`               | named and default slots render correctly       |
| `Computed properties` | `wrapper.vm` internals via interface cast      |
| `Reactivity`          | state changes update the DOM as expected       |
