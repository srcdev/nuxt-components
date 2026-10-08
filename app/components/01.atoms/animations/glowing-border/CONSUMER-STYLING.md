# GlowingBorder — Consumer Styling Guide

## Public token API

### Box

| Token | Default | Description |
|---|---|---|
| `--glowing-border-width` | `3px` | Border thickness. |
| `--glowing-border-radius` | `30px` | Corner radius. |
| `--glowing-border-surface` | `var(--theme-surface-subtle)` | Fill colour behind the glow (the padding-box layer). |
| `--glowing-border-text-colour` | `var(--theme-text)` | Text colour inside the box. |
| `--glowing-border-animation-duration` | `10s` | Time for the glow to complete one full rotation. |
| `--glowing-border-overflow` | `hidden` | Clips content to the rounded corners. Set `visible` when wrapping a control whose hover/focus outline must show (see the recipe below). |

> Changed 2026-10-08: `--glowing-border-surface` defaulted to the `canvas` system colour and no text
> colour was set. It now defaults to `var(--theme-surface-subtle)`, with the new
> `--glowing-border-text-colour` defaulting to `var(--theme-text)`. Set
> `--glowing-border-surface: canvas` to keep the old fill.

```vue
<GlowingBorder
  style="--glowing-border-width: 6px; --glowing-border-radius: 8px; --glowing-border-animation-duration: 3s;"
>
  <p>Fast, sharp-cornered glow</p>
</GlowingBorder>
```

### Variant colour stops

Each `variant` drives a 5-stop conic gradient. Every stop is an individually overridable token,
named `--glowing-border-{variant}-color-{1-5}`:

| Variant | Stops (defaults) |
|---|---|
| `subtle` (default) | `--glowing-border-subtle-color-1` `#ff9a9e` · `-2` `#fad0c4` · `-3` `#fad0c4` · `-4` `#fbc2eb` · `-5` `#a18cd1` |
| `vivid` | `--glowing-border-vivid-color-1` `#ff0000` · `-2` `#ffa500` · `-3` `#ffff00` · `-4` `#008000` · `-5` `#0000ff` |
| `silver` | `--glowing-border-silver-color-1` `#d4d4d4` · `-2` `#e4e4e4` · `-3` `#f5f5f5` · `-4` `#e4e4e4` · `-5` `#d4d4d4` |
| `steel` | `--glowing-border-steel-color-1` `#434343` · `-2` `#5a5a5a` · `-3` `#6e6e6e` · `-4` `#5a5a5a` · `-5` `#434343` |
| `green` | `--glowing-border-green-color-1` `#00ff87` · `-2` `#39ff14` · `-3` `#00c853` · `-4` `#64dd17` · `-5` `#00e676` |

```vue
<GlowingBorder
  variant="vivid"
  style="--glowing-border-vivid-color-1: var(--theme-accent); --glowing-border-vivid-color-5: var(--theme-accent-alt);"
>
  <p>Brand-coloured glow</p>
</GlowingBorder>
```

Private tokens, not public API: `--_glow-deg`, `--_clr-1` through `--_clr-5`, and
`--_gradient-glow` (the resolved per-variant colour stops and the animated rotation angle). Use the
public tokens above instead.

## State hooks

| Selector | Meaning |
|---|---|
| `.glowing-border` | Root element (rendered as the `tag` element). |
| `.glowing-border[data-variant="subtle\|vivid\|silver\|steel\|green"]` | The active colour variant. |

> Changed 2026-10-08: the variant used to be added as a bare class (`.glowing-border.green`), which
> collided with any consumer class of the same name (`.green`, `.silver` are common). It's now a
> `data-variant` attribute; update any selector that targeted the old class. The animation's
> keyframes were renamed from the generic `glow` to `glowing-border-rotate` for the same reason.

## Motion

The glow rotates continuously via CSS animation and stops automatically when the visitor has
`prefers-reduced-motion: reduce` set.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** the active variant re-declares its `--_clr-*` stops on the root from the
`--glowing-border-{variant}-color-*` tokens, so set those public tokens, never `--_clr-*`.

## Recipe: glow as a control's border

For a single "special" button or input, wrap just the control so the glow becomes its border.
No changes to the control are needed:

- `InputButton`'s border already defaults to its own surface colour, so it shows no edge of its own.
- `InputTextCore` needs `--input-text-border: transparent`.
- On the `GlowingBorder`: radius is the control's radius plus the glow width, surface
  `transparent`, overflow `visible` (so the control's hover and focus outlines aren't clipped),
  and an inline or shrink-to-fit display so it hugs the control.

```vue
<GlowingBorder tag="span" variant="vivid" style-class-passthrough="special-cta">
  <InputButton variant="primary" button-text="Book a free consultation"></InputButton>
</GlowingBorder>

<GlowingBorder variant="vivid" style-class-passthrough="special-input">
  <InputTextCore id="email" v-model="email" type="email" name="email"></InputTextCore>
</GlowingBorder>
```

```css
.special-cta,
.special-input {
  --glowing-border-width: 3px;
  --glowing-border-surface: transparent;
  --glowing-border-overflow: visible;
}

.special-cta {
  --glowing-border-radius: calc(var(--button-border-radius) + 3px);
  display: inline-block;
}

.special-input {
  --glowing-border-radius: calc(var(--form-input-border-radius) + 3px);
  --input-text-border: transparent;
}
```

The `HighlightedControls` story shows both.

## Class passthrough

Use `styleClassPassthrough` to add classes to the root element for layout purposes (positioning,
sizing). It doesn't affect the glow's colours or geometry, which stay governed by the tokens above.

```vue
<GlowingBorder style-class-passthrough="my-glowing-border">...</GlowingBorder>
```

## Notes

The root has `overflow: hidden` by default (`--glowing-border-overflow`, to clip content to the
rounded corners) and `overflow-wrap: anywhere`, so long unbroken words and URLs wrap instead of being clipped.
