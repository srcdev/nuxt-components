import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed, ref } from "vue";
import StorybookComponent from "../InputButton.vue";
import InputText from "../../input-text/InputText.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

interface InputButtonStoryArgs {
  type: "submit" | "button" | "reset";
  theme: "default" | "success" | "error" | "warning";
  variant: "primary" | "secondary" | "tertiary" | "inline";
  buttonText: string;
  isPill: boolean;
  styleClassPassthrough: string[];
  isPending: boolean;
  hasPendingEffect: boolean;
  readonly: boolean;
  useLeftSlot: boolean;
  useRightSlot: boolean;
  useIconOnlySlot: boolean;
  leftSlotContent: string;
  rightSlotContent: string;
  iconOnlyContent: string;
  leftIconName: string;
  rightIconName: string;
  iconOnlyName: string;
  useLeftIcon: boolean;
  useRightIcon: boolean;
  useIconOnly: boolean;
}

export default {
  title: "Components/Forms/Input Button/InputButton",
  component: StorybookComponent,
  argTypes: {
    // Basic Configuration
    type: {
      control: { type: "select" },
      options: ["button", "submit", "reset"],
      description: "Button type attribute",
      table: {
        category: "Basic",
      },
    },
    buttonText: {
      control: "text",
      description: "Button text content",
      table: {
        category: "Basic",
      },
    },

    // States
    readonly: {
      control: "boolean",
      description: "Whether button is readonly/disabled",
      table: {
        category: "States",
      },
    },
    isPending: {
      control: "boolean",
      description: "Whether button is in pending state",
      table: {
        category: "States",
      },
    },

    // Styling
    theme: {
      control: { type: "select" },
      options: ["default", "success", "error", "warning"],
      description: "Button theme",
      table: {
        category: "Styling",
      },
    },
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary", "inline"],
      description: "primary: filled. secondary: outlined. tertiary: text-only. inline: no colours, for wrapper components that style the button themselves",
      table: {
        category: "Styling",
      },
    },
    isPill: {
      control: "boolean",
      description: "Whether button has pill shape",
      table: {
        category: "Styling",
      },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes",
      table: {
        category: "Styling",
      },
    },

    // Effects
    hasPendingEffect: {
      control: "boolean",
      description: "Enable pending effect",
      table: {
        category: "Effects",
      },
    },

    // Slots
    useLeftSlot: {
      control: "boolean",
      description: "Use left icon slot",
      table: {
        category: "Slots",
      },
    },
    useRightSlot: {
      control: "boolean",
      description: "Use right icon slot",
      table: {
        category: "Slots",
      },
    },
    useIconOnlySlot: {
      control: "boolean",
      description: "Use icon-only slot (hides text)",
      table: {
        category: "Slots",
      },
    },
    leftSlotContent: {
      control: "text",
      description: "Content for left slot",
      table: {
        category: "Slots",
      },
    },
    rightSlotContent: {
      control: "text",
      description: "Content for right slot",
      table: {
        category: "Slots",
      },
    },
    iconOnlyContent: {
      control: "text",
      description: "Content for icon-only slot",
      table: {
        category: "Slots",
      },
    },

    // Icon Configuration
    useLeftIcon: {
      control: "boolean",
      description: "Use Icon component for left slot",
      table: {
        category: "Icons",
      },
    },
    leftIconName: {
      control: "text",
      description: "Icon name for left slot (e.g., 'mdi:arrow-left')",
      table: {
        category: "Icons",
      },
    },
    useRightIcon: {
      control: "boolean",
      description: "Use Icon component for right slot",
      table: {
        category: "Icons",
      },
    },
    rightIconName: {
      control: "text",
      description: "Icon name for right slot (e.g., 'mdi:arrow-right')",
      table: {
        category: "Icons",
      },
    },
    useIconOnly: {
      control: "boolean",
      description: "Use Icon component for icon-only slot",
      table: {
        category: "Icons",
      },
    },
    iconOnlyName: {
      control: "text",
      description: "Icon name for icon-only slot (e.g., 'mdi:flash')",
      table: {
        category: "Icons",
      },
    },
  },
  args: {
    type: "button",
    theme: "default",
    variant: "primary",
    buttonText: "Click me",
    styleClassPassthrough: [],
    isPending: false,
    hasPendingEffect: false,
    readonly: false,
    isPill: false,
    useLeftSlot: false,
    useRightSlot: false,
    useIconOnlySlot: false,
    leftSlotContent: "👈",
    rightSlotContent: "👉",
    iconOnlyContent: "⚡",
    useLeftIcon: false,
    useRightIcon: false,
    useIconOnly: false,
    leftIconName: "mdi:arrow-left",
    rightIconName: "mdi:arrow-right",
    iconOnlyName: "mdi:flash",
  },
  parameters: {
    docs: {
      description: {
        component:
          "The library's button. Renders a `<button>`, or a link when `href` is set (`NuxtLink` for a `/` path unless `external`). `variant` (primary, secondary, tertiary, inline) and `theme` pick the colours, `is-pill` rounds it, `readonly` dims it and blocks clicks, and `is-pending` with `has-pending-effect` animates a border while work runs. Label copy is `button-text`; the `left`/`right` slots add icons beside it, and `iconOnly` replaces it (the text stays as screen-reader text). The Slots and Icons controls are story-only. It's also the action button inside [InputCopy](?path=/story/molecules-input-copy--default), [CookieConsentBanner](?path=/story/molecules-cookieconsentbanner--default) and the step buttons of [InputNumberField](?path=/story/components-forms-input-number-inputnumberfield--default).",
      },
    },
  },
} as Meta<InputButtonStoryArgs>;

// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0; font-size: 1.4rem;";
const usedByNote = `
  <p style="${storyNoteStyle}">
    Also the action button inside
    <a href="/?path=/story/molecules-input-copy--default" target="_top">InputCopy</a>,
    <a href="/?path=/story/molecules-cookieconsentbanner--default" target="_top">CookieConsentBanner</a>
    (variant inline, styled by the banner's tokens) and the step buttons of
    <a href="/?path=/story/components-forms-input-number-inputnumberfield--default" target="_top">InputNumberField</a>.
  </p>
`;

const storyOnlyArgs = [
  "useLeftSlot",
  "useRightSlot",
  "useIconOnlySlot",
  "leftSlotContent",
  "rightSlotContent",
  "iconOnlyContent",
  "leftIconName",
  "rightIconName",
  "iconOnlyName",
  "useLeftIcon",
  "useRightIcon",
  "useIconOnly",
] as const;

const stripStoryArgs = (args: InputButtonStoryArgs) =>
  Object.fromEntries(Object.entries(args).filter(([key]) => !(storyOnlyArgs as readonly string[]).includes(key)));

const Template: StoryFn<InputButtonStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const clickCount = ref(0);

    const handleClick = () => {
      if (!args.readonly) {
        clickCount.value++;
      }
    };

    const componentArgs = computed(() => stripStoryArgs(args));

    return {
      args,
      componentArgs,
      clickCount,
      handleClick,
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; margin: 3.6rem;">
      ${usedByNote}
      <!-- :key forces a remount when any slot-visibility arg changes. Verified the args
           themselves ARE reactive here (a plain {{ args.useLeftSlot }} interpolation updates
           live on toggle) — the bug is narrower: Vue's compiled-at-runtime string template
           doesn't reliably re-evaluate a <template v-if="..."> conditionally attached to a named
           slot when only the v-if's condition changes, on this component/Storybook combination.
           Toggling a control changed the fallthrough attribute (confirmed via useleftslot="true"
           in the rendered DOM) but never actually added/removed the slot content until a hard
           refresh. Remounting sidesteps whatever the underlying slot-stability quirk is, rather
           than chasing it further. The story-only args are stripped before v-bind, so they no
           longer land on the button as attributes. -->
      <StorybookComponent
        :key="[args.useLeftSlot, args.useLeftIcon, args.useRightSlot, args.useRightIcon, args.useIconOnlySlot, args.useIconOnly].join(',')"
        v-bind="componentArgs"
        @click="handleClick"
      >
        <template v-if="args.useLeftSlot || args.useLeftIcon" #left>
          <Icon v-if="args.useLeftIcon" :name="args.leftIconName" class="icon" />
          <span v-else>{{ args.leftSlotContent }}</span>
        </template>
        <template v-if="args.useRightSlot || args.useRightIcon" #right>
          <Icon v-if="args.useRightIcon" :name="args.rightIconName" class="icon" />
          <span v-else>{{ args.rightSlotContent }}</span>
        </template>
        <template v-if="args.useIconOnlySlot || args.useIconOnly" #iconOnly>
          <Icon v-if="args.useIconOnly" :name="args.iconOnlyName" class="icon" />
          <span v-else>{{ args.iconOnlyContent }}</span>
        </template>
      </StorybookComponent>
      <div class="mbs-40">
        Click count: {{ clickCount }}
      </div>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  buttonText: "Button Text Only",
  useLeftSlot: false,
  useRightSlot: false,
};
Default.parameters = {
  docs: { description: { story: "Text only. Every prop is live in Controls, including the pending, pill and readonly states." } },
};

export const WithBothEmojiIcons = Template.bind({});
WithBothEmojiIcons.args = {
  buttonText: "With Both Emoji Icons",
  useLeftSlot: true,
  useRightSlot: true,
  leftSlotContent: "💸",
  rightSlotContent: "✅",
};
WithBothEmojiIcons.parameters = {
  docs: { description: { story: "Plain content in the `left` and `right` slots." } },
};

