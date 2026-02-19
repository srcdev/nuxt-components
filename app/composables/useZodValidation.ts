import { ref, reactive, toRaw, type Ref } from "vue";
import type { z } from "zod";
import { ZodError } from "zod";
import type { ApiErrorResponse } from "../types/forms/types.forms.d";

// Accepts a Zod schema and a form ref
const useZodValidation = <T extends z.ZodTypeAny>(formSchema: T, formRef: Ref<HTMLFormElement | null>) => {
  const zodFormControl = reactive({
    errorCount: 0,
    displayLoader: false,
    submitDisabled: false,
    submitAttempted: false,
    submitSuccessful: false,
    formIsValid: false,
    isPending: false,
    isDisabled: false,
    previousState: {} as Record<string, { value: unknown; message: string }>,
  });

  type FormSchemaType = z.infer<T>;
  const zodErrorObj = ref<z.ZodFormattedError<FormSchemaType> | null>(null);

  const resetPreviousValues = () => {
    // Type guard for ZodObject using internal _def.typeName
    const def = (formSchema as z.ZodTypeAny)._def as { typeName?: string };
    if (def && def.typeName === "ZodObject") {
      const shape = (formSchema as unknown as z.ZodObject<Record<string, z.ZodTypeAny>>).shape;
      for (const field of Object.keys(shape)) {
        const previousValue = {
          value: null,
          message: "",
        };
        zodFormControl.previousState[field] = previousValue;
      }
    }
  };

  const initZodForm = () => {
    resetPreviousValues();
  };

  const getErrorCount = (zodErrorObj: z.ZodFormattedError<FormSchemaType> | null) => {
    if (!zodErrorObj) return 0;
    // Remove _errors from the error object for counting
    const { _errors, ...fieldErrors } = zodErrorObj as Record<string, unknown>;
    return Object.keys(fieldErrors).length;
  };

  const transformErrorMessages = (errors: Record<string, string | string[]>) => {
    const apiErrors = ref<Record<string, string | string[]>>({});
    for (const [key, value] of Object.entries(errors)) {
      const fieldPath = key.split(".").map((key: string) => key.charAt(0).toLowerCase() + key.slice(1));
      apiErrors.value[fieldPath.join(".")] = value;
    }
    return apiErrors.value;
  };

  const updatePreviousValue = async (field: string, message: string, state: Record<string, unknown>) => {
    const previousValue = {
      value: state[field],
      message: message,
    };
    zodFormControl.previousState[field] = previousValue;
  };

  const pushCustomErrors = async (apiErrorResponse: ApiErrorResponse, state: Record<string, unknown>) => {
    const apiErrors = transformErrorMessages(apiErrorResponse.data.errors);
    // 1: Create a ZodError object to hold the issues
    const zodError = new ZodError([]);
    // 2: Reset previous state values
    resetPreviousValues();
    // 3: Add issues to the ZodError object
    for (const [path, message] of Object.entries(apiErrors)) {
      zodError.issues.push({
        path: path.split("."),
        message: Array.isArray(message) ? message.join(", ") : message,
        code: "custom",
        input: state[path],
      });
      await updatePreviousValue(path, Array.isArray(message) ? message.join(", ") : message, state);
    }
    zodErrorObj.value = zodError.format();
    zodFormControl.errorCount = getErrorCount(zodErrorObj.value as z.ZodFormattedError<FormSchemaType> | null);
    zodFormControl.formIsValid = zodFormControl.errorCount === 0;
    zodFormControl.displayLoader = false;
    zodFormControl.submitAttempted = true;
    scrollToFirstError();
    return zodErrorObj.value;
  };

  const doZodValidate = async (state: Record<string, unknown>) => {
    const valid = formSchema.safeParse(toRaw(state));
    if (!valid.success) {
      zodErrorObj.value = valid.error.format();
    } else {
      zodErrorObj.value = null;
    }
    zodFormControl.errorCount = getErrorCount(zodErrorObj.value as z.ZodFormattedError<FormSchemaType> | null);
    zodFormControl.formIsValid = valid.success;
    return valid.success;
  };

  const fieldMaxLength = (_name: string) => {
    // Note: This function relied on internal Zod APIs that changed in v4
    // For now, returning undefined as the maxlength functionality may need refactoring
    // or using a different approach like parsing schema metadata
    return undefined;
  };

  const scrollToFirstError = async () => {
    if (formRef.value) {
      const firstErrorElement = formRef.value.querySelector("[aria-invalid=true]");

      if (firstErrorElement) {
        window.scrollTo({
          top: firstErrorElement?.getBoundingClientRect().y + window.scrollY,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  };

  const scrollToFormHead = () => {
    if (formRef.value) {
      const formHead = formRef.value.getBoundingClientRect().top;
      window.scrollTo({
        top: formHead,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  return {
    initZodForm,
    zodFormControl,
    zodErrorObj,
    pushCustomErrors,
    doZodValidate,
    fieldMaxLength,
    scrollToFirstError,
    scrollToFormHead,
  };
};

export default useZodValidation;
