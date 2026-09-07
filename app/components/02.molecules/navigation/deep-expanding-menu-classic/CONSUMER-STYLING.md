# DeepExpandingMenuClassic — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--deep-expanding-menu-classic-gap` | `1.2rem` | Gap on the root grid |
| `--deep-expanding-menu-classic-item-gap` | `2.4rem` | Gap between top-level items |
| `--deep-expanding-menu-classic-link-border-width` | `0.2rem` | Bottom border width on links and group toggles |
| `--deep-expanding-menu-classic-link-padding-block` | `0.8rem` | Vertical padding on links and group toggles |
| `--deep-expanding-menu-classic-link-border-colour-hover` | `light-dark(var(--blue-10), var(--slate-00))` | Bottom border colour on hover/focus |
| `--deep-expanding-menu-classic-icon-size` | `1.2rem` | Caret icon size |
| `--deep-expanding-menu-classic-panel-offset-top` | `4rem` | Panel offset from the toggle |
| `--deep-expanding-menu-classic-panel-width` | `20rem` | Panel width below the `768px` breakpoint |
| `--deep-expanding-menu-classic-panel-width-tablet` | `40rem` | Panel width from `768px` |
| `--deep-expanding-menu-classic-panel-width-desktop` | `60rem` | Panel width from `1024px` |
| `--deep-expanding-menu-classic-panel-background-colour` | `white` | Panel background |
| `--deep-expanding-menu-classic-panel-border-width` | `0.1rem` | Panel border width |
| `--deep-expanding-menu-classic-panel-border-colour` | `black` | Panel border colour |
| `--deep-expanding-menu-classic-panel-border-radius` | `1.2rem` | Panel corner radius |
| `--deep-expanding-menu-classic-panel-shadow` | `0 0 1rem rgba(0, 0, 0, 0.1)` | Panel box-shadow |
| `--deep-expanding-menu-classic-panel-padding` | `1.2rem` | Panel padding |
| `--deep-expanding-menu-classic-panel-heading-colour` | `var(--slate-10)` | `childLinksTitle` heading colour inside the panel |
| `--deep-expanding-menu-classic-panel-list-gap` | `1.2rem` | Gap between child link grid items |
| `--deep-expanding-menu-classic-group-link-colour` | `var(--slate-10)` | Child link text colour |
| `--deep-expanding-menu-classic-group-link-border-colour-hover` | `var(--slate-10)` | Child link bottom border colour on hover/focus |

```css
.my-page {
  --deep-expanding-menu-classic-panel-background-colour: #1a1a1a;
  --deep-expanding-menu-classic-panel-border-colour: transparent;
  --deep-expanding-menu-classic-group-link-colour: white;
}
```

Or scope to a single instance via `styleClassPassthrough`:

```vue
<DeepExpandingMenuClassic style-class-passthrough="main-nav">...</DeepExpandingMenuClassic>
```
