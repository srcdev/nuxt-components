import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { reactive, ref } from "vue";
import InputTextWithLabel from "../../input-text/variants/InputTextWithLabel.vue";
import InputSelectWithLabel from "../../input-select/variants/InputSelectWithLabel.vue";
import InputTextareaWithLabel from "../../input-textarea/variants/InputTextareaWithLabel.vue";
import MultipleCheckboxes from "../../input-checkbox/MultipleCheckboxes.vue";
import InputButtonCore from "../../input-button/InputButtonCore.vue";
import FormField from "../../form-field/FormField.vue";
import HeroText from "../../../01.atoms/text-blocks/hero-text/HeroText.vue";
import type { IFormMultipleOptions, InputUiVariant } from "~/types/forms/types.forms.d";

interface ContactFormStoryArgs {
  inputVariant: InputUiVariant;
}

// Demo composition, not a component of its own — a richer variant of the pattern the real
// luxury-locs-by-natasha-nuxt3 /contact page uses (see that repo's app/pages/contact.vue): same
// name/phone/email + multi-select services + comments shape, plus an InputSelectWithLabel
// "How did you hear about us?" field that page doesn't have, to also exercise the select
// component alongside the others in one composed form. No validation wiring
// (useZodValidation/zod) here — that's the consuming app's concern, this is a visual/composition
// reference only.
export default {
  title: "Patterns/Contact Form",
  argTypes: {
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      description: "Applied to every field in the form at once",
      table: { category: "Styling" },
    },
  },
  args: {
    inputVariant: "normal",
  },
} as Meta<ContactFormStoryArgs>;

const Template: StoryFn<ContactFormStoryArgs> = (args) => ({
  components: {
    InputTextWithLabel,
    InputSelectWithLabel,
    InputTextareaWithLabel,
    MultipleCheckboxes,
    InputButtonCore,
    FormField,
    HeroText,
  },
  setup() {
    const state = reactive({
      fullName: "",
      telNumber: "",
      emailAddress: "",
      hearAboutUs: "",
      services: [] as string[],
      comments: "",
    });

    const hearAboutUsOptions = ref<IFormMultipleOptions>({
      data: [
        { id: "search", name: "hearAboutUs", value: "search", label: "Search engine" },
        { id: "social", name: "hearAboutUs", value: "social", label: "Social media" },
        { id: "referral", name: "hearAboutUs", value: "referral", label: "Friend referral" },
        { id: "other", name: "hearAboutUs", value: "other", label: "Other" },
      ],
      total: 4,
      skip: 0,
      limit: 10,
    });

    const servicesOptions = ref<IFormMultipleOptions>({
      data: [
        { id: "balayage", name: "services", value: "balayage", label: "Balayage" },
        { id: "highlights", name: "services", value: "highlights", label: "Highlights" },
        { id: "full-colour", name: "services", value: "full-colour", label: "Full Colour" },
        { id: "cut-style", name: "services", value: "cut-style", label: "Cut & Style" },
      ],
      total: 4,
      skip: 0,
      limit: 10,
    });

    return { args, state, hearAboutUsOptions, servicesOptions };
  },
  template: `
    <div style="margin: 36px; max-width: 480px;">
      <HeroText
        tag="h2"
        font-size="heading"
        :text-content="[{ text: 'Get in touch', styleClass: 'normal' }]"
        :style-class-passthrough="['mbe-20']"
      />

      <form @submit.prevent>
        <FormField width="wide" :has-gutter="false">
          <InputTextWithLabel
            v-model="state.fullName"
            type="text"
            name="fullName"
            label="Full name"
            placeholder="eg. Jane Smith"
            error-message=""
            :required="true"
            :input-variant="args.inputVariant"
          />
        </FormField>

        <FormField width="wide" :has-gutter="false">
          <InputTextWithLabel
            v-model="state.telNumber"
            type="tel"
            inputmode="tel"
            name="telNumber"
            label="Telephone number"
            placeholder="eg. 07700 900000"
            error-message=""
            :required="true"
            :input-variant="args.inputVariant"
          />
        </FormField>

        <FormField width="wide" :has-gutter="false">
          <InputTextWithLabel
            v-model="state.emailAddress"
            type="email"
            inputmode="email"
            name="emailAddress"
            label="Email address"
            placeholder="eg. name@domain.com"
            error-message=""
            :required="true"
            :input-variant="args.inputVariant"
          />
        </FormField>

        <FormField width="wide" :has-gutter="false">
          <InputSelectWithLabel
            v-model="state.hearAboutUs"
            v-model:field-data="hearAboutUsOptions"
            name="hearAboutUs"
            label="How did you hear about us?"
            placeholder="Select an option"
            error-message=""
            :input-variant="args.inputVariant"
          />
        </FormField>

        <FormField width="wide" :has-gutter="false">
          <MultipleCheckboxes
            v-model="state.services"
            v-model:field-data="servicesOptions"
            name="services"
            legend="Services of interest"
            label="Select all that apply"
            error-message=""
            options-layout="inline"
            :is-button="true"
            :input-variant="args.inputVariant"
          >
            <template #descriptionText>Choose one or more services you're interested in.</template>
          </MultipleCheckboxes>
        </FormField>

        <FormField width="wide" :has-gutter="false">
          <InputTextareaWithLabel
            v-model="state.comments"
            name="comments"
            label="Comments"
            placeholder="Tell us a bit more about what you're looking for…"
            error-message=""
            :input-variant="args.inputVariant"
          >
            <template #descriptionText>Optional — any extra information that might help us.</template>
          </InputTextareaWithLabel>
        </FormField>

        <FormField width="wide" :has-gutter="false">
          <InputButtonCore type="submit" variant="primary" button-text="Send message" />
        </FormField>
      </form>
    </div>
  `,
});

export const Default = Template.bind({});
