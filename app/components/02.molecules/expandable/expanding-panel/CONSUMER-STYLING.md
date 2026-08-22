# ExpandingPanel — Consumer Styling Guide

## Public token API

All `--expanding-panel-*` tokens are the stable override surface. Set them at any scope
(global, page, or instance) without touching the component itself.

| Token | Default | Controls |
|---|---|---|
| `--expanding-panel-summary-gap` | `1rem` | Gap between the summary label and the toggle icon |
| `--expanding-panel-summary-padding-block` | `0.5rem` | Vertical padding on the clickable summary row |
| `--expanding-panel-icon-size` | `1.2rem` | Toggle icon `font-size` |
| `--expanding-panel-content-z-index` | `10` | Stacking order of the content region when `contentIsOnTop` is `true` |
| `--expanding-panel-content-gap` | `0px` | Space between the summary and the content region when `contentIsOnTop` is `true` |

Note: `background-color`, `padding`, and shadow are **not** tokenised. They can be applied directly
to `.expanding-panel-content`, or to a wrapper inside the `#content` slot — see
[expanding-panel.md](../../../../.claude/skills/components/expanding-panel.md#styling-the-content-when-contentisontop)
for why both are safe.

---

## Global theming — recommended approach

Create `assets/styles/setup/07.components/expanding-panel.css` in the consuming app and set
tokens on `:root`. This applies to every `ExpandingPanel` across the site.

```css
/* assets/styles/setup/07.components/expanding-panel.css */
:root {
  --expanding-panel-summary-gap: 1.6rem;
  --expanding-panel-summary-padding-block: 1.2rem;
  --expanding-panel-icon-size: 1.4rem;
}
```

---

## Page-scoped overrides

Override tokens for a specific section by scoping them under the page or layout wrapper.
No `:deep()` is required (component styles are unscoped).

```css
/* In the consuming page's unscoped <style> block */
.faq-section {
  .expanding-panel {
    --expanding-panel-summary-padding-block: 1.6rem;
  }
}
```

---

## Per-instance overrides via styleClassPassthrough

Use sparingly — prefer global or page-scoped CSS. When a single instance needs a distinct
visual style, pass a modifier class:

```vue
<ExpandingPanel
  name="promo"
  :content-is-on-top="true"
  :style-class-passthrough="['promo-panel']"
>
  <template #summary>...</template>
  <template #content>
    <div class="promo-panel-body">...</div>
  </template>
</ExpandingPanel>
```

```css
.expanding-panel.promo-panel {
  --expanding-panel-content-gap: 0.4rem;
  --expanding-panel-content-z-index: 20;
}

.promo-panel-body {
  background-color: white;
  padding: 1rem;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}
```

---

## Notes

- `--expanding-panel-content-gap` and `--expanding-panel-content-z-index` only take effect when
  `contentIsOnTop` is `true` — they're no-ops for the default (in-flow) layout.
- `background-color`, `padding`, `border`, and shadow are all safe to set directly on
  `.expanding-panel-content`. The open/close animation clips via `overflow: clip` on
  `::details-content`, and `.expanding-panel-content` is a child of it, so its own box is
  correctly clipped to the animated height while closed/closing. A wrapper inside the `#content`
  slot works equally well if you prefer to keep the styling scoped to your own markup.
- **WebKit (Safari/iOS) doesn't support `::details-content` at all**, and `ExpandingPanel` has no
  fallback for it (an `@supports`-based CSS fallback was tried and reverted 2026-08-22 — it didn't
  reliably work). If this panel needs to work correctly on real Apple devices, use
  `ExpandingPanelClassic` instead — see its own `CONSUMER-STYLING.md`.
- Don't stack multiple `contentIsOnTop` panels as direct siblings (linked via a shared `name` or
  not). The overlay is absolutely positioned so it doesn't push the next element down — which
  means a sibling `ExpandingPanel` placed right after it sits exactly where the overlay renders,
  and gets visually covered when the first panel opens. `contentIsOnTop` is for a single panel
  overlaying unrelated trailing page content, not for grouped/stacked accordion panels — use the
  default in-flow layout for those.
