# ProgressTracker Component

## Overview

`ProgressTracker` (`app/components/02.molecules/progress-tracker/`) is a presentational progress
track for a multi-step flow: a header with "Step X of Y" and a progress bar, then the steps as a
`StepperList`. Steps before the `v-model` index are done (filled indicator with a tick), the model's
step is current (ringed number, content in a focus card) and later steps are upcoming (outlined
number, muted text). The current step's `#step-{n}` slot is where a parent puts a form or actions,
so it also works as an accordion-style n-step wizard. The parent owns all state; the component has
no events and never changes the model. Styling tokens:
`app/components/02.molecules/progress-tracker/CONSUMER-STYLING.md`.

---

## Props reference

> **Hyphenation rule**: write camelCase props hyphenated in templates: `:style-class-passthrough`.

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `v-model` | `number` | (required) | 0-based index of the current step. `steps.length` means every step is done. Floored, and clamped to `0`–`steps.length`. |
| `:steps` | `ProgressTrackerStep[]` | (required) | `{ title: string; body?: string }`, exported from `~/types/components`. An empty array renders nothing. |
| `heading-tag` | `"h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h3"` | Tag for each step title. |
| `step-label` | `string` | `"Step {current} of {total}"` | Header text and the bar's `aria-valuetext`; `{current}` is 1-based. |
| `complete-label` | `string` | `"All steps complete"` | Header text once every step is done. |
| `done-label` | `string` | `"Completed"` | Screen-reader text appended to each done title (", Completed"). |
| `done-icon` | `string` | `"lucide:check"` | Iconify name for the tick. |
| `:focus-on-change` | `boolean` | `true` | Move focus when the model changes (see Behaviour). |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Classes on the root `div`. |

## Slots

| Slot | Props | Notes |
|---|---|---|
| `#step-{n}` | `{ step, index, headingId }` | Rendered **only while step `n` is current**, inside its focus card under the body. `headingId` is the step title's id, for `aria-labelledby` on a form. |

---

## Behaviour

- One row per step, with its title and body; a step without a body has no body paragraph.
- Steps before the model are done, the model's step is current, later steps are upcoming.
- The current title has `aria-current="step"`; done titles carry `done-label` as screen-reader
  text; indicators are `aria-hidden`. The list is an `ol`, so position ("2 of 5") is announced too.
- The header shows `step-label` filled in, or `complete-label` when every step is done. It's a
  polite live region, so a change is announced.
- The bar is `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax` = step count,
  `aria-valuenow` = done count and `aria-valuetext` = the header label.
- Changing the model after mount moves focus to the new current title (`tabindex="-1"`), or to the
  header label when complete, so keyboard and screen-reader users aren't dropped when a slot's
  focused button unmounts. Never on first render. `:focus-on-change="false"` turns it off (e.g.
  when the parent restores saved progress after mount).
- Done steps are plain text: there is nothing clickable in the component itself.
- The model is clamped: negative counts as 0, above `steps.length` counts as complete, fractions
  are floored.
- Survives worst-case data (unbroken strings, long copy, 20+ steps, empty steps) without breaking
  the layout; the header wraps the bar below the label when space runs out.
- Bar and state colour transitions are off under `prefers-reduced-motion: reduce`.

---

## Usage

### Display only

```vue
<ProgressTracker v-model="currentStep" :steps="onboardingSteps" />
```

### Wizard (parent-owned forms)

```vue
<script setup lang="ts">
import type { ProgressTrackerStep } from "~/types/components";

const currentStep = ref(0);
const form = reactive({ name: "", email: "" });

const steps = computed<ProgressTrackerStep[]>(() => [
  { title: "Your details", body: currentStep.value > 0 ? form.name : "Tell us who you are." },
  { title: "Contact", body: currentStep.value > 1 ? form.email : "Where can we reach you?" },
  { title: "Review and submit" },
]);
</script>

<template>
  <ProgressTracker v-model="currentStep" :steps="steps">
    <template #step-0="{ headingId }">
      <form :aria-labelledby="headingId" @submit.prevent="currentStep++">
        <!-- fields, then a submit InputButton labelled Continue -->
      </form>
    </template>
    <template #step-1="{ headingId }">
      <form :aria-labelledby="headingId" @submit.prevent="currentStep++">
        <!-- fields, a Back InputButton (@click="currentStep--") and Continue -->
      </form>
    </template>
    <template #step-2="{ headingId }">
      <form :aria-labelledby="headingId" @submit.prevent="currentStep = steps.length">
        <!-- review, Back and Submit -->
      </form>
    </template>
  </ProgressTracker>
</template>
```

Validation, saving and what "complete" means are the parent's job. Pass a summary of each completed
step back in as its `body` so done steps show what was entered.

---

## Composition

- Built on `StepperList` (`tag="ol"`, `indicator-alignment="top"`), filling its `indicator-{n}` and
  `item-{n}` slots. ProgressTracker sets StepperList's `--stepper-list-*` tokens on
  `.progress-tracker-list` from its own, so an ancestor's `--stepper-list-*` values don't reach it.
- Connector colour per state uses `.stepper-list-item:has(.progress-tracker-indicator.is-done)`,
  the per-step state recipe from StepperList's `CONSUMER-STYLING.md`.
- The focus card bleeds left by `--progress-tracker-card-padding-inline` so the current step's text
  stays aligned with the other steps; the current indicator moves down by the card's block padding
  to stay level with its title. Clearance between the current ring and the card is
  `gap - card-padding-inline - ring-width` (4rem - 2rem - 0.6rem = 1.4rem by default). The first
  defaults (3.2rem gap, 2.4rem padding) left 0.2rem and the ring touched the card, so change these
  three together.

---

## Stories

Default, All Complete, Interactive (Mark complete), Wizard (parent-owned forms), Translated
Labels, White Card on a Panel, Stress Test. Title: `Molecules/ProgressTracker`.

---

## Notes

- Out of scope: clickable or back-navigable steps, a built-in complete event or validation,
  horizontal layout, auto-advance.
- Auto-imported in Nuxt; import the `ProgressTrackerStep` type from `~/types/components`.
