# DisplayQrCode

Renders a styled QR code SVG from a string value. Supports colour, size, corner radius, and pixel/marker shape variants.

**File**: `app/components/01.atoms/qr-code/DisplayQrCode.vue`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `qr-value` | `string` | required | The string to encode into the QR code |
| `variant` | `QrCodeVariant` | `{ inner: "default", marker: "default", pixel: "default" }` | Shape variants for inner markers, outer markers, and pixels |
| `radius` | `number` | `0` | Corner rounding for the rounded, circle and dots shapes, 0 to 1 (the library clamps values outside) |
| `black-color` | `string` | `"currentColor"` | Colour for the dark modules |
| `white-color` | `string` | `"transparent"` | Colour for the light modules |
| `size` | `string` | `"256px"` | Width of the QR code (height matches via `aspect-ratio: 1 / 1`), never wider than its container |
| `aria-label` | `string` | `"QR code"` | Accessible name for the QR image (root has `role="img"`). Pass something specific and translated, e.g. "Scan to book an appointment". |
| `style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root element |

### QrCodeVariant type

```typescript
import type { QrCodeVariant } from "srcdev-nuxt-components/types/components";

// Each field accepts: "default" | "circle" | "rounded" | "dots" | "pixelated"
const variant: QrCodeVariant = {
  inner: "circle",
  marker: "rounded",
  pixel: "dots",
};
```

## Slots and events

| Name | Kind | Description |
|------|------|-------------|
| `fallback` | slot | Rendered in place of the code when `qr-value` is too long to encode (about 2.9KB at the lowest error correction, less at higher). Empty by default, leaving a blank box of the same size. |
| `error` | event | `(error: Error)`, emitted once when encoding fails. Resets when `qr-value` changes. |

```vue
<DisplayQrCode :qr-value="bookingUrl" @error="reportQrError">
  <template #fallback>
    <a :href="bookingUrl">Open the booking page</a>
  </template>
</DisplayQrCode>
```

## CSS token

`--display-qr-code-size` overrides the `size` prop when set (e.g. on a page wrapper). Full reference: `app/components/01.atoms/qr-code/CONSUMER-STYLING.md`.

## CSS classes

| Class | Where | Description |
|-------|-------|-------------|
| `.display-qr-code` | root | always present |
| `.display-qr-code-fallback` | root | only when the value can't be encoded (with `data-error`) |

## Usage

Minimal — encodes a URL with default styling:

```vue
<DisplayQrCode qr-value="https://example.com" />
```

Custom size, colour, and rounded pixels:

```vue
<DisplayQrCode
  qr-value="https://example.com"
  size="320px"
  black-color="#1a1a2e"
  white-color="#f5f5f5"
  :radius="0.5"
  :variant="{ inner: 'circle', marker: 'rounded', pixel: 'default' }"
/>
```

## Notes

- The component renders directly as the `Qrcode` element from `nuxt-qrcode` — there is no wrapper `<div>`. The `.display-qr-code` class is applied to the `Qrcode` root, which renders as an `<svg>`. When encoding fails it renders a `<span class="display-qr-code display-qr-code-fallback">` instead.
- Encoding errors are caught with `onErrorCaptured`, so an over-capacity value from a CMS can't break the page render. `nuxt-qrcode` must be installed in the consuming app.
- `size` is applied via CSS `v-bind()` — pass any valid CSS length value (`px`, `rem`, `%`, etc.).
- `black-color` defaults to `currentColor`, so the QR code inherits the surrounding text colour automatically unless overridden.
- `white-color` defaults to `transparent`, making the background of the QR code see-through by default.
- 2026-10-19 migration: added the `fallback` slot and `error` event, capped the width at the container, corrected the variant list (`pixelated`, no `classy`) and added a `StressTest` story; the story's radius control now uses the real 0 to 1 range.
