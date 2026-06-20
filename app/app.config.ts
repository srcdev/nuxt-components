import type { SemanticTheme } from "~/types/components";

export default defineAppConfig({
  srcdev: {
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
