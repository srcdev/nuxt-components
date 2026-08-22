# Claude Development Guidelines

This document provides context and best practices for AI assistance on this Nuxt component library project.

## Project Overview

**Framework**: Nuxt 4.3.0 with TypeScript
**Testing**: Vitest 3.2.4 with @nuxt/test-utils
**Architecture**: Component library with comprehensive testing and CI/CD

## Critical Auto-Import Behavior

⚠️ **IMPORTANT**: This Nuxt project has auto-imports enabled. **DO NOT** manually import Vue internals like:

- `ref`, `reactive`, `computed`, `watch`, `nextTick`
- `useState`, `useRoute`, `useRouter`
- Custom composables from `~/composables/`

**Exception**: Only import `type` definitions and external packages explicitly.

```vue
<!-- ✅ CORRECT -->
<script setup lang="ts">
import type { PropType } from "vue";
const count = ref(0); // auto-imported
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough); // auto-imported
</script>

<!-- ❌ INCORRECT -->
<script setup lang="ts">
import { ref, computed } from "vue"; // Unnecessary in Nuxt
import type { PropType } from "vue";
</script>
```

## Component Development Patterns

### Form Components

- Extend `BaseCheckboxRadioProps` interface from `~/types/forms/types.forms`
- Use `defineModel<T>()` for v-model support with proper typing
- Include `fieldHasError`, `theme`, `size`, `styleClassPassthrough` props
- Apply theme via `data-theme` attribute
- Comprehensive test coverage with `mountSuspended`

### Layout Components

- Use `useStyleClassPassthrough()` composable for styling flexibility
  - `elementClasses`: Computed reactive class string
  - `updateElementClasses(classes)`: Toggle classes on/off dynamically
  - `resetElementClasses(props.styleClassPassthrough)`: Reset to initial prop value
  - Watch prop changes and reset classes accordingly
- Dynamic slot patterns (e.g., `component-{index}-{type}`) — **default to named dynamic slots** (`v-for="(_, name) in $slots"`, consumer controls slot names). Only use indexed slots (`itemCount` prop) when the count is needed for logic beyond the slot loop itself (e.g. aria linking across two parallel loops, z-index math). See `.claude/skills/component-dynamic-slots.md` for the full decision guide and a third "prefixed slot inference" pattern.
- Leverage existing components when possible (composition over creation)
- CSS custom properties with `v-bind()` for dynamic values
- Functional base styles, allow HOC customization

### useStyleClassPassthrough Full API

```vue
<script setup lang="ts">
// Basic usage
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

// Advanced usage with dynamic class management
const { elementClasses, updateElementClasses, resetElementClasses } = useStyleClassPassthrough(
  props.styleClassPassthrough
);

// Toggle classes conditionally (e.g., based on slots or state)
updateElementClasses(["has-left-button", "has-right-button"]);

// Watch for prop changes and reset
watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>
```

## Testing Requirements

**Framework**: Vitest with `@nuxt/test-utils/runtime`
**Mount Function**: Always use `mountSuspended()` for Nuxt components
**Coverage**: Test props, slots, reactivity, accessibility, error states
**Location**: Tests in `{component-folder}/tests/` directory

```typescript
// ✅ Standard test pattern
import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentName from "../ComponentName.vue";

describe("ComponentName", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ComponentName);
    expect(wrapper.vm).toBeTruthy();
  });
});
```

### Advanced Testing Patterns

**Component Instance Access:**

```typescript
// ✅ Proper TypeScript casting for component internals
interface ComponentInstance {
  computedProp: { value: string };
  refProp: HTMLElement | null;
}
const vm = wrapper.vm as unknown as ComponentInstance;
expect(vm.computedProp.value).toBe("expected");
```

**Fake Timers:**

`test/vitest.setup.ts` calls `vi.useFakeTimers()` globally and cleans up in `afterEach`. Never call `vi.useFakeTimers()`, `vi.useRealTimers()`, or `vi.runAllTimers()` inside a test file — it conflicts with the global setup.

Use `vi.advanceTimersByTime(ms)` rather than `vi.runAllTimers()` to avoid firing auto-run timer chains that re-queue themselves (which would loop infinitely).

`nextTick` must be explicitly imported from `"vue"` in test files — auto-imports are component-only.

