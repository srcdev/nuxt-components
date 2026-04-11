# useTooltipsGuide Composable

## Overview

`useTooltipsGuide` runs a sequential popover guide — it finds all `[popover]` elements inside a container, shows them one by one, and waits for the user to dismiss each before advancing. Useful for onboarding flows and feature introductions.

**This composable ships inside the `srcdev-nuxt-components` layer** (`app/composables/useTooltips.ts`, exported as `useTooltipsGuide`). It is auto-imported via the Nuxt layer — **do not create a local copy** in the consuming app.

## Prerequisites

- Uses the native HTML Popover API — supported in all modern browsers (Chrome 114+, Firefox 125+, Safari 17+)
- Popovers must have `id` attributes and corresponding trigger buttons with `popovertarget` and `popovertargetaction="toggle"` attributes
- Close buttons inside each popover must have `popovertargetaction="hide"`

## Usage

### 1. Mark up the popovers

Each step in the guide is a native `[popover]` element. Include a trigger button (used internally to open the popover respecting anchor positioning) and a close button:

```vue
<div ref="guideContainerRef">
  <button popovertarget="step-1" popovertargetaction="toggle" style="display:none">Open step 1</button>
  <div id="step-1" popover>
    <p>Welcome! This is step one.</p>
    <button popovertarget="step-1" popovertargetaction="hide">Got it</button>
  </div>

  <button popovertarget="step-2" popovertargetaction="toggle" style="display:none">Open step 2</button>
  <div id="step-2" popover>
    <p>This is step two.</p>
    <button popovertarget="step-2" popovertargetaction="hide">Got it</button>
  </div>
</div>
```

### 2. Initialise the composable

```ts
const guideContainerRef = ref<HTMLElement | null>(null)

const {
  isGuideRunning,
  currentTooltipIndex,
  startGuide,
  restartGuide,
  stopGuide,
  hasPopovers,
  totalPopovers,
} = useTooltipsGuide(guideContainerRef, {
  autoStart: true,   // default: true — starts after startDelay on mount
  startDelay: 2000,  // default: 2000ms — delay before auto-start
})
```

Pass `guideContainerRef` to the container element via `ref="guideContainerRef"`.

### 3. Manual controls (optional)

```ts
// Restart the guide from the beginning
await restartGuide()

// Stop mid-guide
stopGuide()

// Start manually (when autoStart: false)
await startGuide()
```

## How it works

1. On `onMounted`, waits `startDelay` ms, then calls `initializePopovers()` to collect all `[popover]` elements inside the container.
2. If `autoStart` is `true`, calls `startGuide()` which iterates the popovers in DOM order.
3. For each popover: finds the `[popovertarget][popovertargetaction="toggle"]` trigger button and clicks it to open the popover, then waits for the `[popovertargetaction="hide"]` button to be clicked before advancing.
4. After the last popover is dismissed, `autoRunGuide` is set to `false` and `isGuideRunning` becomes `false`.

## API reference

| Return value | Type | Description |
|---|---|---|
| `isGuideRunning` | `Readonly<Ref<boolean>>` | `true` while the guide is active |
| `currentTooltipIndex` | `Readonly<Ref<number>>` | Zero-based index of the currently shown popover |
| `autoRunGuide` | `Readonly<Ref<boolean>>` | Whether auto-start is still enabled |
| `hasPopovers` | `ComputedRef<boolean>` | `true` if any `[popover]` elements were found |
| `totalPopovers` | `ComputedRef<number>` | Count of `[popover]` elements found |
| `startGuide()` | `async () => void` | Start from the first popover; no-op if already running |
| `restartGuide()` | `async () => void` | Close any open popovers and restart from the beginning |
| `stopGuide()` | `() => void` | Close any open popovers and stop the guide |
| `initializePopovers()` | `() => void` | Re-scan the container for `[popover]` elements; call if popovers are added dynamically |

## Notes

- If no trigger button is found for a popover, `togglePopover(true)` is called directly as a fallback — anchor positioning may not apply in this case.
- `restartGuide` is a no-op if the guide is already running (`isGuideRunning` is `true`).
- Popovers are collected in DOM order — control guide sequence by ordering elements in the markup.
- `startDelay` uses `useSleep` (also from the layer) — the delay runs on `onMounted` so it is always client-side only.
