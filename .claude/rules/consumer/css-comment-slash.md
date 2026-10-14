---
paths:
  - "app/**/*.vue"
  - "app/**/*.css"
---

# No `*/` inside CSS comments

Never join token names with a bare slash in a CSS comment (`--_form-*/--_scheme-icon-font-size`);
write "and" or space the slash.

Why: `*/` closes the comment early and yields a misleading "Unclosed string" error lines later.

