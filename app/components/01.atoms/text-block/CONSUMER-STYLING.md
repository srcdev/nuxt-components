# TextBlock — Consumer Styling Guide

`TextBlock` is a plain wrapper whose only styling is vertical padding. Both edges default to the
global fluid spacing token `--fluid-space-48-96` (`clamp(3rem, …, 6rem)`, i.e. 30px–60px).

## Tokens

| Token | Default | Controls |
|-------|---------|----------|
| `--text-block-padding-block-start` | `var(--fluid-space-48-96)` | `padding-block-start` |
| `--text-block-padding-block-end` | `var(--fluid-space-48-96)` | `padding-block-end` |

```css
/* Tighter lead block on one page */
.price-list-page {
  --text-block-padding-block-start: var(--fluid-space-24-48);
  --text-block-padding-block-end: 0;
}
```

You don't need to redeclare the default padding in your own CSS to get it; the component ships it.

## Overriding one instance

Add your own class through `styleClassPassthrough` and set the tokens on it:

```vue
<TextBlock :style-class-passthrough="['page-lead']">…</TextBlock>
```

```css
.page-lead {
  --text-block-padding-block-end: 0;
}
```

`.text-block` is declared inside `@layer components`, so any unlayered consumer rule on the class
itself also wins, but prefer the tokens so the fallback chain stays intact.
