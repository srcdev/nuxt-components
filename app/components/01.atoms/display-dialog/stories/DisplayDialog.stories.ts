import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../DisplayDialog.vue";

type StoryArgs = {
  variant: "dialog" | "modal" | "confirm" | "alert" | "fullscreen";
  allowContentScroll: boolean;
  justifyDialog: "start" | "center" | "end";
  alignDialog: "start" | "center" | "end";
  theme: "" | "info" | "success" | "warning" | "error";
  closeIcon: string;
  closeLabel: string;
  stressShowTitle?: boolean;
  stressShowContent?: boolean;
  stressFooterButtons?: number;
};

export default {
  title: "Atoms/DisplayDialog",
  component: StorybookComponent,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["dialog", "modal", "confirm", "alert", "fullscreen"],
      description: "Controls sizing, shape, and ARIA role of the dialog panel",
      table: { category: "Appearance" },
    },
    allowContentScroll: {
      control: { type: "boolean" },
      description: "Allow the content area to scroll independently",
      table: { category: "Behaviour" },
    },
    justifyDialog: {
      control: { type: "inline-radio" },
      options: ["start", "center", "end"],
      description: "Horizontal position of the dialog panel within the overlay",
      table: { category: "Layout" },
    },
    alignDialog: {
      control: { type: "inline-radio" },
      options: ["start", "center", "end"],
      description: "Vertical position of the dialog panel within the overlay",
      table: { category: "Layout" },
    },
    theme: {
      control: { type: "select" },
      options: ["", "info", "success", "warning", "error"],
      description: "Semantic theme: accent border and title colour on the header",
      table: { category: "Appearance" },
    },
    closeIcon: {
      control: { type: "text" },
      description: "Icon name for the close button",
      table: { category: "Appearance" },
    },
    closeLabel: {
      control: { type: "text" },
      description: "Screen-reader label for the close button (override for localisation)",
      table: { category: "Accessibility" },
    },
    styleClassPassthrough: { table: { disable: true } },
    lockViewport: { table: { disable: true } },
    dataDialogId: { table: { disable: true } },
  },
  args: {
    variant: "dialog",
    allowContentScroll: false,
    justifyDialog: "center",
    alignDialog: "center",
    theme: "",
    closeIcon: "bitcoin-icons:cross-filled",
    closeLabel: "Close",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A dialog overlay with header, scrollable content, and footer action slots. Supports `dialog`, `confirm`, `alert`, `modal`, and `fullscreen` variants. The `alert` variant sets `role=alertdialog` and disables dismiss-on-outside-click and Escape. Slots: `dialogTitle` (also names the dialog), `dialogContent`, `actionButtonLeft` and `actionButtonRight`. Open state is `v-model`; `closeLabel` and `closeIcon` set the header close button. With no `dialogTitle`, pass an `aria-label` (it falls through to the `<dialog>`). Every story renders in its own frame because the overlay is `position: fixed`.",
      },
      story: { inline: false, height: "600px" },
    },
  },
} as Meta<StoryArgs>;

const triggerButtonStyles =
  "padding: 0.8rem 1.6rem; border-radius: 0.4rem; border: 0.1rem solid currentColor; background: transparent; cursor: pointer; font-size: 1.4rem;";

const actionButtonStyles =
  "padding: 0.8rem 1.6rem; border-radius: 0.4rem; border: 0.1rem solid currentColor; background: transparent; cursor: pointer; font-size: 1.4rem;";

const Template: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const open = ref(false);
    return { args, open };
  },
  template: `
    <div style="padding: 4rem; display: flex; justify-content: center;">
      <button :style="'${triggerButtonStyles}'" @click="open = true">Open dialog</button>
      <StorybookComponent
        v-model="open"
        :variant="args.variant"
        :allow-content-scroll="args.allowContentScroll"
        :justify-dialog="args.justifyDialog"
        :align-dialog="args.alignDialog"
        :theme="args.theme || undefined"
        :close-icon="args.closeIcon"
        :close-label="args.closeLabel"
        :lock-viewport="false"
        data-dialog-id="storybook-dialog"
      >
        <template #dialogTitle>
          <p style="margin: 0; font-weight: 700; font-size: 1.6rem;">Dialog title</p>
        </template>
        <template #dialogContent>
          <p style="margin: 0; line-height: 1.6;">
            This is the dialog content area. It accepts any markup via the
            <code>#dialogContent</code> slot.
          </p>
        </template>
        <template #actionButtonLeft>
          <button :style="'${actionButtonStyles}'" @click="open = false">Cancel</button>
        </template>
        <template #actionButtonRight>
          <button :style="'${actionButtonStyles}'" @click="open = false">Confirm</button>
        </template>
      </StorybookComponent>
    </div>
  `,
});

