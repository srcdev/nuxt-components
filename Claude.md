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
- Dynamic slot patterns (e.g., `component-{index}-{type}`)
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

## Development Workflow

1. **Plan**: Check existing patterns in MCP documentation
2. **Create**: Follow established component patterns
3. **Style**: Functional base styles with CSS custom properties
4. **Test**: Comprehensive test suite with `mountSuspended`
5. **Document**: Update MCP reference for new patterns
6. **Verify**: Ensure TypeScript strict mode compliance

## CI/CD

- **GitHub Actions**: Automated testing on Node 20/22
- **Type Checking**: TypeScript strict mode validation
- **Test Suite**: All tests must pass before merge
- **Badge Status**: Green badges indicate healthy codebase

---

**Remember**: This is a production-ready component library. Maintain high standards for code quality, testing, and documentation.
