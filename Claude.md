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
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentName from "../ComponentName.vue";

describe("ComponentName", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ComponentName);
    expect(wrapper.vm).toBeTruthy();
  });
});
```

## Styling Methodology

**Architecture**: CSS custom properties with BEM-like structure
**Approach**: Functional base styles, custom design via HOC style blocks
**Theme System**: `data-theme` attributes with CSS custom property overrides
**Responsive**: CSS Grid/Flexbox with container queries where supported

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
- **PropType imports**: Only import `PropType` type, not the runtime function
- **Interface definitions**: Store in `~/types/{category}/` directories
- **defineModel typing**: Use union types for arrays/single values

```typescript
// ✅ Proper defineModel typing
const model = defineModel<(string | number)[] | string | undefined>();

// ✅ Proper PropType usage
import type { PropType } from "vue";
const props = defineProps({
  config: {
    type: Object as PropType<ConfigInterface>,
    default: () => ({}),
  },
});
```

## Documentation System

**MCP Reference**: Structured documentation in `.mcp/component-patterns.json`
**Purpose**: AI agent integration and pattern reference
**Coverage**: Component APIs, styling systems, common tasks, best practices

## Common Pitfalls to Avoid

1. **Manual Vue imports**: Don't import `ref`, `computed`, etc. (auto-imported)
2. **Missing test coverage**: Every component needs comprehensive tests
3. **Hardcoded styles**: Use CSS custom properties for flexibility
4. **PropType runtime imports**: Import as type only
5. **Missing accessibility**: Include proper ARIA attributes
6. **Inconsistent naming**: Follow established slot/prop naming patterns

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
