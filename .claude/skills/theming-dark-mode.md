# Dark Mode in a Consumer App

## Overview

Since 2026-10-04 this layer ships **light colour values only**. No token in the layer uses
`light-dark()`, because older iPad Safari doesn't support it. A custom property holding an
unsupported `light-dark()` is stored without complaint, then every property that reads it becomes
invalid at computed-value time: transparent backgrounds, `currentColor` borders, no console error.

Dark mode is the consumer app's decision. The layer still provides all the switching plumbing:

| Part | What it does |
|---|---|
| `runtimeConfig.public.colourScheme.enabled` | Turns the plumbing on. `new-app-scaffold.md` defaults it to `false`, so set it to `true` (see `colour-scheme-disable.md` for the config shape) |
| Head script (`modules/colour-scheme.ts`, `utils/colour-scheme-init.ts`) | Before first paint, sets `html[data-color-scheme]` to the saved `auto`, `light` or `dark` (default `auto`) |
| `useColourScheme()` | Reads/writes the saved scheme. See `composable-colour-scheme.md` |
| `DisplayThemeSwitch` | Ready-made system/light/dark picker. See `components/display-theme-switch.md` |

What the app supplies is the dark **values**, and the CSS `color-scheme` property. The layer
doesn't declare `color-scheme` at all (removed 2026-10-04), so browsers render native UI
(scrollbars, date and select pickers, form control internals) light unless the app says
otherwise. There are two ways to do it.

---

## Option A: attribute + media query (works on older Safari)

Redeclare the tokens you want dark under `html[data-color-scheme="dark"]`, and again inside a
`prefers-color-scheme: dark` media query for `auto`. The two blocks hold the same declarations;
that duplication is the cost of not using `light-dark()`.

Put it in its own file, imported **last** in the app's `03.theming/index.css` (see
`consumer-styles-structure.md`). The selectors are wrapped in `:where()` like every other consumer
token file, so they have zero specificity and win over the app's own light values by coming later.

```css
/* setup/03.theming/index.css */
@import "./_default.css";
@import "./_forms.css";
@import "./_dark.css";   /* last */
```

### Full token set

These are the dark values the layer used to ship, so starting from this file gives you back the
previous built-in dark mode exactly. Delete what you don't need, or swap in your own palette's steps
(`--gold-04` etc.). If your `_default.css` changed a page-level token to another palette (e.g.
`--colour-text-accent: var(--gold-09)`), use that palette's step here too.

```css
/* Dark scheme: token values for html[data-color-scheme="dark"], and "auto" on a dark OS. */

/* ---- 1. Page-level, a11y and input tokens: html only ---- */
:where(html[data-color-scheme="dark"]) {
  color-scheme: dark; /* native UI goes dark too */

  --page-bg: var(--slate-08);
  --colour-text-default: var(--slate-01);
  --colour-text-accent: var(--blue-05);
  --colour-text-eyebrow: var(--blue-05);
  --colour-link-default: var(--blue-02);
  --colour-link-hover: var(--blue-03);

  --theme-input-surface: var(--slate-10);
  --theme-input-surface-hover: var(--slate-09);
  --theme-input-text-color-normal: var(--slate-01);
  --theme-input-placeholder: var(--slate-04);

  --focus-box-shadow-colour-on: var(--slate-00);
  --box-shadow-on: 0 0 0 0.3rem var(--slate-00);

  /* Only if you use StepperList */
  --stepper-list-counter-circle-text: var(--blue-02);
  --stepper-list-counter-circle-border: var(--blue-02);
  --stepper-list-counter-disc-background: var(--blue-02);
  --stepper-list-counter-disc-border: var(--blue-02);
  --stepper-list-counter-square-text: var(--blue-02);
  --stepper-list-counter-square-border: var(--blue-02);
  --stepper-list-connector-color: var(--blue-02);
  --stepper-list-icon-color: var(--blue-02);

  /* Only if you use TreatmentConsultant */
  --treatment-consultant-primary-colour: var(--amber-02);
  --treatment-consultant-primary-foreground: var(--amber-02);
  --treatment-consultant-muted-colour: var(--amber-05);
  --treatment-consultant-muted-foreground: var(--amber-05);
  --treatment-consultant-background: var(--amber-10);
  --treatment-consultant-foreground: var(--amber-02);
  --treatment-consultant-border-colour: var(--amber-03);
  --treatment-consultant-checked-surface-colour: var(--green-10);
  --treatment-consultant-checked-stroke-colour: var(--green-03);
  --treatment-consultant-conflict-surface-colour: var(--sunset-09);
  --treatment-consultant-conflict-stroke-colour: var(--sunset-03);
}

/* ---- 2. Semantic slots: html AND every themed element ---- */
:where(
  html[data-color-scheme="dark"],
  html[data-color-scheme="dark"] [data-theme],
  html[data-color-scheme="dark"] [data-invalid]
) {
  --theme-surface: var(--colour-theme-9);
  --theme-surface-inverted: var(--colour-theme-2);
  --theme-surface-hover: var(--colour-theme-7);
  --theme-accent: var(--colour-theme-4);
  --theme-surface-subtle: var(--colour-theme-9);
  --theme-border: var(--colour-theme-5);
  --theme-border-focus: var(--colour-theme-3);
  --theme-ring: var(--colour-theme-9);
  --theme-text: var(--colour-theme-2);
  --theme-text-inverted: var(--colour-theme-7);
}

/* ---- 3. Warning keeps its AA-safe step 6 surface in both schemes ---- */
:where(html[data-color-scheme="dark"] [data-theme="warning"]) {
  --theme-surface: var(--colour-theme-6);
  --theme-surface-hover: var(--colour-theme-7);
}

/* ---- 4. Form error tokens ---- */
:where(
  html[data-color-scheme="dark"] [data-invalid],
  html[data-color-scheme="dark"] [data-theme="error"]
) {
  --theme-error-surface: var(--red-07);
  --theme-error-border: var(--red-07);
  --theme-error-outline: var(--red-05);
}

/* ---- 5. "auto" on a dark OS: repeat blocks 1-4 with data-color-scheme="auto" ---- */
@media (prefers-color-scheme: dark) {
  :where(html[data-color-scheme="auto"]) {
    /* block 1 declarations */
  }
  :where(
    html[data-color-scheme="auto"],
    html[data-color-scheme="auto"] [data-theme],
    html[data-color-scheme="auto"] [data-invalid]
  ) {
    /* block 2 declarations */
  }
  :where(html[data-color-scheme="auto"] [data-theme="warning"]) {
    /* block 3 declarations */
  }
  :where(
    html[data-color-scheme="auto"] [data-invalid],
    html[data-color-scheme="auto"] [data-theme="error"]
  ) {
    /* block 4 declarations */
  }
}
```

