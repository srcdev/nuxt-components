import { ref } from "vue";
import SocialIconsList from "../SocialIconsList.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { ISocialIcon } from "~/types/components/social-icons-list.d";
import type { MediaCanvas } from "~/types/components";
import "./social-icons-list-recipes.css";

const sampleItems: ISocialIcon[] = [
  {
    networkName: "Facebook",
    iconName: "logos:facebook",
    baseHref: "https://www.facebook.com/",
    profileId: "yourprofile",
  },
  {
    networkName: "X (Twitter)",
    iconName: "logos:x",
    baseHref: "https://x.com/",
    profileId: "yourhandle",
  },
  {
    networkName: "Instagram",
    iconName: "logos:instagram-icon",
    baseHref: "https://www.instagram.com/",
    profileId: "yourprofile",
  },
  {
    networkName: "YouTube",
    iconName: "logos:youtube-icon",
    baseHref: "https://www.youtube.com/@",
    profileId: "yourchannel",
  },
  {
    networkName: "TikTok",
    iconName: "logos:tiktok-icon",
    baseHref: "https://www.tiktok.com/@",
    profileId: "yourprofile",
  },
];

const meta: Meta<typeof SocialIconsList> = {
  title: "Molecules/SocialIconsList",
  component: SocialIconsList,
  argTypes: {
    items: {
      control: "object",
      description:
        "Array of social network items. Each item needs networkName, iconName (any Iconify icon), baseHref and profileId; the link is baseHref + profileId. Items whose href isn't http(s), mailto, tel or site-relative are skipped.",
    },
    label: {
      control: "text",
      description: "aria-label for the list element",
    },
    linkLabelTemplate: {
      control: "text",
      description: "aria-label for each link; {network} is replaced with the item's networkName",
    },
    showLabel: {
      control: "boolean",
      description: "Show each item's networkName as visible text after the icon (or fill the `label` slot)",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    items: sampleItems,
    label: "Social media profiles",
    linkLabelTemplate: "{network} profile (opens in a new tab)",
    showLabel: false,
    styleClassPassthrough: ["m-40"],
  },
  parameters: {
    docs: {
      description: {
        component:
          "A wrapping row of icon links to social profiles, built from the `items` array (`ISocialIcon`: `networkName`, `iconName`, `baseHref`, `profileId`, optional `label`). " +
          "Links open in a new tab and are named from `linkLabelTemplate` or each item's `label`; `label` names the list; `showLabel` (or the scoped `label` slot) adds visible text, and the scoped `icon` slot replaces the icon. An item's optional `brandColour` is exposed as `--social-icons-list-brand-colour` for recipes. Size, tiles, hover and focus come from `--social-icons-list-*` tokens; the Recipe stories show four alternative looks built only from tokens and consumer CSS.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SocialIconsList>;

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default — all five networks at the standard icon size. */
export const Default: Story = {
  render: (args) => ({
    components: { SocialIconsList },
    setup() {
      return { args };
    },
    template: `<SocialIconsList v-bind="args" />`,
  }),
};

/** Large icons — override icon size via CSS token. */
export const LargeIcons: Story = {
  name: "Large Icons",
  render: (args) => ({
    components: { SocialIconsList },
    setup() {
      return { args };
    },
    template: `<SocialIconsList v-bind="args" style="--social-icons-list-icon-size: 4rem;" />`,
  }),
  parameters: {
    docs: { description: { story: "`--social-icons-list-icon-size: 4rem` set on the component." } },
  },
};

/** Single network — only one item in the list. */
export const SingleNetwork: Story = {
  name: "Single Network",
  args: {
    items: [
      {
        networkName: "Instagram",
        iconName: "logos:instagram-icon",
        baseHref: "https://www.instagram.com/",
        profileId: "yourprofile",
      },
    ],
  },
  render: (args) => ({
    components: { SocialIconsList },
    setup() {
      return { args };
    },
    template: `<SocialIconsList v-bind="args" />`,
  }),
};

const stressItems: ISocialIcon[] = [
  ...sampleItems,
  { networkName: "Instagram", iconName: "logos:instagram-icon", baseHref: "https://www.instagram.com/", profileId: "second-account" },
  {
    networkName: "LinkedIn",
    iconName: "logos:linkedin-icon",
    baseHref: "https://www.linkedin.com/in/",
    profileId: "a-very-long-profile-identifier-without-any-spaces-at-all-in-it-1234567890",
  },
  { networkName: "Pinterest", iconName: "logos:pinterest", baseHref: "https://www.pinterest.com/", profileId: "" },
  { networkName: "Unknown icon", iconName: "logos:this-icon-does-not-exist", baseHref: "https://example.com/", profileId: "x" },
  { networkName: "<script>alert('xss')</script>", iconName: "mdi:web", baseHref: "https://example.com/", profileId: "html" },
  { networkName: "إنستغرام", iconName: "mdi:instagram", baseHref: "https://www.instagram.com/", profileId: "rtl", label: "ملفنا على إنستغرام" },
  { networkName: "Unsafe", iconName: "mdi:alert", baseHref: "javascript:", profileId: "alert(1)" },
  { networkName: "Email", iconName: "mdi:email", baseHref: "mailto:", profileId: "hello@example.com" },
  { networkName: "Phone", iconName: "mdi:phone", baseHref: "tel:", profileId: "+441234567890" },
  ...Array.from({ length: 10 }, (_, i) => ({
    networkName: `Network ${i + 1}`,
    iconName: "mdi:web",
    baseHref: "https://example.com/",
    profileId: `profile-${i + 1}`,
  })),
];

/**
 * Stress test — duplicate networks, unbroken and empty profile IDs, a missing icon, HTML-like and
 * right-to-left names, an unsafe href and twenty-plus items, inside the CanvasSwitcher.
 */
export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    items: stressItems,
    label: "Datenschutzfreundliche Profile in sozialen Netzwerken unseres Unternehmens",
    linkLabelTemplate: "Unser {network}-Profil (öffnet sich in einem neuen Tab)",
    styleClassPassthrough: [],
  },
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
    components: { SocialIconsList },
    setup() {
      return { args };
    },
    template: `<SocialIconsList v-bind="args" />`,
  }),
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Check at every canvas width: the row wraps and never overflows the dashed box. Both Instagram accounts render (they used to share a `:key`). " +
          "The `javascript:` item is skipped, so there's no 'Unsafe' link; mailto and tel links stay. The unknown icon still leaves a 1em focus target; tab through to check the focus ring on every link. " +
          "Inspect the links for the German template, the Arabic `label` override, and the HTML-like name rendered as plain text in its `aria-label`.",
      },
    },
  },
};

