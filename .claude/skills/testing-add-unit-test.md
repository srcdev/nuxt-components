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
    vi.restoreAllMocks(); // always restore vi.spyOn() stubs after each test
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

### Testing the aria-labelledby dev-warning (useAriaLabelledById)

Components using `useAriaLabelledById` (see [component-aria-landmark.md](component-aria-landmark.md))
`console.warn` on mount if `aria-labelledby` is set but no element in `document` has the matching
id. To assert this warning (or its absence) in a test, `mountSuspended` must attach to the real
document — by default VTU mounts into a detached container, so `document.getElementById` will
never find the slotted heading even when it's correctly bound, producing a false-positive warning:

```ts
const wrapper = await mountSuspended(ComponentName, {
  props: { tag: "section" },
  attachTo: document.body, // required — see note above
  slots: {
    default: (props: { headingId: string }) => h("h2", { id: props.headingId }, "Title"),
  },
});
```

> Returning a plain string from a slot function does **not** produce DOM — always use `h()`.

## Key rules

- Always `mountSuspended` — never `mount` or `shallowMount` from `@vue/test-utils` directly.
- Always call both `wrapper?.unmount()` and `vi.restoreAllMocks()` in `afterEach`. The unmount cleans up Vue; the restore cleans up any `vi.spyOn()` stubs so they don't leak into later test files.
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

### Native clicks are silently dropped under frozen time

Vue's event invoker ignores an event whose timestamp is at or before the moment its listener was
attached (a guard against an event that triggered the patch also firing the new listener). With
the clock frozen, a native `button.click()` or `dispatchEvent()` straight after mount carries the
same timestamp, so the handler never runs and the test fails with "called 0 times". Whether it
bites depends on render timing: `CookieConsentBanner`'s click tests passed with raw `<button>`s
and failed once they became `InputButton`s (2026-10-15). Either use test-utils'
`wrapper.trigger("click")` (which works, including on teleported content via `findComponent`), or
advance the clock first:

```ts
// Vue ignores events stamped at or before its listener's attach time; fake timers freeze both.
function click(button: HTMLElement) {
  vi.advanceTimersByTime(1);
  button.click();
}
```

## `mountSuspended` flushes component async setup — initial state may be past the first `await`

`mountSuspended` calls `flushPromises()` internally, draining all pending microtasks including `await nextTick()` calls inside the component's async functions. If a component's async lifecycle starts with `await nextTick()` (e.g. to let a CSS `v-bind` update before beginning a transition), **the component will have already executed past it by the time `mountSuspended` returns**.

Assert the post-flush state, not the state before the first await:

```ts
// Component's runEffect() starts with: await nextTick(); opacity.value = 0;
// ❌ — by the time mountSuspended returns, opacity is already 0
const wrapper = await mountSuspended(MyComponent, { props });
expect(wrapper.find(".content").attributes("style")).toContain("opacity: 1");

// ✅ — assert the state that exists after mountSuspended's flush
const wrapper = await mountSuspended(MyComponent, { props });
expect(wrapper.find(".content").attributes("style")).toContain("opacity: 0");
```

## `.then().catch()` requires two microtask hops; use `.then(onFulfilled, onRejected)` for one

When asserting Promise settlement with a single `await Promise.resolve()`, put both handlers in the two-argument form of `.then()`. Chaining `.then().catch()` creates an intermediate Promise that adds a second hop, so `settled` won't be `true` after only one drain:

