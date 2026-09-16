# UiBlockDecorated — Consumer Styling Guide

## Public token API

Each strength level (border 1-6, shadow 1-6, inner shadow 1-4) has its own token, defaulting to a
built-in elevation/border scale. Only the tokens for the strength levels actually in use need
overriding.

| Token | Default | Controls |
|---|---|---|
| `--ui-block-decorated-border-1` .. `-6` | `1px` .. `6px solid var(--theme-border)` | Border at each strength level |
| `--ui-block-decorated-shadow-1` .. `-6` | `0 1px 2px rgba(0,0,0,0.08)` .. `0 24px 32px rgba(0,0,0,0.18)` | Drop shadow at each strength level |
| `--ui-block-decorated-inner-shadow-1` .. `-4` | `inset 0 1px 2px rgba(0,0,0,0.08)` .. `inset 0 6px 8px rgba(0,0,0,0.14)` | Inset shadow at each strength level |
| `--ui-block-decorated-inner-shadow-highlight` | `inset 0 1px 0 rgba(255,255,255,0.15)` | Highlight layered on top of every inner shadow strength |

```css
.my-page {
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

## Strength props apply at most one class each

`borderStrength`, `shadowStrength` and `innerShadowStrength` are independent — a value of `0`
(the default) applies no class for that decoration. All three can be combined on the same
instance (e.g. a border and a shadow together).
