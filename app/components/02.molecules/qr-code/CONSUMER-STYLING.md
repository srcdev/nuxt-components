# CaptureQrCode / DecodeQrCode — Consumer Styling Guide

## Public token API

### CaptureQrCode

| Token | Default | Controls |
|---|---|---|
| `--capture-qr-code-aspect-ratio` | `1 / 1` | Root aspect ratio (the camera frame) |
| `--capture-qr-code-error-gap` | `1.2rem` | Gap between the error message and the reset button |

The reset button is `InputButtonCore` (`variant="secondary"`), styled by its own tokens.

### DecodeQrCode

| Token | Default | Controls |
|---|---|---|
| `--decode-qr-code-gap` | `1.2rem` | Gap between upload, drop zone and results |
| `--decode-qr-code-upload-gap` | `0.6rem` | Gap between the upload label text and the file input |
| `--decode-qr-code-dropzone-min-height` | `3rem` | Drop zone minimum height |
| `--decode-qr-code-dropzone-padding` | `1.2rem` | Drop zone padding |
| `--decode-qr-code-dropzone-border-radius` | `0.5rem` | Drop zone corner rounding |
| `--decode-qr-code-dropzone-border-width` | `2px` | Drop zone dashed border width |
| `--decode-qr-code-dropzone-border-colour` | `gray` | Drop zone border colour |
| `--decode-qr-code-dropzone-border-colour-active` | the border colour | Border colour while an image is dragged over |
| `--decode-qr-code-dropzone-background-active` | `transparent` | Background while an image is dragged over |

Private (not public API): `--_dropzone-border-colour`.

> Changed 2026-09-28: all of these were hardcoded or missing. DecodeQrCode's root is no longer
> forced to `aspect-ratio: 1 / 1`.

---

## State hooks

| Hook | Component | When |
|---|---|---|
| `.capture-qr-code-stopped` | Capture | Camera stopped (tab hidden, route leave), no error |
| `.capture-qr-code-error` (`role="alert"`) | Capture | Camera error; replaceable via the `#error` slot |
| `.decode-qr-code-dropzone.is-dropping` | Decode | An image is dragged over the drop zone |

Inner classes: Capture `.capture-qr-code-camera`, `.capture-qr-code-results`; Decode
`.decode-qr-code-upload` (label), `.decode-qr-code-upload-label`, `.decode-qr-code-capture` (file
input), `.decode-qr-code-dropzone`, `.decode-qr-code-dropzone-label`, `.decode-qr-code-results`.
Both results wrappers are polite live regions and always rendered; the `<ul>` inside appears once a
code is decoded.

> Changed 2026-09-28: renamed from `.capture-qr-stream` (root), `.camera-stopped`, `.camera-error`,
> `.scanned-results`, `.qr-code-capture` and `.qr-code-dropzone`.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to each component's root. Reactive after mount.
