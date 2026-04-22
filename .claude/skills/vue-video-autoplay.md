# Vue Video Autoplay on Client-Side Navigation

## Overview

In Vue/Nuxt SPAs, binding `:src` directly on a `<video>` element silently skips the browser fetch when Vue patches the element during client-side navigation. The video appears but never loads — no network request is made. Use a `<source>` child element instead, combined with `:key` and an explicit `load()` call.

## The problem

When Vue patches an existing `<video>` DOM element (e.g. on route change), setting `src` via `:src` doesn't always trigger the browser to re-fetch the media resource. This fails silently — no console error, no network request, poster image just sits there.

## The fix

```vue
<!-- ✅ Correct — src in <source> child -->
<video
  :key="src"
  autoplay
  muted
  loop
  playsinline
  preload="auto"
  :poster="poster"
>
  <source :src="src" type="video/mp4" />
</video>

<!-- ❌ Wrong — :src on <video> silently skips fetch on Vue patches -->
<video autoplay muted loop playsinline preload="auto" :src="src"></video>
```

## Three things working together

1. **`<source>` child** — the browser re-reads source children when `load()` is called, reliably initiating the fetch.
2. **`:key="src"`** — forces Vue to unmount/remount the `<video>` element when the source changes (covers same-component src swaps).
3. **Explicit `v.load()` call** — programmatically re-initiates fetching after mount and on src change. Do not rely on `autoplay` alone for client-side navigation.

## Autoplay pattern for Nuxt components

```ts
const videoEl = shallowRef<HTMLVideoElement | null>(null);

const tryPlay = async () => {
  const v = videoEl.value;
  if (!v) return;
  v.muted = true; // required for programmatic autoplay in all browsers
  try {
    await v.play();
  } catch {
    // autoplay blocked — poster remains visible
  }
};

const kickOffLoad = async () => {
  await nextTick();
  const v = videoEl.value;
  if (!v) return;
  v.load();
  void tryPlay();
};

// Covers initial mount and src prop changes
watch(() => props.src, () => void kickOffLoad(), { immediate: true, flush: "post" });

// Covers keep-alive re-activation
onActivated(() => void kickOffLoad());
```

Attach `@loadeddata="() => void tryPlay()"` and `@canplay="() => void tryPlay()"` to the `<video>` element as additional retry points once data arrives.

## Notes

- `preload="auto"` tells the browser to buffer eagerly — essential for autoplay reliability.
- `v.muted = true` set programmatically (in addition to the `muted` attribute) works around a Safari bug where the attribute alone is insufficient for programmatic play.
- This pattern applies to any Vue/Nuxt video component, not just background/ambient video.
