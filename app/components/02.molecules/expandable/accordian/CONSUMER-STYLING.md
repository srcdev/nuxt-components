# AccordianCore — Consumer Styling Guide

## No tokens of its own

`AccordianCore` doesn't define any `--accordian-*` custom properties. It's a thin wrapper that
renders `itemCount` copies of a panel component (`ExpandingPanel` by default, or
`ExpandingPanelClassic` when `variant="classic"`) and forwards `name`/`animationDuration` to each
one — all real styling surface lives on whichever panel component is active. See that
component's own `CONSUMER-STYLING.md`:

- [../expanding-panel/CONSUMER-STYLING.md](../expanding-panel/CONSUMER-STYLING.md) (default, `variant="modern"`)
- [../expanding-panel-classic/CONSUMER-STYLING.md](../expanding-panel-classic/CONSUMER-STYLING.md) (`variant="classic"`)

`--expanding-panel-*` tokens set at any scope (global, page) apply to `AccordianCore`'s panels
too, since they're the same underlying component — no `AccordianCore`-specific override is
needed for summary gap, icon size, etc.

---

## The `.accordian-item` hook

Every panel gets `style-class-passthrough="['accordian-item']"` automatically — this is the one
`AccordianCore`-specific override surface, used to target *all* panels in the group without
reaching into `ExpandingPanel`/`ExpandingPanelClassic` internals.

```css
/* In the consuming page's unscoped <style> block */
.display-accordian {
  .accordian-item.expanding-panel {
    /* modern variant (default) */
    border-block-end: 1px solid var(--theme-border, #e0e0e0);
  }

  /* If this instance uses variant="classic", target the classic root class instead: */
  .accordian-item.expanding-panel-classic {
    border-block-end: 1px solid var(--theme-border, #e0e0e0);
  }
}
```

Note the root class differs by variant (`.expanding-panel` vs `.expanding-panel-classic`) — a
selector written for one won't match the other. If you switch `variant` on an existing instance,
check any `.accordian-item.expanding-panel*` overrides still target the right class.

---

## Page-scoped overrides

No `:deep()` is required (component styles are unscoped).

```css
.faq-section {
  .display-accordian {
    max-width: 480px;

    .accordian-item.expanding-panel {
      --expanding-panel-summary-padding-block: 1.6rem;
    }
  }
}
```

---

## Per-instance overrides via styleClassPassthrough

Use sparingly — prefer global or page-scoped CSS. `styleClassPassthrough` on `AccordianCore`
targets the root `.display-accordian` element, not the individual panels (those already get
`.accordian-item` automatically):

```vue
<AccordianCore name="faq" :item-count="3" :style-class-passthrough="['compact-faq']">
  ...
</AccordianCore>
```

```css
.display-accordian.compact-faq {
  max-width: 400px;
}
```

---

## Notes

- `variant` is group-wide: every panel in one `AccordianCore` renders the same component, so
  there's no per-panel styling divergence caused by variant — just remember which root class
  (`.expanding-panel` vs `.expanding-panel-classic`) your `.accordian-item` selectors need.
- `contentIsOnTop` isn't exposed on `AccordianCore` — it isn't meaningful for a grouped accordion
  (see `ExpandingPanel`'s own docs for why: it's for a single panel overlaying trailing page
  content, not stacked/grouped panels). Use `ExpandingPanel`/`ExpandingPanelClassic` directly if
  you need an overlay panel.
