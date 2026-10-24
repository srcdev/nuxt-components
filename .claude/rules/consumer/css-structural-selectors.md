---
paths:
  - "app/**/*.vue"
---

# Check positional selectors against every sibling, and render the position

Before relying on `:last-child`, `:first-child`, `:nth-child()` or `+`/`~` in component CSS, list
every sibling the template renders in that parent (indicator divs, `v-if` elements, slots) and use
`:last-of-type` or a class when they'd break it. Give the targeted position a story with data in
it, and a spec that runs the same selector against the mounted markup.

Why: `ResponsiveHeader`'s last-dropdown rule used `.main-navigation-list:last-child`, but two
indicator `<div>`s follow the lists, so it never matched in any version; no story had a dropdown in
that position, so nobody saw it (fixed 2026-10-25, CLAUDE.md pitfall #36).
