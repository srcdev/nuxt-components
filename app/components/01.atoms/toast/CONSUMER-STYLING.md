# DisplayToast / DisplayToastProvider — Consumer Styling Guide

## Stacking order

```css
--display-toast-z-index: 999999;          /* DisplayToast (standalone) */
--display-toast-provider-z-index: 999999; /* DisplayToastProvider (queue) */
```

Both default to `999999`, matching `DisplayDialog`'s own `--display-dialog-z-index` default — a
toast is meant to float above ordinary page chrome (headers, sticky nav), so it needs to clear
whatever z-index a consumer's own layout uses for that. If a toast appears behind your site
header, your header's z-index is at or above `999999`; either raise the toast's token to match/
exceed it, or (more robust) lower the header's z-index to something more ordinary — very few
elements legitimately need to sit above a `dialog`/`alertdialog`.

If a `DisplayDialog` and a toast happen to be visible at the same time, the two tie on DOM/paint
order at equal z-index — an acceptable edge case for a transient notification, not worth resolving
with a strict priority order between them.

```css
/* Global override, e.g. assets/styles/setup/07.components/display-toast.css */
:root {
  --display-toast-z-index: 1000000;
  --display-toast-provider-z-index: 1000000;
}
```
