# HeaderBlock — Consumer Styling Guide

## No component-owned CSS tokens

`HeaderBlock` has no `<style>` block of its own. Visual size comes from applying one of six global
`.page-heading-1`–`.page-heading-6` utility classes (`classLevel` prop), defined in
`app/assets/styles/setup/05.typography/02.utility-classes/_font-classes-page-heading.css`:

```css
.page-heading-1 { font-size: var(--step-8); }
.page-heading-2 { font-size: var(--step-7); }
/* … down to .page-heading-6 { font-size: var(--step-3); } */
```

Each size is a fluid type-scale token (`--step-3` through `--step-8`, defined globally, not by
this component) — override those tokens at a page/section scope to change every `page-heading-*`
element's size at once, not just this component's.

All six levels also reset `margin-block: 0rem` and `padding-block: 0rem` (instead of relying on the
browser's own per-level heading margins, which vary by `<h1>`–`<h6>` and would otherwise fight
`classLevel`/`tagLevel` being independent). This is a deliberate blank slate — add spacing in your
own CSS rather than expecting a level to come with baked-in margin:

```css
.my-page .page-heading-1 {
  margin-block: 2.4rem 1.6rem;
}
```

## Overriding one instance

Use `styleClassPassthrough` to add your own class and override `font-size`/`font-weight`/etc. for
a single `HeaderBlock` instance without touching the shared `.page-heading-*` utility classes:

```vue
<HeaderBlock :tag-level="2" :class-level="1" style-class-passthrough="hero-title">Big idea</HeaderBlock>
```

```css
.hero-title {
  font-size: 6rem;
}
```
