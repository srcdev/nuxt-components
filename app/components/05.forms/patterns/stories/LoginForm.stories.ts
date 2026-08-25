import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { reactive } from "vue";
import InputTextWithLabel from "../../input-text/variants/InputTextWithLabel.vue";
import InputPasswordWithLabel from "../../input-text/variants/InputPasswordWithLabel.vue";
import InputCheckboxRadioWithLabel from "../../input-checkbox-radio/InputCheckboxRadioWithLabel.vue";
import InputButtonCore from "../../input-button/InputButtonCore.vue";
import FormField from "../../form-field/FormField.vue";
import GlassPanel from "../../../01.atoms/glass-panel/GlassPanel.vue";
import HeroText from "../../../01.atoms/text-blocks/hero-text/HeroText.vue";
import type { InputUiVariant } from "~/types/forms/types.forms.d";

interface LoginFormStoryArgs {
  inputVariant: InputUiVariant;
}

// Demo composition, not a component of its own — exercises the real-world "login form" pattern
// (labelled text/password inputs, a single checkbox, primary + tertiary buttons) using the
// existing WithLabel wrapper components rather than the bare *Core components other stories use,
// since that's what a consuming app actually reaches for. No validation wiring (useZodValidation)
// here — that's the consuming app's concern, this is a visual/composition reference only.
export default {
  title: "Patterns/Login Form",
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
} as Meta<LoginFormStoryArgs>;

const Template: StoryFn<LoginFormStoryArgs> = (args) => ({
  components: {
    InputTextWithLabel,
    InputPasswordWithLabel,
    InputCheckboxRadioWithLabel,
    InputButtonCore,
    FormField,
    GlassPanel,
    HeroText,
  },
  setup() {
    const state = reactive({
      email: "",
      password: "",
      rememberMe: false,
    });
    return { args, state };
  },
  template: `
    <div style="margin: 36px; max-width: 420px;">
      <GlassPanel :style-class-passthrough="['login-panel']">
        <div style="padding: 3.2rem;">
          <HeroText
            tag="h2"
            font-size="heading"
            :text-content="[{ text: 'Sign in', styleClass: 'normal' }]"
            :style-class-passthrough="['mbe-20']"
          />

          <form @submit.prevent>
            <FormField width="wide" :has-gutter="false">
              <InputTextWithLabel
                v-model="state.email"
                type="email"
                inputmode="email"
                name="email"
                label="Email address"
                placeholder="you@example.com"
                error-message=""
                :required="true"
                :input-variant="args.inputVariant"
              />
            </FormField>

            <FormField width="wide" :has-gutter="false">
              <InputPasswordWithLabel
                v-model="state.password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                error-message=""
                :required="true"
                :input-variant="args.inputVariant"
              />
            </FormField>

            <FormField width="wide" :has-gutter="false">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <InputCheckboxRadioWithLabel
                  v-model="state.rememberMe"
                  type="checkbox"
                  name="rememberMe"
                  label="Remember me"
                  :input-variant="args.inputVariant"
                />
                <InputButtonCore type="button" variant="tertiary" button-text="Forgot password?" />
              </div>
            </FormField>

            <FormField width="wide" :has-gutter="false">
              <!-- InputButtonCore keeps box-sizing: content-box, so width: 100% alone sizes only
                   the content box and padding/border overflow past it — box-sizing: border-box
                   here makes width: 100% mean the actual rendered width, not a demo-only quirk
                   worth fixing in the component itself since content-box is relied on elsewhere
                   (e.g. icon-only's aspect-ratio: 1). -->
              <InputButtonCore
                type="submit"
                variant="primary"
                button-text="Sign in"
                style="width: 100%; box-sizing: border-box;"
              />
            </FormField>
          </form>
        </div>
      </GlassPanel>
    </div>
  `,
});

export const Default = Template.bind({});