```ts
// ❌ needs two await Promise.resolve() to settle
promise.then(() => { settled = true; }).catch(() => { settled = true; });

// ✅ settles after one await Promise.resolve()
promise.then(
  () => { settled = true; },
  () => { settled = true; },
);
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

## Router behaviour in tests: this repo has no vue-router

With no `app/pages/`, Nuxt installs its minimal router, and tests run against it. It has no routes,
its `RouterLink` renders a plain `<a>` (no active classes, never `aria-current`), `addRoute` returns
nothing, and `removeRoute` throws. So a test that pushes a route to make a link "active" proves
nothing. To test behaviour that depends on vue-router's `RouterLink` (as in a consumer app), stub it
with a component that does what vue-router does and lets fall-through attributes override it:

```ts
const VueRouterLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup: (props, { slots }) => () =>
    h("a", { href: props.to, "aria-current": "page", class: "router-link-exact-active" }, slots.default?.()),
});
wrapper = await mountSuspended(MyComponent, { global: { stubs: { RouterLink: VueRouterLink } } });
```

`PaginationNav.spec.ts` uses this for its arrows' `aria-current` (2026-10-27). Check that a test like
this fails without the fix: a `finally` that throws hides the real assertion error.

## Testing `useId()` uniqueness across instances

Each `mountSuspended` call is its own Nuxt app, so `useId()` restarts its counter and two separately
mounted instances get the **same** ids. That's a test artefact, not a bug. To prove two instances
don't collide, render both inside one host component (`MultipleCheckboxes.spec.ts`):

```ts
const Host = defineComponent({
  components: { ComponentUnderTest },
  setup: () => ({ props: initialPropsData }),
  template: `<div><ComponentUnderTest v-bind="props" /><ComponentUnderTest v-bind="props" /></div>`,
});
const host = await mountSuspended(Host);
const ids = host.findAll("input").map((input) => input.attributes("id"));
expect(new Set(ids).size).toBe(ids.length);
```

## Testing duplicate `v-for` keys

Duplicate keys don't show on first render, and Vue only warns (and only corrupts the DOM) inside
the keyed diff's unsorted middle section. A reorder that keeps the first or last item in place can
be resolved from the ends and never reaches it. Mount with two items sharing the repeatable field,
then `setProps` with the first and last items swapped, and assert the rendered labels in order
(`SkipLinks.spec.ts`). With an `href`-only key that test rendered five links instead of four.

## Stub third-party children that hold shared state

When a component renders a library child whose behaviour the spec doesn't need (the spec drives
the parent's own handlers), stub the child in the mount helper. Unmounting doesn't isolate a
library that keeps module-level state: `QrcodeStream` queues every camera start/stop on one shared
promise chain, so a start left from an earlier test failed mid-test and emitted `error` into the
next `CaptureQrCode`, but only under full-suite load and only with `SRCDEV_STANDALONE=true`
(2026-10-21).

```typescript
const qrcodeStreamStub = { name: "QrcodeStream", emits: ["detect", "error"], template: `<div class="qrcode-stream-stub"></div>` };

const mountCapture = async (options: CaptureMountOptions = {}) => {
  const wrapper = await mountSuspended(CaptureQrCode, {
    ...options,
    global: { ...options?.global, stubs: { QrcodeStream: qrcodeStreamStub, ...options?.global?.stubs } },
  });
  mounted.push(wrapper);
  return wrapper;
};
```

Assert against the stub's class, not the component's tag name (see
`.claude/rules/test-no-vacuous-assertions.md`). Run the spec with `npm run test:run` so
standalone-only modules load.

## Mocking browser APIs

### Global constructors (ResizeObserver, IntersectionObserver, etc.)

Use `vi.stubGlobal` before the `describe` block. Do **not** call `vi.unstubAllGlobals()` in `afterEach` — it removes stubs from `vitest.setup.ts` (`$fetch`, etc.):

```ts
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("ResizeObserver", mockResizeObserver);
```

### Prototype methods (Popover API, Canvas, etc.)

When an API is missing from jsdom entirely (e.g. `hidePopover`, `showPopover`) use `Object.defineProperty` in `beforeEach`. **`vi.restoreAllMocks()` does not clean these up** — delete them explicitly in `afterEach`:

```ts
beforeEach(() => {
  // vi.spyOn stubs are cleaned by vi.restoreAllMocks() in afterEach
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as never);

  // Object.defineProperty stubs are NOT cleaned by vi.restoreAllMocks() —
  // must be deleted explicitly to prevent leaking into other test files
  Object.defineProperty(HTMLElement.prototype, "hidePopover", {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
  Object.defineProperty(HTMLElement.prototype, "showPopover", {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  wrapper?.unmount();
  vi.restoreAllMocks(); // cleans up vi.spyOn stubs
  // Remove Object.defineProperty prototype stubs — vi.restoreAllMocks() won't touch these
  delete (HTMLElement.prototype as unknown as Record<string, unknown>)["hidePopover"];
  delete (HTMLElement.prototype as unknown as Record<string, unknown>)["showPopover"];
});
```

The `as unknown as Record<string, unknown>` double-cast is required because TypeScript's
`HTMLElement` type has no index signature — cast through `unknown` first.

## A mount helper that keeps `v-model` in sync

To test a `v-model` component through clicks and keys, feed `update:modelValue` back into the
props. The handler needs the wrapper it's creating, so hold it in a `const` object: a self-referencing
`const wrapper` is an implicit `any` under strict mode, and `let wrapper` assigned once fails
ESLint's `prefer-const`.

```ts
const mountToggle = async (props: Record<string, unknown> = {}) => {
  const holder: { current?: Awaited<ReturnType<typeof mountSuspended>> } = {};
  const onUpdate = (value: string | number) => {
    void holder.current?.setProps({ modelValue: value });
  };
  const wrapper = await mountSuspended(SlidingToggle, {
    props: { modelValue: "monthly", "onUpdate:modelValue": onUpdate, ...props },
  });
  holder.current = wrapper;
  mounted.push(wrapper);
  return wrapper;
};
```

Type the handler's `value` as the model's full type (`string | number` for a generic model), not
the narrower one a test happens to use.

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
