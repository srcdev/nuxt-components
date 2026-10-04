import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { reactive, ref } from "vue";
import InputTextWithLabel from "../../input-text/InputTextWithLabel.vue";
import InputPasswordWithLabel from "../../input-text/InputPasswordWithLabel.vue";
import InputTextAsNumberWithLabel from "../../input-text/InputTextAsNumberWithLabel.vue";
import InputRangeDefault from "../../input-range/InputRangeDefault.vue";
import InputNumberField from "../../input-number/InputNumberField.vue";
import InputTextareaWithLabel from "../../input-textarea/InputTextareaWithLabel.vue";
import InputSelectWithLabel from "../../input-select/InputSelectWithLabel.vue";
import ToggleSwitchWithLabel from "../../toggle-switch/ToggleSwitchWithLabel.vue";
import ToggleSwitchWithLabelInline from "../../toggle-switch/ToggleSwitchWithLabelInline.vue";
import MultipleCheckboxes from "../../input-checkbox/MultipleCheckboxes.vue";
import SingleCheckbox from "../../input-checkbox/SingleCheckbox.vue";
import MultipleRadiobuttons from "../../input-radio/MultipleRadiobuttons.vue";
import TripleToggleSwitch from "../../triple-toggle-switch/TripleToggleSwitch.vue";
import InputButton from "../../input-button/InputButton.vue";
import FormField from "../../form-field/FormField.vue";
import FormWrapper from "../../form-wrapper/FormWrapper.vue";
import HeroText from "../../../01.atoms/text-blocks/hero-text/HeroText.vue";
import type { InputUiVariant, IFormMultipleOptions, InputTypesText, InputMode } from "~/types/forms/types.forms.d";

interface MigratedFieldsFormStoryArgs {
  inputVariant: InputUiVariant;
}

// Living reference, not a component of its own: every 05.forms component that scores 5/5 in the
// Component Ledger (.claude/component-ledger/audit.json) appears here, either as its own field or
// rendered inside one. As of 2026-10-04 every 05.forms component is 5/5, so all of them are in:
// - Own field: InputTextWithLabel (InputTextCore; plus one per type/inputmode pair for checking
//   on-device keyboards), InputPasswordWithLabel,
//   InputTextAsNumberWithLabel, InputRangeDefault (InputRangeCore), InputNumberField
//   (InputNumber), InputTextareaWithLabel (InputTextareaCore), InputSelectWithLabel
//   (InputSelectCore), ToggleSwitchWithLabel and ToggleSwitchWithLabelInline (ToggleSwitchCore),
//   MultipleCheckboxes, SingleCheckbox, MultipleRadiobuttons, TripleToggleSwitch ("Theme
//   preference": no Field wrapper or error state, so it sits under a plain caption).
// - Rendered inside other fields: FormWrapper (wraps the form), FormField (wraps every field),
//   FormFieldset (checkbox/radio groups), InputLabel, InputDescription (the "Full name" and
//   "Password" help text), InputError (every error strip), the input-checkbox-radio family
//   (every checkbox and radio), InputButton (Continue/Clear errors, and the inline buttons inside
//   the password and number fields), PendingEffect (Continue's simulated 1.5s submit).
// Add a field here each time a new 05.forms component reaches 5/5, so this story stays a visible
// completeness check rather than living only in the ledger's HTML output. No validation wiring
// (useZodValidation/zod) here — that's the consuming app's concern, this is a visual/composition
// reference only.
export default {
  title: "Patterns/Migrated Fields Form",
  argTypes: {
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      description: "Applied to every text-like field in the form at once",
      table: { category: "Styling" },
    },
  },
  args: {
    inputVariant: "normal",
  },
} as Meta<MigratedFieldsFormStoryArgs>;