// ─── Recipes ─────────────────────────────────────────────────────────────────
// Each look is tokens plus consumer CSS on a passthrough class: see social-icons-list-recipes.css
// and the Recipes section of CONSUMER-STYLING.md.

const brandItems: ISocialIcon[] = [
  { networkName: "Facebook", iconName: "bi:facebook", baseHref: "https://www.facebook.com/", profileId: "yourprofile", brandColour: "#1877f2" },
  { networkName: "X", iconName: "bi:twitter-x", baseHref: "https://x.com/", profileId: "yourhandle", brandColour: "#000000" },
  { networkName: "Instagram", iconName: "bi:instagram", baseHref: "https://www.instagram.com/", profileId: "yourprofile", brandColour: "#e1306c" },
  { networkName: "YouTube", iconName: "bi:youtube", baseHref: "https://www.youtube.com/@", profileId: "yourchannel", brandColour: "#ff0000" },
  { networkName: "TikTok", iconName: "bi:tiktok", baseHref: "https://www.tiktok.com/@", profileId: "yourprofile", brandColour: "#000000" },
];

// Black brand colours vanish on a dark dock, so X and TikTok glow in their light/accent colours there.
const darkBrandItems: ISocialIcon[] = brandItems.map((item) =>
  item.networkName === "X"
    ? { ...item, brandColour: "#ffffff" }
    : item.networkName === "TikTok"
      ? { ...item, brandColour: "#25f4ee" }
      : item
);

