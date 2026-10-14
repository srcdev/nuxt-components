# DisplayAvatar Component

> **Changed 2026-10-14:** size is a `data-size` attribute, not a bare class (`.display-avatar.lg` → `.display-avatar[data-size="lg"]`). New `image-size` prop (default `112`): `NuxtImg` used to get `width="100%"`, which @nuxt/image ignores, so the Vercel provider requested its largest screen width for every avatar. A broken image now falls back to the initials, initials are emoji-safe, and long fallback text is clipped inside the circle. With `chip`, the status dot was drawn at the avatar's diameter instead of its configured size: avatar and chip both declared a private `--_size` on the same root element and the avatar's size rules won. The avatar's private tokens are now `--_avatar-size`/`--_avatar-font-size`. Content (both slots too) now sits in a full-size `.display-avatar-surface` that carries the background, so the chip's cutout covers the whole avatar instead of landing on the initials span and cutting into the letters.

> **Changed 2026-10-08:** new `status`/`status-label` props, forwarded to the chip. Chip status used to be an `online`/`idle`/`dnd` class through `style-class-passthrough`, which no longer colours the dot.

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
| `size`                      | `"xs" \| "s" \| "md" \| "lg" \| "xl"`   | `"md"`   | Sets `data-size`, which picks width, height and font-size.        |
| `chip`                      | `boolean \| DisplayChipConfig`           | —        | Add a status chip. `true` uses defaults; pass a config object to customise. |
| `status`                    | `DisplayChipStatus`                       | —        | Chip status colour (`offline`/`online`/`idle`/`dnd`), forwarded to `DisplayChip`. Ignored without `chip`; the chip defaults to `offline`. |
| `status-label`              | `string`                                  | —        | Screen-reader text for the chip status (e.g. "Online"), forwarded to `DisplayChip`. Ignored without `chip`. |
| `:image-size`              | `number`                                  | `112`    | Pixel width and height requested from `@nuxt/image` (1x; 2x is double). Raise it if you resize the avatar past `xl` with `--display-avatar-size`. |
| `:style-class-passthrough`  | `string \| string[]`                      | `[]`     | Extra CSS classes on the root element.                            |

### Size dimensions

| Size | Diameter | Font size |
| ---- | -------- | --------- |
| `xs` | 2.4rem (24px) | 1.2rem (12px) |
| `s`  | 3.2rem (32px) | 1.4rem (14px) |
| `md` | 4rem (40px)   | 1.6rem (16px) |
| `lg` | 4.8rem (48px) | 1.8rem (18px) |
| `xl` | 5.6rem (56px) | 2rem (20px)   |

Each step is a token (`--display-avatar-size-md`, `--display-avatar-font-size-md`, ...), and `--display-avatar-size`/`--display-avatar-font-size` override the scale for one avatar or an area. A custom `size` string renders at `md` unless you set `--display-avatar-size`. Full list in `CONSUMER-STYLING.md`.

---

## Slots

| Slot      | Purpose                                                              |
| --------- | -------------------------------------------------------------------- |
| `default` | Replaces the auto image/fallback content entirely.                  |
| `icon`    | Appended inside the avatar (e.g. an icon overlay over the image). |

Both slots render inside `.display-avatar-surface`, a full-size element that carries the background. With `chip`, that surface is what gets the cutout mask.

---

## Fallback text logic

When `src` is not set, a `<span>` renders the fallback value:

1. `text` prop — used as-is if it has any non-whitespace content.
2. `alt` initials — the first character (a whole grapheme, so emoji and flags stay intact) of the first two words. Extra whitespace is ignored.
3. Empty string — if neither is set.

When `alt` is set, the initials are `aria-hidden` and the full `alt` is rendered as `sr-only` text, so a screen reader announces "Jane Smith" rather than "J S". With only `text`, the text is read as-is.

If the image fails to load, the initials fallback shows instead (an empty circle when there is no `alt`). A new `src` tries the image again.

The fallback is one line, clipped to the circle: keep `text` short (1–3 characters).

With `src`, the image uses `alt`, or an empty (decorative) `alt` when none is given. Pass `alt` unless the name is already visible next to the avatar.

```
alt="John Doe"     → "JD"
alt="Alice"        → "A"
alt="Alice Bob C"  → "AB"
alt="🦄 Unicorn"    → "🦄U"
alt="  Jane  Smith " → "JS"
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
  status="online"
  status-label="Online"
/>
```

Default chip config: `{ size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg" }`. Without `status` the dot is `offline`.

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
  size?: string       // chip diameter, e.g. "12px"
  maskWidth?: string  // cutout ring width, e.g. "4px"
  offset?: string     // distance from avatar edge, e.g. "0px"
  angle?: string      // position around avatar (0–360deg), e.g. "45deg"
  icon?: string       // Iconify icon name
  label?: string      // short text (max 3 characters)
}
```

### Default slot override

```vue
<DisplayAvatar size="xl">
  <template #default>
    <img src="/images/profile.jpg" alt="Jane Smith" class="display-avatar-image" />
  </template>
</DisplayAvatar>
```

### Icon slot

```vue
<DisplayAvatar alt="Jane Smith">
  <template #icon>
    <Icon name="bi:check-circle-fill" class="display-avatar-icon" />
  </template>
</DisplayAvatar>
```

---

## Styling

Tokens for size, background, text colour, radius and icon size are in `CONSUMER-STYLING.md` next to the component; overrides follow [component-local-style-override.md](../component-local-style-override.md). Give an icon in the `#icon` slot the `display-avatar-icon` class to size it with `--display-avatar-icon-size`.

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- When `chip` is set, the root element becomes `DisplayChip` and the `as` prop is ignored.
- `class` and `style` are **not** declared as explicit props — they fall through to the root element automatically via Vue's attribute inheritance (`inheritAttrs: true`). Do not re-add them as props; doing so pulls them out of `$attrs` and breaks automatic inheritance.
- `NuxtImg` is used for the image, so `@nuxt/image` must be installed in the consuming app.
- 2026-09-27 migration: moved from `01.atoms` to `02.molecules` (it composes `DisplayChip`). Font sizes fixed (they were 16px-root rem values, rendering at 7.5–12.5px here); sizes and colours are now public tokens, with a `--theme-*` background and text colour instead of no background and faint `--slate-03` text. The hardcoded English `"Avatar"` alt fallback became an empty (decorative) alt, and initials now announce the full `alt`. Classes `.avatar-image`/`.avatar-icon` became `.display-avatar-image`/`.display-avatar-icon`. A stray `style-class-passthrough` attribute is no longer rendered on a native root, and the chip config now reacts to prop changes.
