# useColourScheme Composable

## Overview

`useColourScheme` provides reactive dark/light/auto mode switching, persisted in `localStorage` and applied via a CSS class on `<html>`. It reads an `enabled` flag from runtime config so consuming apps can disable the feature entirely.

**This composable ships inside the `srcdev-nuxt-components` layer** (`app/composables/useColourScheme.ts`). It is auto-imported via the Nuxt layer — **do not create a local copy** in the consuming app.

## Prerequisites

- `runtimeConfig.public.colourScheme.enabled` set in the consuming app's `nuxt.config.ts` (see below)
- If disabled, the `colour-scheme-disable.md` skill covers the one-line CSS override needed to lock the theme

## Runtime config

The composable reads `config.public.colourScheme.enabled` at runtime. Add this to the consuming app's `nuxt.config.ts`:

```ts
// nuxt.config.ts
runtimeConfig: {
  public: {
    colourScheme: {
      enabled: true, // set false to disable switching (see colour-scheme-disable.md)
    },
  },
},
```

When `enabled` is `false`, `useColourScheme()` returns `{ currentColourScheme }` but the watcher and `localStorage` logic are skipped — `currentColourScheme` stays at `"auto"` and the composable is inert.

## Usage

```ts
const { currentColourScheme } = useColourScheme()
// currentColourScheme is a Ref<"light" | "dark" | "auto">
```

To let the user toggle the scheme, bind `currentColourScheme` to a control:

```vue
<select v-model="currentColourScheme">
  <option value="auto">Auto</option>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</select>
```

Setting `currentColourScheme.value` triggers the watcher, which writes to `localStorage` and calls `applyColourScheme()` to update the `<html>` class immediately.

## How scheme application works

The layer ships a head script (`utils/colour-scheme-init.ts`) that runs before paint to read `localStorage` and apply the correct class to `<html>`, preventing flash of wrong theme. `useColourScheme` then syncs its reactive state to match on `onMounted`.

The three valid values are:

| Value | Behaviour |
|---|---|
| `"auto"` | Follows `prefers-color-scheme` media query |
| `"light"` | Forces light theme regardless of OS setting |
| `"dark"` | Forces dark theme regardless of OS setting |

## Notes

- `onMounted` is used to read `localStorage` — `currentColourScheme` is always `"auto"` during SSR and hydrates client-side. Do not read it server-side.
- To disable scheme switching completely in a consuming app, set `enabled: false` in runtime config **and** follow `colour-scheme-disable.md` to lock the CSS to a single theme.
- The composable name exported from the layer is `useColourScheme` (named export).