const recipeStory = (panelStyle: string, before = ""): Story["render"] => (args) => ({
  components: { SocialIconsList },
  setup() {
    return { args, panelStyle };
  },
  template: `
    <div :style="'display: flex; align-items: center; justify-content: center; gap: 1.6rem; flex-wrap: wrap; min-block-size: 24rem; padding: 4rem 2.4rem; border-radius: 2.4rem; font-family: sans-serif; ' + panelStyle">
      ${before}
      <SocialIconsList v-bind="args" />
    </div>
  `,
});

/** Mono icons on soft tiles; each icon takes its item's brandColour on hover or keyboard focus. */
export const RecipeMonoTiles: Story = {
  name: "Recipe: Mono Tiles",
  args: { items: brandItems, styleClassPassthrough: ["demo-social-mono-tiles"] },
  render: recipeStory("background: #ffffff;"),
  parameters: {
    docs: {
      description: {
        story:
          "Mono `bi:` icons, tile tokens (`--social-icons-list-link-padding`, `-radius`, `-background`, `-background-hover`) and " +
          "`--social-icons-list-icon-colour-hover: var(--social-icons-list-brand-colour)` set on `.social-icons-list-item`.",
      },
    },
  },
};

/** A dark dock around dark tiles; the hovered or focused tile glows in its brand colour. */
export const RecipeDarkDock: Story = {
  name: "Recipe: Dark Dock with Glow",
  args: { items: darkBrandItems, styleClassPassthrough: ["demo-social-dark-dock"] },
  render: recipeStory("background: #16171b;"),
  parameters: {
    docs: {
      description: {
        story:
          "The dock is the list root itself (padding, border, radius and `inline-size: fit-content` on the passthrough class). The glow is " +
          "`--social-icons-list-link-shadow-hover` built from the brand colour with `color-mix()`. X and TikTok use white and cyan here, since black wouldn't show.",
      },
    },
  },
};

/** Visible labels with the icon in a brand-coloured circle. */
export const RecipeLabelledPills: Story = {
  name: "Recipe: Labelled Pills",
  args: { items: brandItems, showLabel: true, styleClassPassthrough: ["demo-social-pills"] },
  render: recipeStory("background: #f5f4f0;"),
  parameters: {
    docs: {
      description: {
        story:
          "`show-label` adds each `networkName` as visible text; the circle is the icon wrapper (`--social-icons-list-icon-wrapper-padding`, `-radius`, " +
          "and `-background` from the brand colour). The links keep their `aria-label`, which contains the visible name (WCAG 2.5.3).",
      },
    },
  },
};

/** Overlapping circles that fan out when the row is hovered or a link has keyboard focus. */
export const RecipeOverlappingStack: Story = {
  name: "Recipe: Overlapping Stack",
  args: { items: brandItems, styleClassPassthrough: ["demo-social-stack"] },
  render: recipeStory(
    "background: #ffffff;",
    `<span style="font-size: 1.6rem; font-weight: 600; color: #4a4b52;">Follow us</span>`
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Negative `margin-inline-start` on every item after the first, reset on `:hover`/`:focus-within` of the list, so keyboard users get the fan-out too " +
          "(no transition under reduced motion). \"Follow us\" is the consumer's own text beside the component, not part of it.",
      },
    },
  },
};

/** The scoped `icon` and `label` slots: custom markup per item. */
export const CustomSlots: Story = {
  name: "Custom Slots",
  args: { items: brandItems, styleClassPassthrough: ["demo-social-pills"] },
  render: (args) => ({
    components: { SocialIconsList },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 4rem 2.4rem; border-radius: 2.4rem; background: #f5f4f0; font-family: sans-serif;">
        <SocialIconsList v-bind="args">
          <template #icon="{ item }">
            <span style="font-size: 0.8em; font-weight: 700; color: #ffffff; line-height: 1;">{{ Array.from(item.networkName)[0] }}</span>
          </template>
          <template #label="{ item }">
            {{ item.networkName }} <small style="font-weight: 400;">@{{ item.profileId }}</small>
          </template>
        </SocialIconsList>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `icon` slot replaces the icon inside the wrapper (here the network's first letter), and the `label` slot replaces the visible text " +
          "(filling it shows the label without `show-label`). Both receive `{ item }`. Slot content sits inside the link, so keep it non-interactive.",
      },
    },
  },
};
