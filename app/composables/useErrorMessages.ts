import type { IFormData } from '../../shared/types/types.forms';

export function useErrorMessage(name: string, formData: Ref<IFormData>) {
  const defaultError = ref('');
  const errorMessages = ref(formData.value.errorMessages);

  const hasCustomError = () => {
    return errorMessages.value[name] !== undefined && errorMessages.value[name].useCustomError;
  };

  const errorMessage = computed(() => {
    console.log(`errorMessage()`);
    if (hasCustomError()) {
      console.log(`errorMessage() | IF`);
      return errorMessages.value[name]?.message;
    } else {
      return defaultError.value;
    }
  });

  const setDefaultError = (newDefaultError: string) => {
    defaultError.value = newDefaultError;
  };

  const fieldHasError = computed(() => {
    // console.log(`fieldHasError() | name(${name})`);
    nextTick();
    if (formData.value.submitDisabled) {
      console.log(`fieldHasError() | name(${name}) | IF`);
      if (hasCustomError()) {
        console.log(`fieldHasError() | name(${name}) | IF | IF`);

        return true;
      } else if (Object.keys(formData.value.validityState).length > 0 && formData.value.validityState[name] !== undefined) {
        console.log(`fieldHasError() | name(${name}) | IF | ELSE IF`);

        return !formData.value.validityState[name];
      }
      console.log(`fieldHasError() | name(${name}) | IF | ELSE`);

      return false;
    }
  });

  const removeCustomError = (valid: boolean = false) => {
    console.log(`useErrorMessage | removeCustomError | name(${name}) | valid(${valid})`);
    // formData.value.validityState[name] = valid;
    // await nextTick();
    // delete formData.value.errorMessages[name];
  };

  return {
    hasCustomError,
    errorMessage,
    setDefaultError,
    fieldHasError,
    removeCustomError,
  };
}
