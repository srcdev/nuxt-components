import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed, ref } from "vue";
import StorybookComponent from "../InputLabel.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { InputUiVariant, InputLabelIndicator } from "~/types/forms/types.forms";
import type { MediaCanvas } from "~/types/components";

interface InputLabelStoryArgs {
  id: string;
  required: boolean;
  indicator: InputLabelIndicator;
  requiredText: string;
  optionalText: string;
  requiredIcon: string;
  optionalIcon: string;
  indicatorColorRequired: string;
  indicatorColorOptional: string;
  fieldHasError: boolean;
  inputVariant: InputUiVariant;
  styleClassPassthrough: string;
  textLabel: string;
  htmlLabel: string;
}

export default {
  title: "Components/Forms/Input Label/InputLabel",
  component: StorybookComponent,
  argTypes: {
    id: {
      control: "text",
      description: "Id of the control this label is for, rendered as the label's for attribute",
      table: { category: "Basic" },
    },
    textLabel: {
      control: "text",
      description: "textLabel slot: plain label text",
      table: { category: "Slots" },
    },
    htmlLabel: {
      control: "text",
      description: "htmlLabel slot: rich markup, rendered before the text slot",
      table: { category: "Slots" },
    },
    required: {
      control: "boolean",
      description: "Whether the field is required. Drives which fields the indicator marks",
      table: { category: "Indicator" },
    },
    indicator: {
      control: { type: "select" },
      options: ["none", "required", "optional"],
      description: "Which fields get a marker. Unset falls back to app.config srcdev.inputLabel.indicator, then none",
      table: { category: "Indicator" },
    },
    requiredText: {
      control: "text",
      description: "Required marker text (aria-hidden, the control's required attribute is what's announced)",
      table: { category: "Indicator" },
    },
    optionalText: {
      control: "text",
      description: "Optional marker text (announced, and kept as screen-reader text when an icon is used)",
      table: { category: "Indicator" },
    },
    requiredIcon: {
      control: "text",
      description: "Iconify name that replaces the required text",
      table: { category: "Indicator" },
    },
    optionalIcon: {
      control: "text",
      description: "Iconify name that replaces the visible optional text",
      table: { category: "Indicator" },
    },
    indicatorColorRequired: {
      control: "color",
      description: "Sets --input-label-indicator-color-required on the story wrapper",
      table: { category: "Tokens" },
    },
    indicatorColorOptional: {
      control: "color",
      description: "Sets --input-label-indicator-color-optional on the story wrapper",
      table: { category: "Tokens" },
    },
    fieldHasError: {
      control: "boolean",
      description: "Rendered as data-invalid, a styling hook only",
      table: { category: "State" },
    },
    inputVariant: {
      control: { type: "select" },
      options: ["normal", "outlined", "underlined"],
      description: "Rendered as data-input-variant, a styling hook only",
      table: { category: "Layout" },
    },
    styleClassPassthrough: { control: "text", table: { category: "Styling" } },
  },
  args: {
    id: "story-field",
    required: false,
    indicator: "none",
    requiredText: "*",
    optionalText: "(optional)",
    requiredIcon: "",
    optionalIcon: "",
    indicatorColorRequired: "",
    indicatorColorOptional: "",
    fieldHasError: false,
    inputVariant: "normal",
    styleClassPassthrough: "",
    textLabel: "Email address",
    htmlLabel: "",
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
          "The `<label>` every labelled field wrapper renders. Label copy goes in the `textLabel` and `htmlLabel` slots (html first), `id` becomes its `for`, and `indicator` with `required` adds a required or optional marker (falling back to `app.config` `srcdev.inputLabel`). `field-has-error` and `input-variant` are styling hooks only. The control in these stories is a plain input; see [InputTextField](?path=/story/components-forms-input-text-inputtextfield--required) for it inside a real field.",
      },
    },
  },
} as Meta<InputLabelStoryArgs>;

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const fieldNote = `
  <p style="${storyNoteStyle}">
    Every labelled field wrapper renders this label and forwards its own <code>required</code> prop. See it in a real field in the
    <a href="/?path=/story/components-forms-input-text-inputtextfield--required" target="_top">InputTextField</a> story.
  </p>
`;

