---
name: SamaritanPrompt
description: SamaritanPrompt and SamaritanPromptMixed animated text prompts — props, MessageConfig API, typewriter/word-pulse effects, pause on hover, aria-live announcements, cursor slot, CSS tokens
type: reference
---

# SamaritanPrompt / SamaritanPromptMixed

## Overview

Two components in `02.molecules/samaritan-prompt/` that loop through messages with animated text
effects, styled as a monospace line over an underline with a pulsing cursor glyph below:

- **`SamaritanPrompt`** — a list of plain strings, one effect and one set of timings for all of them.
- **`SamaritanPromptMixed`** — a list of `SamaritanPromptMessageConfig` objects, each able to pick its
  own effect and override any timing. Adds an `introDelay` before each loop.

Effects:

- `typewriter` — characters typed one by one, held, deleted one by one.
- `word-pulse` — the whole message fades in, holds, fades out.

Both use `useCancellableTimer` for all timing, so the loop exits cleanly on unmount.

## Accessibility

- The visual content (`.samaritan-prompt__content`) and the cursor are `aria-hidden="true"`, so
  screen readers never hear partial text.
- A visually hidden `aria-live="polite"` `aria-atomic="true"` span announces each full message when
  it's fully shown (typewriter: once typed; word-pulse: once faded in) and is cleared before it
  deletes or fades out, so a repeated message announces again.
- **Pause on hover** (WCAG 2.2.2): pointer over the root pauses the sequence where it is and the
  cursor pulse; leaving resumes. The root gets `data-paused` while paused.
- `prefers-reduced-motion: reduce` removes the cursor pulse and the word-pulse fade transition. The
  text sequence keeps running (it's the content).

> **Changed 2026-09-27**: `SamaritanPrompt` previously had no live region (the visible text was read
> character by character, if at all) and no reduced-motion handling; both now match
> `SamaritanPromptMixed`. Pause on hover is new on both.

## Props — SamaritanPrompt

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | `string[]` | — | Messages to cycle through. **Required.** |
| `effect` | `"typewriter" \| "word-pulse"` | `"typewriter"` | Effect for all messages. Changing it restarts the loop. |
| `typeSpeed` | `number` | `80` | ms per character typed. |
| `deleteSpeed` | `number` | `40` | ms per character deleted. |
| `holdDuration` | `number` | `2000` | ms the typed text holds before deleting. |
| `pauseDuration` | `number` | `500` | Typewriter: ms between messages. Word-pulse: ms before each full cycle. |
| `wordDuration` | `number` | `1200` | ms a word-pulse message stays fully visible. |
| `fadeDuration` | `number` | `400` | ms for the word-pulse fade in/out. |
| `hideCursorInCycle` | `boolean` | `true` | Hide the cursor while text animates, show it during pauses. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root. Reactive. |

## Props — SamaritanPromptMixed

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messageConfigs` | `SamaritanPromptMessageConfig[]` | — | Messages. **Required.** |
| `effect` | `"typewriter" \| "word-pulse"` | `"typewriter"` | Default effect. |
| `typeSpeed` | `number` | `80` | ms per character typed. |
| `deleteSpeed` | `number` | `40` | ms per character deleted. |
| `holdDuration` | `number` | `7000` | ms the typed text holds before deleting. |
| `pauseDuration` | `number` | `1000` | ms pause after each message. |
| `wordDuration` | `number` | `1200` | ms a word-pulse message stays fully visible. |
| `fadeDuration` | `number` | `400` | ms for the word-pulse fade in/out. |
| `introDelay` | `number` | `2000` | ms before the first message of every loop. `0` starts immediately. |
| `hideCursorInCycle` | `boolean` | `true` | Hide the cursor while text animates. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root. Reactive. |

Note the different defaults for `holdDuration` and `pauseDuration` between the two components.

### SamaritanPromptMessageConfig

```ts
import type { SamaritanPromptMessageConfig } from "srcdev-nuxt-components";

interface SamaritanPromptMessageConfig {
  text: string;
  effect?: "typewriter" | "word-pulse";
  typeSpeed?: number;
  deleteSpeed?: number;
  holdDuration?: number;
  pauseDuration?: number;
  wordDuration?: number;
  fadeDuration?: number;
  hideCursorInCycle?: boolean;
}
```

Omitted fields fall back to the matching component prop. `SamaritanPromptEffect` is exported too.

> **Changed 2026-09-27**: this type was `MessageConfig`, exported from inside
> `SamaritanPromptMixed.vue`. It now lives in `app/types/components/samaritan-prompt.d.ts`.

## Slots

| Slot | Default | Description |
|------|---------|-------------|
| `cursor` | `▲` | Cursor glyph. Rendered inside `aria-hidden` `.samaritan-prompt__cursor`, so keep it decorative. |

## Usage

```vue
<SamaritanPrompt :messages="['Can you hear me?', 'Surveillance active']" />

<SamaritanPrompt effect="word-pulse" :word-duration="2000" :messages="['Stand by']" />

<SamaritanPromptMixed
  :intro-delay="0"
  :message-configs="[
    { text: 'Initialising system', effect: 'typewriter', holdDuration: 3000 },
    { text: 'Stand by', effect: 'word-pulse', wordDuration: 2000 },
  ]"
/>
```

Inside a `messageConfigs` object literal, keys are camelCase (`holdDuration`), not hyphenated; only
props on the component tag are hyphenated.

## Styling

Full token list and class hooks: `app/components/02.molecules/samaritan-prompt/CONSUMER-STYLING.md`.
Tokens are `--samaritan-prompt-*` (text/underline/cursor colours, font, sizes, gaps, pulse
duration). Defaults are white text on the assumption of a dark page; for a light or theme-switching
page set `--samaritan-prompt-text-colour` and `--samaritan-prompt-underline-colour` (e.g. to
`var(--theme-text)`).

The component brings no page layout; centre it from its parent.

> **Changed 2026-09-27**: tokens renamed from `--samaritan-*` / `color` to `--samaritan-prompt-*` /
> `colour`. `SamaritanPromptMixed` no longer needs (or styles) a `.samaritan-stage` ancestor.

## Notes

- `SamaritanPromptMixed` reads `messageConfigs` at the start of each loop, so prop changes land on
  the next loop. `SamaritanPrompt` restarts only when `effect` changes.
- The `Mono MMM 5` font is declared with `@font-face` in each component's unscoped style from
  `/fonts/monoMMM_5.ttf` (`font-display: swap` in `SamaritanPrompt`, `optional` in `SamaritanPromptMixed`).
