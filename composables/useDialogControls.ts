export const useDialogControls = () => {
  interface DialogConfig {
    [key: string]: boolean;
  }

  const dialogsConfig = reactive<DialogConfig>({});

  function initialiseDialogs(dialogIds: string[]) {
    dialogIds.forEach((id) => {
      dialogsConfig[id] = false;
    });
  }

  const controlDialogs = (name: string, state: boolean) => {
    dialogsConfig[name] = state;
  };

  return {
    dialogsConfig,
    controlDialogs,
    initialiseDialogs,
  };
};
