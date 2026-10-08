import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import AlertContent from "../AlertContent.vue";
import InputButton from "../../../05.forms/input-button/InputButton.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

type LineClamp = "none" | "1" | "2" | "3" | "4";

// Story-only args: drive CSS tokens, not AlertContent props. See their argTypes entries.
type StoryArgs = InstanceType<typeof AlertContent>["$props"] & {
  titleLineClamp: LineClamp;
  textLineClamp: LineClamp;
};

const lineClampArgType = (token: string, example: string) => ({
  control: "select" as const,
  options: ["none", "1", "2", "3", "4"] satisfies LineClamp[],
  description:
    `**Story control, not a prop.** Sets the \`${token}\` CSS token on a wrapper so you can try it here. ` +
    `To use it in an app, set the token in your own CSS, e.g. \`.site-notice { ${token}: ${example}; }\`. ` +
    "`1` is single-line ellipsis, `none` (the default) shows everything. Don't clamp messages people need to read in full.",
  table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
});

const meta: Meta<StoryArgs> = {
  title: "Molecules/AlertContent",
  component: AlertContent,
  argTypes: {
    titleLineClamp: lineClampArgType("--alert-content-title-line-clamp", "1"),
    textLineClamp: lineClampArgType("--alert-content-text-line-clamp", "3"),
    theme: {
      control: { type: "inline-radio" },
      options: ["info", "success", "warning", "error"],
      description: "Semantic theme — controls the accent colour and default icon",
      table: { category: "Appearance" },
    },
    customIcon: {
      control: "text",
      description: "Iconify icon name to override the default theme icon",
      table: { category: "Appearance" },
    },
    showIcon: {
      control: "boolean",
      description: "Render the theme icon column",
      table: { category: "Appearance" },
    },
    dismissible: {
      control: "boolean",
      description: "Show a close button (emits 'dismiss' on click)",
      table: { category: "Behaviour" },
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
      table: { category: "Styling" },
    },
    contentId: { table: { disable: true } },
    ariaLive: { table: { disable: true } },
  },
  args: {
    theme: "info",
    showIcon: true,
    dismissible: false,
    titleLineClamp: "none",
    textLineClamp: "none",
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

// Links open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const toastNote = `
  <p style="${storyNoteStyle}">
    To see the dismiss action and auto-dismiss in context, open the
    <a href="/?path=/story/molecules-displaytoast--default" target="_top">DisplayToast</a> and
    <a href="/?path=/story/molecules-displaytoastprovider--default" target="_top">DisplayToastProvider</a> stories.
  </p>
`;
const cookieNote = `
  <p style="${storyNoteStyle}">
    For the #actions slot wired up to real accept and reject handlers, open the
    <a href="/?path=/story/molecules-cookieconsentbanner--default" target="_top">CookieConsentBanner</a> story.
  </p>
`;

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => {
    const { titleLineClamp: _titleLineClamp, textLineClamp: _textLineClamp, ...rest } = args;
    return rest;
  });
  const tokenStyles = computed(() => ({
    "--alert-content-title-line-clamp": args.titleLineClamp,
    "--alert-content-text-line-clamp": args.textLineClamp,
  }));
  return { args, componentArgs, tokenStyles };
}

/** Default — info theme with title and body content. */
export const Default: Story = {
  render: (args) => ({
    components: { AlertContent },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div :data-theme="args.theme" :style="tokenStyles" style="max-width: 600px; padding: 2rem;">
        ${toastNote}
        <AlertContent v-bind="componentArgs">
          <template #title>Alert title</template>
          <template #content>This is the alert body. It describes what happened and what the user should do next.</template>
        </AlertContent>
      </div>
    `,
  }),
};

/** Dismissible — renders the close button and demonstrates the dismiss emit. */
export const Dismissible: Story = {
  args: { theme: "info", dismissible: true },
  render: (args) => ({
    components: { AlertContent },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div :data-theme="args.theme" :style="tokenStyles" style="max-width: 600px; padding: 2rem;">
        ${toastNote}
        <AlertContent v-bind="componentArgs">
          <template #title>Dismissible alert</template>
          <template #content>Click the close button to emit the dismiss event.</template>
        </AlertContent>
      </div>
    `,
  }),
};

/** Title only — no body content slot. */
export const TitleOnly: Story = {
  name: "Title Only",
  args: { theme: "success" },
  render: (args) => ({
    components: { AlertContent },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div :data-theme="args.theme" :style="tokenStyles" style="max-width: 600px; padding: 2rem;">
        ${toastNote}
        <AlertContent v-bind="componentArgs">
          <template #title>Your changes have been saved.</template>
        </AlertContent>
      </div>
    `,
  }),
};

/** Custom icon — overrides the default theme icon via the customIcon prop. */
export const CustomIcon: Story = {
  name: "Custom Icon",
  args: { theme: "info", customIcon: "akar-icons:star" },
  render: (args) => ({
    components: { AlertContent },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div :data-theme="args.theme" :style="tokenStyles" style="max-width: 600px; padding: 2rem;">
        ${toastNote}
        <AlertContent v-bind="componentArgs">
          <template #title>Custom icon via prop</template>
          <template #content>The icon is overridden using the customIcon prop.</template>
        </AlertContent>
      </div>
    `,
  }),
};

/** All themes — all four semantic variants stacked. */
export const AllThemes: Story = {
  name: "All Themes",
  render: () => ({
    components: { AlertContent },
    setup() {
      return { themes: ["info", "success", "warning", "error"] as const };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.6rem; max-width: 600px; padding: 2rem;">
        ${toastNote}
        <div v-for="theme in themes" :key="theme" :data-theme="theme">
          <AlertContent :theme="theme" :dismissible="true">
            <template #title>{{ theme.charAt(0).toUpperCase() + theme.slice(1) }}</template>
            <template #content>This is the {{ theme }} variant of the AlertContent component.</template>
          </AlertContent>
        </div>
      </div>
    `,
  }),
};

