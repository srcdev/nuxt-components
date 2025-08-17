export const useDialogControls = () => {
  interface DialogConfig {
    [key: string]: boolean;
  }

  interface DialogCallbacks {
    [key: string]: {
      onConfirm?: () => void;
      onCancel?: () => void;
    };
  }

  const dialogsConfig = reactive<DialogConfig>({});
  const dialogCallbacks = reactive<DialogCallbacks>({});

  function initialiseDialogs(dialogIds: string[]) {
    dialogIds.forEach((id) => {
      dialogsConfig[id] = false;
    });
  }

  function registerDialogCallbacks(dialogId: string, callbacks: { onConfirm?: () => void; onCancel?: () => void }) {
    dialogCallbacks[dialogId] = callbacks;
  }

  const controlDialogs = (name: string, state: boolean, action?: 'confirm' | 'cancel') => {
    if (!state && action && dialogCallbacks[name]) {
      // Execute callback before closing dialog
      if (action === 'confirm' && dialogCallbacks[name].onConfirm) {
        dialogCallbacks[name].onConfirm!();
      } else if (action === 'cancel' && dialogCallbacks[name].onCancel) {
        dialogCallbacks[name].onCancel!();
      }
    }
    dialogsConfig[name] = state;
  };

  return {
    dialogsConfig,
    controlDialogs,
    initialiseDialogs,
    registerDialogCallbacks,
  };
};
