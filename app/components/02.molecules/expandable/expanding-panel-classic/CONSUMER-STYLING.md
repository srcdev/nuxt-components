# ExpandingPanelClassic — Consumer Styling Guide

## Public token API

All `--expanding-panel-classic-*` tokens are the stable override surface. Set them at any scope
(global, page, or instance) without touching the component itself.

| Token | Default | Controls |
|---|---|---|
| `--expanding-panel-classic-summary-gap` | `1rem` | Gap between the summary label and the toggle icon |
| `--expanding-panel-classic-summary-padding-block` | `0.5rem` | Vertical padding on the clickable summary row |
| `--expanding-panel-classic-icon-size` | `1.2rem` | Toggle icon `font-size` |
| `--expanding-panel-classic-content-z-index` | `10` | Stacking order of the content region when `contentIsOnTop` is `true` |
| `--expanding-panel-classic-content-gap` | `0px` | Space between the summary and the content region when `contentIsOnTop` is `true` |

Note: `background-color`, `padding`, and shadow are **not** tokenised, and must never be applied
to `.inner` itself — see [expanding-panel-classic.md](../../../../.claude/skills/components/expanding-panel-classic.md#styling-the-content-when-contentisontop)
for why, and style a wrapper *inside* the `#content` slot instead.

---

## Global theming — recommended approach

Create `assets/styles/setup/07.components/expanding-panel-classic.css` in the consuming app and set
tokens on `:root`. This applies to every `ExpandingPanelClassic` across the site.

```css
/* assets/styles/setup/07.components/expanding-panel-classic.css */
:root {
  --expanding-panel-classic-summary-gap: 1.6rem;
  --expanding-panel-classic-summary-padding-block: 1.2rem;
  --expanding-panel-classic-icon-size: 1.4rem;
}
```

---

## Page-scoped overrides

Override tokens for a specific section by scoping them under the page or layout wrapper.
No `:deep()` is required (component styles are unscoped).

```css
/* In the consuming page's unscoped <style> block */
.faq-section {
  .expanding-panel-classic {
    --expanding-panel-classic-summary-padding-block: 1.6rem;
  }
}
```

---

## Per-instance overrides via styleClassPassthrough

Use sparingly — prefer global or page-scoped CSS. When a single instance needs a distinct
visual style, pass a modifier class:

```vue
<ExpandingPanelClassic
  name="promo"
  :content-is-on-top="true"
  :style-class-passthrough="['promo-panel']"
>
  <template #summary>...</template>
  <template #content>
    <!-- Wrapper INSIDE the slot carries the visual styling — never .inner itself -->
    <div class="promo-panel-body">...</div>
  </template>
</ExpandingPanelClassic>
```

```css
.expanding-panel-classic.promo-panel {
  --expanding-panel-classic-content-gap: 0.4rem;
  --expanding-panel-classic-content-z-index: 20;
}

.promo-panel-body {
  background-color: white;
  padding: 1rem;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}
```

---

## Notes

- `--expanding-panel-classic-content-gap` and `--expanding-panel-classic-content-z-index` only take effect when
  `contentIsOnTop` is `true` — they're no-ops for the default (in-flow) layout.
- Never set `background-color`, `padding`, `border`, or a shadow directly on `.inner`. `.inner`
  has no explicit height when collapsed (`grid-template-rows: 0fr`) and relies on
  `overflow: hidden` to clip its *children* to 0px — but padding/border/background on `.inner`'s
  own box are not "overflow content", so they'd still render as a visible gap under the summary
  while closed. Always style a wrapper element placed *inside* the `#content` slot instead; that
  wrapper is a child of `.inner` and gets clipped correctly.
- Don't stack multiple `contentIsOnTop` panels as direct siblings (linked via a shared `name` or
  not). The overlay is absolutely positioned so it doesn't push the next element down — which
  means a sibling `ExpandingPanelClassic` placed right after it sits exactly where the overlay renders,
  and gets visually covered when the first panel opens. `contentIsOnTop` is for a single panel
  overlaying unrelated trailing page content, not for grouped/stacked accordion panels — use the
  default in-flow layout for those.
