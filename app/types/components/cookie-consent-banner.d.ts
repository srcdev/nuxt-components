import type { SemanticTheme } from "./semantic-theme.d"

export type CookieConsentStatus = "unset" | "granted" | "denied"

export interface CookieConsentBannerProps {
  theme?: SemanticTheme
  styleClassPassthrough?: string | string[]
}
