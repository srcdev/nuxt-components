---
paths:
  - "app/**/*.vue"
---

# Build layout-level nav data per locale, not per route

Nav data passed into a layout-level header (`ResponsiveHeader`, `SiteHeader`) that uses
`localePath()` must be rebuilt only when the locale changes: a `shallowRef` refreshed by
`watch(locale, …)`, not a `computed()`. Plain `t()` alone is fine in a `computed()`.

Why: `localePath()` reads the current route, so a `computed()` that calls it returns a new, equal
object on every navigation. Until 2026-11-24, `ResponsiveHeader` treated that as new nav data, hid every
item and re-measured, so the nav blinked on each route change (fixed in the layer since, but
any other component that watches the object's identity has the same problem). Detail and code:
skill `components/responsive-header.md` (srcdev-nuxt-components), "Localised nav links".
