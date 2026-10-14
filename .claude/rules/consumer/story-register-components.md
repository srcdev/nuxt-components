---
paths:
  - "**/*.stories.ts"
---

# Register every component a story template uses

Every component in a story's `template` string, including ones placed in the component's slots, must
be listed in that story's `components: {}`.

Why: components aren't auto-registered in story templates; unregistered ones render as unknown tags.
Detail: skill `storybook-add-story.md` (srcdev-nuxt-components).