```typescript
// ✅ Async component with image preloading
import { nextTick } from "vue";

let mockImage: { src: string; onload: (() => void) | null; onerror: (() => void) | null };

beforeEach(() => {
  mockImage = { src: "", onload: null, onerror: null };
  vi.stubGlobal("Image", vi.fn(() => mockImage));
  // ⚠️ Do NOT call vi.unstubAllGlobals() in afterEach —
  // it removes the global stubs from vitest.setup.ts ($fetch, etc.)
});

// Helper: mount then simulate first image load
async function mountAndLoad(wrapper) {
  mockImage.onload?.();
  await nextTick();             // let onMounted resume after Promise.race
  vi.advanceTimersByTime(500); // fire loading timeout, not the 7s auto-run
  await nextTick();            // let Vue update DOM
  return wrapper;
}

// onerror needs one extra tick vs onload — callback → resolve → Promise.race → await resume
mockImage.onerror?.();
await nextTick();
await nextTick(); // extra tick for onerror promise chain
vi.advanceTimersByTime(500);
await nextTick();
```

**Browser API Mocking:**

```typescript
// ✅ Mock browser APIs (ResizeObserver, IntersectionObserver, etc.)
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("ResizeObserver", mockResizeObserver);
```

**DOM Element Testing:**

```typescript
// ✅ Test CSS custom properties and DOM manipulation
const element = wrapper.find(".component");
const style = (element.element as HTMLElement).style;
expect(style.getPropertyValue("--custom-prop")).toBe("expected-value");
```

**SVG and Dynamic Content:**

```typescript
// ✅ Test dynamically generated content (SVG paths, computed styles)
const vm = wrapper.vm as unknown as ComponentInstance;
vm.width = 200; // Set reactive property
await nextTick();
expect(vm.generatedPath.length).toBeGreaterThan(0);
```

## Styling Methodology

**Architecture**: CSS custom properties with BEM-like structure
**Approach**: Functional base styles, custom design via HOC style blocks
**Theme System**: `data-theme` attributes with CSS custom property overrides
**Responsive**: CSS Grid/Flexbox with container queries where supported
**rem base**: `html` font-size is set to `62.5%`, making `1rem = 10px`. Use this when calculating rem values (e.g. `1.6rem = 16px`, `2.4rem = 24px`).

```css
/* ✅ Component styling pattern */
.component-name {
  --_border-radius: var(--theme-border-radius, 0.5rem);
  --_transition-duration: var(--theme-transition-duration, 300ms);

  /* Functional base styles */
  border-radius: var(--_border-radius);
  transition: all var(--_transition-duration) ease;
}
```

## File Organization

```
app/
├── components/
│   ├── component-name/
│   │   ├── ComponentName.vue
│   │   └── tests/
│   │       └── ComponentName.spec.ts
├── composables/
├── types/
│   ├── components/
│   └── forms/
└── pages/
```

## TypeScript Conventions

- **Strict mode**: All components must pass TypeScript strict checks
- **Interface definitions**: Store in `~/types/{category}/` directories
- **defineModel typing**: Use union types for arrays/single values
- **Consumer-facing component types**: If a component defines an interface consumers need to import (e.g. a data-shape prop), don't leave it inline in the `.vue` file — inline types aren't importable by consuming apps. Move it to `app/types/components/<component-name>.d.ts` and export it from `app/types/components/index.ts` so it's reachable as `import type { X } from "srcdev-nuxt-components"`. See `.claude/skills/component-export-types.md`.

### Props Pattern

Always use `interface Props` + `withDefaults(defineProps<Props>(), {...})`. Never use options-style `defineProps({ propName: { type: ..., default: ... } })`.

```typescript
// ✅ Correct — modern typed props
interface Props {
  tag?: "div" | "section";           // optional with union literal types
  label?: string;
  itemCount: number;                 // required — no `?`
  columnCount?: 2 | 3 | 4 | 5 | 6;
  gap?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  label: "",
  columnCount: 2,
  gap: "1rem",
  styleClassPassthrough: () => [],   // array/object defaults use factory functions
});

// ✅ Proper defineModel typing
const model = defineModel<(string | number)[] | string | undefined>();
```

## Vue Template Conventions

- **Prop hyphenation**: ESLint (`vue/attribute-hyphenation`) requires camelCase props to be written hyphenated in templates. Always use `:item-count`, `:column-count`, `:style-class-passthrough` — never the camelCase form.
- **Self-closing elements**: Already covered in pitfalls — use explicit closing tags everywhere.
- **Linting workflow**: For ESLint auto-fixable issues after an edit, save the file and let IDE auto-fix run first. Only attempt manual corrections if issues remain.
- **Hyphenated attributes in tests**: When a component uses a hyphenated Vue prop like `:tab-index`, Vue renders it as the literal `tab-index` DOM attribute — not `tabindex`. Assert with `attributes("tab-index")`, not `attributes("tabindex")`.

## Storybook

### NuxtImg / @nuxt/image on Vercel

`@nuxt/image` auto-detects Vercel and generates `/_vercel/image?url=...` URLs. In deployed Storybook (`storybook-static/`), source images aren't present so this fails. Three changes are required together:

