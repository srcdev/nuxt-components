# DisplayTooltipDefined — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--display-tooltip-defined-content-gap` | `1.2rem` | Gap between title/body/action/close-button |
| `--display-tooltip-defined-title-colour` | `inherit` | `tooltipTitle` text colour |
| `--display-tooltip-defined-title-margin-block` | `0 0` | `tooltipTitle` block margin |
| `--display-tooltip-defined-title-font-size` | `1.6rem` | `tooltipTitle` font size |
| `--display-tooltip-defined-title-font-weight` | `700` | `tooltipTitle` font weight |
| `--display-tooltip-defined-title-line-height` | `120%` | `tooltipTitle` line height |
| `--display-tooltip-defined-title-letter-spacing` | `normal` | `tooltipTitle` letter spacing |
| `--display-tooltip-defined-body-colour` | `inherit` | `tooltipContent` text colour |
| `--display-tooltip-defined-body-margin-block` | `0 0` | `tooltipContent` block margin |
| `--display-tooltip-defined-body-font-size` | `1.3rem` | `tooltipContent` font size |
| `--display-tooltip-defined-body-font-weight` | `inherit` | `tooltipContent` font weight |
| `--display-tooltip-defined-body-line-height` | `140%` | `tooltipContent` line height |
| `--display-tooltip-defined-body-letter-spacing` | `normal` | `tooltipContent` letter spacing |
| `--display-tooltip-defined-action-colour` | `inherit` | `tooltipAction` text colour |
| `--display-tooltip-defined-action-margin-block` | `0 0` | `tooltipAction` block margin |
| `--display-tooltip-defined-action-font-size` | `1.4rem` | `tooltipAction` font size |
| `--display-tooltip-defined-action-font-weight` | `700` | `tooltipAction` font weight |
| `--display-tooltip-defined-action-line-height` | `130%` | `tooltipAction` line height |
| `--display-tooltip-defined-action-letter-spacing` | `normal` | `tooltipAction` letter spacing |
| `--display-tooltip-defined-close-button-margin-block` | `1.2rem 0` | Space above the close button |

The three `*-colour` tokens default to `inherit`, which resolves to the underlying
`DisplayTooltip` popover's own `--display-tooltip-popover-text-colour` (see its
CONSUMER-STYLING.md) — override there for a uniform colour change, or override one of these three
for a single field.

```css
.my-page {
  --display-tooltip-defined-title-colour: var(--brand-accent);
  --display-tooltip-defined-title-font-size: 1.8rem;
}
```

This component also renders (and can override) every `--display-tooltip-*` token from the
underlying `DisplayTooltip` — see its CONSUMER-STYLING.md for the full popover/trigger/close-button
token API.
