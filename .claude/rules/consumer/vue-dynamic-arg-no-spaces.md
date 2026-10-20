---
paths:
  - "app/**/*.vue"
  - "app/**/*.stories.ts"
---

# No spaces inside a dynamic slot or argument name

Never put a space inside `#[...]`, `:[...]` or `@[...]`: write `` #[`item-${i}-summary`] ``, not
`` #[`item-${i + 6}-summary`] ``. When the name needs arithmetic, build it in script and bind it
(`#[item.summarySlot]`).

Why: an HTML attribute name ends at the first space, so the template compiler sees a cut-off
expression ("Missing } in template expression"). In a story's template string it only fails when
Storybook renders the story. Detail: skill `storybook-add-story.md` (srcdev-nuxt-components),
"Dynamic slot names in template strings".
