# CaptureQrCode

Live camera QR code scanner. Streams the device camera, detects QR codes in real time, and displays the decoded results inline. Handles camera errors, page visibility changes, and route navigation — stopping media streams cleanly in all cases.

**File**: `app/components/02.molecules/qr-code/CaptureQrCode.vue`

## Prerequisites

The `nuxt-qrcode` Nuxt module must be registered in the consuming app's `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["nuxt-qrcode"],
});
```

Camera access requires a secure context (HTTPS or localhost) and the user granting camera permission.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root element |

## CSS classes

| Class | Where | Description |
|-------|-------|-------------|
| `.capture-qr-stream` | root | always present |
| `.camera-stopped` | inner | shown when camera is off but no error |
| `.camera-error` | inner | shown when an error has occurred |
| `.scanned-results` | inner | shown when at least one code has been decoded |

## Behaviour

- Camera starts automatically on mount (`state.cameraOn = true`)
- When the page becomes hidden (tab switch, minimize), the camera stops and media streams are released
- On route leave (`onBeforeRouteLeave`), the camera stops and streams are released
- On `<KeepAlive>` deactivate/activate, camera is stopped/restarted accordingly
- If the user denies camera permission or another error occurs, the `.camera-error` state is shown with the error message and a **Reset camera** button
- Detected QR codes replace the previous results — each scan is a fresh result set
- Results are displayed as a `<ul>` inside `.scanned-results`

## Usage

Drop in where camera scanning is needed. No configuration required beyond the module being present:

```vue
<CaptureQrCode />
```

With styling:

```vue
<CaptureQrCode style-class-passthrough="my-scanner" />
```

## CSS override

The root element is a square (`aspect-ratio: 1 / 1`) by default. Override in a consuming page or component:

```css
.my-scanner.capture-qr-stream {
  aspect-ratio: auto;
  max-width: 40rem;
}

.my-scanner .camera-error {
  padding: 1.6rem;
  border-radius: 0.8rem;
  background-color: var(--theme-surface-error);
}

.my-scanner .scanned-results {
  margin-block-start: 1.6rem;
  font-size: 1.4rem;
}
```

## Notes

- The component does not emit the detected values — results are rendered inline. To act on scan results in a parent, extend the component or use `nuxt-qrcode`'s `QrcodeStream` directly with `@detect`.
- Media streams are stopped via two strategies: via the `QrcodeStream` component ref and via a document-level `querySelectorAll("video")` sweep — the sweep acts as a safety net if the ref is unavailable.
