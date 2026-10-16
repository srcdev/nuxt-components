import { computed, reactive, ref } from "vue";
import ProgressTracker from "../ProgressTracker.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import InputButton from "../../../05.forms/input-button/InputButton.vue";
import InputTextField from "../../../05.forms/input-text/InputTextField.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas, ProgressTrackerStep } from "~/types/components";

type LineClamp = "none" | "1" | "2" | "3" | "4";

// Story-only args: drive CSS tokens, not ProgressTracker props. See the argTypes entries.
// modelValue is re-declared writable: stories drive it like a parent would.
type StoryArgs = Omit<InstanceType<typeof ProgressTracker>["$props"], "modelValue"> & {
  modelValue: number;
  titleLineClamp: LineClamp;
  bodyLineClamp: LineClamp;
};

const lineClampControl = (token: string, example: string) => ({
  control: "select" as const,
  options: ["none", "1", "2", "3", "4"] satisfies LineClamp[],
  description:
    `**Story control, not a prop.** Sets the \`${token}\` CSS token on a wrapper so you can try it here. ` +
    `To use it in an app, set the token in your own CSS, e.g. \`${example}\`. ` +
    "`1` is single-line ellipsis, `none` (the default) shows everything.",
  table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
});

const onboardingSteps: ProgressTrackerStep[] = [
  { title: "Create your account", body: "Enter your email and choose a password to get started." },
  {
    title: "Verify your email",
    body: "Click the link we sent to your inbox. If you don't see it, check your spam folder: it should arrive within a few minutes.",
  },
  { title: "Choose a plan", body: "Select from Starter, Pro, or Enterprise depending on your needs." },
  { title: "Invite your team", body: "Add colleagues by email so they can collaborate on your workspace." },
  { title: "Start building", body: "You're all set. Dive into the dashboard and start your first project." },
];

const meta: Meta<StoryArgs> = {
  title: "Molecules/ProgressTracker",
  component: ProgressTracker,
  argTypes: {
    titleLineClamp: lineClampControl(
      "--progress-tracker-title-line-clamp",
      ".onboarding { --progress-tracker-title-line-clamp: 1; }"
    ),
    bodyLineClamp: lineClampControl(
      "--progress-tracker-body-line-clamp",
      ".onboarding { --progress-tracker-body-line-clamp: 2; }"
    ),
    modelValue: {
      control: { type: "number", min: 0, step: 1 },
      description: "0-based index of the current step (`v-model`). `steps.length` means every step is done.",
      table: { category: "State" },
    },
    steps: { control: "object", table: { category: "Content" } },
    headingTag: {
      control: "select",
      options: ["h2", "h3", "h4", "h5", "h6"],
      description: "Heading level for each step title; pick to fit the surrounding page outline",
      table: { category: "Semantics", defaultValue: { summary: "h3" } },
    },
    stepLabel: {
      control: "text",
      description: "Header text; `{current}` and `{total}` are filled in",
      table: { category: "Labels" },
    },
    completeLabel: { control: "text", table: { category: "Labels" } },
    doneLabel: {
      control: "text",
      description: "Screen-reader text added after each done step's title",
      table: { category: "Labels" },
    },
    doneIcon: { control: "text", description: "Iconify name for the done tick", table: { category: "Labels" } },
    focusOnChange: {
      control: "boolean",
      description: "Move focus to the new current title (or the header label when complete) when the model changes",
      table: { category: "Behaviour" },
    },
    styleClassPassthrough: { control: "object", table: { category: "Styling" } },
  },
  args: {
    titleLineClamp: "none",
    bodyLineClamp: "none",
    modelValue: 1,
    steps: onboardingSteps,
    headingTag: "h3",
    stepLabel: "Step {current} of {total}",
    completeLabel: "All steps complete",
    doneLabel: "Completed",
    doneIcon: "lucide:check",
    focusOnChange: true,
    styleClassPassthrough: [],
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
        <div :class="canvasName" style="margin-inline: auto; padding: 3.2rem 2rem; outline: 1px dashed currentColor;">
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
          "A presentational progress track for a multi-step flow. `steps` (title and optional body) render through StepperList: " +
          "steps before the `v-model` index are done (tick), the model's step is current (ringed number, focus card) and later steps are upcoming. " +
          "A header shows `stepLabel` and a progress bar. The `#step-{n}` slot renders only inside the current step, so a parent can put a form " +
          "or actions there and drive the model itself (see the Wizard story). The component has no events and never changes the model; " +
          "when the model changes it moves focus to the new step's title (`focusOnChange`).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => {
    const { titleLineClamp: _titleLineClamp, bodyLineClamp: _bodyLineClamp, modelValue: _modelValue, ...rest } = args;
    return rest;
  });
  const tokenStyles = computed(() => ({
    "--progress-tracker-title-line-clamp": args.titleLineClamp,
    "--progress-tracker-body-line-clamp": args.bodyLineClamp,
  }));
  return { args, componentArgs, tokenStyles };
}

