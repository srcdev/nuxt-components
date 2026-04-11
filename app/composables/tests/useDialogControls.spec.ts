import { describe, it, expect, vi } from "vitest";
import { useDialogControls } from "../useDialogControls";

describe("useDialogControls", () => {
  // ─── initialiseDialogs ────────────────────────────────────────────────────

  describe("initialiseDialogs", () => {
    it("registers each dialog id as false", () => {
      const { dialogsConfig, initialiseDialogs } = useDialogControls();
      initialiseDialogs(["confirm", "delete"]);
      expect(dialogsConfig.confirm).toBe(false);
      expect(dialogsConfig.delete).toBe(false);
    });

    it("does not affect pre-existing dialog state", () => {
      const { dialogsConfig, initialiseDialogs, controlDialogs } = useDialogControls();
      initialiseDialogs(["a"]);
      controlDialogs("a", true);
      initialiseDialogs(["b"]);
      expect(dialogsConfig.a).toBe(true); // unchanged
      expect(dialogsConfig.b).toBe(false);
    });
  });

  // ─── controlDialogs ───────────────────────────────────────────────────────

  describe("controlDialogs", () => {
    it("sets dialog state to true (open)", () => {
      const { dialogsConfig, initialiseDialogs, controlDialogs } = useDialogControls();
      initialiseDialogs(["modal"]);
      controlDialogs("modal", true);
      expect(dialogsConfig.modal).toBe(true);
    });

    it("sets dialog state to false (close)", () => {
      const { dialogsConfig, initialiseDialogs, controlDialogs } = useDialogControls();
      initialiseDialogs(["modal"]);
      controlDialogs("modal", true);
      controlDialogs("modal", false);
      expect(dialogsConfig.modal).toBe(false);
    });

    it("multiple dialogs are independent", () => {
      const { dialogsConfig, initialiseDialogs, controlDialogs } = useDialogControls();
      initialiseDialogs(["a", "b"]);
      controlDialogs("a", true);
      expect(dialogsConfig.a).toBe(true);
      expect(dialogsConfig.b).toBe(false);
    });
  });

  // ─── registerDialogCallbacks + controlDialogs actions ────────────────────

  describe("callbacks", () => {
    it("fires onConfirm when closing with action='confirm'", () => {
      const { initialiseDialogs, controlDialogs, registerDialogCallbacks } = useDialogControls();
      initialiseDialogs(["modal"]);
      const onConfirm = vi.fn();
      registerDialogCallbacks("modal", { onConfirm });
      controlDialogs("modal", false, "confirm");
      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it("fires onCancel when closing with action='cancel'", () => {
      const { initialiseDialogs, controlDialogs, registerDialogCallbacks } = useDialogControls();
      initialiseDialogs(["modal"]);
      const onCancel = vi.fn();
      registerDialogCallbacks("modal", { onCancel });
      controlDialogs("modal", false, "cancel");
      expect(onCancel).toHaveBeenCalledOnce();
    });

    it("does not fire onConfirm when opening (state=true)", () => {
      const { initialiseDialogs, controlDialogs, registerDialogCallbacks } = useDialogControls();
      initialiseDialogs(["modal"]);
      const onConfirm = vi.fn();
      registerDialogCallbacks("modal", { onConfirm });
      controlDialogs("modal", true, "confirm");
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it("does not fire onCancel when opening (state=true)", () => {
      const { initialiseDialogs, controlDialogs, registerDialogCallbacks } = useDialogControls();
      initialiseDialogs(["modal"]);
      const onCancel = vi.fn();
      registerDialogCallbacks("modal", { onCancel });
      controlDialogs("modal", true, "cancel");
      expect(onCancel).not.toHaveBeenCalled();
    });

    it("does not fire onConfirm when closing without an action", () => {
      const { initialiseDialogs, controlDialogs, registerDialogCallbacks } = useDialogControls();
      initialiseDialogs(["modal"]);
      const onConfirm = vi.fn();
      registerDialogCallbacks("modal", { onConfirm });
      controlDialogs("modal", false);
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it("does not fire confirm callback for a different dialog", () => {
      const { initialiseDialogs, controlDialogs, registerDialogCallbacks } = useDialogControls();
      initialiseDialogs(["a", "b"]);
      const onConfirm = vi.fn();
      registerDialogCallbacks("a", { onConfirm });
      controlDialogs("b", false, "confirm");
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });
});