### Why the selectors look like that

- **Semantic slots must be redeclared on `[data-theme]` and `[data-invalid]` elements**, not only
  on `html`. The layer declares them on all three (`_theme-slots.css`) so `var(--colour-theme-N)`
  resolves against each themed element's own hue. A dark value set only on `html` would be
  computed once with the default hue and inherited, and every `data-theme="success"`/`"error"`
  element would turn the default blue.
- **`[data-theme="warning"]` needs its own block** because the layer gives warning a fixed step 6
  surface (the lightest orange step where light text still passes AA). Block 2 would otherwise
  overwrite it.
- **No `data-color-scheme` attribute at all** only happens if the plumbing is disabled. If you
  render before the head script can run (rare), add `html:not([data-color-scheme])` next to the
  `auto` selector in block 5.

### Component tokens

Components whose own public tokens default to fixed light values (e.g.
`--clipped-panel-background-colour`, `--glass-panel-*`, `--carousel-flip-*`,
`--dashboard-quad-grid-*`) don't change with the semantic slots. Add any you use to block 1 (and
block 5). Each component's `CONSUMER-STYLING.md` lists its colour tokens.

---

## Option B: `light-dark()` (shorter, modern browsers only)

If the app doesn't need to support older Safari (`light-dark()` needs Safari 17.5+, Chrome 123+,
Firefox 120+), set each token once with both values. `light-dark()` picks its branch from the
`color-scheme` property, which the layer doesn't set, so the app declares it, following the
attribute:

```css
html {
  color-scheme: light dark; /* "auto": follow the OS */

  &[data-color-scheme="light"] { color-scheme: light; }
  &[data-color-scheme="dark"]  { color-scheme: dark; }
}

:where(html) {
  --page-bg: light-dark(var(--slate-00), var(--slate-08));
  --colour-text-default: light-dark(var(--slate-09), var(--slate-01));
}

:where(html, [data-theme], [data-invalid]) {
  --theme-surface: light-dark(var(--colour-theme-7), var(--colour-theme-9));
  --theme-text: light-dark(var(--colour-theme-9), var(--colour-theme-2));
  /* ...the rest of block 2 from Option A, each as light-dark(layer value, dark value) */
}
```

The light value for each token is the layer's current default (see
`app/assets/styles/setup/03.theming/` and `a11y/_variables.css` in the package). The same rules
apply: semantic slots on `[data-theme]`/`[data-invalid]` too, and a separate rule for
`[data-theme="warning"]`.

**Multi-value caveat**: `light-dark()` can't hold comma-separated values (e.g. a box-shadow list).
Put the varying part in a scalar var:

```css
--_shadow-a: light-dark(0.08, 0.5);
--my-shadow: 0 8px 32px rgba(0, 0, 0, var(--_shadow-a));
```

On a browser without `light-dark()`, Option B fails the same silent way described in the
Overview. Don't mix: if older Safari matters for any page, use Option A everywhere.

---

## Light-only apps

If the app has no dark mode, leave `colourScheme.enabled: false` (the scaffold default) and add
nothing. With no `color-scheme` declared anywhere, native UI stays light even on a dark OS.

---

## Storybook in a consumer app

This repo's own Storybook is set up as a consumer and is a working reference:
`.storybook/color-scheme.css` holds blocks 1-4, and `.storybook/preview.ts` turns its "Follow OS"
toolbar option into `data-color-scheme="light"`/`"dark"` using `matchMedia`, so it needs no block 5.
Those files aren't in the npm package; the token set above is the same content.

---

## Related

- `composable-colour-scheme.md`: `useColourScheme()` API
- `colour-scheme-disable.md`: the `enabled` flag and turning everything off
- `theming-colour-ramps.md`: ramps, semantic slots, palettes for your dark values
- `consumer-styles-structure.md`: where `_dark.css` sits in the app's CSS tree
