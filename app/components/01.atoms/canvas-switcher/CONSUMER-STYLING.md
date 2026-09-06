# CanvasSwitcher — Consumer Styling

CanvasSwitcher renders its buttons via `InputButtonCore` (`variant="tertiary"`, icon-only) — see
that component's own `CONSUMER-STYLING.md` for the button surface/hover/focus tokens it inherits.
CanvasSwitcher itself exposes the following public tokens:

| Token | Default | Applies to |
|---|---|---|
| `--canvas-switcher-gap` | `2rem` | Gap between the switcher's own children (currently just the list) |
| `--canvas-switcher-item-gap` | `1rem` | Gap between each button in the list |
| `--canvas-switcher-icon-size` | `2.4rem` | Width/height of each icon |
| `--canvas-switcher-icon-colour` | `light-dark(var(--slate-10), var(--slate-02))` | Icon colour, resting state |
| `--canvas-switcher-icon-colour-current` | `light-dark(var(--green-10), var(--green-04))` | Icon colour when that button's canvas is selected (`aria-pressed="true"`) |

## Class passthrough

`styleClassPassthrough` (string or string[]) is applied to the root `.canvas-switcher` element via
`useStyleClassPassthrough()`.

## Canvas-size utility classes

`.mobileCanvas`, `.tabletCanvas`, `.laptopCanvas`, `.desktopCanvas`, `.fullWidthCanvas` are also
declared in this component's stylesheet (not scoped to `.canvas-switcher`) so a consumer can apply
the same `MediaCanvas` value returned by `v-model:canvas-name` directly as a class on a preview
wrapper to constrain its width — see `LayoutGridA`/`LayoutGridB` stories for the pattern. These are
plain global utility classes, not overridable via a CSS custom property; import `CanvasSwitcher`
(or otherwise ensure its styles are bundled) wherever you rely on them.
