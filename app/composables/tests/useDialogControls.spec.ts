import { describe, it, expect, vi } from "vitest";
import { useDialogControls } from "../useDialogControls";

describe("useDialogControls", () => {
  // ─── initialisation ───────────────────────────────────────────────────────

  describe("initialisation", () => {
    it("registers each dialog id as false", () => {
      const { dialogsConfig } = useDialogControls({ confirm: {}, delete: {} });
      expect(dialogsConfig.confirm).toBe(false);
      expect(dialogsConfig.delete).toBe(false);
    });

    it("defaults to empty config when called with no arguments", () => {
      const { dialogsConfig } = useDialogControls();
      expect(Object.keys(dialogsConfig)).toHaveLength(0);
    });
  });

  // ─── openDialog ───────────────────────────────────────────────────────────

  describe("openDialog", () => {
    it("sets dialog state to true", () => {
      const { dialogsConfig, openDialog } = useDialogControls({ modal: {} });
      openDialog("modal");
      expect(dialogsConfig.modal).toBe(true);
    });

    it("multiple dialogs are independent", () => {
      const { dialogsConfig, openDialog } = useDialogControls({ a: {}, b: {} });
      openDialog("a");
      expect(dialogsConfig.a).toBe(true);
      expect(dialogsConfig.b).toBe(false);
    });
  });

  // ─── closeDialog ──────────────────────────────────────────────────────────

  describe("closeDialog", () => {
    it("sets dialog state to false", () => {
      const { dialogsConfig, openDialog, closeDialog } = useDialogControls({ modal: {} });
      openDialog("modal");
      closeDialog("modal");
      expect(dialogsConfig.modal).toBe(false);
    });

    it("fires onConfirm when closing with action='confirm'", () => {
      const onConfirm = vi.fn();
      const { openDialog, closeDialog } = useDialogControls({ modal: { onConfirm } });
      openDialog("modal");
      closeDialog("modal", "confirm");
      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it("fires onCancel when closing with action='cancel'", () => {
      const onCancel = vi.fn();
      const { openDialog, closeDialog } = useDialogControls({ modal: { onCancel } });
      openDialog("modal");
      closeDialog("modal", "cancel");
      expect(onCancel).toHaveBeenCalledOnce();
    });

    it("does not fire onConfirm when closing without an action", () => {
      const onConfirm = vi.fn();
      const { openDialog, closeDialog } = useDialogControls({ modal: { onConfirm } });
      openDialog("modal");
      closeDialog("modal");
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it("does not fire confirm callback for a different dialog", () => {
      const onConfirm = vi.fn();
      const { openDialog, closeDialog } = useDialogControls({ a: { onConfirm }, b: {} });
      openDialog("b");
      closeDialog("b", "confirm");
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });
});