const ScrollableTemplate: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const open = ref(false);
    return { args, open };
  },
  template: `
    <div style="padding: 4rem; display: flex; justify-content: center;">
      <button :style="'${triggerButtonStyles}'" @click="open = true">Open dialog</button>
      <StorybookComponent
        v-model="open"
        variant="dialog"
        :allow-content-scroll="true"
        :lock-viewport="false"
        data-dialog-id="storybook-scrollable"
      >
        <template #dialogTitle>
          <p style="margin: 0; font-weight: 700; font-size: 1.6rem;">Scrollable content</p>
        </template>
        <template #dialogContent>
          <div style="padding: 1.2rem 0;">
            <p style="margin: 0 0 1.6rem; line-height: 1.6;">Lorem ipsum odor amet, consectetuer adipiscing elit. Scelerisque tincidunt vestibulum litora torquent aliquam a. Sem litora tellus mattis nisi vehicula sodales arcu egestas.</p>
            <p style="margin: 0 0 1.6rem; line-height: 1.6;">Justo molestie felis tellus tellus taciti? Ullamcorper viverra quis felis donec aliquam torquent imperdiet. Curabitur vitae quis malesuada imperdiet hendrerit felis quam dictum.</p>
            <p style="margin: 0 0 1.6rem; line-height: 1.6;">Lobortis efficitur enim litora dictum montes. Sagittis eget etiam curae suspendisse cubilia. Ante aliquam orci mus ultricies nostra.</p>
            <p style="margin: 0 0 1.6rem; line-height: 1.6;">Venenatis adipiscing integer eget donec ridiculus risus. Nulla quis sollicitudin sem nam bibendum ligula. Curabitur malesuada platea egestas venenatis in torquent.</p>
            <p style="margin: 0; line-height: 1.6;">Curae maximus nam tortor porta sodales at, feugiat iaculis integer. Lacus habitasse odio fames natoque neque varius nostra.</p>
          </div>
        </template>
        <template #actionButtonLeft>
          <button :style="'${actionButtonStyles}'" @click="open = false">Cancel</button>
        </template>
        <template #actionButtonRight>
          <button :style="'${actionButtonStyles}'" @click="open = false">Confirm</button>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = { variant: "dialog" };

export const Confirm = Template.bind({});
Confirm.args = { variant: "confirm" };
Confirm.parameters = {
  docs: {
    description: { story: "Compact dialog sized to its content. Use for simple yes/no confirmations." },
  },
};

export const Alert = Template.bind({});
Alert.args = { variant: "alert" };
Alert.parameters = {
  docs: {
    description: {
      story:
        "Sets `role=alertdialog`. Escape and outside-click are both disabled — the user must take explicit action via the footer buttons.",
    },
  },
};

export const Fullscreen = Template.bind({});
Fullscreen.args = { variant: "fullscreen" };
Fullscreen.parameters = {
  docs: {
    description: { story: "Fills the entire viewport. No border or border-radius. Useful for immersive multi-step flows." },
  },
};

export const ScrollableContent = ScrollableTemplate.bind({});
ScrollableContent.parameters = {
  docs: {
    description: { story: "Content area scrolls independently when it overflows the fixed-height dialog panel." },
  },
};

const stressLabels = [
  "Abbrechenundzurückzurübersicht",
  "😀 Bestätigen",
  "<b>not bold</b>",
  "إلغاء العملية",
  "OK",
  "Änderungenspeichernundfortfahrenohnezuwarten",
];

export const StressTest: StoryFn<StoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const open = ref(true);
    return { args, open, stressLabels };
  },
  template: `
    <div style="padding: 4rem; display: flex; justify-content: center;">
      <button :style="'${triggerButtonStyles}'" @click="open = true">Open dialog</button>
      <StorybookComponent
        v-model="open"
        :variant="args.variant"
        :allow-content-scroll="args.allowContentScroll"
        :justify-dialog="args.justifyDialog"
        :align-dialog="args.alignDialog"
        :theme="args.theme || undefined"
        :close-icon="args.closeIcon"
        :close-label="args.closeLabel"
        :lock-viewport="false"
        aria-label="Stress test dialog"
        data-dialog-id="storybook-stress"
      >
        <template v-if="args.stressShowTitle" #dialogTitle>
          <p style="margin: 0; font-weight: 700; font-size: 1.6rem;">😀 Bevorzugtekontaktmethodefürrückfragenundterminvereinbarungenbestätigen &lt;b&gt;not bold&lt;/b&gt; طريقة الاتصال المفضلة</p>
        </template>
        <template v-if="args.stressShowContent" #dialogContent>
          <p style="margin: 0 0 1.2rem; line-height: 1.6;">https://example.invalid/a/very/long/unbroken/url/that/never/offers/a/break/opportunity/anywhere/in/its/path?query=withevenmoreunbrokentextandparameters</p>
          <p style="margin: 0 0 1.2rem; line-height: 1.6;">Sind Sie sicher, dass Sie alle nicht gespeicherten Änderungen an Ihrem Profil, Ihren Benachrichtigungseinstellungen und Ihren gespeicherten Zahlungsmethoden unwiderruflich verwerfen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.</p>
          <p dir="rtl" style="margin: 0 0 1.2rem; line-height: 1.6;">هل أنت متأكد أنك تريد تجاهل جميع التغييرات غير المحفوظة؟ لا يمكن التراجع عن هذا الإجراء.</p>
          <p v-for="n in 12" :key="n" style="margin: 0 0 1.2rem; line-height: 1.6;">Paragraph {{ n }}: <b>&lt;script&gt;alert("x")&lt;/script&gt;</b> renders as text. Lorem ipsum odor amet, consectetuer adipiscing elit.</p>
        </template>
        <template v-if="args.stressFooterButtons" #actionButtonRight>
          <button
            v-for="label in stressLabels.slice(0, args.stressFooterButtons)"
            :key="label"
            :style="'${actionButtonStyles}'"
            @click="open = false"
          >{{ label }}</button>
        </template>
      </StorybookComponent>
    </div>
  `,
});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.args = {
  variant: "modal",
  closeLabel: "Dialogfensterschließenundzurückkehren 😀",
  stressShowTitle: true,
  stressShowContent: true,
  stressFooterButtons: 6,
};
StressTest.argTypes = {
  stressShowTitle: {
    control: { type: "boolean" },
    description: "Story-only: render the `dialogTitle` slot (off shows the close button alone in the header)",
    table: { category: "Stress test (story-only)" },
  },
  stressShowContent: {
    control: { type: "boolean" },
    description: "Story-only: render the `dialogContent` slot",
    table: { category: "Stress test (story-only)" },
  },
  stressFooterButtons: {
    control: { type: "range", min: 0, max: 6, step: 1 },
    description: "Story-only: number of footer buttons in `actionButtonRight` (0 omits the footer)",
    table: { category: "Stress test (story-only)" },
  },
};
StressTest.parameters = {
  docs: {
    story: { inline: false, height: "700px" },
    description: {
      story:
        "Worst-case content, opened on load. A long unbroken title with emoji, HTML-like and right-to-left text, an unbroken URL, long German and Arabic copy, escaped markup that must render as text, and six footer buttons with unbroken labels. Switch `variant` through all five: the panel never exceeds the viewport, the close button stays in the header's top-right corner, the title and content wrap instead of widening the panel, the footer buttons wrap onto further rows and stay visible (content is clipped, or scrolls with `allowContentScroll`, rather than pushing the footer off-screen). Toggle the slots off one at a time: with no content the footer keeps its own row (at the bottom of the fixed-height `dialog` panel) instead of stretching into the middle one, and with nothing but the header the panel is just the close button.",
    },
  },
};