export const WithBothNuxtIconComponents = Template.bind({});
WithBothNuxtIconComponents.args = {
  buttonText: "With Both Nuxt Icon Components",
  useLeftIcon: true,
  useRightIcon: true,
  leftIconName: "mdi:arrow-left",
  rightIconName: "mdi:arrow-right",
};
WithBothNuxtIconComponents.parameters = {
  docs: { description: { story: "`<Icon class=\"icon\">` in both slots, sized by `--input-icon-size`." } },
};

export const EmojiIconOnly = Template.bind({});
EmojiIconOnly.args = {
  buttonText: "Emoji Icon Only Button",
  useIconOnlySlot: true,
  iconOnlyContent: "⚡",
};
EmojiIconOnly.parameters = {
  docs: { description: { story: "The `iconOnly` slot makes the button square (`data-icon-only`) and keeps `button-text` as screen-reader text." } },
};

export const NuxtIconOnlyComponent = Template.bind({});
NuxtIconOnlyComponent.args = {
  buttonText: "Nuxt Icon Only Button",
  useIconOnly: true,
  iconOnlyName: "mdi:chevron-right-circle-outline",
};
NuxtIconOnlyComponent.parameters = {
  docs: { description: { story: "Icon-only with an `<Icon>`; the accessible name still comes from `button-text`." } },
};

// Composition check, not a props demo: confirms InputButton's --button-min-height (defaults
// to var(--input-min-height)) actually keeps it height-aligned with an inline text input, the
// most common "usual suspect" pairing (e.g. newsletter signup, search bar). Textareas are the
// deliberate exception to this alignment and aren't part of this story.
const InlineTemplate: StoryFn = () => ({
  components: { StorybookComponent, InputText },
  template: `
    <div style="margin: 36px; max-width: 480px;">
      <div style="display: flex; align-items: flex-start; gap: 0.8rem;">
        <InputText
          id="inline-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          style="flex: 1;"
        />
        <StorybookComponent type="submit" variant="primary" button-text="Subscribe" />
      </div>
    </div>
  `,
});

export const InlineWithTextInput = InlineTemplate.bind({});

// Fixed showcase: hardcoded values, so Controls would do nothing here.
InlineWithTextInput.parameters = {
  controls: { disable: true },
  docs: {
    description: {
      story: "Composition check: `--button-min-height` defaults to `--input-min-height`, so the button lines up with an inline text input. Controls do nothing here.",
    },
  },
};

const stressLabels = [
  "Jetzt unverbindlich einen kostenlosen Beratungstermin vereinbaren",
  "Datenschutzgrundverordnungskonformitätsbestätigung",
  "https://example.com/a/very/long/unbroken/url/for/the/button/label",
  "<b>not bold</b>",
  "🎉 Book now",
  "احجز الآن",
  "x",
  "",
];

const StressTemplate: StoryFn<InputButtonStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const componentArgs = computed(() => {
      const { buttonText: _buttonText, ...rest } = stripStoryArgs(args);
      return rest;
    });
    return { args, componentArgs, stressLabels };
  },
  template: `
    <div style="display: grid; gap: 2.4rem;">
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 1.2rem;">
        <StorybookComponent v-for="(label, index) in stressLabels" :key="index" v-bind="componentArgs" :button-text="label" />
        <StorybookComponent v-bind="componentArgs" :button-text="stressLabels[0]">
          <template #left><Icon name="mdi:calendar" class="icon" /></template>
          <template #right><Icon name="mdi:arrow-right" class="icon" /></template>
        </StorybookComponent>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 1.2rem;">
        <StorybookComponent v-bind="componentArgs" variant="secondary" button-text="Zurück zur vorherigen Seite" />
        <StorybookComponent v-bind="componentArgs" :button-text="stressLabels[0]" />
      </div>
    </div>
  `,
});

export const StressTest = StressTemplate.bind({});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.args = { isPill: true };
StressTest.decorators = [
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
];
StressTest.parameters = {
  layout: "fullscreen",
  initialCanvas: "mobileCanvas",
  docs: {
    story: { inline: false, height: "900px" },
    description: {
      story:
        "Long German copy, an unbroken compound word, a long URL, HTML-like text, emoji, right-to-left text, a single character and an empty label, then a long label with icons on both sides and a wrapping row of two buttons. Check at every canvas width: no button pushes past the dashed outline, long labels wrap inside the button (`--input-button-text-white-space` defaults to `normal`), icons keep their size, markup renders as text, and the pill shape still reads with several lines. Toggle variant, pill and pending in Controls. Button text is never line-clamped: a cut-off action label can't be trusted.",
    },
  },
};
