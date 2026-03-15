# Icon Sets

## Overview

`@nuxt/icon` can serve icons from two sources:

1. **Local package** (`@iconify-json/*` installed in the project) — SVG is inlined at build/SSR time, zero runtime cost, no flash.
2. **Iconify CDN** (`api.iconify.design`) — icon is fetched client-side after JS loads, causing a visible flash of content (FOUC) on first page load.

The layer uses several icon sets across its components. Because these are in the layer's `devDependencies` (not `dependencies`), they are **not automatically installed** in consumer apps. Any missing set falls back to the CDN and will flash.

## How the layer signals missing sets

The layer's `modules/icon-sets.ts` runs at dev/build time and logs an info message listing any icon sets that are used by layer components but not found in the consumer's project. Check the terminal output when running `nuxt dev` or `nuxt build`.

## Component → icon set mapping

| Icon set | Package | Used by |
|----------|---------|---------|
| `akar-icons` | `@iconify-json/akar-icons` | DisplayToast, display-prompt variants |
| `bi` | `@iconify-json/bi` | NavigationItems (overflow caret) |
| `bitcoin-icons` | `@iconify-json/bitcoin-icons` | Display components |
| `gravity-ui` | `@iconify-json/gravity-ui` | NavigationItems (burger/ellipsis overflow) |
| `ic` | `@iconify-json/ic` | CarouselBasic, CarouselFlip, CarouselInfinite, SliderGallery, CanvasSwitcher |
| `lucide` | `@iconify-json/lucide` | ColourFinder, TreatmentConsultant |
| `material-symbols` | `@iconify-json/material-symbols` | ServicesSection, form components |
| `mdi` | `@iconify-json/mdi` | NavigationHorizontal, form components, ServicesCard |
| `radix-icons` | `@iconify-json/radix-icons` | InputPasswordWithLabel, InputError, DisplayThemeSwitch |

## Fix: install missing packages

```bash
npm install @iconify-json/akar-icons @iconify-json/bi @iconify-json/bitcoin-icons \
  @iconify-json/gravity-ui @iconify-json/ic @iconify-json/lucide \
  @iconify-json/material-symbols @iconify-json/mdi @iconify-json/radix-icons
```

Only install the sets you actually need — unused ones cost nothing either way, but the install above covers everything the layer ships.

## Notes

- The layer's build-time info message only lists sets missing from the **consumer's own project**. It is not a hard error.
- A consumer app can install any additional icon sets it needs for its own components — these won't conflict.
- If you're not using a particular layer component (e.g. `ColourFinder`), missing `@iconify-json/lucide` won't cause any visible problem.
- The `peerDependencies` + `peerDependenciesMeta (optional: true)` in the layer's `package.json` is the npm-standard signal — package managers like npm 7+ will show a notice for missing optional peers during install.
