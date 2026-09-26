# InputError — Consumer Styling Guide

`InputError` is the red error message strip rendered under a form control by every `*Field`
wrapper (`InputTextWithLabel`, `InputNumberField`, `InputSelectWithLabel`, `SingleCheckbox`, ...).
It animates open (`grid-template-rows: 0fr → 1fr` plus opacity) when the field is in error.

## Public token API

Every token is consumed as `var(--input-error-*, {default})`, so none is declared on the element
itself: set them on any ancestor (or `:root`) and they inherit down.

| Token | Default | Controls |
|---|---|---|
| `--input-error-text-color` | `var(--input-error-color)` (`white`) | Message text colour |
| `--input-error-icon-color` | `--input-error-text-color` | Icon colour |
| `--input-error-icon-size` | `1em` | Icon size (applied as `font-size`, see pitfall #24) |
| `--input-error-background-color` | `var(--theme-error-surface)` | Strip background |
| `--input-error-border-color` | `var(--theme-error-border)` | Border colour while visible |
| `--input-error-outline-color` | `var(--theme-error-outline)` | Outline colour while visible (attached `underlined` variant always has no outline) |
| `--input-error-border-radius` | `var(--form-input-border-radius)` (`0.5rem`) | Corner radius (bottom corners when attached, all corners when detached) |
| `--input-error-font-family` | `var(--font-family)` | Message font family |
| `--input-error-font-size` | `1.6rem` | Message font size |
| `--input-error-font-weight` | `500` | Message font weight |
| `--input-error-padding-inline` | `1.2rem` | Inline padding of the message, and the icon's inset from the start edge |
| `--input-error-padding-block-start` | `1.2rem` (`normal` variant), `1rem` (others) | Message top padding. Setting it overrides every variant |
| `--input-error-padding-block-end` | `1rem` | Message bottom padding |
| `--input-error-list-gap` | `0.6rem` | Gap between messages when `error-message` is an array |
| `--input-error-detached-offset` | `2rem` | Gap above a visible detached error |
| `--input-error-margin-block-start` | `0.25rem` | Gap above an attached error. Declared globally in `03.theming/_default.css` |
| `--input-error-transition-duration` | `var(--theme-form-transition-duration)` (`0.2s`) | Open/close animation duration. The animation is disabled under `prefers-reduced-motion: reduce` |

### Why component tokens instead of the `--theme-error-*` ones

The root carries `data-theme="error"`, which matches the global `:where([data-theme="error"])`
rule in `03.theming/_error.css`. That rule **re-declares** `--input-error-color` and the three
`--theme-error-*` tokens on the error element itself, so overriding those on an ancestor never
reaches `InputError`. The `--input-error-*` tokens above aren't declared anywhere by default, so an
ancestor override always lands. If you really want to change the global ones, target
`.input-error-message` directly.

Private tokens (not public API): `--_text-color`, `--_border-radius`, `--_padding-inline`,
`--_transition-duration` (resolved intermediates reused across rules) and
`--_padding-block-start` (swapped by `data-input-variant`).

---

## State hooks

| Attribute on `.input-error-message` | When |
|---|---|
| `data-visible` | `show-error` is `true` |
| `data-detached` | `is-detached` is `true` (error sits below the control with a gap, fully rounded) |
| `data-input-variant="normal" \| "outlined" \| "underlined"` | Always, mirrors `input-variant` |

Inner elements: `.input-error-message-inner`, `.input-error-message-content`,
`.input-error-message-icon-wrapper`, `.input-error-message-icon`, `.input-error-message-text`,
`.input-error-message-single`, `.input-error-message-list`, `.input-error-message-list-item`.

> **Changed 2026-09-26**: state used to be bare classes (`.show`, `.detached`, `.normal`,
> `.outlined`, `.underlined`) and the inner elements used generic names (`.inner`,
> `.inner-content`, `.inner-icon`, `.icon`, `.message`, `.message-single`, `.message-list`,
> `.message-list-item`). Update selectors: `.input-error-message.show` →
> `.input-error-message[data-visible]`, `.inner .message` → `.input-error-message-text`, etc.
> Most old overrides (colour, font size, padding) can now be replaced by a token.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --input-error-font-size: 1.4rem;
  --input-error-border-radius: 0;
}
```

---

## Per-section overrides

```css
.contact-page {
  --input-error-background-color: var(--red-08);
  --input-error-border-color: var(--red-08);
  --input-error-detached-offset: 0.8rem;

  .input-error-message[data-input-variant="underlined"] {
    --input-error-padding-inline: 0;
  }
}
```

## Class passthrough

`:style-class-passthrough` (string or string array) adds classes to the root
`.input-error-message` element. Field wrappers don't forward it, so in practice use the tokens
above.
