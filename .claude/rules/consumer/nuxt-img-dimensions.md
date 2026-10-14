---
paths:
  - "app/**/*.vue"
---

# NuxtImg needs numeric width and height

Always give `NuxtImg` numeric `width` and `height` props, roughly the largest rendered pixel width
(pass a size prop through when it varies). Never `width="100%"`. CSS sizes the displayed image.

Why: without them the Vercel provider requests a width it doesn't allow (`w=1536`), and a
non-numeric width makes it request its largest screen width for every image.
