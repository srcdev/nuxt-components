import SocialIconsList from "../SocialIconsList.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { ISocialIcon } from "~/types/components/social-icons-list.d";

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
        "Array of social network items. Each item requires networkName, iconName (Iconify logos: collection), baseHref, and profileId.",
    },
    label: {
      control: "text",
      description: "aria-label for the list element",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    items: sampleItems,
    label: "Social media profiles",
    styleClassPassthrough: ["m-40"],
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
    template: `<SocialIconsList v-bind="args" style="--theme-social-icon-size: 4rem;" />`,
  }),
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
        profileId: "luxurylocs",
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
