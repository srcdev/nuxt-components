# CookieConsentBanner — Consumer Styling Guide

> **Changed 2026-09-27**: classes and tokens renamed from `privacy-notice-banner` to
> `cookie-consent-banner` to match the component (`.privacy-notice-banner` →
> `.cookie-consent-banner`, `--privacy-notice-banner-*` → `--cookie-consent-banner-*`, and the
> `data-test-id` values likewise). The consent cookie's own name (`privacy-notice-consent`, owned by
> `useCookieConsent`) is unchanged.

## Public token API

### Position and panel

| Token | Default | Controls |
|---|---|---|
| `--cookie-consent-banner-z-index` | `999999` | Stacking order (matches `DisplayDialog`/`DisplayToast`) |
| `--cookie-consent-banner-gutter` | `1.6rem` | Distance from the viewport's bottom and side edges |
| `--cookie-consent-banner-max-width` | `64rem` | Maximum width (centred) |
| `--cookie-consent-banner-padding` | `1.6rem` | Panel padding |
| `--cookie-consent-banner-gap` | `1.2rem` | Gap between the message and the buttons |
| `--cookie-consent-banner-border-radius` | `0.8rem` | Panel corner radius |
| `--cookie-consent-banner-border` | `0.1rem solid var(--slate-10)` | Panel border (shorthand) |
| `--cookie-consent-banner-accent` | `var(--theme-accent)` | Accent colour: top border, accept button, reject hover border |
| `--cookie-consent-banner-accent-border-width` | `0.2rem` | Accent top-border width |
| `--cookie-consent-banner-background` | `var(--slate-00)` | Panel background |
| `--cookie-consent-banner-text-colour` | `var(--slate-10)` | Panel text colour |
| `--cookie-consent-banner-transition-duration` | `200ms` | Close fade and button hover transitions |

> **Changed 2026-09-27**: `--cookie-consent-banner-border`/`-background` used to default to
> `light-dark()` values, which older iPad Safari doesn't support. Following the library rule, they
> now keep the light values only. The panel also sets its own text colour now; before, it inherited
> the page's, which would put light text on the white panel in dark mode. For a dark-mode panel, set
> these tokens in your own CSS (you're free to use `light-dark()` there).

### Buttons

| Token | Default | Controls |
|---|---|---|
| `--cookie-consent-banner-actions-gap` | `0.8rem` | Gap between the two buttons |
| `--cookie-consent-banner-button-padding` | `0.8rem 1.6rem` | Button padding |
| `--cookie-consent-banner-button-border-radius` | `0.4rem` | Button corner radius |
| `--cookie-consent-banner-focus-ring` | `var(--theme-border-focus)` | `:focus-visible` outline colour on both buttons |
| `--cookie-consent-banner-reject-border-colour` | `var(--slate-08)` | Reject button border, resting |
| `--cookie-consent-banner-reject-border-colour-hover` | `var(--cookie-consent-banner-accent)` | Reject button border, hover/focus |
| `--cookie-consent-banner-accept-background` | `var(--cookie-consent-banner-accent)` | Accept button background |
| `--cookie-consent-banner-accept-text-colour` | `var(--slate-00)` | Accept button text |

Private tokens (not public API): `--_gutter`, `--_transition-duration`, `--_accent` on the root,
each resolving a public token once for reuse.

## State hooks

- `data-theme` on the root, from the `theme` prop or `app.config` (default `info`). It sets the
  `--theme-*` tokens, so it drives the default accent and focus ring.
- `.closed` on the root once consent is granted or denied. The banner fades out and becomes
  `visibility: hidden`, so its buttons leave the tab order and the accessibility tree.
- Inner classes: `.cookie-consent-banner-inner` (the `role="region"`), `.cookie-consent-banner-message`,
  `.cookie-consent-banner-actions`, `.cookie-consent-banner-reject`, `.cookie-consent-banner-accept`.
- `data-test-id`: `cookie-consent-banner`, `cookie-consent-banner-reject`, `cookie-consent-banner-accept`.

## Motion

Closing fades opacity and collapses `grid-template-rows` over the transition duration. Under
`prefers-reduced-motion: reduce` it closes instantly.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** the banner is teleported to `<body>`, so tokens set on a page or section wrapper never
reach it. Set them on `:root`/`html`, on `body`, or on the banner itself through
`style-class-passthrough`. A `<style scoped>` block can't reach it either without `:deep()` from a
component that is an ancestor in the component tree, so prefer an unscoped global block.

## Recipe: dark panel

```css
:where(html) {
  --cookie-consent-banner-background: light-dark(var(--slate-00), var(--slate-10));
  --cookie-consent-banner-text-colour: light-dark(var(--slate-10), var(--slate-01));
  --cookie-consent-banner-border: 0.1rem solid light-dark(var(--slate-10), var(--slate-02));
}
```

## Class passthrough

`style-class-passthrough` adds classes to the teleported root `.cookie-consent-banner`, next to
`data-theme` and `.closed`. It's reachable in normal use and is the most reliable place to set
tokens for this component, since ancestor wrappers don't contain it.
