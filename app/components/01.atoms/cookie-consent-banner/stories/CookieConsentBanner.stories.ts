import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../CookieConsentBanner.vue";

export default {
  title: "Atoms/CookieConsentBanner",
  component: StorybookComponent,
  argTypes: {
    theme: {
      control: { type: "inline-radio" },
      options: ["info", "success", "warning", "error"],
      description: "Semantic theme for the banner's accent border/accept button",
      table: { category: "Appearance" },
    },
    styleClassPassthrough: {
      control: { type: "object" },
      description: "Extra classes applied to the banner root",
      table: { category: "Styling" },
    },
  },
  args: {
    theme: "info",
    styleClassPassthrough: [],
  },
  parameters: {
    docs: {
      description: {
        // Drives itself from the real useCookieConsent()/useCookie() state, so
        // once accepted/rejected in this browser it stays hidden across story
        // reloads. Each story below has "Show banner again" (resets state
        // in-place) and "Delete cookie" (clears document.cookie directly, for
        // verifying the cookie itself is actually gone, e.g. in devtools).
        component: "Reads/writes a real 'privacy-notice-consent' cookie via useCookieConsent(). Use the story's reset controls to bring the banner back.",
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
      <StorybookComponent :theme="args.theme" :style-class-passthrough="args.styleClassPassthrough">
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
      <StorybookComponent :theme="args.theme">
        <template #message>We use cookies to understand traffic to this site. No personal data is sold.</template>
        <template #acceptLabel>Allow cookies</template>
        <template #rejectLabel>No thanks</template>
      </StorybookComponent>
    </div>
  `,
});
