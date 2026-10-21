import { ref, type ComponentPublicInstance } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import CaptureQrCode from "../CaptureQrCode.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof CaptureQrCode> = {
  title: "Molecules/QR Code/CaptureQrCode",
  component: CaptureQrCode,
  argTypes: {
    cameraStoppedLabel: {
      control: { type: "text" },
      description: "Message shown while the camera is stopped (e.g. the tab is hidden)",
      table: { category: "Content", defaultValue: { summary: "Camera stopped" } },
    },
    resetCameraLabel: {
      control: { type: "text" },
      description: "Reset button text in the error state",
      table: { category: "Content", defaultValue: { summary: "Reset camera" } },
    },
    errorMessages: {
      control: "object",
      description:
        "Error copy keyed by camera error name (`NotAllowedError`, `NotFoundError`, ...) plus `default`. Merged over the built-in English messages",
      table: { category: "Content" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    cameraStoppedLabel: "Camera stopped",
    resetCameraLabel: "Reset camera",
    errorMessages: {},
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
          "Live QR code scanner using the device camera. Needs camera permission; the camera stops while the tab is hidden and restarts when it's shown again, and stops on route leave. " +
          "Results are announced through a polite live region. Copy props: `cameraStoppedLabel`, `resetCameraLabel`, `errorMessages`; the `#error` slot replaces the error block.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CaptureQrCode>;

export const Default: Story = {
  render: (args) => ({
    components: { CaptureQrCode },
    setup() {
      return { args };
    },
    template: `
      <p style="margin: 0 0 1.6rem;">Allow camera access when prompted, then hold a QR code up to the camera.</p>
      <CaptureQrCode v-bind="args" />
    `,
  }),
};

interface CaptureSetupState {
  onDetect: (codes: { rawValue: string }[]) => void;
  onError: (err: Error) => void;
  state: { cameraOn: boolean };
}

const namedError = (name: string, message = "") => Object.assign(new Error(message), { name });

const hostileResults = [
  "https://example.com/a/very/long/unbroken/path/that/never/wraps/on/its/own?utm_source=northtown&utm_medium=print&utm_campaign=autumn",
  "WIFI:T:WPA;S:Alex Morgan's very long network name for the upstairs studio;P:correcthorsebatterystaple;;",
  "<script>alert('not run')</script>",
  "🙂🙂🙂",
  "مرحبا بالعالم",
  "x",
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    cameraStoppedLabel:
      "Die Kamera wurde angehalten, weil dieser Tab im Hintergrund ist. Kehren Sie zu diesem Tab zurück, um fortzufahren.",
    resetCameraLabel: "Kamerazugriff erneut anfordern und den Scanvorgang neu starten",
    errorMessages: {
      default: "Supercalifragilisticexpialidociousandthensomemoretextwithoutanyspacesatall",
    },
  },
  render: (args) => ({
    components: { CaptureQrCode },
    setup() {
      // Story-only: drive the component's internal handlers, since a camera can't be faked here.
      const captureRef = ref<ComponentPublicInstance | null>(null);
      const internals = () => (captureRef.value?.$ as unknown as { setupState: CaptureSetupState } | undefined)?.setupState;
      const simulateResults = () => internals()?.onDetect(hostileResults.map((rawValue) => ({ rawValue })));
      const simulateKnownError = () => internals()?.onError(namedError("NotAllowedError"));
      const simulateUnknownError = () => internals()?.onError(namedError("SomethingElse", "raw library text"));
      const simulateStopped = () => {
        const state = internals()?.state;
        if (state) state.cameraOn = false;
      };
      return { args, captureRef, simulateResults, simulateKnownError, simulateUnknownError, simulateStopped };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 0.8rem; margin-block-end: 1.6rem;">
        <button type="button" @click="simulateResults">Simulate hostile results</button>
        <button type="button" @click="simulateKnownError">Simulate NotAllowedError</button>
        <button type="button" @click="simulateUnknownError">Simulate unknown error</button>
        <button type="button" @click="simulateStopped">Simulate stopped camera</button>
      </div>
      <CaptureQrCode ref="captureRef" v-bind="args" />
    `,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "720px" },
      description: {
        story:
          "Hostile copy and results at every `CanvasSwitcher` width; the buttons call the component's internal handlers because a real camera can't be faked here. " +
          "Check that: the long URL and Wi-Fi string wrap inside the canvas, `<script>` renders as text, emoji and right-to-left results read correctly, and a single character still shows as a list item; " +
          "`NotAllowedError` shows the built-in plain-language message, an unknown error shows the long unbroken `errorMessages.default` wrapped, and the long German reset label wraps inside its button; " +
          "the stopped message wraps. Switch tabs and back: the camera restarts.",
      },
    },
  },
};
