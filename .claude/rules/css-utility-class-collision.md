---
paths:
  - "app/**/*.vue"
---

# Check utility class names before using them in markup

Before putting a short utility-style class (`mi-*`, `mb-*`, other spacing/sizing abbreviations) on a
component's own markup, check what `app/assets/styles/setup/06.utility-classes/` already defines it
as.

Why: `mi-12` was used as an icon-size hint but means `margin-inline: 1.2rem`, which collapsed three
components' carets to zero width. Detail: CLAUDE.md pitfall #18.