/** Actions — a row of buttons under the message, e.g. for a consent or confirm prompt. */
export const WithActions: Story = {
  name: "With Actions",
  args: { theme: "info", customIcon: "material-symbols:cookie-outline" },
  render: (args) => ({
    components: { AlertContent, InputButton },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div :data-theme="args.theme" :style="tokenStyles" style="max-width: 600px; padding: 2rem;">
        ${cookieNote}
        <AlertContent v-bind="componentArgs">
          <template #title>Cookies</template>
          <template #content>This site uses cookies to understand how it's used. You can accept or reject them.</template>
          <template #actions>
            <InputButton type="button" variant="tertiary" button-text="Reject" />
            <InputButton type="button" variant="primary" button-text="Accept" />
          </template>
        </AlertContent>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "For the slot wired to real handlers, see the [CookieConsentBanner](?path=/story/molecules-cookieconsentbanner--default) story. " +
          "The #actions slot renders a wrapping row under the message, outside the aria-live/contentId body so the buttons aren't announced or pulled into aria-describedby. Actions are right-aligned by default (--alert-content-actions-justify). The cookie icon comes from customIcon; set showIcon to false to drop the icon column.",
      },
    },
  },
};

const stressAlerts = [
  {
    key: "german",
    theme: "error",
    dismissible: true,
    title: "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft",
    content:
      "Ihre Zahlung konnte leider nicht verarbeitet werden. Bitte überprüfen Sie Ihre Kartendaten und versuchen Sie es erneut, oder wenden Sie sich an Ihre Bank. https://example.com/zahlungen/fehler/a-very-long-path-segment-without-any-spaces-at-all-in-it",
    actions: ["Zahlungsinformationenaktualisierung", "Kundendienstmitarbeiterkontaktaufnahme"],
  },
  {
    key: "emoji-html",
    theme: "warning",
    dismissible: true,
    title: "🚨🔥 Heads up <script>alert('xss')</script>",
    content: "<b>Not bold</b> &amp; <img src=x onerror=alert(1)> should all render as plain text. 👍🏽👨‍👩‍👧‍👦",
  },
  {
    key: "rtl",
    theme: "info",
    dir: "rtl",
    dismissible: true,
    title: "تنبيه مهم بخصوص حسابك",
    content: "تم تحديث شروط الخدمة. يرجى مراجعة التغييرات قبل المتابعة لاستخدام الموقع.",
  },
  {
    key: "single-char",
    theme: "success",
    title: "Ok",
  },
  {
    key: "broken-icon-empty-title",
    theme: "info",
    customIcon: "not-a-real-set:missing-icon",
    title: "",
    content: "Broken customIcon name and an empty title slot.",
  },
  {
    key: "content-only-no-icon",
    theme: "success",
    showIcon: false,
    content: "x",
  },
];

/**
 * Stress test — hostile content across several alerts, inside the CanvasSwitcher so it can be
 * checked at every width.
 */
export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: { titleLineClamp: "none", textLineClamp: "none" },
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "mobileCanvas");
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
  render: (args) => ({
    components: { AlertContent, InputButton },
    setup() {
      return { ...useStorySetup(args), stressAlerts };
    },
    template: `
      <div :style="tokenStyles" style="display: grid; gap: 1.6rem;">
        ${toastNote}
        <div v-for="alert in stressAlerts" :key="alert.key" :data-theme="alert.theme" :dir="alert.dir">
          <AlertContent
            :theme="alert.theme"
            :custom-icon="alert.customIcon"
            :show-icon="alert.showIcon ?? true"
            :dismissible="alert.dismissible ?? false"
          >
            <template v-if="alert.title !== undefined" #title>{{ alert.title }}</template>
            <template v-if="alert.content" #content>{{ alert.content }}</template>
            <template v-if="alert.actions" #actions>
              <InputButton
                v-for="label in alert.actions"
                :key="label"
                type="button"
                variant="primary"
                :button-text="label"
              />
            </template>
            <template v-if="alert.dir === 'rtl'" #dismissLabel>إغلاق</template>
          </AlertContent>
        </div>
      </div>
    `,
  }),
  parameters: {
    layout: "fullscreen",
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Hostile content: an unbroken German compound as the title, long German copy ending in a long URL, long German button labels, " +
          "emoji at the start, HTML-like text (must render as text), right-to-left Arabic, a two-character title, an empty title slot, " +
          "a broken customIcon name, and a one-character message with no icon. Check at every CanvasSwitcher width that nothing overflows " +
          "or gets clipped by the alert's rounded edge, unbroken text wraps, the action buttons wrap their labels instead of spilling out, " +
          "the icon and dismiss button keep their size, and the RTL alert puts the accent stripe on the right. " +
          "The two line-clamp controls are CSS tokens (story only), not props: try `1` to see single-line ellipsis.",
      },
    },
  },
};
