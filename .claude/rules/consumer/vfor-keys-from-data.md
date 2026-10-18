---
paths:
  - "app/**/*.vue"
---

# Key data-driven `v-for` lists on something unique

Key a `v-for` over prop, CMS or API data on a field guaranteed unique. When the only candidates
can repeat (`href`, `to`, a label), combine one with the index: `` :key="`${index}-${link.href}`" ``.

Why: duplicate keys break Vue's keyed diff. Reordering a list where two items shared an `href` left
a stale extra element in the DOM (`SkipLinks`, 2026-10-18); `ContentDocs` had the same bug with
nav items sharing a `to`. Vue only warns while patching an update, so first render looks fine.
Detail: skill `testing-add-unit-test.md` (srcdev-nuxt-components), "Testing duplicate `v-for` keys".
