# DisplayTooltipDefined — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--display-tooltip-defined-title-colour` | `inherit` | `tooltipTitle` text colour |
| `--display-tooltip-defined-body-colour` | `inherit` | `tooltipContent` text colour |
| `--display-tooltip-defined-action-colour` | `inherit` | `tooltipAction` text colour |

All three default to `inherit`, which resolves to the underlying `DisplayTooltip` popover's own
`--display-tooltip-popover-text-colour` (see its CONSUMER-STYLING.md) — override there for a
uniform colour change, or override one of these three for a single field.

```css
.my-page {
  --display-tooltip-defined-title-colour: var(--brand-accent);
}
```

This component also renders (and can override) every `--display-tooltip-*` token from the
underlying `DisplayTooltip` — see its CONSUMER-STYLING.md for the full popover/trigger/close-button
token API.
