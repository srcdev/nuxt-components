# CookieConsentBanner — Consumer Styling Guide

The banner is a fixed, teleported wrapper around `AlertContent`. The panel itself (background, text
colour, border, radius, padding, accent stripe, icon, title and message sizes, actions alignment) is
`AlertContent`'s, styled with its `--alert-content-*` tokens: see
`app/components/02.molecules/alert-content/CONSUMER-STYLING.md`. This guide covers what the banner
adds: position, motion and the two buttons.

> **Changed 2026-09-27**: rebuilt on `AlertContent`. The banner's own panel tokens
> (`--cookie-consent-banner-padding`, `-gap`, `-border-radius`, `-border`, `-accent-border-width`,
> `-background`, `-text-colour`, `-actions-gap`) are gone; use the matching `--alert-content-*`
> tokens. The panel now follows `data-theme` in light and dark mode (a theme-tinted surface) instead
> of a fixed white panel, with a left accent stripe instead of a top border.
>
> Earlier the same day: classes, tokens and `data-test-id`s renamed from `privacy-notice-banner` to
> `cookie-consent-banner`. The consent cookie's own name (`privacy-notice-consent`, owned by
> `useCookieConsent`) is unchanged.

## Public token API

### Position and motion

| Token | Default | Controls |
|---|---|---|
| `--cookie-consent-banner-z-index` | `999999` | Stacking order (matches `DisplayDialog`/`DisplayToast`) |
| `--cookie-consent-banner-gutter` | `1.6rem` | Distance from the viewport's bottom and side edges |
| `--cookie-consent-banner-max-width` | `64rem` | Maximum width (centred) |
| `--cookie-consent-banner-transition-duration` | `200ms` | Close fade and button hover transitions |

### Buttons

| Token | Default | Controls |
|---|---|---|
| `--cookie-consent-banner-accent` | `var(--theme-accent)` | Accept background and reject hover border |
| `--cookie-consent-banner-button-padding` | `0.8rem 1.6rem` | Button padding |
| `--cookie-consent-banner-button-border-radius` | `0.4rem` | Button corner radius |
| `--cookie-consent-banner-focus-ring` | `var(--theme-border-focus)` | `:focus-visible` outline colour on both buttons |
| `--cookie-consent-banner-reject-border-colour` | `var(--theme-border)` | Reject button border, resting |
| `--cookie-consent-banner-reject-border-colour-hover` | `var(--cookie-consent-banner-accent)` | Reject button border, hover/focus |
| `--cookie-consent-banner-accept-background` | `var(--cookie-consent-banner-accent)` | Accept button background |
| `--cookie-consent-banner-accept-text-colour` | `var(--theme-on-surface)` | Accept button text |

The gap between the buttons and their alignment (right by default) are `AlertContent`'s
`--alert-content-actions-gap` and `--alert-content-actions-justify`.

Private tokens (not public API): `--_gutter`, `--_transition-duration`, `--_accent` on the root,
each resolving a public token once for reuse.

## State hooks

- `data-theme` on the root and on the inner `.alert-content`, from the `theme` prop or `app.config`
  (default `info`). It drives every `--theme-*` default, for the panel and the buttons.
- `.closed` on the root once consent is granted or denied. The banner fades out and becomes
  `visibility: hidden`, so its buttons leave the tab order and the accessibility tree.
- Classes: `.cookie-consent-banner` > `.cookie-consent-banner-inner` (the `role="region"`) >
  `.alert-content` (see its guide for the inner structure); the buttons are
  `.cookie-consent-banner-reject` and `.cookie-consent-banner-accept` inside `.alert-content-actions`.
- `data-test-id`: `cookie-consent-banner`, `cookie-consent-banner-reject`, `cookie-consent-banner-accept`,
  plus `AlertContent`'s `alert-icon`, `alert-title`, `alert-content`, `alert-actions`.

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
`style-class-passthrough`. That includes the `--alert-content-*` panel tokens; setting them on the
banner scopes them to the banner, leaving other alerts on the page alone.

## Recipe: neutral panel

The pre-2026-09-27 look (white panel, dark text, no tint), scoped to the banner:

```css
.cookie-consent-banner {
  --alert-content-inner-background: var(--slate-00);
  --alert-content-text-colour: var(--slate-10);
  --alert-content-border: 0.1rem solid var(--slate-10);
}
```

## Class passthrough

`style-class-passthrough` adds classes to the teleported root `.cookie-consent-banner`, next to
`data-theme` and `.closed`. It's reachable in normal use and is the most reliable place to set
tokens for this component, since ancestor wrappers don't contain it.
