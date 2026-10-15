import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import StorybookComponent from "../CookieConsentBanner.vue";

export default {
  title: "Molecules/CookieConsentBanner",
  component: StorybookComponent,
  argTypes: {
    theme: {
      control: { type: "inline-radio" },
      options: ["info", "success", "warning", "error"],
      description: "Semantic theme for the banner's accent border/accept button",
      table: { category: "Appearance" },
    },
    icon: {
      control: "text",
      description: "Iconify name for the alert icon",
      table: { category: "Appearance" },
    },
    showIcon: {
      control: "boolean",
      description: "Render the icon column",
      table: { category: "Appearance" },
    },
    acceptLabel: {
      control: "text",
      description: "Accept button text",
      table: { category: "Content" },
    },
    rejectLabel: {
      control: "text",
      description: "Reject button text",
      table: { category: "Content" },
    },
    ariaLabel: {
      control: "text",
      description: "Accessible name for the banner region",
      table: { category: "Accessibility" },
    },
    styleClassPassthrough: {
      control: { type: "object" },
      description: "Extra classes applied to the banner root",
      table: { category: "Styling" },
    },
  },
  args: {
    theme: "info",
    ariaLabel: "Cookie consent",
    acceptLabel: "Accept",
    rejectLabel: "Reject",
    icon: "material-symbols:cookie-outline",
    showIcon: true,
    styleClassPassthrough: [],
  },
  parameters: {
    // Own iframe on the Docs page: the banner is fixed to the viewport.
    docs: {
      story: { inline: false, height: "400px" },
      description: {
        // Drives itself from the real useCookieConsent()/useCookie() state, so
        // once accepted/rejected in this browser it stays hidden across story
        // reloads. Each story below has "Show banner again" (resets state
        // in-place) and "Delete cookie" (clears document.cookie directly, for
        // verifying the cookie itself is actually gone, e.g. in devtools).
        component:
          "Fixed, non-modal cookie consent banner built on AlertContent, with Accept/Reject InputButtons wired to useCookieConsent(). " +
          "Copy comes from the title and message slots and the acceptLabel, rejectLabel and ariaLabel props; theme, icon and showIcon set the look. " +
          "It reads/writes a real 'privacy-notice-consent' cookie, so use the story's reset controls to bring the banner back.",
      },
    },
  },
} as Meta<typeof StorybookComponent>;

// Resets the same "privacy-notice-consent" cookie useCookieConsent() reads, so the
// banner's status goes back to "unset" and reappears without a page reload
// (Nuxt dedupes useCookie() by key, so this shares the ref CookieConsentBanner
// itself reads).
function useResetConsent() {
  const consentCookie = useCookie<"granted" | "denied" | null>("privacy-notice-consent");
  const showAgain = () => {
    consentCookie.value = null;
  };
  // Belt-and-braces alongside showAgain(): clears the actual browser cookie
  // rather than just the in-memory ref, so devtools/Application tab reflects
  // it too, not only the story's live re-render.
  const deleteCookie = () => {
    document.cookie = "privacy-notice-consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    consentCookie.value = null;
  };
  return { showAgain, deleteCookie };
}

