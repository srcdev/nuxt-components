import type { SVGVariant } from "nuxt-qrcode"

export interface QrCodeVariant {
  inner: SVGVariant
  marker: SVGVariant
  pixel: SVGVariant
}

export type CaptureQrCodeErrorName =
  | "NotAllowedError"
  | "NotFoundError"
  | "NotSupportedError"
  | "NotReadableError"
  | "OverconstrainedError"
  | "StreamApiNotSupportedError"
  | "InsecureContextError"
  | "StreamLoadTimeoutError"

export type CaptureQrCodeErrorMessages = Partial<Record<CaptureQrCodeErrorName | "default", string>>
