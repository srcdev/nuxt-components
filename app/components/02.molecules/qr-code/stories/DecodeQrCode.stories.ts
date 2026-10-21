import { ref, type ComponentPublicInstance } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import DecodeQrCode from "../DecodeQrCode.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof DecodeQrCode> = {
  title: "Molecules/QR Code/DecodeQrCode",
  component: DecodeQrCode,
  argTypes: {
    uploadLabel: {
      control: { type: "text" },
      description: "Visible label for the file input",
      table: { category: "Content", defaultValue: { summary: "Upload a QR code image" } },
    },
    dropLabel: {
      control: { type: "text" },
      description: "Instruction text inside the drop zone",
      table: { category: "Content", defaultValue: { summary: "Or drop a QR code image here" } },
    },
    noResultLabel: {
      control: { type: "text" },
      description: "Shown when an image is decoded but contains no QR code",
      table: { category: "Content", defaultValue: { summary: "No QR code was found in that image." } },
    },
    readErrorLabel: {
      control: { type: "text" },
      description: "Shown when a dropped file or URL can't be read as an image",
      table: { category: "Content", defaultValue: { summary: "That file couldn't be read as an image." } },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    uploadLabel: "Upload a QR code image",
    dropLabel: "Or drop a QR code image here",
    noResultLabel: "No QR code was found in that image.",
    readErrorLabel: "That file couldn't be read as an image.",
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
          "Decodes QR codes from an uploaded or dropped image (PNG, JPEG, WEBP and other common formats). Results, or a no-code/unreadable-file message, are announced through a polite live region. " +
          "Copy props: `uploadLabel`, `dropLabel`, `noResultLabel`, `readErrorLabel`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DecodeQrCode>;

export const Default: Story = {
  render: (args) => ({
    components: { DecodeQrCode },
    setup() {
      return { args };
    },
    template: `<DecodeQrCode v-bind="args" />`,
  }),
};

interface DecodeSetupState {
  onDetect: (codes: { rawValue: string }[]) => void;
  onDropping: (dropping: boolean) => void;
  onDropError: () => void;
}

const hostileResults = [
  "https://example.com/a/very/long/unbroken/path/that/never/wraps/on/its/own?utm_source=northtown&utm_medium=print&utm_campaign=autumn",
  "<b>Not bold</b>",
  "🙂🙂🙂",
  "مرحبا بالعالم",
  "x",
  ...Array.from({ length: 10 }, (_, i) => `Code ${i + 1}`),
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    uploadLabel: "Laden Sie ein Bild mit einem QR-Code von Ihrem Gerät hoch, um ihn zu entschlüsseln",
    dropLabel: "Supercalifragilisticexpialidociousandthensomemoretextwithoutanyspacesatall",
    noResultLabel: "In diesem Bild wurde kein QR-Code gefunden. Versuchen Sie es mit einem schärferen Foto.",
    readErrorLabel: "",
  },
  render: (args) => ({
    components: { DecodeQrCode },
    setup() {
      // Story-only: drive the component's internal handlers to show states without a real image.
      const decodeRef = ref<ComponentPublicInstance | null>(null);
      const internals = () => (decodeRef.value?.$ as unknown as { setupState: DecodeSetupState } | undefined)?.setupState;
      const dropping = ref(false);
      const simulateResults = () => internals()?.onDetect(hostileResults.map((rawValue) => ({ rawValue })));
      const simulateEmpty = () => internals()?.onDetect([]);
      const simulateError = () => internals()?.onDropError();
      const toggleDropping = () => {
        dropping.value = !dropping.value;
        internals()?.onDropping(dropping.value);
      };
      return { args, decodeRef, simulateResults, simulateEmpty, simulateError, toggleDropping };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 0.8rem; margin-block-end: 1.6rem;">
        <button type="button" @click="simulateResults">Simulate hostile results</button>
        <button type="button" @click="simulateEmpty">Simulate image with no code</button>
        <button type="button" @click="simulateError">Simulate unreadable file</button>
        <button type="button" @click="toggleDropping">Toggle dragging state</button>
      </div>
      <DecodeQrCode ref="decodeRef" v-bind="args" />
    `,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "720px" },
      description: {
        story:
          "Hostile copy and results at every `CanvasSwitcher` width; the buttons call the component's internal handlers so each state shows without a real image. " +
          "Check that: the long German upload label wraps and the file input stays inside the canvas; the unbroken drop label wraps inside the drop zone; " +
          "the long URL wraps, `<b>` renders as text, emoji and right-to-left results read correctly, and 15 results stack without overflow; " +
          "the no-code message wraps; `readErrorLabel` is empty here, so the unreadable-file button clears the results and renders no message element at all; " +
          "the dragging state shows the active border and background.",
      },
    },
  },
};
