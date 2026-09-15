# SkipLinks — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--skip-links-z-index` | `1000` | Stacking context of the revealed skip-nav panel |
| `--skip-links-gap` | `0.2rem` | Gap between stacked skip links |
| `--skip-links-background-colour` | `black` | Skip-nav panel background |
| `--skip-links-border-colour` | `white` | Skip-nav panel border colour |
| `--skip-links-border-width` | `1px` | Skip-nav panel border width |
| `--skip-links-padding` | `0.2rem` | Skip-nav panel padding |
| `--skip-links-text-colour` | `white` | Skip link text colour |
| `--skip-links-link-padding-block` | `0.8rem` | Skip link vertical padding |
| `--skip-links-link-padding-inline` | `1.2rem` | Skip link horizontal padding |
| `--skip-links-transition-duration` | `0.3s` | Duration of the reveal transition when a link is focused |
| `--skip-links-focus-outline-width` | `2px` | Focus outline width on a skip link |
| `--skip-links-focus-outline-colour` | `white` | Focus outline colour on a skip link |

```css
.my-page {
  --skip-links-background-colour: #111;
  --skip-links-border-colour: #ffd700;
  --skip-links-focus-outline-colour: #ffd700;
}
```

## Links are prop-driven

The set of skip links is provided via the `links` prop (`{ href, label }[]`), not slots — see the
skill doc for the default value and localisation notes.
