# useZodValidation Composable

## Overview

`useZodValidation` wires a Zod schema to a form ref, providing reactive validation state, error formatting, field-level error messages, and scroll-to-error behaviour. It is the standard form validation composable in this layer — use it in any form in consuming apps.

**This composable ships inside the `srcdev-nuxt-components` layer** (`app/composables/useZodValidation.ts`). It is auto-imported via the Nuxt layer — **do not create a local copy** in the consuming app.

## Prerequisites

- `zod` installed in the consuming app (`npm i zod`)
- A `<form>` element accessible via a template ref

## Setup in the consuming app

### 1. Define a Zod schema

```ts
import { z } from "zod"

const formSchema = z.object({
  fullName: z
    .string({ error: (i) => (i.input === undefined ? "Full name is required" : "Full name must be a string") })
    .trim()
    .min(2, "Name is too short")
    .max(80, "Name is too long"),
  emailAddress: z
    .string({ error: (i) => (i.input === undefined ? "Email is required" : "Email must be a string") })
    .email({ error: "Invalid email address" }),
})

type FormSchema = z.infer<typeof formSchema>
```

### 2. Create form state and a form ref

```ts
const formRef = ref<HTMLFormElement | null>(null)

const state = reactive({
  fullName: "",
  emailAddress: "",
})
```

### 3. Initialise the composable

`useZodValidation` must be typed with the schema type to get typed error objects:

```ts
type ReturnTypeUseZodValidation = ReturnType<typeof useZodValidation>

const { initZodForm, zodFormControl, zodErrorObj, doZodValidate, fieldMaxLength, scrollToFirstError } =
  useZodValidation<typeof formSchema>(formSchema, formRef) as ReturnTypeUseZodValidation

initZodForm()
```

### 4. Derive typed form errors

```ts
const formErrors = computed<z.ZodFormattedError<FormSchema> | null>(() => zodErrorObj.value)
```

### 5. Bind to the template

Pass `formRef` to the `<form>` and bind `formErrors` to each field's `error-message` and `field-has-error` props:

```vue
<form ref="formRef" @submit.stop.prevent="submitForm()">
  <InputTextWithLabel
    id="fullName"
    v-model="state.fullName"
    name="fullName"
    label="Full name"
    :error-message="formErrors?.fullName?._errors[0] ?? ''"
    :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.fullName)"
    :required="true"
  />
  <InputButtonCore
    type="submit"
    :is-pending="zodFormControl.displayLoader"
    :readonly="zodFormControl.submitDisabled"
    button-text="Submit"
    @click.stop.prevent="submitForm()"
  />
</form>
```

### 6. Submit handler

```ts
const submitForm = async () => {
  zodFormControl.submitAttempted = true
  if (!(await doZodValidate(state))) {
    scrollToFirstError()
    return
  }
  zodFormControl.displayLoader = true
  try {
    // await $fetch("/api/contact", { method: "POST", body: state })
    zodFormControl.submitSuccessful = true
  } catch (error) {
    console.warn("Form submission failed", error)
  } finally {
    zodFormControl.displayLoader = false
  }
}
```

### 7. Live validation on state change (optional)

Re-run validation on every state change so errors clear as the user types:

```ts
watch(
  () => state,
  () => { doZodValidate(state) },
  { deep: true }
)
```

## API reference

### `useZodValidation<T>(formSchema, formRef)`

| Return value | Type | Description |
|---|---|---|
| `initZodForm()` | `() => void` | Initialises previous-value tracking — call once after setup |
| `zodFormControl` | `reactive` | Mutable form state (see below) |
| `zodErrorObj` | `Ref<ZodFormattedError \| null>` | Raw formatted error object from Zod |
| `doZodValidate(state)` | `async (state) => boolean` | Runs `safeParse` and updates `zodErrorObj`; returns `true` if valid |
| `pushCustomErrors(apiErrorResponse, state)` | `async` | Merges server-side API errors into the Zod error object |
| `fieldMaxLength(name)` | `(name: string) => undefined` | Currently returns `undefined` (Zod v4 internal API change — do not rely on this) |
| `scrollToFirstError()` | `async () => void` | Scrolls to the first `[aria-invalid=true]` element in the form |
| `scrollToFormHead()` | `() => void` | Scrolls to the top of the form element |

### `zodFormControl` properties

| Property | Type | Description |
|---|---|---|
| `submitAttempted` | `boolean` | Set to `true` when submit is first clicked — gates error display |
| `displayLoader` | `boolean` | Drive `:is-pending` on the submit button |
| `submitDisabled` | `boolean` | Drive `:readonly` on the submit button |
| `submitSuccessful` | `boolean` | Set to `true` after a successful submission |
| `formIsValid` | `boolean` | `true` when `zodErrorObj` is null |
| `errorCount` | `number` | Number of invalid fields |

## Notes

- `useZodValidation` is exported as a default export from the layer, not a named export — the auto-import handles this transparently.
- The `as ReturnTypeUseZodValidation` cast is required because TypeScript cannot infer the generic return type through the layer auto-import.
- `fieldMaxLength` is currently a no-op (returns `undefined`) due to a Zod v4 internal API change — omit it from templates or pass `undefined` to `:maxlength`.
- For server-side validation errors (e.g. from a Resend or API call), use `pushCustomErrors` with the API error response shape `{ data: { errors: Record<string, string | string[]> } }`.
