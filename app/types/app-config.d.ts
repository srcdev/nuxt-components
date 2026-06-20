import type { SemanticTheme, DisplayPromptTheme, DisplayToastTheme, DisplayToastPosition, DisplayToastAlignment } from "./components"

declare module "@nuxt/schema" {
  interface AppConfigInput {
    srcdev?: {
      alertContent?: {
        icons?: Partial<Record<SemanticTheme, string>>
        dismissIcon?: string
      }
      displayPrompt?: {
        theme?: DisplayPromptTheme
        dismissible?: boolean
        useAutoFocus?: boolean
        masked?: boolean
      }
      displayToast?: {
        appearance?: {
          theme?: DisplayToastTheme
          position?: DisplayToastPosition
          alignment?: DisplayToastAlignment
          fullWidth?: boolean
          masked?: boolean
        }
        behavior?: {
          autoDismiss?: boolean
          duration?: number
          revealDuration?: number
        }
      }
      displayDialog?: {
        variant?: "dialog" | "modal" | "confirm" | "alert" | "fullscreen"
        justifyDialog?: "start" | "center" | "end"
        alignDialog?: "start" | "center" | "end"
        lockViewport?: boolean
        allowContentScroll?: boolean
        theme?: SemanticTheme
        closeIcon?: string
      }
    }
  }
}