const render = (args: StoryArgs) => ({
  components: { ProgressTracker },
  setup() {
    return useStorySetup(args);
  },
  template: `
    <div :style="tokenStyles" style="max-inline-size: 64rem;">
      <ProgressTracker v-bind="componentArgs" v-model="args.modelValue" />
    </div>
  `,
});

export const Default: Story = {
  render,
  parameters: {
    docs: {
      description: {
        story: "Step 2 of 5. Change the `modelValue` control to move through the steps, or set it to 5 for the complete state.",
      },
    },
  },
};

export const AllComplete: Story = {
  name: "All Complete",
  args: { modelValue: 5 },
  render,
  parameters: {
    docs: { description: { story: "The model equals `steps.length`: every step is done and the header shows `completeLabel`." } },
  },
};

export const Interactive: Story = {
  name: "Interactive (Mark complete)",
  render: (args) => ({
    components: { ProgressTracker, InputButton },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div :style="tokenStyles" style="max-inline-size: 64rem;">
        <ProgressTracker v-bind="componentArgs" v-model="args.modelValue">
          <template v-for="(_, index) in args.steps" :key="index" #[\`step-\${index}\`]>
            <InputButton button-text="Mark complete" is-pill @click="args.modelValue = index + 1" />
          </template>
        </ProgressTracker>
        <InputButton
          v-if="args.modelValue >= args.steps.length"
          button-text="Start again"
          variant="secondary"
          style="margin-block-start: 2.4rem;"
          @click="args.modelValue = 0"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The minimal pattern: each step's `#step-{n}` slot holds a \"Mark complete\" button that sets the model to the next index. " +
          "The button only exists in the current step, and focus moves to the next title after each click.",
      },
    },
  },
};

const wizardSteps: ProgressTrackerStep[] = [
  { title: "Your details", body: "Tell us who you are." },
  { title: "Contact", body: "Where can we reach you?" },
  { title: "Review and submit", body: "Check everything looks right, then submit." },
];

export const Wizard: Story = {
  name: "Wizard (parent-owned forms)",
  args: { modelValue: 0, steps: wizardSteps },
  render: (args) => ({
    components: { ProgressTracker, InputButton, InputTextField },
    setup() {
      const story = useStorySetup(args);
      const form = reactive({ name: "", email: "" });
      const errors = reactive({ name: "", email: "" });
      const submitted = ref(false);

      const steps = computed<ProgressTrackerStep[]>(() => [
        { title: "Your details", body: args.modelValue > 0 && form.name ? form.name : "Tell us who you are." },
        { title: "Contact", body: args.modelValue > 1 && form.email ? form.email : "Where can we reach you?" },
        { title: "Review and submit", body: "Check everything looks right, then submit." },
      ]);

      const next = (field: "name" | "email") => {
        errors[field] = form[field].trim() ? "" : "This field is required";
        if (!errors[field]) args.modelValue = (args.modelValue ?? 0) + 1;
      };
      const back = () => {
        args.modelValue = Math.max(0, (args.modelValue ?? 0) - 1);
      };
      const submit = () => {
        submitted.value = true;
        args.modelValue = steps.value.length;
      };
      const restart = () => {
        Object.assign(form, { name: "", email: "" });
        submitted.value = false;
        args.modelValue = 0;
      };

      return { ...story, form, errors, steps, submitted, next, back, submit, restart };
    },
    template: `
      <div :style="tokenStyles" style="max-inline-size: 64rem;">
        <ProgressTracker v-bind="componentArgs" v-model="args.modelValue" :steps="steps">
          <template #step-0="{ headingId }">
            <form :aria-labelledby="headingId" style="display: grid; gap: 1.6rem;" @submit.prevent="next('name')">
              <InputTextField
                v-model="form.name"
                type="text"
                name="wizard-name"
                label="Full name"
                :error-message="errors.name"
                :field-has-error="!!errors.name"
                required
              />
              <div style="display: flex; gap: 1.2rem;">
                <InputButton type="submit" button-text="Continue" is-pill />
              </div>
            </form>
          </template>
          <template #step-1="{ headingId }">
            <form :aria-labelledby="headingId" style="display: grid; gap: 1.6rem;" @submit.prevent="next('email')">
              <InputTextField
                v-model="form.email"
                type="email"
                name="wizard-email"
                label="Email address"
                :error-message="errors.email"
                :field-has-error="!!errors.email"
                required
              />
              <div style="display: flex; gap: 1.2rem; flex-wrap: wrap;">
                <InputButton button-text="Back" variant="secondary" is-pill @click="back" />
                <InputButton type="submit" button-text="Continue" is-pill />
              </div>
            </form>
          </template>
          <template #step-2="{ headingId }">
            <form :aria-labelledby="headingId" style="display: grid; gap: 1.6rem;" @submit.prevent="submit">
              <dl style="display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 0.4rem 1.6rem; margin: 0;">
                <dt>Name</dt><dd style="margin: 0;">{{ form.name }}</dd>
                <dt>Email</dt><dd style="margin: 0;">{{ form.email }}</dd>
              </dl>
              <div style="display: flex; gap: 1.2rem; flex-wrap: wrap;">
                <InputButton button-text="Back" variant="secondary" is-pill @click="back" />
                <InputButton type="submit" button-text="Submit" is-pill />
              </div>
            </form>
          </template>
        </ProgressTracker>
        <div v-if="submitted" style="margin-block-start: 2.4rem;">
          <InputButton button-text="Start again" variant="secondary" is-pill @click="restart" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "An n-step wizard where the parent owns everything: the form values, validation and the model. Each `#step-{n}` slot holds that " +
          "step's form, labelled by its step title through the slot's `headingId`. Continue validates and increments the model, Back " +
          "decrements it, Submit sets it to `steps.length`. Done steps show what was entered, by passing it back in as the step's `body`. " +
          "Try it with the keyboard only: focus follows each step change to the new title.",
      },
    },
  },
};

