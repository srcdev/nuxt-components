import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed, ref } from "vue";
import StorybookComponent from "../InputDescription.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { InputUiVariant } from "~/types/forms/types.forms";
import type { MediaCanvas } from "~/types/components";

interface InputDescriptionStoryArgs {
  descriptionId: string;
  fieldHasError: boolean;
  inputVariant: InputUiVariant;
  styleClassPassthrough: string;
  descriptionText: string;
  descriptionHtml: string;
}

export default {
  title: "Components/Forms/Input Description/InputDescription",
  component: StorybookComponent,
  argTypes: {
    descriptionId: {
      control: "text",
      description: "Rendered as the root id, the target of the control's aria-describedby",
      table: { category: "Basic" },
    },
    descriptionText: {
      control: "text",
      description: "descriptionText slot: plain help text, rendered in a <p>",
      table: { category: "Slots" },
    },
    descriptionHtml: {
      control: "text",
      description: "descriptionHtml slot: rich markup, rendered in a <div> above the text slot",
      table: { category: "Slots" },
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
    descriptionId: "story-field-description",
    fieldHasError: false,
    inputVariant: "normal",
    styleClassPassthrough: "",
    descriptionText: "We'll only use this to send your booking confirmation.",
    descriptionHtml: "",
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
          "Help text for a form field. Copy goes in the `descriptionText` slot (a paragraph) and the `descriptionHtml` slot (rich markup, rendered first); with neither filled nothing renders. `description-id` becomes the root id, for the control's `aria-describedby`. `field-has-error` and `input-variant` are styling hooks only. Every labelled field renders it from its own description slots: see [InputTextField](?path=/story/components-forms-input-text-inputtextfield--with-description).",
      },
    },
  },
} as Meta<InputDescriptionStoryArgs>;

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const fieldNote = `
  <p style="${storyNoteStyle}">
    Every labelled field renders this from its own description slots. See it in a real field in the
    <a href="/?path=/story/components-forms-input-text-inputtextfield--with-description" target="_top">InputTextField</a> story.
  </p>
`;

const Template: StoryFn<InputDescriptionStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const componentArgs = computed(() => {
      const { descriptionText: _text, descriptionHtml: _html, ...rest } = args;
      return rest;
    });
    return { args, componentArgs };
  },
  template: `
    <div style="max-width: 48rem; font-size: 1.6rem;">
      ${fieldNote}
      <label for="story-field" style="display: block; font-weight: 700;">Email address</label>
      <StorybookComponent v-bind="componentArgs">
        <template v-if="args.descriptionHtml" #descriptionHtml><span v-html="args.descriptionHtml"></span></template>
        <template v-if="args.descriptionText" #descriptionText>{{ args.descriptionText }}</template>
      </StorybookComponent>
      <input
        id="story-field"
        type="email"
        :aria-describedby="args.descriptionText || args.descriptionHtml ? args.descriptionId : undefined"
        style="width: 100%; padding: 1.2rem; font-size: 1.6rem;"
      />
    </div>
  `,
});

export const TextOnly = Template.bind({});
TextOnly.parameters = {
  docs: { description: { story: "Plain help text in the `descriptionText` slot." } },
};

export const HtmlOnly = Template.bind({});
HtmlOnly.args = {
  descriptionText: "",
  descriptionHtml: "Password must contain:<ul><li>At least 12 characters</li><li>One number</li></ul>",
};
HtmlOnly.parameters = {
  docs: { description: { story: "Rich markup, here a list, in the `descriptionHtml` slot." } },
};

export const TextAndHtml = Template.bind({});
TextAndHtml.args = {
  descriptionHtml: "<strong>Tip:</strong> use your work address if you have one.",
};
TextAndHtml.parameters = {
  docs: { description: { story: "Both slots: `descriptionHtml` renders above `descriptionText`." } },
};

export const Empty = Template.bind({});
Empty.args = { descriptionText: "", descriptionHtml: "" };
Empty.parameters = {
  docs: { description: { story: "With neither slot provided nothing is rendered, so no empty element or id is left behind." } },
};

export const CustomTokens = Template.bind({});
CustomTokens.args = { styleClassPassthrough: "input-description-story-tokens" };
CustomTokens.parameters = {
  docs: { description: { story: "Colour, size and slot spacing set as tokens through a passthrough class." } },
};
CustomTokens.decorators = [
  () => ({
    template: `
      <div>
        <component is="style">
          .input-description-story-tokens {
            --input-description-color: var(--theme-input-placeholder);
            --input-description-font-size: 1.4rem;
            --input-description-slot-margin-block-start: 0.2rem;
            --input-description-slot-margin-block-end: 1.2rem;
          }
        </component>
        <story />
      </div>
    `,
  }),
];

export const Panel = Template.bind({});
Panel.args = {
  styleClassPassthrough: "input-description-story-panel",
  descriptionHtml: "<strong>Tip:</strong> use your work address if you have one.",
};
Panel.parameters = {
  docs: {
    description: {
      story:
        "Callout styling via the root tokens. The slot margins are zeroed so the panel's padding is even, and the root margins space the panel from the label and control instead.",
    },
  },
};
Panel.decorators = [
  () => ({
    template: `
      <div>
        <component is="style">
          .input-description-story-panel {
            --input-description-background-color: var(--theme-surface-subtle);
            --input-description-border: 0.1rem solid var(--theme-border);
            --input-description-border-radius: 0.6rem;
            --input-description-margin-block: 0.4rem 0.8rem;
            --input-description-padding-block: 0.8rem;
            --input-description-padding-inline: 1.2rem;
            --input-description-slot-margin-block-start: 0;
            --input-description-slot-margin-block-end: 0;
          }
          .input-description-story-panel .input-description-html + .input-description-text {
            margin-block-start: 0.4rem;
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
  descriptionText:
    "📧 Wir verwenden Ihre Adresse ausschließlich für Rückfragen zu Ihrer Bestellung. Datenschutzgrundverordnungskonformitätsbestätigung https://example.com/a/very/long/unbroken/url/for/the/privacy/policy <b>not bold</b> يرجى إدخال بريدك الإلكتروني",
  descriptionHtml:
    "<strong>Hinweis:</strong> Elektronischepostadressefürdiebenachrichtigungüberbestellungen <a href=\"https://example.com/a/very/long/unbroken/url/for/the/terms\">https://example.com/a/very/long/unbroken/url/for/the/terms</a>",
};
StressTest.parameters = {
  initialCanvas: "mobileCanvas",
  docs: {
    description: {
      story:
        "Long German copy, unbroken compound words, long URLs (one as a link), emoji, HTML-like and right-to-left text in both slots. Check at every canvas width: every line wraps inside the dashed outline and the wrapped lines don't touch. Copy arrives through slots, so there is no line-clamp token: clamp your own slot markup if you need to.",
    },
  },
};
