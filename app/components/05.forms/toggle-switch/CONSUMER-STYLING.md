# ToggleSwitchCore — Consumer Styling Guide

## Public token API

Every colour token below is `var(--toggle-switch-*, {default})` — set the `--toggle-switch-*`
name to override just this component; leave it unset and it inherits the shared `--theme-*` token
every other themed component also falls back to. See `theming-component-token-pattern.md` for why
this two-tier shape exists. Defaults are unchanged from before this migration — this is a
token-rename pass, not a redesign.

| Token | Falls back to | Controls |
|---|---|---|
| `--toggle-switch-surface` | `var(--theme-checkbox-symbol-surface)` | Track background (resting) |
| `--toggle-switch-surface-hover` | `var(--theme-surface-subtle)` | Track background on hover |
| `--toggle-switch-border` | `var(--theme-border)` | Track border colour |
| `--toggle-switch-border-focus` | `var(--theme-border-focus)` | Track outline colour on `:focus-visible` |
| `--toggle-switch-symbol-border` | `var(--theme-text)` | Thumb border colour |
| `--toggle-switch-symbol-surface-off` | `var(--theme-on-surface)` | Thumb background, unchecked |
| `--toggle-switch-symbol-surface-on` | `var(--theme-surface)` | Thumb background, checked |
| `--toggle-switch-icon-on-color` | `var(--theme-on-surface)` | "On" icon colour |
| `--toggle-switch-icon-off-color` | `var(--theme-surface)` | "Off" icon colour |

Geometry (`--input-toggle-*`, `--form-element-*`) is shared across every `05.forms` component and
untouched by this — see `theming-form-geometry-tokens.md`.

### Track width

`--toggle-switch-track-width` overrides the track's width directly. Left unset, the track derives
its width from the shared `--input-toggle-*`/`--form-element-*` geometry tokens so it always scales
with `--input-toggle-symbol-size` — resize the thumb and the track resizes to match, no separate
width to keep in sync:

```css
.my-compact-toggle {
  --input-toggle-symbol-size: 2.2rem;
  /* Track width now follows automatically — no --toggle-switch-track-width override needed. */
}
```

Only set `--toggle-switch-track-width` if you need a width the formula doesn't produce (e.g. a
fixed width independent of symbol size).

> Five private locals (`--_icon-on-opacity`, `--_icon-off-opacity`, `--_symbol-background-color`,
> `--_symbol-margin-inline-start`, `--_symbol-checked-offset`) were removed during this migration —
> declared but never actually read by any property in the component, confirmed by grep. Not part
> of any public API, so nothing to update if you were relying on them (you weren't — they had zero
> effect).

---

## Global theming — app-level CSS file

```css
:where(html) {
  --toggle-switch-symbol-surface-on: var(--rose-05);
  --toggle-switch-border-focus: var(--rose-03);
}
```

---

## Per-instance overrides

```vue
<ToggleSwitchCore id="notifications" name="notifications" style="--toggle-switch-symbol-surface-on: var(--gold-06);" />
```
