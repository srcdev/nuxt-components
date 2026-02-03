import type {
  IFormData,
  IFieldsInitialState,
  IFormFieldC12,
  IApiErrorMessages,
  ICustomErrorMessage,
  IErrorMessagesArr,
} from "../types/forms/types.forms"
// import { formFieldC12 } from '@/components/forms/c12/utils';

// export function useFormControl(name: string = '') {
export function useFormControl(name: string = "") {
  let savedInitialState = {}

  const formData = ref<IFormData>({
    data: {} as IFieldsInitialState,
    validityState: {},
    dirtyFields: {},
    focusedField: "",
    isPending: false,
    errorCount: 0,
    errorMessages: {},
    formFieldsC12: {},
    hasCustomErrorMessages: false,
    formIsValid: false,
    submitAttempted: false,
    submitDisabled: false,
    submitSuccess: false,
    displayErrorMessages: false,
  })

  const initValidationState = async (fieldsInitialState: IFieldsInitialState | Ref<IFieldsInitialState | null>) => {
    const fields = Object.keys(fieldsInitialState.value || {})
    const state = fields.reduce(
      (accumulatedFields, field) => {
        accumulatedFields[field] = false
        return accumulatedFields
      },
      {} as Record<string, boolean>
    )
    formData.value.validityState = state
  }

  const initFormData = async (fieldsInitialState: IFieldsInitialState | Ref<IFieldsInitialState | null>) => {
    initValidationState(fieldsInitialState)

    if (fieldsInitialState !== null) {
      savedInitialState = toRaw(fieldsInitialState.value) as IFieldsInitialState
      formData.value.data = fieldsInitialState as IFieldsInitialState
    }
    return
  }

  const initFormFieldsC12 = (name: string, formFieldC12: IFormFieldC12) => {
    formData.value.formFieldsC12[name] = formFieldC12
    return
  }

  const updatePreviousValues = () => {
    console.log(`useFormControl | updatePreviousValues`)

    Object.keys(formData.value.data).forEach((key) => {
      if (formData.value.formFieldsC12[key]) {
        const currentValue = formData.value.data[key]
        // Filter out undefined values and IOptionsValueArr[] which are not supported by previousValue
        if (currentValue !== undefined && !Array.isArray(currentValue)) {
          formData.value.formFieldsC12[key].previousValue = currentValue
        }
      }
    })
  }

  const getErrorCount = async (updateState: boolean = false) => {
    await nextTick()

    const errorCount = Object.values(formData.value.validityState).filter((value) => !value).length
    formData.value.errorCount = errorCount
    formData.value.formIsValid = errorCount === 0

    if (updateState) {
      formData.value.submitDisabled = true
      formData.value.displayErrorMessages = formData.value.errorCount > 0
      formData.value.submitAttempted = true
    }

    if (formData.value.submitDisabled) {
      formData.value.submitDisabled = !formData.value.formIsValid
    }

    // update fieldHasError ref
    // if (typeof formData.value!.formFieldsC12[name] !== 'undefined') {
    //   fieldHasError.value = formData.value!.submitAttempted && !formData.value!.formFieldsC12[name].isValid;
    // } else {
    //   fieldHasError.value = false;
    // }

    return formData.value.errorCount
  }

  // Function to count items with "useCustomError" set to true
  const countItemsWithCustomError = (obj: IErrorMessagesArr) => {
    let count = 0

    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]?.useCustomError === true) {
        count++
      }
    }

    return count
  }

  /*
   *   Useage:
   *
   *   const { updateErrorMessages } = useFormControl();
   *
   *   Add/Update entry
   *   const sampleCustomErrorEmail = {
   *     useCustomError: true,
   *     message: "This is a sample custom error for error EMAIL",
   *   };
   *   updateErrorMessages("email", sampleCustomErrorEmail);
   */
  const updateErrorMessages = async (name: string, message: string = "", valid: boolean = false) => {
    if (!valid) {
      // Ensure the form field exists before updating it
      if (!formData.value.formFieldsC12[name]) {
        console.warn(`Form field "${name}" not found in formFieldsC12`)
        return
      }

      formData.value.formFieldsC12[name].useCustomError = true

      // if (typeof message === 'string') {
      //   formData.value.formFieldsC12[name].customErrors = message;
      // } else if (typeof message === 'object') {
      //   formData.value.formFieldsC12[name].customErrors = message;
      // }

      formData.value.formFieldsC12[name].customErrors = message
      formData.value.formFieldsC12[name].isValid = valid

      // formData.value.errorMessages[name].useCustomError = true;
      // formData.value.errorMessages[name].message = message;
    }
    formData.value.hasCustomErrorMessages = countItemsWithCustomError(formData.value.errorMessages) > 0
  }

  const useApiErrors = async (errors: IApiErrorMessages) => {
    // Object.keys(errors).forEach((key) => {
    //   updateErrorMessages(key, errors[key]);
    // });

    for (const [key, message] of Object.entries(errors)) {
      // console.log(`${key}: ${message}`);
      updateErrorMessages(key, message)
    }
  }

  // const resetForm = () => {
  //   console.log('resetForm()');
  //   formData.value.data = toRaw(fieldsInitialState.value) as IFieldsInitialState;
  //   formData.value.validityState = {};
  //   formData.value.errorCount = 0;
  //   formData.value.isPending = false;
  //   formData.value.errorMessages = {};
  //   formData.value.formIsValid = false;
  // };

  const fieldIsDirty = (name: string) => {
    if (typeof formData.value.formFieldsC12[name] !== "undefined") {
      return formData.value.formFieldsC12[name].isDirty
    } else {
      return false
    }
  }

  // const fieldHasError = (name: string) => {
  //   const currentValidityState = formData.value.validityState[name];

  //   if (formData.value.submitAttempted) {
  //     return currentValidityState;
  //   }
  //   return false;
  // };

  // const fieldHasError = computed({
  //   // getter
  //   get() {
  //     console.log(`fieldHasError getter: ${name}`);
  //     if (typeof formData.value!.formFieldsC12[name] !== 'undefined') {
  //       return !formData.value!.formFieldsC12[name].isValid;
  //     }
  //     return formData.value.validityState[name];
  //   },
  //   // setter
  //   set(newValue) {
  //     if (formData.value.submitAttempted) {
  //       return newValue;
  //     }
  //     return false;
  //   },
  // });

  // const fieldHasError = ref(false);

  const formIsValid = computed(() => {
    return formData.value.formIsValid
  })

  const submitDisabled = computed(() => {
    return formData.value.submitDisabled
  })

  // Keep an eye on this for performance issue

  // const updateFieldValidity = (name: string, valid: boolean) => {
  //   console.log(`updateFieldValidity: name:${name} - valid:${valid}`);
  //   console.log(formData.value);
  //   // formData.value.formFieldsC12[name].isValid = valid;
  //   formData.value.validityState[name] = valid;
  // };

  watch(
    () => formData.value.validityState,
    () => {
      getErrorCount()
    },
    { deep: true }
  )

  watch(
    () => formData.value.formFieldsC12,
    () => {
      formData.value.formFieldsC12
    },
    { deep: true }
  )

  watch(
    () => formData.value.isPending,
    (newValue, oldValue) => {
      if (newValue) {
        updatePreviousValues()
      }
    }
  )

  return {
    formData,
    initFormData,
    initFormFieldsC12,
    getErrorCount,
    updateErrorMessages,
    // resetForm,
    formIsValid,
    submitDisabled,
    useApiErrors,
    // fieldHasError,
    fieldIsDirty,
    // updateFieldValidity,
  }
}
