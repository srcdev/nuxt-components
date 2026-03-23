# TreatmentConsultant Component

## Overview

`TreatmentConsultant` is a self-contained 5-step hair consultation wizard (`03.organisms`). It collects a user's hair profile across four steps (hair type, natural colour, dream colour, style & treatments) and renders a personalised recommendation on the final step.

All data — hair types, colour swatches, treatments, and the recommendation matrix — is hard-coded inside the component. There are no external data dependencies.

## Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `autoAdvance` | `boolean` | `false` | Automatically advances to the next step immediately after each selection (steps 0–2). On step 3, a "View Results" button still appears when `allowMultipleTreatments` is also `true`. |
| `allowMultipleTreatments` | `boolean` | `false` | Enables multi-select on the treatments step. When `false`, selecting a treatment deselects any previous choice. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Standard passthrough prop for HOC styling. |

## Basic usage

```vue
<TreatmentConsultant :auto-advance="true" :allow-multiple-treatments="true" />
```

## Steps

| Index | Label | Behaviour |
|-------|-------|-----------|
| 0 | Hair Type | Single select — straight, wavy, curly, coily |
| 1 | Your Colour | Single select — 7 natural colour swatches |
| 2 | Dream Colour | Single select — 8 desired colours (incl. "none") |
| 3 | Style & Treatments | Single or multi-select (see `allowMultipleTreatments`) |
| 4 | Results | Read-only — recommendation, treatment cards, summary, CTA |

## Navigation rules

- Completed steps (index < current) are clickable to go back.
- Future steps are disabled via `aria-disabled` + `tabindex="-1"`.
- Steps 0–2 require a selection before proceeding (`canProceed`).
- Step 3 is always passable — treatments are optional.
- `reset()` clears all state and returns to step 0.

## Treatment selection logic

- Selecting `"none"` clears all other treatments (and vice versa).
- In multi-select mode, selecting a treatment automatically removes any conflicting ones (defined by each treatment's `excludes` array).
- Conflicting treatments are visually marked with a `lucide:ban` icon and a "Conflicts with X" label.

## Treatment–Colour compatibility

Some treatments clash with same-day colour services: `keratin-smoothing`, `perm`, `relaxer`, `japanese-straightening`. These show a "Not same-day as colour" badge in the results view when a colour change was also selected.

## Recommendation matrix

`getColourRecommendation(naturalColour, desiredColour, hairType)` maps the combination to:

```ts
interface Recommendation {
  suitability: "great" | "possible" | "difficult" | "not-recommended";
  method: string;      // e.g. "Semi-Permanent", "Bleach Required"
  notes: string;       // one-line summary
  details: string[];   // bullet points
}
```

Curly or coily hair type appends an extra conditioning note to `details`. Unmapped combinations fall back to `suitability: "possible"` with a consultation prompt.

## Image assets

Swatch JPEGs live at `public/images/treatment-consultant/`:
- `swatch-{light-blonde,dark-blonde,light-brown,dark-brown,red,black,grey-white}.jpeg` (natural colours)
- `swatch-dream-{blonde,brown,red,black,grey-silver,vivid,balayage}.jpeg` (desired colours)

All `NuxtImg` usages include explicit `width` and `height` (128×128 in options, 96×96 in results summary).

## Styling

Amber-toned dark theme. Tokens scoped to `.treatment-consultant`:

```css
.treatment-consultant {
  --_canvas-color: var(--amber-09);
  --_canvas-text: var(--amber-02);
  --_surface-active: var(--amber-10);
  --_surface-checked: var(--green-09);
  --_surface-excluded: color-mix(in srgb, var(--red-07) 10%, transparent);
  /* … */
}
```

Fonts: Inter (body), Playfair Display (accent).
Step transitions: `<Transition name="slide" mode="out-in">`.
Results cards use `v-motion` with staggered enter animations.

## Local style override scaffold

```vue
<TreatmentConsultant :style-class-passthrough="['my-consultant']" />

<style>
/* ─── TreatmentConsultant local overrides ──────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.treatment-consultant {
  &.my-consultant {
    /* Canvas background */
    /* --_canvas-color: var(--brand-surface); */

    /* Option selected state */
    /* --_surface-checked: var(--brand-accent); */
    /* --_border-checked: var(--brand-accent-border); */
  }
}
</style>
```

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

## CTA (results step)

- "Book Consultation" links to `/#contact` (hardcoded anchor).
- "Start Again" calls `reset()`.

## Notes

- Component is auto-imported in Nuxt — no import needed.
- No slots — entirely self-contained UI and data.
- `styleClassPassthrough` is accepted but not currently wired to `useStyleClassPassthrough` inside the component.
- Storybook story at `Organisms/TreatmentConsultant` — controls for both props.
