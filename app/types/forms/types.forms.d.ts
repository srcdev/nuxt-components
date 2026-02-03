export interface IValidationPatterns {
  pattern: string
  minlength: string
  maxlength: string
  hint: string
}

export interface IOptionsConfig {
  id: string
  name: string
  value: string
  label: string
  icon?: string
}

export interface IFormMultipleOptions {
  data: IOptionsConfig[]
  total: number
  skip: number
  limit: number
}

export interface IOptionsValueArr {
  [key: string]: string | boolean | number | URL | object
}

export interface IFieldsInitialState {
  [key: string]: null | string | boolean | number | URL | object | IOptionsValueArr[]
}

export type TFieldsInitialState = {
  [key: string]: null | string | boolean | number | URL | object | IOptionsValueArr[]
}

export interface IValidityState {
  badInput: boolean
  customError: boolean
  patternMismatch: boolean
  rangeOverflow: boolean
  rangeUnderflow: boolean
  stepMismatch: boolean
  tooLong: boolean
  tooShort: boolean
  typeMismatch: boolean
  valid: boolean
  valueMissing: boolean
}

export interface IValidityStateArr {
  [key: string]: {
    badInput: boolean
    customError: boolean
    patternMismatch: boolean
    rangeOverflow: boolean
    rangeUnderflow: boolean
    stepMismatch: boolean
    tooLong: boolean
    tooShort: boolean
    typeMismatch: boolean
    valid: boolean
    valueMissing: boolean
  }
}

export interface IFormFieldsState {
  [key: string]: boolean
}

export interface ICustomErrorMessage {
  useCustomError: boolean
  message: string
}

export interface InpuTextC12 {
  label: string
  placeholder: string
  errorMessage: string
}

export interface IErrorMessagesArr {
  [x: string]: ICustomErrorMessage
}

export interface IFormFieldC12 {
  label: string
  placeholder: string
  errorMessage: string
  useCustomError: boolean
  customErrors: null | string | string[]
  isValid: boolean
  isDirty: boolean
  type: string
  previousValue: null | string | boolean | number | URL | object
}

export interface IFormFieldsC12 {
  [x: string]: IFormFieldC12
}

export interface IFormFieldState {
  isValid: boolean
  isDirty: boolean
  previousValue: null | string | boolean | number | URL | object
}

export interface IFormFieldStateObj {
  [x: string]: IFormFieldState
}

export interface IFormData {
  [x: string]: string | boolean | number | URL | object
  data: IFieldsInitialState
  validityState: IFormFieldsState
  dirtyFields: IFormFieldsState
  focusedField: string
  isPending: boolean
  errorCount: number
  errorMessages: IErrorMessagesArr
  formFieldsC12: IFormFieldsC12
  formIsValid: boolean
  submitAttempted: boolean
  submitDisabled: boolean
  submitSuccess: boolean
  displayErrorMessages: boolean
}

export interface IApiErrorMessages {
  [x: string]: string
}

// New types

export interface C12nInputText {
  type: string
  id: string
  name: string
  label: string
  placeholder: string
  errorMessage: string
  fieldHasError: boolean
  required: boolean
  styleClassPassthrough: string[]
}

export interface C12nMultipleCheckboxes {
  id: string
  name: string
  label: string
  legend: string
  placeholder: string
  errorMessage: string
  fieldHasError: boolean
  required: boolean
  styleClassPassthrough: string[]
}

export interface C12nInputCheckboxWithLabel {
  id: string
  name: string
  required: string
  label: string
  placeholder: string
  errorMessage: string | string[]
  fieldHasError: boolean
  styleClassPassthrough: string[]
}

export interface C12nInputRange {
  id: string
  name: string
  label: string
  min: number
  max: number
  step: number
  placeholder: string
  errorMessage: string
  fieldHasError: boolean
  required: boolean
  styleClassPassthrough: string[]
}

export interface C12nInputTextCore {
  type: string
  id: string
  name: string
  label: string
  placeholder: string
  errorMessage: string
  fieldHasError: boolean
  required: boolean
}

export interface InputTextWithLabel {
  type: string
  id: string
  name: string
  label: string
  placeholder: string
  errorMessage: string
  fieldHasError: boolean
  required: boolean
  styleClassPassthrough: string[]
  deepCssClassPassthrough: string[]
}

export interface ApiErrorResponse {
  url: string
  statusCode: number
  statusMessage: string
  message: string
  stack: string
  data: {
    errors: {
      [key: string]: string | string[] // Index signature for dynamic keys
    }
  }
}

// Button component shared props
export interface BaseButtonProps {
  size?: string
  weight?: string
  theme?: string
  buttonText: string
  dataTestid?: string
  styleClassPassthrough?: string | string[]
  useEffect?: boolean
  effect?: "fancy" | "pulse"
  isPending?: boolean
  readonly?: boolean
}
// Checkbox/Radio component shared props
export interface BaseCheckboxRadioProps {
  type: "checkbox" | "radio"
  id: string
  name: string
  required?: boolean
  size?: string
  theme?: string
  fieldHasError?: boolean
  styleClassPassthrough?: string | string[]
  trueValue?: string | number | boolean
  falseValue?: string | number | boolean
  ariaDescribedby?: string
  displayAsDisc?: boolean
  multipleOptions?: boolean
}
