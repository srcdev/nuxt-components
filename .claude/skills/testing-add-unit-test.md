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

## Key rules

- Always `mountSuspended` — never `mount` or `shallowMount` from `@vue/test-utils` directly.
- Always `afterEach(() => wrapper?.unmount())` to prevent test leaks.
- Use a `createWrapper` helper to keep individual tests short.
- Include at least one snapshot test per meaningful visual state.

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
