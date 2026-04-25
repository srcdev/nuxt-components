# DisplayQrCode

Renders a styled QR code SVG from a string value. Supports colour, size, corner radius, and pixel/marker shape variants.

**File**: `app/components/01.atoms/qr-code/DisplayQrCode.vue`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `qr-value` | `string` | required | The string to encode into the QR code |
| `variant` | `QrCodeVariant` | `{ inner: "default", marker: "default", pixel: "default" }` | Shape variants for inner markers, outer markers, and pixels |
| `radius` | `number` | `0` | Corner rounding applied to pixels/markers (0–1 scale) |
| `black-color` | `string` | `"currentColor"` | Colour for the dark modules |
| `white-color` | `string` | `"transparent"` | Colour for the light modules |
| `size` | `string` | `"256px"` | Width of the QR code (height matches via `aspect-ratio: 1 / 1`) |
| `style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root element |

### QrCodeVariant type

```typescript
import type { QrCodeVariant } from "srcdev-nuxt-components/types/components";

// Each field accepts: "default" | "circle" | "rounded" | "dots" | "classy" | "classy-rounded"
const variant: QrCodeVariant = {
  inner: "circle",
  marker: "rounded",
  pixel: "dots",
};
```

## CSS classes

| Class | Where | Description |
|-------|-------|-------------|
| `.display-qr-code` | root | always present |

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

- The component renders directly as the `Qrcode` element from `nuxt-qrcode` — there is no wrapper `<div>`. The `.display-qr-code` class is applied to the `Qrcode` root, which renders as an `<svg>`.
- `size` is applied via CSS `v-bind()` — pass any valid CSS length value (`px`, `rem`, `%`, etc.).
- `black-color` defaults to `currentColor`, so the QR code inherits the surrounding text colour automatically unless overridden.
- `white-color` defaults to `transparent`, making the background of the QR code see-through by default.
