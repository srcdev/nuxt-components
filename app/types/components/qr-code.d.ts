import type { SVGVariant } from "nuxt-qrcode"

export interface QrCodeVariant {
  inner: SVGVariant
  marker: SVGVariant
  pixel: SVGVariant
}
