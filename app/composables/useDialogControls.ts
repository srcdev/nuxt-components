type DialogCallbacks = {
  onConfirm?: () => void;
  onCancel?: () => void;
};

type DialogsSetupConfig = Record<string, DialogCallbacks>;

export const useDialogControls = (config: DialogsSetupConfig = {}) => {
  const dialogsConfig = reactive<Record<string, boolean>>(
    Object.fromEntries(Object.keys(config).map((id) => [id, false]))
  );

  const openDialog = (name: string) => {
    dialogsConfig[name] = true;
  };

  const closeDialog = (name: string, action?: "confirm" | "cancel") => {
    if (action && config[name]) {
      if (action === "confirm") config[name].onConfirm?.();
      else if (action === "cancel") config[name].onCancel?.();
    }
    dialogsConfig[name] = false;
  };

  return {
    dialogsConfig,
    openDialog,
    closeDialog,
  };
};
