# Form input variant (`normal` / `outlined` / `underlined`)

## Overview

Every `05.forms` control (and `SelectMenu`) takes `:input-variant`. Set it once for the whole site
in the consuming app's `app.config.ts`; a per-field prop still overrides it.

Resolution in every component: **explicit `:input-variant` prop → `app.config`
`srcdev.forms.inputVariant` → `"normal"`** (shared composable `useInputVariant`).

```ts
// consumer app.config.ts
export default defineAppConfig({
  srcdev: { forms: { inputVariant: "outlined" } },
});
```

Nuxt deep-merges this over the layer's own `app/app.config.ts`, so only the key you set changes.
Leave it out and every field stays `normal`, as before (added 2026-11-23).

## What each variant looks like

| Variant | Text, textarea, number, select, OTP | Label (labelled Fields) |
|---|---|---|
| `normal` | Bordered box, light shadow ring, 2px focus outline at a small offset | Above the box |
| `outlined` | Same box with no shadow ring: a flush 1px outline in the ring's colour, which turns the border colour on hover and the focus colour on focus, so it reads as a 2px border | `InputTextField`, `InputPasswordField`, `InputTextareaField`: inside the box at rest, floats onto the top border as a pill on focus, with a value, when invalid or on autofill. Other Fields: above the box |
| `underlined` | Bottom border only | Above the box |

Checkbox and radio controls only style `underlined` (a checkbox squares off); `outlined` looks
like `normal` there. `InputRangeField` and `ToggleSwitchField` always render `normal`.

`outlined` also moves a Field's description after the control and its error.

## Components that read it

`InputText`/`InputTextField`/`InputPasswordField`/`InputTextAsNumberField`,
`InputTextarea`/`InputTextareaField`, `InputNumber`/`InputNumberField`,
`InputSelect`/`InputSelectField`, `InputOtp`/`InputOtpField`, `InputCheckboxRadio`/
`InputCheckboxRadioField`/`InputCheckboxRadioButton`, `SingleCheckbox`, `MultipleCheckboxes`,
`MultipleRadiobuttons`, `InputLabel`, `InputDescription`, `InputError`, `SelectMenu`.

Each renders the resolved value as `data-input-variant`, so consumer CSS can target
`[data-input-variant="outlined"]` whichever way it was set. Fields pass the resolved value down,
so a field's label, description and error always match its control.

## Styling the variant

Every colour and size of `outlined` is a public token. See each component's CONSUMER-STYLING.md
(`--input-text-outlined-*`, `--input-textarea-outlined-*`, `--input-number-outlined-*`,
`--input-select-outlined-*`, `--input-otp-outlined-*`).

## Notes

- Mixing variants on one page works: give the odd field its own `:input-variant`.
- Inside srcdev-nuxt-components, new form components take `inputVariant?: InputUiVariant` with
  an `undefined` default and read `useInputVariant(() => props.inputVariant)`, never the prop
  directly, or the app.config tier is skipped.