export const TranslatedLabels: Story = {
  name: "Translated Labels",
  args: {
    stepLabel: "Schritt {current} von {total}",
    completeLabel: "Alle Schritte erledigt",
    doneLabel: "Erledigt",
    steps: [
      { title: "Konto erstellen", body: "Geben Sie Ihre E-Mail-Adresse ein und wählen Sie ein Passwort." },
      { title: "E-Mail bestätigen", body: "Klicken Sie auf den Link, den wir Ihnen geschickt haben." },
      { title: "Tarif wählen", body: "Wählen Sie zwischen Starter, Pro oder Enterprise." },
    ],
  },
  render,
  parameters: {
    docs: {
      description: {
        story: "Every visible and screen-reader string is a prop: `stepLabel`, `completeLabel` and `doneLabel`.",
      },
    },
  },
};

export const WhiteCard: Story = {
  name: "White Card on a Panel",
  render: (args) => ({
    components: { ProgressTracker },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div
        :style="tokenStyles"
        style="max-inline-size: 64rem; padding: 4rem 3.2rem; border-radius: 2.4rem; background: #f4f4f5; --progress-tracker-card-surface: #ffffff; --progress-tracker-label-font-family: ui-monospace, Menlo, monospace;"
      >
        <ProgressTracker v-bind="componentArgs" v-model="args.modelValue" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Token overrides on a wrapper: `--progress-tracker-card-surface: #ffffff` lifts the focus card off a grey panel, and " +
          "`--progress-tracker-label-font-family` sets a monospace header label.",
      },
    },
  },
};

// ─── Stress test ──────────────────────────────────────────────────────────────

const unbroken = "Kontoverifizierungsbestätigungsschreiben".repeat(3);
const longGerman =
  "Bitte bestätigen Sie Ihre E-Mail-Adresse innerhalb von vierundzwanzig Stunden, da der Bestätigungslink danach aus Sicherheitsgründen automatisch ungültig wird.";
const longUrl = "https://example.com/a/very/long/url/without/any/spaces/that/keeps/going/and/going/and/going";

const stressSteps: ProgressTrackerStep[] = [
  { title: unbroken, body: longGerman },
  { title: `${longGerman} ${longGerman}`, body: longUrl },
  { title: "🦄💇‍♀️ Emoji first" },
  { title: "مرحبا بكم في صالوننا", body: "نحن نقدم جميع خدمات الشعر" },
  { title: "<script>alert(1)</script> renders as text", body: "<b>not bold</b>" },
  { title: "A", body: "" },
  ...Array.from({ length: 14 }, (_, i) => ({ title: `Extra step ${i + 7}`, body: i % 2 ? undefined : "Short body." })),
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    modelValue: 1,
    steps: stressSteps,
    stepLabel: "Schritt {current} von insgesamt {total} Schritten im Registrierungsvorgang",
  },
  render: (args) => ({
    components: { ProgressTracker },
    setup() {
      const story = useStorySetup(args);
      return { ...story, unbroken };
    },
    template: `
      <div :style="tokenStyles" style="max-inline-size: 64rem; display: grid; gap: 4.8rem;">
        <ProgressTracker v-bind="componentArgs" v-model="args.modelValue">
          <template #step-1><p style="margin: 0;">Slot content: {{ unbroken }}</p></template>
        </ProgressTracker>
        <ProgressTracker :steps="[]" :model-value="0" />
        <ProgressTracker :steps="[{ title: 'Only step' }]" :model-value="2.5" />
        <ProgressTracker :steps="[{ title: 'First' }, { title: 'Second' }]" :model-value="-1" />
      </div>
    `,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "1400px" },
      description: {
        story:
          "Worst-case data at every canvas width. Check that: the unbroken title, long German copy and URL wrap inside the step instead of " +
          "widening it, and the focus card stays inside the canvas; the long translated header label wraps and the bar drops below it; " +
          "emoji, RTL and HTML-like text render as plain text; a missing or empty body leaves no gap; 20 steps keep their numbers inside the " +
          "indicators. Below it: an empty `steps` array renders nothing, a single step with model 2.5 shows as complete, and model -1 shows " +
          "the first step as current. Try the line clamp controls too: they set CSS tokens, they are not props.",
      },
    },
  },
};
