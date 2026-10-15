import type { SemanticTheme } from "./semantic-theme.d"

export type CookieConsentStatus = "unset" | "granted" | "denied"

export interface CookieConsentBannerProps {
  theme?: SemanticTheme
  ariaLabel?: string
  acceptLabel?: string
  rejectLabel?: string
  icon?: string
  showIcon?: boolean
  styleClassPassthrough?: string | string[]
}
