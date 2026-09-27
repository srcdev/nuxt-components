# AlertContent / AlertContentInner

## Overview

`AlertContent` is a themed alert panel: an accent stripe on the left, then an icon, a title and/or
message, an optional row of action buttons, and an optional dismiss button. `data-theme` (from the
required `theme` prop) drives every colour through the `--theme-*` tokens, so it works in light and
dark mode.

`AlertContentInner` is the shared inside (icon, body, actions, dismiss) used by both `AlertContent`
and `AlertMaskedContent`. `DisplayToast`, `DisplayToastProvider` and `DisplayPrompt` pick one of
those two with `<component :is>`, so props and slots added here should be forwarded by both
wrappers. Don't use `AlertContentInner` directly in pages.

**Location**: `app/components/02.molecules/alert-content/AlertContent.vue`, `AlertContentInner.vue`

> **Changed 2026-09-27**: skill doc renamed from `alert-content-inner.md`. Added the `showIcon` prop
> and `#actions` slot, public `--alert-content-*` tokens for the previously hardcoded values, and
> renamed `.title`/`.content` to `.alert-content-title`/`.alert-content-text`.

## Props

Same on `AlertContent`, `AlertContentInner` and `AlertMaskedContent`:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `theme` | `SemanticTheme` | — | **Required.** Default icon, and `data-theme` on `AlertContent`'s root. |
| `customIcon` | `string` | `undefined` | Icon name override. |
| `showIcon` | `boolean` | `true` | Set `false` to drop the icon column entirely (no empty space left). |
| `dismissible` | `boolean` | `false` | Shows the dismiss button, which emits `dismiss`. |
| `contentId` | `string` | `undefined` | `id` on `.alert-content-body`, for `aria-describedby` wiring. |
| `ariaLive` | `"polite" \| "assertive" \| "off"` | `undefined` | `aria-live` on `.alert-content-body`. Leave unset for static content (e.g. a banner present on page load). |

## Slots

| Slot | Description |
|---|---|
| `#icon` | Replaces the icon (inside the `aria-hidden` icon region). |
| `#title` | Title line (`<p class="alert-content-title">`). |
| `#content` | Message text (`<p class="alert-content-text">`), so phrasing content only. |
| `#actions` | A wrapping, right-aligned (`--alert-content-actions-justify`) row of controls under the message. Sits **outside** `.alert-content-body`, so it isn't part of the `aria-live` region or the `contentId` description. |
| `#dismissIcon` | Replaces the dismiss button icon. |
| `#dismissLabel` | Screen-reader label for the dismiss button (default `"Close"`); pass translated text here. |

## Events

| Event | When |
|---|---|
| `dismiss` | The dismiss button is clicked. |

## app.config defaults

Icon names, per theme and for the dismiss button, are configurable globally. One change covers every
toast, prompt and any other component built on `AlertContentInner`.

```ts
export default defineAppConfig({
  srcdev: {
    alertContent: {
      icons: {
        info: "heroicons:information-circle",
        success: "heroicons:check-circle",
        warning: "heroicons:exclamation-triangle",
        error: "heroicons:x-circle",
      },
      dismissIcon: "heroicons:x-mark",
    },
  },
})
```

Resolution chain: **`customIcon` prop → app.config icons → hardcoded fallback**. The `#dismissIcon`
slot always wins over app.config.

## Usage

```vue
<AlertContent theme="success">
  <template #title>Saved</template>
  <template #content>Your changes have been saved.</template>
</AlertContent>

<!-- Action row (right-aligned by default), custom icon -->
<AlertContent theme="info" custom-icon="material-symbols:cookie-outline">
  <template #title>Cookies</template>
  <template #content>We use cookies to understand how the site is used.</template>
  <template #actions>
    <InputButtonCore type="button" variant="tertiary" button-text="Reject" @click="reject" />
    <InputButtonCore type="button" variant="primary" button-text="Accept" @click="accept" />
  </template>
</AlertContent>
```

## Styling

Full token list in `CONSUMER-STYLING.md` next to the component. Outer shape (`AlertContent` only):
`--alert-content-accent`, `-accent-width`, `-border`, `-border-radius-start`/`-end`. Inside (applies to
`AlertMaskedContent` too): `--alert-content-inner-background`, `-gap`, `-padding`, `-text-colour`,
`-icon-colour`, `-icon-size`, `-title-font-size`, `-text-font-size`, `-body-gap`,
`-actions-spacing`, `-actions-gap`, `-actions-justify` (default `flex-end`, right-aligned), and the `-dismiss-*` tokens.

## Notes

- `AlertMaskedContent` sets `--alert-content-inner-background: transparent` on its own root so the
  SVG mask shows through; change its fill with `--alert-masked-content-background` instead.
- `AlertContent`'s root is `display: grid` so the inner stretches to the root's height (e.g. in a
  stretched row next to a taller alert) instead of showing the accent colour below it.
- The inner is a flex row (icon | main | dismiss), so a missing icon or dismiss button leaves no
  empty column or stray gap. Before 2026-09-27 it was a fixed three-column grid, and a
  non-dismissible alert carried an empty trailing column plus its gap.
