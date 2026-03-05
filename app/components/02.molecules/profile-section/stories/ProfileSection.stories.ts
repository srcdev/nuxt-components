import ProfileSection from "../ProfileSection.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ProfileSection> = {
  title: "Molecules/ProfileSection",
  component: ProfileSection,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "HTML element to render as the root",
    },
    profilePicture: {
      control: "object",
      description: "Profile picture src and alt text",
    },
    profileInfoCount: {
      control: { type: "number", min: 1, step: 1 },
      description: "Number of profile-info slot blocks to render",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    tag: "div",
    profilePicture: {
      src: "/images/services/service-balayage.jpg",
      alt: "Natasha — mobile hairdresser in Bath",
    },
    profileInfoCount: 3,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof ProfileSection>;

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default — three profile-info blocks with representative content. */
export const Default: Story = {
  render: (args) => ({
    components: { ProfileSection },
    setup() {
      return { args };
    },
    template: `
      <ProfileSection v-bind="args">
        <template #profile-info-1>
          <div class="experience">
            <p class="page-body-normal">With over 10 years of experience as a mobile hairdresser, Natasha brings the salon to you — whether you're at home, in the office, or getting ready for a special occasion.</p>
          </div>
        </template>
        <template #profile-info-2>
          <div class="location">
            <p class="page-body-normal">Based in <span class="highlight">Bath</span>, covering the surrounding area including Bristol, Frome, and beyond.</p>
          </div>
        </template>
        <template #profile-info-3>
          <div class="services">
            <p class="page-body-normal">Specialising in <a href="#" class="highlight">cuts</a>, <a href="#" class="highlight">colour</a>, and <a href="#" class="highlight">styling</a> for all hair types.</p>
          </div>
        </template>
      </ProfileSection>
    `,
  }),
};

/** With profile links — demonstrates the optional profileLinks slot. */
export const WithProfileLinks: Story = {
  name: "With Profile Links",
  render: (args) => ({
    components: { ProfileSection },
    setup() {
      return { args };
    },
    template: `
      <ProfileSection v-bind="args">
        <template #profile-info-1>
          <div class="experience">
            <p class="page-body-normal">With over 10 years of experience as a mobile hairdresser, Natasha brings the salon to you.</p>
          </div>
        </template>
        <template #profile-info-2>
          <div class="location">
            <p class="page-body-normal">Based in <span class="highlight">Bath</span>, covering the surrounding area including Bristol, Frome, and beyond.</p>
          </div>
        </template>
        <template #profile-info-3>
          <div class="services">
            <p class="page-body-normal">Specialising in <a href="#" class="highlight">cuts</a>, <a href="#" class="highlight">colour</a>, and <a href="#" class="highlight">styling</a> for all hair types.</p>
          </div>
        </template>
        <template #profileLinks>
          <a href="#">Instagram</a>
          <a href="#">Book now</a>
        </template>
      </ProfileSection>
    `,
  }),
};

/** Section tag — renders the root as a semantic section element. */
export const AsSectionTag: Story = {
  name: "As section Tag",
  args: {
    tag: "section",
  },
  render: (args) => ({
    components: { ProfileSection },
    setup() {
      return { args };
    },
    template: `
      <ProfileSection v-bind="args">
        <template #profile-info-1>
          <p class="page-body-normal">Profile information block one.</p>
        </template>
        <template #profile-info-2>
          <p class="page-body-normal">Profile information block two.</p>
        </template>
        <template #profile-info-3>
          <p class="page-body-normal">Profile information block three.</p>
        </template>
      </ProfileSection>
    `,
  }),
};

/** Custom count — renders a different number of profile-info slot blocks. */
export const CustomInfoCount: Story = {
  name: "Custom Profile Info Count",
  args: {
    profileInfoCount: 2,
  },
  render: (args) => ({
    components: { ProfileSection },
    setup() {
      return { args };
    },
    template: `
      <ProfileSection v-bind="args">
        <template #profile-info-1>
          <p class="page-body-normal">First block of information about this person.</p>
        </template>
        <template #profile-info-2>
          <p class="page-body-normal">Second block of information about this person.</p>
        </template>
      </ProfileSection>
    `,
  }),
};
