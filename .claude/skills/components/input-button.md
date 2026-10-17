# InputButton

> **Renamed 2026-09-28:** `InputButtonCore` → `InputButton`; root class `.input-button-core` →
> `.input-button`; `data-testid="input-button-core"` → `"input-button"`. Same props, slots and
> tokens. Consumer apps keep the old name until they bump to the release that ships the rename.

## Overview

`InputButton` (`05.forms/input-button`) is the library's button. It renders a `<button>` by
default, a `NuxtLink` for an internal `href` (leading `/`), or an `<a>` for an external one. Every
other library component that needs a button (dialogs, navigation burgers, grids, alerts) uses it,
so its tokens restyle those too.

## Props

> Hyphenate props in templates (`:button-text`, `:is-pill`, `:style-class-passthrough`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `buttonText` | `string` | `""` | Visible label; becomes `sr-only` with the `#iconOnly` slot, so always set it for icon-only buttons |
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "inline"` | `"primary"` | Rendered as `data-variant`. Primary is filled, secondary outlined, tertiary text-only (tint on hover). `inline` has no colours of its own and is for action buttons inside custom wrappers (see `component-inline-action-button.md`) |
| `type` | `"button" \| "reset" \| "submit"` | `"button"` | Ignored when rendered as a link |
| `href` | `string` | — | Renders a link instead of a button |
| `external` | `boolean` | `false` | Force a real navigation for a same-origin `href` that isn't a Vue Router page (e.g. a Nitro server route) |
| `theme` | `"default" \| "success" \| "error" \| "warning"` | `"default"` | Sets `data-theme`, re-declaring the `--theme-*` palette on the button |
| `isPill` | `boolean` | `false` | Fully rounded (`data-pill`) |
| `isPending` | `boolean` | `false` | Sets `data-pending` (dimmed primary surface; with `hasPendingEffect`, animates the border and blocks clicks) |
| `hasPendingEffect` | `boolean` | `false` | Renders the `PendingEffect` overlay, sets `data-pending-effect` |
| `readonly` | `boolean` | `false` | Dimmed, `aria-disabled="true"`, and not operable: clicks (mouse or keyboard) are swallowed before any consumer `@click` runs |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Classes on the root. Reactive after mount |

## Slots

| Slot | Notes |
|---|---|
| `#left` | Icon/content before the text (ignored with `#iconOnly`) |
| `#right` | Icon/content after the text (ignored with `#iconOnly`) |
| `#iconOnly` | Square icon-only button; `buttonText` becomes the accessible name |

Give slotted `<Icon>`s `class="icon"` to pick up `--input-icon-size` (applied as `font-size`).

## Usage

```vue
<InputButton button-text="Save" type="submit" />

<InputButton variant="secondary" button-text="Read more" href="/about">
  <template #right><Icon name="mdi:arrow-right" class="icon" /></template>
</InputButton>

<InputButton variant="tertiary" button-text="Close menu">
  <template #iconOnly><Icon name="mdi:close" class="icon" /></template>
</InputButton>
```

## Accessibility

- Icon-only buttons keep `buttonText` as `sr-only` text: never leave it empty.
- `readonly` is exposed as `aria-disabled="true"` (omitted otherwise) and blocks activation; the button stays focusable
  so its label is still discoverable (unlike native `disabled`).
- Focus ring: `:focus-visible` with `--button-focus-ring-width` / `-offset`.

## Styling

Colour tokens are `--input-button-{variant}-{property}` with `--theme-*` fallbacks; geometry and
typography are the global `--button-*` tokens. Full reference:
`app/components/05.forms/input-button/CONSUMER-STYLING.md`.

Long labels wrap inside the button (`--input-button-text-white-space` defaults to `normal`, and
unbroken strings break anywhere). Set it to `nowrap` to keep a label on one line; it then widens
the button instead. Button text is never line-clamped.

State hooks on the root: `data-variant`, `data-theme`, `data-pill`, `data-pending`,
`data-pending-effect`, `data-link`, `data-icon-only`. Inner elements: `.input-button-text` and
`.input-button-icon[data-slot="left" | "right" | "icon-only"]`.

## Notes

- Before 2026-09-28, `readonly` only set `pointer-events: none`, so keyboard users could still
  activate it; the icon size (`width`/`height` on `.icon`) was silently overridden by `@nuxt/icon`.
- **2026-10-17**: secondary changed from a filled `--theme-surface-inverted` button to outlined
  (transparent, `--theme-surface` border and text, `--theme-surface-subtle` on hover), and tertiary
  from a grey `--slate-01` fill with an underline to text-only. Both left the `contrast-color()`
  trial, which now covers primary only. Primary and secondary gained a 2px `box-shadow` ring
  (`--input-button-{variant}-shadow`, default `--colour-theme-2`; width `--input-button-shadow-width`),
  and their hover outline now takes the hover border colour (1px, no offset). Tertiary has neither.
- **2026-10-17**: state moved from bare classes to `data-*` attributes (`.primary` →
  `[data-variant="primary"]`, `.pill` → `[data-pill]`, `.is-pending` → `[data-pending]`,
  `.pending-effect` → `[data-pending-effect]`, `.is-link` → `[data-link]`, `.icon-only` →
  `[data-icon-only]`), and the inner classes were prefixed (`.button-text` →
  `.input-button-text`, `.btn-icon.left` → `.input-button-icon[data-slot="left"]`). The bare names
  collided with consumer CSS (pitfall #16). `--input-button-text-white-space` now defaults to
  `normal` (was `nowrap`, which overflowed narrow columns). `aria-disabled` is omitted instead of
  `"false"` when not readonly. Added the `StressTest` story.