1. **`.storybook/main.ts`** — set `process.env.STORYBOOK = "true"` at the top of the file, and add `staticDirs: ["../public"]` inside the config.

2. **`nuxt.config.ts`** — set `image: { provider: process.env.STORYBOOK ? "none" : undefined }`. The `"none"` provider passes src through unchanged; `undefined` auto-detects (uses Vercel provider in production).

3. **`NuxtImg` tags** — always add explicit `width` and `height` props to avoid a `w=1536` fallback (not in Vercel's allowed widths: 640, 750, 828, 1080, 1200, 1920, 2048, 3840).

### Fonts

`@nuxt/fonts` is disabled in Storybook. Fonts are served instead via `.storybook/fonts.css` (imported in `.storybook/preview.ts`). Font files live in `.storybook/public/_fonts/` and are served as static assets.

| Context   | Font source |
|-----------|-------------|
| Nuxt app  | `@nuxt/fonts` (bunny CDN) |
| Storybook | `.storybook/fonts.css` + static files in `.storybook/public/_fonts/` |

See `.claude/skills/storybook-add-font.md` for the step-by-step process to add a new font (including curl script to download woff2 files from bunny CDN).

## Documentation System

**MCP Reference**: Structured documentation in `.mcp/component-patterns.json`
**Purpose**: AI agent integration and pattern reference
**Coverage**: Component APIs, styling systems, common tasks, best practices

## Common Pitfalls to Avoid

1. **Manual Vue imports**: Don't import `ref`, `computed`, etc. (auto-imported)
2. **Self-closing HTML elements**: ESLint (`vue/html-self-closing`) disallows self-closing non-void elements — always use explicit closing tags: `<slot name="foo"></slot>`, `<span></span>`, not `<slot name="foo" />` or `<span />`
3. **Missing test coverage**: Every component needs comprehensive tests
4. **Hardcoded styles**: Use CSS custom properties for flexibility
5. **PropType runtime imports**: Import as type only
6. **Missing accessibility**: Include proper ARIA attributes
7. **Inconsistent naming**: Follow established slot/prop naming patterns
8. **Incorrect type casting**: Use `as unknown as CustomType` for component instances
9. **Unmocked browser APIs**: Always mock ResizeObserver, IntersectionObserver, etc.
10. **Missing DOM element casting**: Cast to HTMLElement when accessing style properties
11. **Sass-style BEM nesting in native CSS**: Never use `&__child` or `&-modifier` concatenation — this is Sass syntax and does not work in native CSS. esbuild silently converts `&__foo` to `:is(__foo)` which matches nothing. Use `& .block__child` (descendant selector) or a top-level `.block__child {}` rule instead. See `.claude/skills/css-nesting-conventions.md`.
12. **`:src` on `<video>`**: Binding `:src` directly on a `<video>` element silently skips the browser fetch when Vue patches it on client-side navigation — no error, no network request, poster just sits there. Always use a `<source :src="src">` child instead, combined with `:key="src"` and an explicit `videoEl.load()` call. See `.claude/skills/vue-video-autoplay.md`.
13. **Pairing `--theme-text`/`--theme-text-inverted` with `--theme-surface-hover`/`--theme-surface-inverted`**: these two "text" tokens are meant for text sitting on a *light* surface (their light-mode branch is a dark colour step) — but `--theme-surface-hover` and `--theme-surface-inverted`'s light-mode branches are themselves dark steps (by design, so buttons stay bold/coloured even in light mode). Pairing them produces invisible dark-on-dark text in light mode (or any consumer app pinning `color-scheme: light`, e.g. via `data-color-scheme="light"`). Always pair a dark/bold surface with `--theme-on-surface` instead — it's a fixed light value in both modes. `InputButtonCore`'s `.secondary:hover` and `AlertContentInner`'s dismiss-button hover already do this correctly; `InputButtonCore`'s base and `.tertiary` hover states didn't (fixed 2026-08-03) — check any new hover/inverted state against this pattern before shipping it.
14. **Early `05.forms` components read global `--theme-*` tokens directly, with no local indirection**: `InputTextCore`/`InputSelectCore` used to consume `--theme-input-surface`/`--theme-border`/`--theme-border-focus` straight from the global theme-slot tokens, unlike newer components (`ExpandingPanel`'s `--expanding-panel-*`, `TreatmentConsultant`'s `--_*` tokens) which expose their own component-scoped custom properties. A consumer app hit a case where overriding the global tokens didn't visibly land and the cause wasn't pinned down — plausibly cascade/build tooling behaving unexpectedly rather than a specificity bug (the override selector had provably higher specificity than the token's declaration site). Fixed 2026-08-22 by giving both components local `--_input-text-*`/`--_input-select-*` tokens that default from the global ones — see each component's `CONSUMER-STYLING.md` for the two override paths this gives consumers. The rest of `05.forms` (`InputNumberCore`, `InputCheckboxRadioButton`/`Core`, `InputTextareaCore`, `InputButtonCore`, `ToggleSwitchCore`, `TripleToggleSwitchCore`) and a few molecules (`DisplayTooltip`, `AlertContent`/`AlertContentInner`, `DisplayThemeSwitch`) still read the global tokens directly — apply the same local-token pattern to any of them the next time one is touched, rather than doing all of them in one pass.
15. **`InputSelectCore` was visibly taller than `InputTextCore`/`InputButtonCore` next to it**: `.input-select-core` set `line-height: var(--input-element-line-height)` (`3.1`, a unitless multiplier) — at this repo's `1.6rem` `--input-font-size` that computes to ~4.96rem, taller than `--input-min-height` (`4.4rem`) itself, so the select's box grew past its siblings'. `InputTextCore`'s equivalent declaration was already commented out (someone hit this before and disabled it there) but the same line was left active in `InputSelectCore` — fixed 2026-08-22 by commenting it out to match. Only visible when a select sits inline next to a text input/button at the same geometry tokens; easy to miss reviewing one input at a time. Check any new form element against `--input-min-height` if it looks even slightly off next to its siblings.
16. **`DisplayDialog` used bare generic class names for its internal sections** (`.inner`, `.header`, `.footer`, `.col-left`, `.col-right`, `.dialog-content`): since `DisplayDialog` renders `<dialog>` inline (not via `<Teleport>`), it's a genuine DOM descendant of wherever it's used — a consumer app's own `.header`/`.footer` layout CSS (extremely common class names) silently overrode the dialog's own footer/header layout by pure class-name collision, since unlayered consumer CSS always beats `@layer components` regardless of specificity (see pitfall #13's mechanism, same cascade rule, different trigger). Fixed 2026-08-22 by prefixing all six to `.display-dialog-*` (`.display-dialog-inner`, `.display-dialog-header`, etc.) — see `CONSUMER-STYLING.md`. Also fixed in the same pass: `.inner.confirm` was left at `width: initial` while `.inner.alert` right next to it was already capped at `min(90%, 48rem)` — an unconstrained flex item won't wrap a long confirm message, so it rendered as one unbroken line and dragged the whole dialog out to that width. When adding any new component whose root or child elements render inline in the consumer's DOM (not teleported/portaled), prefix every structural class name with the component name — generic names (`header`, `footer`, `inner`, `content`, `col-left`) are exactly the ones a consumer app is most likely to also have.
17. **`DisplayToast`/`DisplayToastProvider` hardcoded `z-index: 100` with no override token**, unlike `DisplayDialog`'s `--display-dialog-z-index` (default `999999`) — a toast is meant to float above ordinary page chrome, but 100 loses to almost any consumer's sticky header. Fixed 2026-08-22: both now expose `--display-toast-z-index`/`--display-toast-provider-z-index`, defaulting to `999999` to match `DisplayDialog`'s convention. See the new `CONSUMER-STYLING.md` in `01.atoms/toast/`. When adding any `position: fixed`/`sticky` overlay component, give it a public z-index token from the start and default it to match the library's existing "definitely on top" value (`999999`) rather than an arbitrary low number.

## Development Workflow

1. **Plan**: Check existing patterns in MCP documentation
2. **Create**: Follow established component patterns
3. **Style**: Functional base styles with CSS custom properties
4. **Test**: Comprehensive test suite with `mountSuspended`
5. **Document**: Update MCP reference for new patterns
6. **Snippet**: Create or update `.vscode/srcdev-component-{name}.code-snippets` — required for every new or changed component
7. **Skill**: Update `.claude/skills/components/<component-name>.md` — required for every new or changed component, same as the snippet in step 6. Covers any change to props/slots/models, defaults, new behaviour, or a bug fix that changes what the component observably does (e.g. it now closes on outside click when it didn't before). Skills are what an AI agent (including Claude Code, in this repo or a consumer app) reads to know how to use the component correctly — a stale skill silently teaches wrong usage. If the component has no skill doc yet, create one following the pattern of an existing one in `.claude/skills/components/`.
8. **Verify**: Ensure TypeScript strict mode compliance

## CI/CD

- **GitHub Actions**: Automated testing on Node 20/22
- **Type Checking**: TypeScript strict mode validation
- **Test Suite**: All tests must pass before merge
- **Badge Status**: Green badges indicate healthy codebase

---

**Remember**: This is a production-ready component library. Maintain high standards for code quality, testing, and documentation.