const Template: StoryFn<typeof StorybookComponent> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const { showAgain, deleteCookie } = useResetConsent();
    return { args, showAgain, deleteCookie };
  },
  template: `
    <div style="padding: 2rem; min-height: 240px; position: relative;">
      <button type="button" @click="showAgain">Show banner again</button>
      <button type="button" @click="deleteCookie" style="margin-inline-start: 0.8rem;">Delete cookie</button>
      <StorybookComponent :theme="args.theme" :icon="args.icon" :show-icon="args.showIcon" :aria-label="args.ariaLabel" :accept-label="args.acceptLabel" :reject-label="args.rejectLabel" :style-class-passthrough="args.styleClassPassthrough">
        <template #message>This site uses cookies for analytics. You can accept or reject them.</template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const CustomCopy: StoryFn<typeof StorybookComponent> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const { showAgain, deleteCookie } = useResetConsent();
    return { args, showAgain, deleteCookie };
  },
  template: `
    <div style="padding: 2rem; min-height: 240px; position: relative;">
      <button type="button" @click="showAgain">Show banner again</button>
      <button type="button" @click="deleteCookie" style="margin-inline-start: 0.8rem;">Delete cookie</button>
      <StorybookComponent :theme="args.theme" :icon="args.icon" :show-icon="args.showIcon" :aria-label="args.ariaLabel" :accept-label="args.acceptLabel" :reject-label="args.rejectLabel">
        <template #title>Your privacy</template>
        <template #message>We use cookies to understand traffic to this site. No personal data is sold.</template>
      </StorybookComponent>
    </div>
  `,
});
CustomCopy.args = { acceptLabel: "Allow cookies", rejectLabel: "No thanks" };

const stressCases = {
  german: {
    title: "Datenschutzeinstellungen",
    message:
      "Diese Website verwendet Cookies, um zu verstehen, wie sie genutzt wird, und um Ihnen ein besseres Erlebnis zu bieten. Weitere Informationen finden Sie in unserer Datenschutzerklärung.",
    acceptLabel: "Alle Cookies akzeptieren und fortfahren",
    rejectLabel: "Alle nicht notwendigen Cookies ablehnen",
    dir: "ltr",
  },
  unbroken: {
    title: "Datenschutzgrundverordnungskonformitätsbestätigungseinstellungen",
    message: "https://example.com/a-very-long-path-segment-without-any-spaces-at-all-in-it/privacy-and-cookie-policy",
    acceptLabel: "Cookieeinwilligungsbestätigung",
    rejectLabel: "Cookieeinwilligungsablehnung",
    dir: "ltr",
  },
  emojiHtml: {
    title: "🍪 <strong>Cookies</strong>",
    message: "<script>alert('xss')</script> We use cookies 🍪🍪🍪 & <em>similar</em> technologies.",
    acceptLabel: "✅ <b>Yes</b>",
    rejectLabel: "❌ <i>No</i>",
    dir: "ltr",
  },
  rtl: {
    title: "ملفات تعريف الارتباط",
    message: "يستخدم هذا الموقع ملفات تعريف الارتباط لفهم كيفية استخدامه. يمكنك قبولها أو رفضها.",
    acceptLabel: "قبول",
    rejectLabel: "رفض",
    dir: "rtl",
  },
  minimal: {
    title: "",
    message: "C",
    acceptLabel: "✓",
    rejectLabel: "✗",
    dir: "ltr",
  },
} as const;

type StressCase = keyof typeof stressCases;

export const StressTest: StoryFn<typeof StorybookComponent> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const { showAgain, deleteCookie } = useResetConsent();
    const copy = computed(() => stressCases[(args as { stressCase?: StressCase }).stressCase ?? "german"]);
    return { args, copy, showAgain, deleteCookie };
  },
  template: `
    <div style="padding: 2rem; min-height: 320px; position: relative;">
      <button type="button" @click="showAgain">Show banner again</button>
      <button type="button" @click="deleteCookie" style="margin-inline-start: 0.8rem;">Delete cookie</button>
      <StorybookComponent :theme="args.theme" :icon="args.icon" :show-icon="args.showIcon" :aria-label="args.ariaLabel" :accept-label="copy.acceptLabel" :reject-label="copy.rejectLabel" :style-class-passthrough="args.styleClassPassthrough">
        <template #title><span :dir="copy.dir">{{ copy.title }}</span></template>
        <template #message><span :dir="copy.dir">{{ copy.message }}</span></template>
      </StorybookComponent>
    </div>
  `,
});
StressTest.storyName = "Stress Test (Worst-Case Data)";
StressTest.argTypes = {
  stressCase: {
    name: "Stress case",
    control: { type: "select" },
    options: Object.keys(stressCases),
    description:
      "**Story control, not a prop.** Picks which worst-case copy fills the title and message slots and the acceptLabel/rejectLabel props (overriding their controls).",
    table: { category: "Story only" },
  },
} as Meta<typeof StorybookComponent>["argTypes"];
StressTest.args = { stressCase: "german" } as typeof StressTest.args;
StressTest.parameters = {
  docs: {
    story: { inline: false, height: "480px" },
    description: {
      story:
        "Hostile slot content, switched with the Stress case control: long German copy and button labels, an unbroken compound title " +
        "with a long URL as the message and unbroken button labels, emoji and HTML-like text (must render as text, never as markup), " +
        "right-to-left Arabic, and a minimal case with an empty title and one-character copy. The banner is fixed to the viewport, so " +
        "use Storybook's viewport toolbar (not a canvas width) to check narrow screens. Check that the banner stays inside the gutter " +
        "and caps at 64rem, unbroken text wraps instead of being clipped (including inside the buttons), and the buttons wrap onto " +
        "their own lines rather than overflowing.",
    },
  },
};
