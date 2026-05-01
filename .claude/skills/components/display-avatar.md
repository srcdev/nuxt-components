# DisplayAvatar Component

## Overview

`DisplayAvatar` renders a circular avatar — either an image (via `NuxtImg`) or a text fallback showing initials derived from the `alt` prop. Optionally wraps in a `DisplayChip` to show a status indicator badge.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:style-class-passthrough`.

| Prop (template form)       | Type                                      | Default  | Notes                                                              |
| -------------------------- | ----------------------------------------- | -------- | ------------------------------------------------------------------ |
| `as`                       | `string \| object`                        | `"span"` | Root element tag. Ignored when `chip` is set.                      |
| `src`                       | `string`                                  | —        | Image URL. Renders `NuxtImg` when set; fallback text otherwise.   |
| `alt`                       | `string`                                  | —        | Alt text for the image; also used to derive initials.             |
| `text`                      | `string`                                  | —        | Override the auto-derived initials with an explicit string.       |
| `size`                      | `"xs" \| "s" \| "md" \| "lg" \| "xl"`   | `"md"`   | Controls width, height, and font-size.                            |
| `chip`                      | `boolean \| DisplayChipConfig`           | —        | Add a status chip. `true` uses defaults; pass a config object to customise. |
| `:style-class-passthrough`  | `string \| string[]`                      | `[]`     | Extra CSS classes on the root element.                            |

### Size dimensions

| Size | Diameter | Font size |
| ---- | -------- | --------- |
| `xs` | 24px     | 0.75rem   |
| `s`  | 32px     | 0.875rem  |
| `md` | 40px     | 1rem      |
| `lg` | 48px     | 1.125rem  |
| `xl` | 56px     | 1.25rem   |

---

## Slots

| Slot      | Purpose                                                              |
| --------- | -------------------------------------------------------------------- |
| `default` | Replaces the auto image/fallback content entirely.                  |
| `icon`    | Appended inside the avatar (e.g. an icon overlay over the image). |

---

## Fallback text logic

When `src` is not set, a `<span>` renders the fallback value:

1. `text` prop — used as-is if provided.
2. `alt` initials — first character of each word, capped at two characters.
3. Empty string — if neither is set.

```
alt="John Doe"     → "JD"
alt="Alice"        → "A"
alt="Alice Bob C"  → "AB"
text="?"           → "?"
```

---

## Usage examples

### Image avatar

```vue
<DisplayAvatar
  src="/images/profile.jpg"
  alt="Jane Smith"
  size="lg"
/>
```

### Initials fallback

```vue
<DisplayAvatar alt="Jane Smith" size="md" />
<!-- renders: "JS" -->
```

### Custom text fallback

```vue
<DisplayAvatar text="?" size="xs" />
```

### Custom root element

```vue
<DisplayAvatar as="div" alt="Jane Smith" />
```

### With a status chip (default config)

```vue
<DisplayAvatar
  src="/images/profile.jpg"
  alt="Jane Smith"
  :chip="true"
/>
```

Default chip config: `{ size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg" }`.

### With a custom chip

```vue
<DisplayAvatar
  src="/images/profile.jpg"
  alt="Jane Smith"
  :chip="{
    size: '16px',
    maskWidth: '2px',
    offset: '4px',
    angle: '45deg'
  }"
/>
```

Full `DisplayChipConfig` shape (pass directly as the `chip` value):

```ts
interface DisplayChipConfig {
  size: string       // chip diameter, e.g. "12px"
  maskWidth: string  // cutout ring width, e.g. "4px"
  offset: string     // distance from avatar edge, e.g. "0px"
  angle: string      // position around avatar (0–360deg), e.g. "45deg"
  icon?: string      // Iconify icon name
  label?: string     // short text (max 3 characters)
}
```

### Default slot override

```vue
<DisplayAvatar size="xl">
  <template #default>
    <img src="/images/profile.jpg" alt="Jane Smith" class="avatar-image" />
  </template>
</DisplayAvatar>
```

### Icon slot

```vue
<DisplayAvatar alt="Jane Smith">
  <template #icon>
    <Icon name="bi:check-circle-fill" class="avatar-icon" />
  </template>
</DisplayAvatar>
```

---

## Local style override scaffold

```vue
<DisplayAvatar
  alt="Jane Smith"
  :style-class-passthrough="['profile-avatar']"
/>

<style>
/* ─── DisplayAvatar local overrides ────────────────────────────────
   Scope by your wrapper class, then nest .display-avatar directly.
   No :deep() needed (component styles are unscoped).
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.my-page-section {
  .display-avatar {
    &.profile-avatar {
      /* custom overrides */
    }
  }
}
</style>
```

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- When `chip` is set, the root element becomes `DisplayChip` and the `as` prop is ignored.
- `class` and `style` are **not** declared as explicit props — they fall through to the root element automatically via Vue's attribute inheritance (`inheritAttrs: true`). Do not re-add them as props; doing so pulls them out of `$attrs` and breaks automatic inheritance.
- `NuxtImg` is used for the image, so `@nuxt/image` must be installed in the consuming app.