const Template: StoryFn<InputLabelStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const componentArgs = computed(() => {
      const {
        textLabel: _text,
        htmlLabel: _html,
        indicatorColorRequired: _required,
        indicatorColorOptional: _optional,
        requiredIcon,
        optionalIcon,
        ...rest
      } = args;
      return { ...rest, requiredIcon: requiredIcon || undefined, optionalIcon: optionalIcon || undefined };
    });
    const tokenStyles = computed(() => ({
      ...(args.indicatorColorRequired && { "--input-label-indicator-color-required": args.indicatorColorRequired }),
      ...(args.indicatorColorOptional && { "--input-label-indicator-color-optional": args.indicatorColorOptional }),
    }));
    return { args, componentArgs, tokenStyles };
  },
  template: `
    <div style="max-width: 48rem; font-size: 1.6rem;" :style="tokenStyles">
      ${fieldNote}
      <StorybookComponent v-bind="componentArgs">
        <template v-if="args.htmlLabel" #htmlLabel><span v-html="args.htmlLabel"></span></template>
        <template v-if="args.textLabel" #textLabel>{{ args.textLabel }}</template>
      </StorybookComponent>
      <input
        :id="args.id"
        type="email"
        :required="args.required"
        :aria-invalid="args.fieldHasError || undefined"
        style="width: 100%; padding: 1.2rem; font-size: 1.6rem;"
      />
    </div>
  `,
});

export const TextLabel = Template.bind({});
TextLabel.parameters = {
  docs: { description: { story: "Plain label text through the `textLabel` slot." } },
};

export const HtmlLabel = Template.bind({});
HtmlLabel.args = {
  textLabel: "",
  htmlLabel: 'Email address <small style="font-weight: normal;">(work or personal)</small>',
};
HtmlLabel.parameters = {
  docs: { description: { story: "Rich markup through the `htmlLabel` slot." } },
};

export const TextAndHtml = Template.bind({});
TextAndHtml.args = {
  htmlLabel: "<strong>Work</strong> ",
};
TextAndHtml.parameters = {
  docs: { description: { story: "Both slots filled: `htmlLabel` renders first, then `textLabel`." } },
};

export const MarkRequired = Template.bind({});
MarkRequired.args = { indicator: "required", required: true };
MarkRequired.parameters = {
  docs: {
    description: {
      story:
        "Required fields get an aria-hidden marker (the control's own required attribute is what screen readers announce). Toggle required off and the marker goes. Set it site-wide with app.config srcdev.inputLabel.indicator.",
    },
  },
};

export const MarkOptional = Template.bind({});
MarkOptional.args = { indicator: "optional", required: false };
MarkOptional.parameters = {
  docs: {
    description: {
      story: "The opposite convention: optional fields are marked instead, and the text is announced. Toggle required on and the marker goes.",
    },
  },
};

export const IndicatorIcon = Template.bind({});
IndicatorIcon.args = {
  indicator: "required",
  required: true,
  requiredIcon: "mdi:asterisk",
  indicatorColorRequired: "#c0392b",
  styleClassPassthrough: "input-label-story-indicator",
};
IndicatorIcon.parameters = {
  docs: { description: { story: "An icon in place of the text, coloured through the per-state indicator token (the colour picker under Tokens)." } },
};
IndicatorIcon.decorators = [
  () => ({
    template: `
      <div>
        <component is="style">
          .input-label-story-indicator {
            --input-label-indicator-icon-size: 0.8em;
          }
        </component>
        <story />
      </div>
    `,
  }),
];

export const CustomTokens = Template.bind({});
CustomTokens.args = { styleClassPassthrough: "input-label-story-tokens", fieldHasError: true };
CustomTokens.parameters = {
  docs: { description: { story: "Tokens set via a passthrough class, plus a colour swap on `[data-invalid]`." } },
};
CustomTokens.decorators = [
  () => ({
    template: `
      <div>
        <component is="style">
          .input-label-story-tokens {
            --input-label-font-size: 1.4rem;
            --input-label-font-weight: 700;
            --input-label-line-height: 1.3;
            --input-label-margin-block: 0 0.4rem;
          }
          .input-label-story-tokens[data-invalid] {
            --input-label-color: var(--theme-error-border);
          }
        </component>
        <story />
      </div>
    `,
  }),
];

export const StressTest = Template.bind({});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.args = {
  textLabel:
    "📧 Elektronischepostadressefürdiebenachrichtigungüberbestellungen https://example.com/a/very/long/unbroken/url/for/the/label <b>not bold</b> البريد الإلكتروني",
  indicator: "optional",
  required: false,
  optionalText: "(freiwilligeAngabekeinePflichtfeldbitteleerlassenwennnichtzutreffend)",
};
StressTest.parameters = {
  initialCanvas: "mobileCanvas",
  docs: {
    description: {
      story:
        "Long unbroken German, a long URL, emoji, HTML-like and right-to-left text in the label, plus an unbroken optional marker. Check at every canvas width: the label and the marker wrap inside the dashed outline, markup renders as text, and the marker stays after the text in RTL. Switch `indicator` to required and turn `required` on to check the required marker. Label copy arrives through slots, so there is no line-clamp token: clamp your own slot markup if you need to.",
    },
  },
};
