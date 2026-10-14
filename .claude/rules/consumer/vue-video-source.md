---
paths:
  - "app/**/*.vue"
---

# Video src goes on a `<source>` child

Never bind `:src` on a `<video>`. Use `<source :src="src">` inside it, `:key="src"` on the video, and
an explicit `videoEl.load()` on mount and src change.

Why: Vue patching `:src` on client-side navigation silently skips the fetch.
Detail: skill `vue-video-autoplay.md` (srcdev-nuxt-components).
