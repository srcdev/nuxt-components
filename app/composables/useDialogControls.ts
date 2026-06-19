type DialogCallbacks = {
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const useDialogControls = <T extends string>(config: Record<T, DialogCallbacks> = {} as Record<T, DialogCallbacks>) => {
  const dialogsConfig = reactive<Record<T, boolean>>(
    Object.fromEntries(Object.keys(config).map((id) => [id, false])) as Record<T, boolean>
  );

  const state = dialogsConfig as Record<T, boolean>;

  const openDialog = (name: T) => {
    state[name] = true;
  };

  const closeDialog = (name: T, action?: "confirm" | "cancel") => {
    if (action) {
      if (action === "confirm") config[name].onConfirm?.();
      else if (action === "cancel") config[name].onCancel?.();
    }
    state[name] = false;
  };

  return {
    dialogsConfig: state,
    openDialog,
    closeDialog,
  };
};
