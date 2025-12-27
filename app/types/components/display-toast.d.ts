import type { VNode, ComponentPublicInstance } from "vue"

export type DisplayToastTheme =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "error"
  | "info"
  | "success"
  | "warning"

export type DisplayToastPosition = "top" | "bottom"
export type DisplayToastAlignment = "left" | "center" | "right"

export interface DisplayToastAppearanceConfig {
  theme?: DisplayToastTheme
  position?: DisplayToastPosition
  alignment?: DisplayToastAlignment
  fullWidth?: boolean
}

export interface DisplayToastBehaviorConfig {
  autoDismiss?: boolean
  duration?: number
  revealDuration?: number
  returnFocusTo?: HTMLElement | ComponentPublicInstance | null
}

export interface DisplayToastContentConfig {
  text?: string
  title?: string
  description?: string
  customIcon?: string
}

export interface DisplayToastConfig {
  appearance?: DisplayToastAppearanceConfig
  behavior?: DisplayToastBehaviorConfig
  content?: DisplayToastContentConfig
}

export interface DisplayToastProps {
  config?: DisplayToastConfig
  styleClassPassthrough?: string | string[]
}

export interface ToastSlots {
  default?(props?: Record<string, never>): VNode[]
  customToastIcon?(props?: Record<string, never>): VNode[]
  title?(props?: Record<string, never>): VNode[]
  description?(props?: Record<string, never>): VNode[]
}
