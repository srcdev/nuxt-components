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
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "inline"` | `"primary"` | `inline` is for action buttons inside custom wrappers (see `component-inline-action-button.md`) |
| `type` | `"button" \| "reset" \| "submit"` | `"button"` | Ignored when rendered as a link |
| `href` | `string` | — | Renders a link instead of a button |
| `external` | `boolean` | `false` | Force a real navigation for a same-origin `href` that isn't a Vue Router page (e.g. a Nitro server route) |
| `theme` | `"default" \| "success" \| "error" \| "warning"` | `"default"` | Sets `data-theme`, re-declaring the `--theme-*` palette on the button |
| `isPill` | `boolean` | `false` | Fully rounded |
| `isPending` | `boolean` | `false` | Adds `.is-pending` |
| `hasPendingEffect` | `boolean` | `false` | Renders the `PendingEffect` overlay |
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
- `readonly` is exposed as `aria-disabled="true"` and blocks activation; the button stays focusable
  so its label is still discoverable (unlike native `disabled`).
- Focus ring: `:focus-visible` with `--button-focus-ring-width` / `-offset`.

## Styling

Colour tokens are `--input-button-{variant}-{property}` with `--theme-*` fallbacks; geometry and
typography are the global `--button-*` tokens. Full reference:
`app/components/05.forms/input-button/CONSUMER-STYLING.md`.

Labels stay on one line by default. Set `--input-button-text-white-space: normal` to let a long
label wrap inside a narrow container (added 2026-10-06; `ServicesCardGrid` does this for its CTAs).

## Notes

- Before 2026-09-28, `readonly` only set `pointer-events: none`, so keyboard users could still
  activate it; the icon size (`width`/`height` on `.icon`) was silently overridden by `@nuxt/icon`.
