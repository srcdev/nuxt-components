import { ref } from "vue";
import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../InputError.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

interface InputErrorStoryArgs {
  id: string;
  errorMessage: string | string[];
  showError: boolean;
  isDetached: boolean;
  inputVariant: "normal" | "outlined" | "underlined";
  icon: string;
  styleClassPassthrough: string;
}

export default {
  title: "Components/Forms/Form Errors/InputError",
  component: StorybookComponent,
  argTypes: {
    id: { control: "text", table: { category: "Basic" } },
    errorMessage: {
      control: "object",
      description: "A string, or an array of strings rendered as a list",
      table: { category: "Basic" },
    },
    showError: { control: "boolean", table: { category: "State" } },
    isDetached: {
      control: "boolean",
      description: "Detached: sits below the control with a gap. Attached: tucked under the control's bottom edge",
      table: { category: "Layout" },
    },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      table: { category: "Layout" },
    },
    icon: { control: "text", table: { category: "Content" } },
    styleClassPassthrough: { control: "text", table: { category: "Styling" } },
  },
  args: {
    id: "story-field-error-message",
    errorMessage: "Please enter a valid email address",
    showError: true,
    isDetached: false,
    inputVariant: "normal",
    icon: "radix-icons:circle-backslash",
    styleClassPassthrough: "",
  },
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "fullWidthCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The error strip every `*Field` wrapper renders under its control, in grid row 2. `error-message` takes a string or an array (rendered as a list), `show-error` opens it, `is-detached` chooses between tucked under the control and sitting below it with a gap, and `input-variant` matches the control's variant. The control in these stories is a stand-in; see [InputTextField](?path=/story/components-forms-input-text-inputtextfield--with-error) (attached) and [MultipleCheckboxes](?path=/story/components-forms-input-checkbox-multiplecheckboxes--error-state) (detached) for it in real use.",
      },
    },
  },
} as Meta<InputErrorStoryArgs>;

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const fieldNote = `
  <p style="${storyNoteStyle}">
    Every field wrapper renders this strip for you. See it attached under a real control in the
    <a href="/?path=/story/components-forms-input-text-inputtextfield--with-error" target="_top">InputTextField</a>
    story, and detached under a group in the
    <a href="/?path=/story/components-forms-input-checkbox-multiplecheckboxes--error-state" target="_top">MultipleCheckboxes</a>
    story.
  </p>
`;

const demoStyles = `
  <component is="style">
    .input-error-story-field {
      display: grid;
      grid-template-rows: auto auto;
      max-width: 48rem;
    }
    .input-error-story-control {
      grid-row: 1;
      grid-column: 1;
      position: relative;
      z-index: 1;
      padding: 1.2rem;
      font-size: 1.6rem;
      background-color: var(--theme-input-surface);
      color: var(--theme-text);
      border: var(--form-element-border-width) solid var(--theme-border);
      border-radius: var(--form-input-border-radius);
    }
    .input-error-story-field[data-invalid] .input-error-story-control {
      border-color: var(--theme-error-border);
    }
    .input-error-story-field[data-variant="underlined"] .input-error-story-control {
      border-radius: 0;
      border-width: 0 0 var(--form-element-border-width);
    }
  </component>
`;

const Template: StoryFn<InputErrorStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    return { args };
  },
  template: `
    <div>
      ${demoStyles}
      ${fieldNote}
      <div
        class="input-error-story-field"
        :data-invalid="args.showError ? '' : undefined"
        :data-variant="args.inputVariant"
      >
        <div class="input-error-story-control">Stand-in form control</div>
        <StorybookComponent
          :id="args.id"
          :error-message="args.errorMessage"
          :show-error="args.showError"
          :is-detached="args.isDetached"
          :input-variant="args.inputVariant"
          :icon="args.icon"
          :style-class-passthrough="args.styleClassPassthrough"
        ></StorybookComponent>
      </div>
    </div>
  `,
});

export const Attached = Template.bind({});
Attached.parameters = {
  docs: { description: { story: "The default: tucked under the control's bottom edge, sharing its border." } },
};

export const Detached = Template.bind({});
Detached.args = { isDetached: true };
Detached.parameters = {
  docs: { description: { story: "Sits below the control with a gap (`--input-error-detached-offset`) and fully rounded corners, as used under checkbox and radio groups." } },
};

export const MultipleMessages = Template.bind({});
MultipleMessages.args = {
  isDetached: true,
  errorMessage: ["Password must be at least 12 characters", "Password must contain a number"],
};
MultipleMessages.parameters = {
  docs: { description: { story: "An array `error-message` renders as a list, spaced by `--input-error-list-gap`." } },
};

export const Underlined = Template.bind({});
Underlined.args = { inputVariant: "underlined" };
Underlined.parameters = {
  docs: { description: { story: "Square corners, and no outline while attached, to match an underlined control." } },
};

export const Hidden = Template.bind({});
Hidden.args = { showError: false };
Hidden.parameters = {
  docs: { description: { story: "Toggle `showError` to see the open/close animation." } },
};

export const StressTest = Template.bind({});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.args = {
  isDetached: true,
  errorMessage: [
    "DieseEingabeistleiderungültigbitteüberprüfenSiedieSchreibweiseundversuchenSieeserneut",
    "https://example.com/a/very/long/unbroken/url/that/should/wrap/inside/the/strip?with=query&and=more",
    "<b>not bold</b> <script>alert(1)</script>",
    "⚠️ Bitte geben Sie eine gültige E-Mail-Adresse ein. Wir verwenden Ihre Adresse ausschließlich für Rückfragen zu Ihrer Bestellung bei Alex Morgan in Northtown.",
    "يرجى إدخال عنوان بريد إلكتروني صالح",
    "x",
    "",
  ],
};
StressTest.parameters = {
  initialCanvas: "mobileCanvas",
  docs: {
    story: { inline: false, height: "720px" },
    description: {
      story:
        "Long unbroken German, a long URL, HTML-like text, emoji, right-to-left text, a single character and an empty string in one array. Check at every canvas width: every message wraps inside the strip (no horizontal overflow past the dashed outline), the icon keeps its size, markup renders as text, and the empty item takes no visible space. Switch `errorMessage` to a single long string to check the non-list path too. Error text is never line-clamped: a truncated validation message can't be acted on.",
    },
  },
};
