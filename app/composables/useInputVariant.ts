import type { MaybeRefOrGetter } from "vue";
import type { InputUiVariant } from "~/types/forms/types.forms";

export const useInputVariant = (variant: MaybeRefOrGetter<InputUiVariant | undefined>) => {
  const appConfig = useAppConfig();

  return computed<InputUiVariant>(
    () => toValue(variant) ?? (appConfig.srcdev?.forms?.inputVariant as InputUiVariant | undefined) ?? "normal"
  );
};
