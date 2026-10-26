---
paths:
  - "app/**/*.vue"
---

# Check positional selectors against every sibling, and render the position

Before relying on `:last-child`, `:first-child`, `:nth-child()` or `+`/`~` in component CSS, list
every sibling the template renders in that parent (indicator divs, `v-if` elements, slots) and use
`:last-of-type` or a class when they'd break it. Give the targeted position a story with data in
it, and a spec that runs the same selector against the mounted markup. Never write a positional
element selector as a descendant (`.row span:first-child`) in a block that can hold a slot or a
child component: it matches their inner elements too. Class the parts you mean.

Why: `ResponsiveHeader`'s last-dropdown rule used `.main-navigation-list:last-child`, but two
indicator `<div>`s follow the lists, so it never matched in any version; no story had a dropdown in
that position, so nobody saw it (fixed 2026-10-25). `ServiceDetail`'s sidebar rows styled
`span:first-child`/`span:last-child` as label/value; the `book-cta` row reused the row class, and
`InputButton`'s lone text span matched both, squeezing "Book now" to one letter group per line
(fixed 2026-10-26).
