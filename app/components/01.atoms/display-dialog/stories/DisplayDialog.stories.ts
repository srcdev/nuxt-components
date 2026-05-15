import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../DisplayDialog.vue";

type StoryArgs = {
  variant: "dialog" | "modal" | "confirm" | "alert" | "fullscreen";
  allowContentScroll: boolean;
  justifyDialog: "start" | "center" | "end";
  alignDialog: "start" | "center" | "end";
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
    styleClassPassthrough: { table: { disable: true } },
    lockViewport: { table: { disable: true } },
    dataDialogId: { table: { disable: true } },
  },
  args: {
    variant: "dialog",
    allowContentScroll: false,
    justifyDialog: "center",
    alignDialog: "center",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A dialog overlay with header, scrollable content, and footer action slots. Supports `dialog`, `confirm`, `alert`, `modal`, and `fullscreen` variants. The `alert` variant sets `role=alertdialog` and disables dismiss-on-outside-click and Escape.",
      },
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
