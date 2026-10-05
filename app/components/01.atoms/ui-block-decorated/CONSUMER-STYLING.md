# UiBlockDecorated — Consumer Styling Guide

## Public token API

Each strength level (border 1-6, shadow 1-6, inner shadow 1-4) has its own token, defaulting to a
built-in elevation/border scale. Only the tokens for the strength levels actually in use need
overriding. To recolour every level at once, set the colour tokens instead.

The colour tokens are private-wrapped (`--_border-colour`, `--_shadow-colour`, `--_inner-shadow-colour`)
because each is reused across every strength level; set the public token, not the `--_` one.

| Token | Default | Controls |
|---|---|---|
| `--ui-block-decorated-border-colour` | `var(--theme-border)` | Border colour for every strength level |
| `--ui-block-decorated-shadow-colour` | `#000` | Drop shadow colour for every strength level; each level mixes in its own opacity (8% .. 18%) |
| `--ui-block-decorated-inner-shadow-colour` | `--ui-block-decorated-shadow-colour` | Inner shadow colour for every strength level (8% .. 14% opacity) |
| `--ui-block-decorated-border-1` .. `-6` | `1px` .. `6px solid` the border colour | Whole border at each strength level |
| `--ui-block-decorated-shadow-1` .. `-6` | `0 1px 2px` .. `0 24px 32px` in the shadow colour | Whole drop shadow at each strength level |
| `--ui-block-decorated-inner-shadow-1` .. `-4` | `inset 0 1px 2px` .. `inset 0 6px 8px` in the inner shadow colour | Whole inset shadow at each strength level |
| `--ui-block-decorated-inner-shadow-highlight` | `inset 0 1px 0 rgba(255,255,255,0.15)` | Highlight layered on top of every inner shadow strength |

```css
.my-page {
  --ui-block-decorated-border-colour: #7c3aed;
  --ui-block-decorated-shadow-colour: #7c3aed;
  --ui-block-decorated-shadow-3: 0 6px 12px rgba(0, 0, 0, 0.2);
  --ui-block-decorated-border-2: 2px dashed hotpink;
}
```

Or scope to a single instance via `styleClassPassthrough`:

```vue
<UiBlockDecorated :shadow-strength="3" style-class-passthrough="promo-block">...</UiBlockDecorated>
```

```css
.promo-block {
  --ui-block-decorated-shadow-3: 0 6px 12px rgba(0, 0, 0, 0.2);
}
```

---

## Strength props apply at most one class each

`borderStrength`, `shadowStrength` and `innerShadowStrength` are independent — a value of `0`
(the default) applies no class for that decoration. All three can be combined on the same
instance (e.g. a border and a shadow together).

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

