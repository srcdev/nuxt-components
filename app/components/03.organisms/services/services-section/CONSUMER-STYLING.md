# ServicesSection — Consumer Styling Guide

## Public token API

All `--services-section-*` tokens are the stable override surface. Set them globally in a
theme file, scoped to a page wrapper, or per-instance via `styleClassPassthrough`.

### Layout & sizing

| Token | Default | Controls |
|---|---|---|
| `--services-section-grid-gap` | `2rem` | Gap between image and content columns below the 768px breakpoint |
| `--services-section-grid-gap-desktop` | `3rem` | Gap between columns at 768px and above |
| `--services-section-image-border-radius` | `0.8rem` | Corner rounding on the service image |
| `--services-section-price-duration-gap` | `3rem` | Gap between the duration and price rows |
| `--services-section-price-duration-item-gap` | `0.8rem` | Gap between icon and text within a single row |
| `--services-section-price-duration-margin-block-end` | `2rem` | Space below the price/duration row |
| `--services-section-decorator-size` | `2rem` | Width/height of the duration and price icons |
| `--services-section-faq-margin-block-end` | `2.4rem` | Space below the FAQ accordion |
| `--services-section-faq-answer-line-height` | `1.6` | Line height of FAQ answer text |

### Colours

| Token | Default | Controls |
|---|---|---|
| `--services-section-faq-divider-color` | `currentColor` | Border colour between FAQ accordion items |
| `--services-section-faq-divider-opacity` | `0.7` | Opacity of each FAQ accordion item's border |

---

## Text content — props, not CSS

Section headings and the default CTA panel copy are **props**, not hardcoded strings, so
there is nothing to override in CSS for these:

| Prop | Default |
|---|---|
| `processHeading` | `"The Process"` |
| `idealForHeading` | `"Ideal For"` |
| `maintenanceHeading` | `"Aftercare & Maintenance"` |
| `faqsHeading` | `"Frequently Asked Questions"` |
| `ctaHeading` | `"Ready to book your appointment?"` |
| `ctaBody` | `"Get in touch to book your appointment."` |

```vue
<ServicesSection
  :service-data="service"
  cta-heading="Ready to book your locs consultation?"
  cta-body="Mobile service across Bath — I come to you."
/>
```

If the CTA needs a different component entirely (not just different text), replace it with
the `cta-panel` scoped slot instead of styling around the default `GlassPanel`:

```vue
<ServicesSection :service-data="service">
  <template #cta-panel="{ serviceData, ctaHeading, ctaBody }">
    <MyCustomPanel :heading="ctaHeading" :body="ctaBody">
      <template #cta><button>Enquire Now</button></template>
    </MyCustomPanel>
  </template>
</ServicesSection>
```

---

## Global theming — recommended approach

Create `assets/styles/setup/07.components/services-section.css` in the consuming app and
set tokens on `:root`. This applies to every `ServicesSection` across the site.

```css
/* assets/styles/setup/07.components/services-section.css */
:root {
  --services-section-grid-gap: 2.4rem;
  --services-section-grid-gap-desktop: 4rem;
  --services-section-image-border-radius: 1.2rem;
  --services-section-faq-divider-color: var(--brand-border);
}
```

---

## Page-scoped overrides

Override tokens for a specific section by scoping them under the page or layout wrapper.
No `:deep()` is required (component styles are unscoped).

```css
/* In the consuming page's unscoped <style> block */
.our-services-page {
  .services-section {
    --services-section-decorator-size: 2.4rem;
    --services-section-faq-answer-line-height: 1.8;
  }
}
```

---

## Per-instance overrides via styleClassPassthrough

Use sparingly — prefer global or page-scoped CSS. When a single instance needs a distinct
visual style, pass a modifier class:

```vue
<ServicesSection :style-class-passthrough="['highlight-service']" :service-data="service" />
```

```css
.services-section.highlight-service {
  --services-section-image-border-radius: 2rem;
  --services-section-faq-divider-color: var(--color-accent);
}
```

---

## FAQ accordion styling

The `AccordianCore` inside this component receives `services-section__faq` via
`styleClassPassthrough`. To target the accordion's own internals (summary, icon rotation,
content padding), style through that class rather than reaching into `AccordianCore`
directly — see `.services-section__faq` in the component's own `<style>` block for the
selectors already scoped this way (`.accordian-item.expanding-panel`,
`.expanding-panel-summary`, `.services-section__faq-answer`).

```css
.services-section {
  .services-section__faq {
    .expanding-panel-details .expanding-panel-summary {
      padding-block: 1.6rem;
    }
  }
}
```

---

## Notes

- `--services-section-grid-gap-desktop` only applies at `768px` and above — the breakpoint
  itself is not a token, since changing it would affect the grid's `minmax()` column sizing
  too, not just spacing.
- The CTA panel is rendered inside a default `<slot name="cta-panel">` — passing that slot
  bypasses `GlassPanel` and all of its tokens (`--glass-panel-*`) entirely, along with the
  `ctaHeading`/`ctaBody` props, which are handed to the slot for reuse rather than applied
  automatically.