const Template: StoryFn<MigratedFieldsFormStoryArgs> = (args) => ({
  components: {
    InputTextWithLabel,
    InputPasswordWithLabel,
    InputTextAsNumberWithLabel,
    InputRangeDefault,
    InputNumberField,
    InputTextareaWithLabel,
    InputSelectWithLabel,
    ToggleSwitchWithLabel,
    ToggleSwitchWithLabelInline,
    MultipleCheckboxes,
    SingleCheckbox,
    MultipleRadiobuttons,
    TripleToggleSwitch,
    InputButton,
    FormField,
    FormWrapper,
    HeroText,
  },
  setup() {
    const state = reactive({
      fullName: "",
      password: "",
      guests: 2 as number | undefined,
      budget: 50,
      quantity: 1,
      notes: "",
      colour: "",
      subscribe: false,
      reminders: true,
      services: [] as string[],
      contactMethod: "",
      themePreference: "system",
      terms: false,
    });

    // One InputTextWithLabel per type/inputmode pair, for checking each on-screen keyboard on a real device.
    const textVariants: { name: string; label: string; type: InputTypesText; inputmode: InputMode; placeholder: string }[] = [
      { name: "variantEmail", label: "Email", type: "email", inputmode: "email", placeholder: "eg. jane@example.com" },
      { name: "variantTel", label: "Phone", type: "tel", inputmode: "tel", placeholder: "eg. 07700 900123" },
      { name: "variantUrl", label: "Website", type: "url", inputmode: "url", placeholder: "eg. https://example.com" },
      { name: "variantSearch", label: "Search", type: "text", inputmode: "search", placeholder: "Search treatments" },
      { name: "variantNumber", label: "Age", type: "number", inputmode: "numeric", placeholder: "eg. 34" },
      { name: "variantNumeric", label: "One-time code", type: "text", inputmode: "numeric", placeholder: "eg. 123456" },
      { name: "variantDecimal", label: "Hair length (cm)", type: "text", inputmode: "decimal", placeholder: "eg. 12.5" },
      { name: "variantDate", label: "Appointment date", type: "date", inputmode: "text", placeholder: "" },
    ];
    const textVariantValues = reactive<Record<string, string>>(
      Object.fromEntries(textVariants.map((variant) => [variant.name, ""]))
    );

    const serviceOptions = reactive<IFormMultipleOptions>({
      data: [
        { id: "1", name: "services", value: "cut", label: "Cut" },
        { id: "2", name: "services", value: "colour", label: "Colour" },
        { id: "3", name: "services", value: "styling", label: "Styling" },
      ],
      total: 3,
      skip: 0,
      limit: 10,
    });

    const contactMethodOptions = reactive<IFormMultipleOptions>({
      data: [
        { id: "1", name: "contactMethod", value: "email", label: "Email" },
        { id: "2", name: "contactMethod", value: "phone", label: "Phone" },
        { id: "3", name: "contactMethod", value: "text", label: "Text message" },
      ],
      total: 3,
      skip: 0,
      limit: 10,
    });

    const themeOptions = reactive<IFormMultipleOptions>({
      data: [
        {
          id: "themePreference-system",
          name: "themePreference",
          value: "system",
          label: "System",
          icon: "material-symbols:night-sight-auto-sharp",
        },
        { id: "themePreference-light", name: "themePreference", value: "light", label: "Light", icon: "radix-icons:sun" },
        { id: "themePreference-dark", name: "themePreference", value: "dark", label: "Dark", icon: "radix-icons:moon" },
      ],
      total: 3,
      skip: 0,
      limit: 3,
    });

    const colourOptions = reactive<IFormMultipleOptions>({
      data: [
        { id: "1", name: "red", value: "red", label: "Red" },
        { id: "2", name: "blue", value: "blue", label: "Blue" },
        { id: "3", name: "green", value: "green", label: "Green" },
      ],
      total: 3,
      skip: 0,
      limit: 10,
    });

    // Demo-only "validation" — a real consuming app would wire this through something like
    // useZodValidation instead (see this file's top comment). Kept deliberately simple so the
    // Continue button has an obvious, reliable way to trigger each field's error state for
    // exercising every field's error UI in Storybook.
    const errors = reactive({
      fullName: "",
      password: "",
      guests: "",
      budget: "",
      quantity: "",
      notes: "",
      colour: "",
      services: "",
      contactMethod: "",
      terms: "",
    });

    const validate = () => {
      errors.fullName = state.fullName.trim() ? "" : "Full name is required";
      errors.password = state.password.length >= 8 ? "" : "Password must be at least 8 characters";
      errors.guests = (state.guests ?? 0) >= 1 ? "" : "At least 1 guest is required";
      errors.budget = state.budget >= 100 ? "" : "Budget must be at least £100";
      errors.quantity = state.quantity >= 1 ? "" : "Quantity must be at least 1";
      errors.notes = state.notes.trim() ? "" : "Notes are required";
      errors.colour = state.colour ? "" : "Please choose a colour";
      errors.services = state.services.length ? "" : "Choose at least one service";
      errors.contactMethod = state.contactMethod ? "" : "Choose how we should contact you";
      errors.terms = state.terms ? "" : "You must agree to the terms";
    };

    // Simulated round trip so the Continue button shows PendingEffect before the errors land.
    const isSubmitting = ref(false);
    const submit = () => {
      isSubmitting.value = true;
      setTimeout(() => {
        isSubmitting.value = false;
        validate();
      }, 1500);
    };

    const clearErrors = () => {
      errors.fullName = "";
      errors.password = "";
      errors.guests = "";
      errors.budget = "";
      errors.quantity = "";
      errors.notes = "";
      errors.colour = "";
      errors.services = "";
      errors.contactMethod = "";
      errors.terms = "";
    };

    return {
      args,
      state,
      errors,
      submit,
      isSubmitting,
      clearErrors,
      colourOptions,
      serviceOptions,
      contactMethodOptions,
      textVariants,
      textVariantValues,
      themeOptions,
    };
  },
  template: `
    <div style="margin: 36px; max-width: 480px;">
      <HeroText
        tag="h2"
        font-size="heading"
        :text-content="[{ text: 'Migrated fields', styleClass: 'normal' }]"
        :style-class-passthrough="['mbe-20']"
      />
      <p style="margin: 0 0 2rem 0; color: #475569; font-size: 1.4rem;">
        Every 05.forms component that is fully migrated (5/5 on the Component Ledger).
        Click Continue to see the pending state, then the error states for any empty or
        out-of-range field: name, password under 8 characters, no guests, budget under £100,
        quantity under 1, notes, colour, services, contact method or terms.
      </p>

      <FormWrapper width="medium">
        <form novalidate @submit.prevent="submit">
          <FormField width="wide" :has-gutter="false">
            <InputTextWithLabel
              v-model="state.fullName"
              type="text"
              name="fullName"
              label="Full name"
              placeholder="eg. Jane Smith"
              :error-message="errors.fullName"
              :field-has-error="!!errors.fullName"
              :required="true"
              :input-variant="args.inputVariant"
            >
              <template #descriptionText>As it appears on your ID</template>
            </InputTextWithLabel>
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <InputPasswordWithLabel
              v-model="state.password"
              name="password"
              label="Password"
              :error-message="errors.password"
              :field-has-error="!!errors.password"
              :required="true"
              :input-variant="args.inputVariant"
            >
              <template #descriptionText>At least 8 characters</template>
            </InputPasswordWithLabel>
          </FormField>

          <FormField v-for="variant in textVariants" :key="variant.name" width="wide" :has-gutter="false">
            <InputTextWithLabel
              v-model="textVariantValues[variant.name]"
              :type="variant.type"
              :inputmode="variant.inputmode"
              :name="variant.name"
              :label="variant.label"
              :placeholder="variant.placeholder"
              error-message=""
              :input-variant="args.inputVariant"
            >
              <template #descriptionText>type="{{ variant.type }}", inputmode="{{ variant.inputmode }}"</template>
            </InputTextWithLabel>
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <InputRangeDefault
              v-model="state.budget"
              name="budget"
              label="Budget (£)"
              :min="0"
              :max="500"
              :step="10"
              :error-message="errors.budget"
              :field-has-error="!!errors.budget"
            >
              <template #left><span aria-hidden="true">−</span></template>
              <template #right><span aria-hidden="true">+</span></template>
            </InputRangeDefault>
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <InputNumberField
              v-model="state.quantity"
              name="quantity"
              label="Quantity"
              :min="1"
              :max="10"
              :error-message="errors.quantity"
              :field-has-error="!!errors.quantity"
              :input-variant="args.inputVariant"
            >
              <template #left><span aria-hidden="true">−</span></template>
              <template #right><span aria-hidden="true">+</span></template>
            </InputNumberField>
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <InputTextAsNumberWithLabel
              v-model="state.guests"
              name="guests"
              label="Guests"
              :min="1"
              :max="8"
              :error-message="errors.guests"
              :field-has-error="!!errors.guests"
              :input-variant="args.inputVariant"
            >
              <template #left><span aria-hidden="true">−</span></template>
              <template #right><span aria-hidden="true">+</span></template>
            </InputTextAsNumberWithLabel>
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <InputTextareaWithLabel
              v-model="state.notes"
              name="notes"
              label="Notes"
              placeholder="Anything else we should know?"
              :error-message="errors.notes"
              :field-has-error="!!errors.notes"
              :input-variant="args.inputVariant"
            />
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <InputSelectWithLabel
              v-model="state.colour"
              v-model:field-data="colourOptions"
              name="colour"
              label="Favourite colour"
              placeholder="Choose a colour"
              :error-message="errors.colour"
              :field-has-error="!!errors.colour"
              :input-variant="args.inputVariant"
            />
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <ToggleSwitchWithLabel v-model="state.subscribe" name="subscribe" label="Subscribe to updates" />
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <ToggleSwitchWithLabelInline v-model="state.reminders" name="reminders" label="Email me appointment reminders" />
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <MultipleCheckboxes
              v-model="state.services"
              v-model:field-data="serviceOptions"
              name="services"
              legend="Services of interest"
              options-layout="inline"
              :is-button="true"
              :error-message="errors.services"
              :field-has-error="!!errors.services"
              :input-variant="args.inputVariant"
            />
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <MultipleRadiobuttons
              v-model="state.contactMethod"
              v-model:field-data="contactMethodOptions"
              name="contactMethod"
              legend="Preferred contact method"
              options-layout="inline"
              :required="true"
              :error-message="errors.contactMethod"
              :field-has-error="!!errors.contactMethod"
              :input-variant="args.inputVariant"
            />
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <div style="display: grid; gap: 0.8rem; justify-items: start;">
              <span>Theme preference</span>
              <TripleToggleSwitch
                v-model="state.themePreference"
                v-model:field-data="themeOptions"
                name="themePreference"
                aria-label="Theme preference"
              />
            </div>
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <SingleCheckbox
              v-model="state.terms"
              name="terms"
              legend="Terms and conditions"
              label="I agree to the terms"
              :required="true"
              :error-message="errors.terms"
              :field-has-error="!!errors.terms"
              :input-variant="args.inputVariant"
            />
          </FormField>

          <FormField width="wide" :has-gutter="false">
            <div style="display: flex; gap: 1.2rem;">
              <InputButton
                type="submit"
                variant="primary"
                button-text="Continue"
                :has-pending-effect="isSubmitting"
                :is-pending="isSubmitting"
                :readonly="isSubmitting"
              />
              <InputButton type="button" variant="tertiary" button-text="Clear errors" @click="clearErrors" />
            </div>
          </FormField>
        </form>
      </FormWrapper>

      <div
        style="margin-top: 2rem; padding: 1.6rem; border-radius: 0.8rem; background: #f8fafc; font-family: monospace; font-size: 1.3rem;"
      >
        <div>fullName: {{ state.fullName || '""' }}</div>
        <div>password: {{ state.password ? "•".repeat(state.password.length) : '""' }}</div>
        <div v-for="variant in textVariants" :key="variant.name">{{ variant.name }}: {{ textVariantValues[variant.name] || '""' }}</div>
        <div>guests: {{ state.guests ?? "undefined" }}</div>
        <div>budget: £{{ state.budget }}</div>
        <div>quantity: {{ state.quantity }}</div>
        <div>notes: {{ state.notes || '""' }}</div>
        <div>colour: {{ state.colour || '""' }}</div>
        <div>subscribe: {{ state.subscribe }}</div>
        <div>reminders: {{ state.reminders }}</div>
        <div>services: {{ JSON.stringify(state.services) }}</div>
        <div>contactMethod: {{ state.contactMethod || '""' }}</div>
        <div>themePreference: {{ state.themePreference }}</div>
        <div>terms: {{ state.terms }}</div>
      </div>
    </div>
  `,
});

export const Default = Template.bind({});
