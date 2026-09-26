# Consumer App Styles Structure

## Overview

How a Nuxt app that extends this layer organises its own global CSS. The app mirrors the library's
own numbered `app/assets/styles/setup/` folders, so the consumer file that overrides a library file
is always in the same-numbered folder, and each folder only holds what the app actually changes.

Proven in a production consumer app (2026). Use it for every new consumer app
(`new-app-scaffold.md` creates the skeleton).

Related skills, which this one ties together:

- `theming-colour-ramps.md` / `theming-override-default.md`: palettes and `--theme-hue`/`--theme-chroma`
- `theming-form-geometry-tokens.md`: non-colour form tokens
- `theming-typography-tokens.md`: the `--step-*` scale and font tokens
- `component-local-style-override.md`: per-component site defaults and page/instance overrides

---

## The tree

```
app/assets/styles/
├── main.css                      @import "./setup/";
└── setup/
    ├── index.css                 imports each numbered folder, in order
    ├── 01.config/                page shell: html/body, layout grid, page transitions
    │   ├── index.css
    │   ├── _head.css
    │   └── _page-transitions.css
    ├── 02.colours/               GENERATED palette files (never hand-edited)
    │   ├── index.css
    │   ├── _palette-params.css
    │   └── _<palette>.css        one per palette in ramps.config.mjs
    ├── 03.theming/               site-wide token values, one file per concern
    │   ├── index.css
    │   ├── _default.css          --theme-hue/--theme-chroma + page-level tokens
    │   ├── _forms.css            shared form colour tokens (--theme-input-*, --theme-border, ...)
    │   └── _<component>.css      one per component whose public tokens you set site-wide
    ├── 04.elements/              only if you change non-colour form geometry (see below)
    │   └── index.css
    └── 05.typography/            font family, timing functions, --step-* overrides
        ├── index.css
        └── 01.tokens/
            ├── index.css
            └── _font-family.css
```

| Consumer folder | Pairs with library folder | Put here |
|---|---|---|
| `01.config/` | `setup/01.config/` (normalise, head) | App shell rules: `html`/`body` behaviour, the page layout grid, `pageTransition`/`layoutTransition` CSS |
| `02.colours/` | `setup/02.colours/` | Output of the ramp generator (`theming-colour-ramps.md`). Regenerate, don't edit |
| `03.theming/` | `setup/03.theming/` | `_default.css` (theme hue/chroma, page tokens), shared token families (`_forms.css`, `_button.css`), and `_<component>.css` site defaults |
| `04.elements/` | `setup/04.elements/` (form geometry) | Overrides of the form geometry tokens you actually change, nothing else |
| `05.typography/` | `setup/05.typography/` | `--font-family`, easing/timing tokens, any `--step-*` overrides |

There's no consumer `06.utility-classes/` or `a11y/` by default. The library's utilities are
meant to be used as-is. Add a folder only when the app genuinely needs its own.

Create a folder only when it has something in it. An empty numbered folder is noise, and an
unimported one is worse (see **Keep the import chain complete**).

---

## Wiring

`nuxt.config.ts`: the library's stylesheet first, then the app's:

```ts
css: ["srcdev-nuxt-components/app/assets/styles/main.css", "./app/assets/styles/main.css"],
```

`app/assets/styles/main.css`:

```css
@import "./setup/";
```

`app/assets/styles/setup/index.css`, in numbered order:

```css
@import "./01.config/";
@import "./02.colours/";
@import "./03.theming/";
@import "./04.elements/";
@import "./05.typography/";
```

Each folder's `index.css` imports its own files:

```css
/* setup/03.theming/index.css */
@import "./_default.css";
@import "./_forms.css";
@import "./_card-core.css";
```

- A **directory** import (`@import "./03.theming/";`) resolves to that folder's `index.css`.
- A **file** import always includes the `.css` extension (`@import "./_default.css";`). Missing
  extensions have broken a consumer build before.

**Order.** Everything in `02.colours`–`05.typography` sets custom properties on `:where(html)`, and
custom properties resolve where they're used, so import order between those folders rarely
changes the result. Keep numbered order anyway, so a reader can predict it. Order does matter
within a folder when two files set the **same** token on the same selector (the later one wins),
so import `_default.css` before files that refine it.

---

## Rules for every file

- **Unlayered.** Never wrap consumer styles in `@layer` (including the library's reserved
  `consumer` name). Unlayered CSS beats every library layer regardless of load order, and a named
  layer can end up registered first and lose. Full explanation in
  `component-local-style-override.md` and `theming-override-default.md`.
- **Token values on `:where(html)`,** not `:root` or `html`. Zero specificity, so a colour-scheme
  selector or a page-level `html.some-page` rule setting the same token wins cleanly. See "Site-wide
  component defaults" in `component-local-style-override.md`.
- **Only public tokens.** Set tokens the component's or theme's docs list as public. Never set
  `--_` private tokens.
- **Override, don't copy.** Put only the tokens you change in a consumer file. Don't copy the
  library's source files into the matching consumer folder: a copy silently goes stale when the
  library changes, and hides which values the app actually customised. This matters most for
  `04.elements/`, where the library's form geometry files are large (`theming-form-geometry-tokens.md`
  explains why a partial override is enough).
- **One concern per file, with a one-line header comment** saying what it covers
  (`/* CardCore — site-wide card look. */`).

---

## Keep the import chain complete

A file or folder only takes effect if every `index.css` above it imports it. When adding a file,
add its `@import` in the same change. After restructuring, check nothing is orphaned:

```bash
# every setup folder should be imported by setup/index.css
ls -d app/assets/styles/setup/*/ | xargs -n1 basename
grep '@import' app/assets/styles/setup/index.css
```

A numbered folder that exists but isn't imported is dead CSS that looks live, which is the
easiest way for this structure to mislead.

---

## Upgrading the layer

Components that haven't been migrated (`/migrate-component`) may rename their tokens when they are.
After upgrading `srcdev-nuxt-components`, check each `03.theming/_<component>.css` against that
component's current `CONSUMER-STYLING.md`, and `_forms.css`/`_button.css` against the theming
skills. A renamed token fails silently: the old name is simply never read.
