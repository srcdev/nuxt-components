---
paths:
  - "**/*.stories.ts"
---

# Story args stay reactive

Never destructure, copy (`ref(args.x)`) or `watch` `args` at setup time. Strip non-prop extra args
inside a `computed` before `v-bind`, and type the meta as `Meta<StoryArgs>` when it has extra args.

Why: setup runs once, so copied args and watchers miss control changes, and unstripped extras become
unknown HTML attributes. Detail: skill `storybook-add-story.md` (srcdev-nuxt-components).
