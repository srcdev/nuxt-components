# Claude Development Guidelines

This document provides context and best practices for AI assistance on this Nuxt component library project.

## Project Overview

**Framework**: Nuxt 4.3.0 with TypeScript
**Testing**: Vitest 3.2.4 with @nuxt/test-utils
**Architecture**: Component library with comprehensive testing and CI/CD

## Auto-imports

Nuxt auto-imports Vue APIs and `~/composables/` in app code: `.claude/rules/consumer/vue-auto-imports.md`.

## Component Development Patterns

### Form Components

- **Naming**: `<Name>` / `<Name>Field` (`.claude/rules/component-naming.md`; backlog in `.claude/skills/component-naming.md`)
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

**Fake Timers:** `test/vitest.setup.ts` installs fake timers and global stubs; see `.claude/rules/test-timers-globals.md` and `.claude/rules/consumer/explicit-vue-imports.md`.

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
**rem base**: `1rem = 10px` (`.claude/rules/consumer/css-rem-base.md`).

**Tokens**: public vs private split in `.claude/rules/css-public-private-tokens.md`; the explanation and examples are in `.claude/skills/theming-component-token-pattern.md`.

## File Organization

```text
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
- **Consumer-facing component types**: `.claude/rules/component-export-types.md`

### Props Pattern

`.claude/rules/consumer/vue-props-pattern.md`. Type models with unions, e.g. `defineModel<(string | number)[] | string | undefined>()`.

## Vue Template Conventions

- **Prop hyphenation**: `.claude/rules/consumer/vue-prop-hyphenation.md`
- **Self-closing elements**: `.claude/rules/consumer/vue-no-self-closing.md`
- **Linting workflow**: For ESLint auto-fixable issues after an edit, save the file and let IDE auto-fix run first. Only attempt manual corrections if issues remain.
- **Hyphenated attributes in tests**: `.claude/rules/test-hyphenated-attrs.md`

## Storybook

### Storybook is the only demo surface

`.claude/rules/no-demo-pages.md`. `app/pages/` was removed 2026-08-23 and leftover
`app/layouts/` demo shells 2026-09-13. `npm run dev` launches Storybook (`storybook dev -p 6006`);
there is no `nuxt dev` script in this repo. A consuming app may still have its own `app/pages/`.

### NuxtImg / @nuxt/image on Vercel

`@nuxt/image` auto-detects Vercel and generates `/_vercel/image?url=...` URLs. In deployed Storybook (`storybook-static/`), source images aren't present so this fails. Three changes are required together:

1. **`.storybook/main.ts`** — set `process.env.STORYBOOK = "true"` at the top of the file, and add `staticDirs: ["../public"]` inside the config.

2. **`nuxt.config.ts`** — set `image: { provider: process.env.STORYBOOK ? "none" : undefined }`. The `"none"` provider passes src through unchanged; `undefined` auto-detects (uses Vercel provider in production).

3. **`NuxtImg` tags**: numeric `width`/`height` (`.claude/rules/consumer/nuxt-img-dimensions.md`).

### Fonts

`@nuxt/fonts` is disabled in Storybook. Fonts are served instead via `.storybook/fonts.css` (imported in `.storybook/preview.ts`). Font files live in `.storybook/public/_fonts/` and are served as static assets.

| Context   | Font source |
|-----------|-------------|
| Nuxt app  | `@nuxt/fonts` (bunny CDN) |
| Storybook | `.storybook/fonts.css` + static files in `.storybook/public/_fonts/` |

See `.claude/skills/storybook-add-font.md` for the step-by-step process to add a new font (including curl script to download woff2 files from bunny CDN).

## Documentation System

**Skills**: `.claude/skills/` (start from `.claude/skills/index.md`), per-component docs in `.claude/skills/components/`
**Purpose**: AI agent integration and pattern reference
**Coverage**: Component APIs, styling systems, common tasks, best practices

## Where knowledge goes

- **`.claude/rules/*.md`**: short, imperative constraints that must always hold. One topic per
  file: the rule, a one-line why, a pointer to the skill for detail. Scope with `paths:`
  frontmatter; leave it out only for repo-wide rules. A path-scoped rule loads when a matching file
  is read, so a rule about creating new files must be repo-wide.
  Rules that also hold in an app extending the layer go in `.claude/rules/consumer/`, the only
  rules folder that ships (`package.json` `files`; `setup:claude` copies it to consumer apps). Keep
  those location-independent: name skills as "skill `x.md` (srcdev-nuxt-components)", not by
  path, and no CLAUDE.md pitfall numbers or ledger references.
- **`.claude/skills/`**: how-to, procedures, decision guides, per-component usage docs.
- **CLAUDE.md**: project overview and index, not rules.

Routing test: if it fits in one sentence and should apply every time matching files are touched
without being asked, it's a rule. If it needs explanation or examples, it's a skill. If both, write
the rule and link it to the skill. "Add a rule" always means `.claude/rules/`.

## Common Pitfalls to Avoid

Numbers are stable (code and docs cite them). Rule files are in `.claude/rules/` (or `.claude/rules/consumer/`).

1. **Manual Vue imports** → `vue-auto-imports.md`
2. **Self-closing elements** → `vue-no-self-closing.md`
3. **Missing test coverage**: Every component needs comprehensive tests
4. **Hardcoded styles**: Use CSS custom properties for flexibility
5. **PropType runtime imports**: Import as type only
6. **Missing accessibility**: Include proper ARIA attributes
7. **Inconsistent naming**: Follow established slot/prop naming patterns
8. **Incorrect type casting**: Use `as unknown as CustomType` for component instances
9. **Unmocked browser APIs**: Always mock ResizeObserver, IntersectionObserver, etc.
10. **Missing DOM element casting**: Cast to HTMLElement when accessing style properties
11. **Sass-style BEM nesting** → `css-native-nesting.md`
12. **`:src` on `<video>`** → `vue-video-source.md`
13. **`--theme-text` on dark surfaces** → `css-surface-text-pairing.md`
14. **Form components reading `--theme-*` directly** → `forms-local-tokens.md`. `InputTextCore`/`InputSelectCore` fixed 2026-08-22, `AlertContent` 2026-09-27; give the rest local tokens the next time each is touched, not in one pass.
15. **`InputSelectCore` taller than its siblings** (active unitless `line-height`, fixed 2026-08-22) → `forms-local-tokens.md`
16. **Generic structural class names** (`DisplayDialog`, 2026-08-22) → `component-class-prefix.md`
17. **Hardcoded overlay z-index** (`DisplayToast`, 2026-08-22) → `css-overlay-z-index.md`
18. **Utility class collision** (`mi-12` on carets, 2026-08-22) → `css-utility-class-collision.md`
19. **`ExpandingPanel` and WebKit** → `css-webkit-support.md`, `panel-variant-default.md`. An `@supports not selector(::details-content)` fallback was tried 2026-08-22 and didn't hold on real devices; don't reintroduce it. `ExpandingPanel` logs a dev-mode `console.warn` instead. `AccordianCore`'s `variant` and `ContentDocs`/`ResponsiveHeader`/`NavigationItems`' `panelVariant` default to `"classic"`. Classic's content div is a sibling of `.expanding-panel-classic-details`, not nested inside it like modern's.
20. **Pass-through private token layer** (`ServicesCard`, 2026-08-23) → `css-public-private-tokens.md`. The ledger's `redundant_priv_tokens` column checks it.
21. **Undefined custom properties behind a dead colour-scheme switch** (`AnimatedSvgText`, 2026-09-07) → `css-colour-scheme.md`
22. **Animation scoped to one child element type** (`AnimatedSvgText` targeted only `svg path`, so a `<text>` rendered nothing; broadened to `svg path, svg text`). When a component's CSS targets one element type inside a slot, check it against every element shape a consumer might put there.
23. **`*/` inside a CSS comment** → `css-comment-slash.md`. It looked like a stale Storybook/Vite cache at first; cache clearing was tried and ruled out.
24. **`@nuxt/icon` CSS unlayered** (fixed 2026-09-28) → `css-icon-layer.md`
25. **`computed()` over `useSlots()`** → `vue-slots-no-computed.md`. Fixed 2026-09-27 across 10 components and 2026-09-29 in `useAriaDescribedById`.
26. **Private tokens collide on a shared root** (`DisplayAvatar`/`DisplayChip`, 2026-10-14) → `css-private-token-collision.md`. Related: `DisplayChip` masks each direct child in that child's own box, so the host must be one full-size element (`.display-avatar-surface`).
27. **`:deep()` in unscoped styles** (`PricingCard`, 2026-10-15) → `css-no-deep.md`

## Development Workflow

The full definition of done is `.claude/skills/component-compliance-checklist.md`. Use `/new-component` to build a new component against it, and `/migrate-component` to bring an existing one up to it. The steps below are the short version.

1. **Plan**: Check existing patterns in `.claude/skills/`
2. **Create**: Follow established component patterns
3. **Style**: Functional base styles with CSS custom properties
4. **Test**: Comprehensive test suite with `mountSuspended`
5. **Snippet**: `.vscode/srcdev-component-{name}.code-snippets`
6. **Skill**: `.claude/skills/components/<component-name>.md`. Steps 5 and 6 are required for every new or changed component (`.claude/rules/component-definition-of-done.md`)
7. **Verify**: Ensure TypeScript strict mode compliance

At the end of a long session, run `/retro`: it checks every consumer-facing doc (CONSUMER-STYLING.md, skill doc, snippet, index, story text) against the code changed since the last release, fixes what's stale, then proposes learnings for skills, rules and memory.

## CI/CD

- **GitHub Actions**: Automated testing on Node 20/22
- **Type Checking**: TypeScript strict mode validation
- **Test Suite**: All tests must pass before merge
- **Badge Status**: Green badges indicate healthy codebase

---

**Remember**: This is a production-ready component library. Maintain high standards for code quality, testing, and documentation.
