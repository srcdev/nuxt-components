import type {
  IFieldsInitialState,
  IFormFieldsState,
  IFormFieldsC12,
  IFormFieldC12,
  IApiErrorMessages,
  ICustomErrorMessage,
  IErrorMessagesArr,
} from "../../app/types/forms/types.forms"

export interface IZodeFormControl {
  [x: string]: string | boolean | number | URL | object
  data: IFieldsInitialState
  validityState: IFormFieldsState
  dirtyFields: IFormFieldsState
  focusedField: string
  isDisabled: boolean
  isPending: boolean
  errorCount: number
  errorMessages: IErrorMessagesArr
  formFieldsC12: IFormFieldsC12
  formIsValid: boolean
  submitAttempted: boolean
  submitDisabled: boolean
  submitSuccess: boolean
  displayErrorMessages: boolean
  displayLoader: boolean
  submitSuccessful: boolean
}
