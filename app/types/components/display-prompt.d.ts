import type { SemanticTheme } from "./semantic-theme.d"

export type DisplayPromptTheme = SemanticTheme

export interface DisplayPromptProps {
  theme?: DisplayPromptTheme
  dismissible?: boolean
  useAutoFocus?: boolean
  styleClassPassthrough?: string | string[]
}
