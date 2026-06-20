import type { SemanticTheme } from "./components"

declare module "@nuxt/schema" {
  interface AppConfigInput {
    srcdev?: {
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
