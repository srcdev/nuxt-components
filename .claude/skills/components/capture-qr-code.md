# CaptureQrCode

Live camera QR code scanner. Streams the device camera, detects QR codes in real time, and displays the decoded results inline. Handles camera errors, page visibility changes, and route navigation — stopping media streams cleanly in all cases.

**File**: `app/components/02.molecules/qr-code/CaptureQrCode.vue`

> **Changed 2026-09-28:** root class `.capture-qr-stream` → `.capture-qr-code`; `.camera-stopped`, `.camera-error`, `.scanned-results` → `.capture-qr-code-stopped`, `-error`, `-results`. Copy is now props, the error block is `role="alert"` with an `#error` slot, and the reset button is `InputButton`.

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
| `camera-stopped-label` | `string` | `"Camera stopped"` | Message while the camera is stopped (tab hidden, route leave) |
| `reset-camera-label` | `string` | `"Reset camera"` | Reset button text in the error state |
| `error-messages` | `CaptureQrCodeErrorMessages` | `{}` | Error copy keyed by error name (`NotAllowedError`, `NotFoundError`, `NotSupportedError`, `NotReadableError`, `OverconstrainedError`, `StreamApiNotSupportedError`, `InsecureContextError`, `StreamLoadTimeoutError`) plus `default`. Each key falls back to a built-in plain-English message; any other error name uses `default`. Type from `~/types/components`. |
| `style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root element |

## Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `#error` | `{ error, message, reset }` | Replaces the default error content (message + reset button). `message` is the resolved `errorMessages` text. `error` is the `Error.name` (e.g. `NotAllowedError`), so you can show your own translated copy per case; call `reset()` to retry. |

## CSS classes

| Class | Where | Description |
|-------|-------|-------------|
| `.capture-qr-code` | root | always present |
| `.capture-qr-code-stopped` | inner | shown when camera is off but no error |
| `.capture-qr-code-error` | inner | shown when an error has occurred |
| `.capture-qr-code-results` | inner | polite live region, always rendered; its `.capture-qr-code-results-list` `<ul>` appears once a code is decoded |
| `.capture-qr-code-result` | `<li>` | one decoded value; wraps anywhere |
| `.capture-qr-code-error-message` | `<p>` | default error text |

## Behaviour

- Camera starts automatically on mount (`state.cameraOn = true`)
- When the page becomes hidden (tab switch, minimize), the camera stops and media streams are released; when it becomes visible again the camera restarts, unless an error is showing (until 2026-10-21 it stayed on "Camera stopped" with no way back)
- On route leave (`onBeforeRouteLeave`), the camera stops and streams are released
- On `<KeepAlive>` deactivate/activate, camera is stopped/restarted accordingly
- If the user denies camera permission or another error occurs, the `.capture-qr-code-error` state is shown with a plain-language message (from `errorMessages`, not the library's raw `[Name]: message` text, which it showed until 2026-10-21) and a **Reset camera** button
- Detected QR codes replace the previous results — each scan is a fresh result set
- Results are displayed as a `<ul>` inside `.capture-qr-code-results`

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
.my-scanner.capture-qr-code {
  aspect-ratio: auto;
  max-width: 40rem;
}

.my-scanner .capture-qr-code-error {
  padding: 1.6rem;
  border-radius: 0.8rem;
  background-color: var(--theme-surface-error);
}

.my-scanner .capture-qr-code-results {
  margin-block-start: 1.6rem;
  font-size: 1.4rem;
}
```

## Notes

- The component does not emit the detected values — results are rendered inline. To act on scan results in a parent, extend the component or use `nuxt-qrcode`'s `QrcodeStream` directly with `@detect`.
- Media streams are stopped by sweeping `<video>` elements inside the component's own root. Until 2026-10-21 it also swept every `<video>` in the document, which stopped any other camera or call stream on the page.
- 2026-10-21 migration: `errorMessages` prop, visible-again restart, own-root stream cleanup, wrapping results, `StressTest` story (simulation buttons drive the internal handlers, since Storybook can't fake a camera).
