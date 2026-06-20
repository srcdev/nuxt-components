import type { SemanticTheme, DisplayPromptTheme, DisplayToastTheme, DisplayToastPosition, DisplayToastAlignment } from "~/types/components";

export default defineAppConfig({
  srcdev: {
    alertContent: {
      icons: {
        info: "akar-icons:info",
        success: "akar-icons:check",
        warning: "akar-icons:circle-alert",
        error: "akar-icons:circle-alert",
      },
      dismissIcon: "material-symbols:close",
    },
    displayPrompt: {
      theme: "info" as DisplayPromptTheme,
      dismissible: false,
      useAutoFocus: false,
      masked: false,
    },
    displayToast: {
      appearance: {
        theme: "info" as DisplayToastTheme,
        position: "top" as DisplayToastPosition,
        alignment: "right" as DisplayToastAlignment,
        fullWidth: false,
        masked: false,
      },
      behavior: {
        autoDismiss: true,
        duration: 5000,
        revealDuration: 550,
      },
    },
    displayDialog: {
      variant: "dialog" as "dialog" | "modal" | "confirm" | "alert" | "fullscreen",
      justifyDialog: "center" as "start" | "center" | "end",
      alignDialog: "center" as "start" | "center" | "end",
      lockViewport: true,
      allowContentScroll: false,
      theme: undefined as SemanticTheme | undefined,
      closeIcon: "bitcoin-icons:cross-filled",
    },
  },
});
