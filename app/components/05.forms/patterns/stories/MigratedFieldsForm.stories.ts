import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { reactive } from "vue";
import InputTextWithLabel from "../../input-text/InputTextWithLabel.vue";
import InputRangeDefault from "../../input-range/InputRangeDefault.vue";
import InputNumberField from "../../input-number/InputNumberField.vue";
import InputTextareaWithLabel from "../../input-textarea/InputTextareaWithLabel.vue";
import InputSelectWithLabel from "../../input-select/InputSelectWithLabel.vue";
import ToggleSwitchWithLabel from "../../toggle-switch/ToggleSwitchWithLabel.vue";
import MultipleCheckboxes from "../../input-checkbox/MultipleCheckboxes.vue";
import SingleCheckbox from "../../input-checkbox/SingleCheckbox.vue";
import InputButtonCore from "../../input-button/InputButtonCore.vue";
import FormField from "../../form-field/FormField.vue";
import HeroText from "../../../01.atoms/text-blocks/hero-text/HeroText.vue";
import type { InputUiVariant, IFormMultipleOptions } from "~/types/forms/types.forms.d";

interface MigratedFieldsFormStoryArgs {
  inputVariant: InputUiVariant;
}

// Living reference, not a component of its own — one field per 05.forms component group that
// currently scores 5/5 in the Component Ledger (.claude/component-ledger/audit.json: tier folder,
// tests, story, skill doc, CONSUMER-STYLING.md, VS Code snippet). As of 2026-09-25 that's
// InputTextCore (via InputTextWithLabel), InputRangeCore (via InputRangeDefault), InputNumber
// (via InputNumberField), InputTextareaCore (via InputTextareaWithLabel), InputSelectCore
// (via InputSelectWithLabel), ToggleSwitchCore (via ToggleSwitchWithLabel), and input-checkbox
// (MultipleCheckboxes + SingleCheckbox). FormField (5/5 as of 2026-09-26) is the layout wrapper
// around every field below rather than a field of its own. Every other 05.forms component
// (radio, ...) is still mid-migration.
// Add a field here each time /migrate-component brings another 05.forms component up to 5/5, so
// this story doubles as a visible migration-progress tracker rather than living only in the
// ledger's HTML output. No validation wiring (useZodValidation/zod) here — that's the consuming
// app's concern, this is a visual/composition reference only.
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
    InputRangeDefault,
    InputNumberField,
    InputTextareaWithLabel,
    InputSelectWithLabel,
    ToggleSwitchWithLabel,
    MultipleCheckboxes,
    SingleCheckbox,
    InputButtonCore,
    FormField,
    HeroText,
  },
  setup() {
    const state = reactive({
      fullName: "",
      budget: 50,
      quantity: 1,
      notes: "",
      colour: "",
      subscribe: false,
      services: [] as string[],
      terms: false,
    });

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
    // exercising InputTextWithLabel/InputRangeDefault/InputNumberField/InputTextareaWithLabel/
    // InputSelectWithLabel/MultipleCheckboxes/SingleCheckbox's error UI in Storybook.
    const errors = reactive({
      fullName: "",
      budget: "",
      quantity: "",
      notes: "",
      colour: "",
      services: "",
      terms: "",
    });

    const validate = () => {
      errors.fullName = state.fullName.trim() ? "" : "Full name is required";
      errors.budget = state.budget >= 100 ? "" : "Budget must be at least £100";
      errors.quantity = state.quantity >= 1 ? "" : "Quantity must be at least 1";
      errors.notes = state.notes.trim() ? "" : "Notes are required";
      errors.colour = state.colour ? "" : "Please choose a colour";
      errors.services = state.services.length ? "" : "Choose at least one service";
      errors.terms = state.terms ? "" : "You must agree to the terms";
    };

    const clearErrors = () => {
      errors.fullName = "";
      errors.budget = "";
      errors.quantity = "";
      errors.notes = "";
      errors.colour = "";
      errors.services = "";
      errors.terms = "";
    };

    return { args, state, errors, validate, clearErrors, colourOptions, serviceOptions };
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
        One field per 05.forms component that's fully migrated (5/5 on the Component Ledger).
        Click Continue with an empty name, a budget under £100, a quantity under 1, empty notes,
        or no colour chosen to see the error states.
      </p>

      <form novalidate @submit.prevent="validate">
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
          />
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
            <InputButtonCore type="submit" variant="primary" button-text="Continue" />
            <InputButtonCore type="button" variant="tertiary" button-text="Clear errors" @click="clearErrors" />
          </div>
        </FormField>
      </form>

      <div
        style="margin-top: 2rem; padding: 1.6rem; border-radius: 0.8rem; background: #f8fafc; font-family: monospace; font-size: 1.3rem;"
      >
        <div>fullName: {{ state.fullName || '""' }}</div>
        <div>budget: £{{ state.budget }}</div>
        <div>quantity: {{ state.quantity }}</div>
        <div>notes: {{ state.notes || '""' }}</div>
        <div>colour: {{ state.colour || '""' }}</div>
        <div>subscribe: {{ state.subscribe }}</div>
        <div>services: {{ JSON.stringify(state.services) }}</div>
        <div>terms: {{ state.terms }}</div>
      </div>
    </div>
  `,
});

export const Default = Template.bind({});
