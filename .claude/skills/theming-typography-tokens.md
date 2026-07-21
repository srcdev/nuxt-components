# Typography Tokens

## Overview

`html { font-size: 62.5%; }` is set globally by this layer (`setup/01.config/_head.css`), which
redefines `1rem` to `10px` instead of the browser default `16px`. Every font-size in this design
system is calibrated against that 10px root, via the fluid `--step-N` custom properties and the
`page-heading-*`/`page-body-*` utility classes built on top of them — never a raw `rem` literal.

**The trap**: a raw value like `font-size: 0.85rem` looks like a reasonable ~13.6px in a normal
16px-root project. In a consumer of this layer it renders at 8.5px — because `1rem` here is `10px`,
not `16px`. This silently produces illegibly small text with no error or warning; it only shows up
visually. Always use `var(--step-N)` (or a `page-heading-*`/`page-body-*` utility class) instead of
a raw `rem`/`px` font-size when writing new component or page-local CSS in a consumer app.

## The token scale

Defined in `setup/05.typography/01.tokens/_reponsive-font-sizes.css`, on `:where(html)`. Each step
is a fluid `clamp()` — smallest at narrow viewports, largest at wide ones:

| Token | Approx. range (px, at 10px root) |
|---|---|
| `--step-1` | ~7.8–8 |
| `--step-2` | ~9.4–10 |
| `--step-3` | ~11.25–12.5 |
| `--step-4` | ~13.5–15.6 (body default) |
| `--step-5` | ~16.2–19.5 |
| `--step-6` | ~19.4–24.4 |
| `--step-7` | ~23.3–30.5 |
| `--step-8` | ~28–38.1 |
| `--step-9` | ~33.6–47.7 |
| `--step-10` | ~40.3–59.6 |

Plus purpose-specific tokens for hero/eyebrow text: `--hero-text-display`, `--hero-text-title`,
`--hero-text-heading`, `--hero-text-subheading`, `--hero-text-label`, `--eyebrow-text-large`,
`--eyebrow-text-medium`, `--eyebrow-text-small`.

`body` itself is set to `font-size: var(--step-4)` (`setup/01.config/_head.css`), so plain `<p>`/`<li>`
text inherits the correct scaled size automatically — you only need to reach for a token explicitly
when setting a font-size on something other than ambient body text (labels, nav links, table cells,
code blocks, etc.).

## Utility classes built on the scale

`setup/05.typography/02.utility-classes/_font-classes-page-heading.css` and
`_font-classes-page-body.css` map the steps to semantic classes:

| Class | Token |
|---|---|
| `.page-heading-1` | `--step-8` |
| `.page-heading-2` | `--step-7` |
| `.page-heading-3` | `--step-6` |
| `.page-heading-4` | `--step-5` |
| `.page-heading-5` | `--step-4` |
| `.page-heading-6` | `--step-3` |
| `.page-body-large` | `--step-6` |
| `.page-body-medium` | `--step-5` |
| `.page-body-normal` | `--step-4` |
| `.page-body-small` | `--step-3` |
| `.page-body-xsmall` | `--step-2` |

`page-body-*` also has `-light`/`-semibold`/`-bold` weight variants (e.g. `.page-body-normal-bold`).

## Steps

### 1. Prefer the utility classes for standalone text

If a heading or paragraph in your markup can just be a plain element with one of these classes,
use the class rather than writing new CSS:

```vue
<h1 class="page-heading-1">Dashboard</h1>
<p class="page-body-normal">Overview of your account activity.</p>
```

### 2. Use `var(--step-N)` inside component-scoped CSS

For font-sizes inside a component's own `<style>` block (sidebar labels, table text, code blocks,
badges, etc.), reference the token directly rather than a class:

```css
.my-component__label {
  font-size: var(--step-4);
}
```

Don't go below `--step-4` for anything a user is expected to actually read (nav links, table
cells, code, captions) — `--step-2`/`--step-3` look reasonable in isolation but read as too small
once placed in real dense UI (sidebars, TOCs, code blocks) next to normal body text. Reserve
`--step-1`–`--step-3` for genuinely decorative/secondary marks (eyebrow labels, badge counters)
where legibility isn't the point.

### 3. Pick a step by relative scale, not by trying to hit a literal px target

Since every step is fluid (`clamp()`), don't reason about "I want 12px" — reason about it relative
to body text (`--step-4`): one step down (`--step-3`) for slightly smaller text (small labels, table
cells), two steps down (`--step-2`) for compact caption/label text (sidebar nav group titles, tab
labels), and so on upward for headings.

## Notes

- This applies to *any* consumer app extending this layer, not just components inside this repo —
  a local/custom component written in a consuming app (e.g. a docs page's own sidebar/TOC component)
  needs the same `var(--step-N)` treatment, since it inherits the same `62.5%` root reset via the
  layer's global CSS.
- Caught in the wild: a docs-page sidebar/TOC/code-block set of components in a consumer app
  (`guidemyhair`) shipped with raw `0.75rem`/`0.85rem`/`0.9rem` font-sizes, assuming a 16px root —
  rendered far too small once the layer's `62.5%` reset applied. Fixed by switching every one to the
  matching `--step-N` token.
