---
name: SamaritanPromptMixed
description: SamaritanPromptMixed animated text prompt — props, MessageConfig API, typewriter/word-pulse effects, accessibility (aria-live), CSS tokens, consumer styling
type: reference
---

# SamaritanPromptMixed

## Overview

`SamaritanPromptMixed` cycles through a list of messages using animated text effects. Each message can independently use either a `typewriter` effect (characters typed and deleted one-by-one) or a `word-pulse` effect (full text fades in, holds, then fades out). Effects and timing can be set globally via props and overridden per-message via `MessageConfig`.

The component uses `useCancellableTimer` for all async timing — the loop exits cleanly on `onUnmounted` without dangling promises.

### Accessibility

- The visual animated content (`.samaritan-prompt__content`) carries `aria-hidden="true"` — screen readers never hear incremental characters.
- A visually hidden `aria-live="polite"` `aria-atomic="true"` span announces the complete message at the moment it is fully displayed:
  - **Typewriter**: announced after all characters are typed (before the hold/delete phase).
  - **Word-pulse**: announced when `textOpacity` reaches `1` (fade-in complete).
- `announcedText` is cleared to `""` before each deletion/fade-out, so the same message announced again in the next cycle fires a new announcement (value changes `"" → text`).
- `prefers-reduced-motion: reduce` disables the content fade transition and the cursor pulse animation via a CSS media query.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messageConfigs` | `MessageConfig[]` | — | Array of message objects. **Required.** |
| `effect` | `"typewriter" \| "word-pulse"` | `"typewriter"` | Default effect for all messages. |
| `typeSpeed` | `number` | `80` | ms per character typed. |
| `deleteSpeed` | `number` | `40` | ms per character deleted. |
| `holdDuration` | `number` | `7000` | ms to hold the fully typed text before deleting. |
| `pauseDuration` | `number` | `1000` | ms pause after a message completes, before the next begins. |
| `wordDuration` | `number` | `1200` | ms the word-pulse text stays fully visible. |
| `fadeDuration` | `number` | `400` | ms for the word-pulse fade-in / fade-out CSS transition. |
| `introDelay` | `number` | `2000` | ms delay before the first message starts on mount. Set to `0` to start immediately. |
| `hideCursorInCycle` | `boolean` | `true` | Hide the cursor during text animation; show it during pause/hold. Per-message override available. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## MessageConfig

Each entry in `messageConfigs` accepts:

```typescript
interface MessageConfig {
  text: string;
  effect?: "typewriter" | "word-pulse";  // overrides global prop
  typeSpeed?: number;
  deleteSpeed?: number;
  holdDuration?: number;
  pauseDuration?: number;
  wordDuration?: number;
  fadeDuration?: number;
  hideCursorInCycle?: boolean;
}
```

Any field omitted falls back to the corresponding component prop.

## Basic usage

```vue
<SamaritanPromptMixed
  :message-configs="[
    { text: 'INITIALISING SYSTEM' },
    { text: 'LOADING PROFILE' },
    { text: 'ACCESS GRANTED' },
  ]"
/>
```

## Mixed effects

```vue
<SamaritanPromptMixed
  :message-configs="[
    { text: 'INITIALISING SYSTEM', effect: 'typewriter', hold-duration: 3000 },
    { text: 'STAND BY', effect: 'word-pulse', word-duration: 2000 },
    { text: 'CONNECTED', effect: 'typewriter' },
  ]"
/>
```

## Fast intro, no delay

```vue
<SamaritanPromptMixed
  :intro-delay="0"
  :type-speed="50"
  :message-configs="[{ text: 'READY' }]"
/>
```

## CSS custom properties

| Token | Default | Description |
|-------|---------|-------------|
| `--samaritan-font-size` | `2rem` | Text size. |
| `--samaritan-color-text` | `#ffffff` | Text colour. |
| `--samaritan-color-underline` | `#ffffff` | Underline bar colour. |
| `--samaritan-color-cursor` | `#cc0000` | Cursor colour (peak of pulse). |
| `--samaritan-color-cursor-off` | `transparent` | Cursor colour (trough of pulse). |
| `--samaritan-font-family` | `"Mono MMM 5", "Nova Mono", "Courier New", monospace` | Font stack. |
| `--samaritan-letter-spacing` | `0.08em` | Letter spacing. |

The custom font `Mono MMM 5` is loaded via `@font-face` inside the component's unscoped `<style>` block from `/fonts/monoMMM_5.ttf`.

## Consumer styling

Use an unscoped style block scoped by a page or section wrapper. No `:deep()` needed.

```vue
<style>
.my-page .samaritan-prompt {
  --samaritan-font-size: 3.2rem;
  --samaritan-color-text: #00ff88;
  --samaritan-color-cursor: #ff4400;
}
</style>
```

## CSS classes

| Class | Notes |
|-------|-------|
| `.samaritan-prompt` | Root element. |
| `.samaritan-prompt__content` | Wraps text + underline. `aria-hidden="true"`. Opacity transitions on word-pulse effect. |
| `.samaritan-prompt__stage` | Centers the text span; min-height prevents layout shift. |
| `.samaritan-prompt__text` | The visible animated text. `text-transform: uppercase`. |
| `.samaritan-prompt__underline` | Horizontal rule below text. |
| `.samaritan-prompt__cursor` | `▲` glyph; pulses via `samaritan-pulse` keyframe. `aria-hidden="true"`. |
| `.samaritan-prompt__sr-text` | Visually hidden `aria-live` region for screen reader announcements. |

## Notes

- The `introDelay` only applies at the start of the loop, not between messages. Between messages, `pauseDuration` applies.
- The cursor pulse animation uses the `samaritan-pulse` keyframe (defined in the component's global style). The cursor hides/shows during cycles via `cursorVisible` + opacity transition, not `display`.
- `prefers-reduced-motion: reduce` suppresses the opacity transition on `.samaritan-prompt__content` and the `animation` on `.samaritan-prompt__cursor`. The `aria-live` announcements continue to fire regardless.
- The `MessageConfig` type is exported from the component: `import type { MessageConfig } from 'srcdev-nuxt-components/components/02.molecules/samaritan-prompt/SamaritanPromptMixed.vue'`.
