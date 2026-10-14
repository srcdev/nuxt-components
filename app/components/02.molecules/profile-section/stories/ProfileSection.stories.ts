import { ref } from "vue";
import ProfileSection from "../ProfileSection.vue";
import EyebrowText from "../../../01.atoms/text-blocks/eyebrow-text/EyebrowText.vue";
import HeroText from "../../../01.atoms/text-blocks/hero-text/HeroText.vue";
import SocialIconsList from "../../social-icons-list/SocialIconsList.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { ISocialIcon, MediaCanvas } from "~/types/components";

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
      description: "Profile picture src, alt text and optional intrinsic width/height",
    },
    headerPlacement: {
      control: { type: "inline-radio" },
      options: ["above", "picture-bottom", "picture-top"],
      description: "Where the eyebrow and heading go: above the grid, or over the bottom or top of the picture on a scrim",
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
      alt: "Alex Morgan, hair stylist",
    },
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
          "The layout responds to the component's own width (a container query), not the viewport: it switches to two columns once it is 768px wide. Use the canvas switcher to check each width.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileSection>;

const headerSlots = `
  <template #eyebrowText>
    <EyebrowText tag="p" font-size="medium" text-content="About Alex" :style-class-passthrough="['mb-0']" />
  </template>
  <template #heroText="{ headingId }">
    <HeroText
      :id="headingId"
      tag="h2"
      font-size="title"
      :text-content="[
        { text: 'Your', styleClass: 'normal' },
        { text: 'local hair stylist', styleClass: 'accent' },
        { text: 'in Northtown', styleClass: 'normal' },
      ]"
      :style-class-passthrough="['mb-20']"
    />
  </template>
`;

const infoSlots = `
  <template #profile-info-1>
    <p class="page-body-normal">With over 10 years of experience, Alex brings the salon to you, whether you're at home, in the office, or getting ready for a special occasion.</p>
  </template>
  <template #profile-info-2>
    <p class="page-body-normal location">Based in <span class="highlight">Northtown</span>, covering the surrounding area including <span class="highlight">Eastfield</span> and beyond.</p>
  </template>
  <template #profile-info-3>
    <p class="page-body-normal services">Specialising in <a href="#" class="highlight">cuts</a>, <a href="#" class="highlight">colour</a>, and <a href="#" class="highlight">styling</a> for all hair types.</p>
  </template>
`;

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default — three profile-info blocks with eyebrow and hero text header slots. */
export const Default: Story = {
  render: (args) => ({
    components: { ProfileSection, EyebrowText, HeroText, SocialIconsList },
    setup() {
      return { args };
    },
    template: `
      <ProfileSection v-bind="args">
        ${headerSlots}
        ${infoSlots}
      </ProfileSection>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The second and third blocks show the content hooks: a `.highlight` inside a `.location` element gets the accent colour, and inside a `.services` element the link colour.",
      },
    },
  },
};

/** With profile links — demonstrates the optional profileLinks slot. */
export const WithProfileLinks: Story = {
  name: "With Profile Links",
  render: (args) => ({
    components: { ProfileSection, EyebrowText, HeroText, SocialIconsList },
    setup() {
      return { args };
    },
    template: `
      <ProfileSection v-bind="args">
        ${headerSlots}
        ${infoSlots}
        <template #profileLinks>
          <a href="#">Instagram</a>
          <a href="#">Book now</a>
        </template>
      </ProfileSection>
    `,
  }),
};

const socialIcons: ISocialIcon[] = [
  { networkName: "Facebook", iconName: "logos:facebook", baseHref: "https://www.facebook.com/", profileId: "yourprofile" },
  { networkName: "Instagram", iconName: "logos:instagram-icon", baseHref: "https://www.instagram.com/", profileId: "yourprofile" },
  { networkName: "TikTok", iconName: "logos:tiktok-icon", baseHref: "https://www.tiktok.com/@", profileId: "yourprofile" },
];

/** With social icons — a SocialIconsList in the profileLinks slot. */
export const WithSocialIcons: Story = {
  name: "With Social Icons",
  render: (args) => ({
    components: { ProfileSection, EyebrowText, HeroText, SocialIconsList },
    setup() {
      return { args, socialIcons };
    },
    template: `
      <ProfileSection v-bind="args">
        ${headerSlots}
        ${infoSlots}
        <template #profileLinks>
          <SocialIconsList :items="socialIcons" label="Alex Morgan on social media" />
        </template>
      </ProfileSection>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `profileLinks` slot holding a `SocialIconsList`, right-aligned at the bottom of the info column. Size and space the icons with `--social-icons-list-icon-size` and `--social-icons-list-gap` set on your own wrapper.",
      },
    },
  },
};

// logos:instagram-icon is near-black and vanishes on a dark scheme; mdi:instagram draws in currentColor, so the theme can colour it.
const themedSocialIcons: ISocialIcon[] = socialIcons.map((icon) =>
  icon.networkName === "Instagram" ? { ...icon, iconName: "mdi:instagram" } : icon
);

// Every value is a token set on a styleClassPassthrough class; the --eyebrow-text-* tokens are EyebrowText's own.
const pictureThemes = `
  <component is="style">
    .profile-section.dark-overlay-profile {
      --profile-section-picture-border-radius: 0.4rem;
      --profile-section-picture-header-scrim-colour: #141110;
      --profile-section-picture-header-text-colour: #f3ece4;
      --profile-section-picture-header-eyebrow-colour: #c9a24a;
      --profile-section-picture-header-padding: 3.6rem;
      --profile-section-info-text-colour: #a39a94;
      --profile-section-highlight-colour: #c9a24a;
      --profile-section-link-colour: #e8dfd6;
      --profile-section-link-colour-hover: #c9a24a;
      --social-icons-list-icon-colour: #e8dfd6;
      --eyebrow-text-font-family: "Poppins", sans-serif;
      --eyebrow-text-font-style: normal;
      --eyebrow-text-font-weight: 600;
      --eyebrow-text-letter-spacing: 0.25em;
    }

    .profile-section.light-overlay-profile {
      --profile-section-picture-border-radius: 1.6rem;
      --profile-section-picture-header-scrim-colour: #f7f2ec;
      --profile-section-picture-header-scrim-opacity: 90%;
      --profile-section-picture-header-scrim-solid-stop: 45%;
      --profile-section-picture-header-scrim-target-colour: rgb(247 242 236 / 0);
      --profile-section-picture-header-text-colour: #2b2420;
      --profile-section-picture-header-eyebrow-colour: #9a6b3f;
      --profile-section-picture-header-padding: 3.2rem 3.2rem 6.4rem;
      --profile-section-info-text-colour: #5a514b;
      --profile-section-highlight-colour: #9a6b3f;
      --profile-section-link-colour: #2b2420;
      --profile-section-link-colour-hover: #9a6b3f;
      --social-icons-list-icon-colour: #2b2420;
      --eyebrow-text-font-family: "Poppins", sans-serif;
      --eyebrow-text-font-style: normal;
      --eyebrow-text-font-weight: 600;
      --eyebrow-text-letter-spacing: 0.25em;
    }
  </component>
`;

const pictureHeaderRender = (themeClass: string, background: string): Story["render"] => (args) => ({
  components: { ProfileSection, EyebrowText, HeroText, SocialIconsList },
  setup() {
    return { args, themedSocialIcons, themeClass };
  },
  template: `
    ${pictureThemes}
    <div style="padding: 2.4rem; background: ${background};">
      <ProfileSection v-bind="args" :style-class-passthrough="[themeClass]">
        <template #eyebrowText>
          <EyebrowText tag="p" font-size="medium" text-content="About Alex" :style-class-passthrough="['mb-0']" />
        </template>
        <template #heroText="{ headingId }">
          <HeroText :id="headingId" tag="h2" font-size="heading" :text-content="[{ text: 'Alex Morgan', styleClass: 'normal' }]" />
        </template>
        ${infoSlots}
        <template #profileLinks>
          <SocialIconsList :items="themedSocialIcons" label="Alex Morgan on social media" />
        </template>
      </ProfileSection>
    </div>
  `,
});

/** Header in picture, dark — eyebrow and heading at the bottom of the image, on a dark scrim. */
export const HeaderInPictureDark: Story = {
  name: "Header In Picture (Dark, Bottom)",
  args: {
    tag: "section",
    headerPlacement: "picture-bottom",
  },
  render: pictureHeaderRender("dark-overlay-profile", "#121010"),
  parameters: {
    docs: {
      description: {
        story:
          "With `header-placement=\"picture-bottom\"`, the eyebrow and heading sit at the bottom of the picture on a scrim, like ServicesCard's `titles-within-image-wrapper`. A long header grows the frame rather than being clipped. " +
          "Every value is a token set on a class added with `styleClassPassthrough`: `--profile-section-picture-header-*` for the scrim and header, `--profile-section-info-text-colour` and the highlight/link tokens for the info column, and EyebrowText's own `--eyebrow-text-*` tokens. Instagram uses `mdi:instagram` coloured with `--social-icons-list-icon-colour`, since `logos:instagram-icon` is near-black and vanishes here. Switch `headerPlacement` in Controls to move the header to the top.",
      },
    },
  },
};

/** Header in picture, light — eyebrow and heading at the top of the image, on a light scrim. */
export const HeaderInPictureLight: Story = {
  name: "Header In Picture (Light, Top)",
  args: {
    tag: "section",
    headerPlacement: "picture-top",
    profilePicture: {
      src: "/images/services/lowlights-1.webp",
      alt: "Alex Morgan, hair stylist",
      width: 828,
      height: 958,
    },
  },
  render: pictureHeaderRender("light-overlay-profile", "#fbf8f4"),
  parameters: {
    docs: {
      description: {
        story:
          "With `header-placement=\"picture-top\"`, the header sits at the top of the picture and the scrim fades downward. A light scrim colour needs a dark `--profile-section-picture-header-text-colour`; browsers with `contrast-color()` pick one automatically, but setting it keeps older browsers right too. The photo's top edge is a cream ceiling beam, so the cream scrim reads as part of the image: it stays solid for the first 45% (behind the text), then fades into `--profile-section-picture-header-scrim-target-colour`, a fully transparent version of the same cream, so it thins out into the pale background without greying. Over a darker photo, set the target to roughly the photo's colour where the fade ends. The extra end padding gives the fade room below the text.",
      },
    },
  },
};

/** With block headings — each profile-info block has its own h3 title. */
export const WithBlockHeadings: Story = {
  name: "With Block Headings",
  args: {
    tag: "section",
  },
  render: (args) => ({
    components: { ProfileSection, EyebrowText, HeroText, SocialIconsList },
    setup() {
      return { args, socialIcons };
    },
    template: `
      <component is="style">
        .profile-section.block-headings-profile {
          --profile-section-info-block-gap: 3.2rem;

          .about-block-heading {
            margin-block: 0 0.8rem;
          }

          .profile-section-info-block p {
            margin: 0;
          }
        }
      </component>
      <ProfileSection v-bind="args" :style-class-passthrough="['block-headings-profile']">
        ${headerSlots}
        <template #profile-info-1>
          <h3 class="page-heading-4 about-block-heading">Experience</h3>
          <p class="page-body-normal">With over 10 years of experience, Alex brings the salon to you, whether you're at home, in the office, or getting ready for a special occasion.</p>
        </template>
        <template #profile-info-2>
          <h3 class="page-heading-4 about-block-heading">Where Alex works</h3>
          <p class="page-body-normal location">Based in <span class="highlight">Northtown</span>, covering the surrounding area including <span class="highlight">Eastfield</span> and beyond.</p>
        </template>
        <template #profile-info-3>
          <h3 class="page-heading-4 about-block-heading">Services</h3>
          <p class="page-body-normal services">Specialising in <a href="#" class="highlight">cuts</a>, <a href="#" class="highlight">colour</a>, and <a href="#" class="highlight">styling</a> for all hair types.</p>
        </template>
        <template #profileLinks>
          <SocialIconsList :items="socialIcons" label="Alex Morgan on social media" />
        </template>
      </ProfileSection>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Each `profile-info-N` slot is free-form, so a block can carry its own heading. Use `h3` under the section's `h2` to keep the heading order. The headings use the `page-heading-4` typography class, and the spacing is set in a consumer stylesheet on a class added with `styleClassPassthrough`, plus `--profile-section-info-block-gap` between blocks.",
      },
    },
  },
};

/** No header slots — the header element is not rendered at all. */
export const WithoutHeader: Story = {
  name: "Without Header Slots",
  render: (args) => ({
    components: { ProfileSection, EyebrowText, HeroText, SocialIconsList },
    setup() {
      return { args };
    },
    template: `
      <ProfileSection v-bind="args">
        ${infoSlots}
      </ProfileSection>
    `,
  }),
};

/** Section tag — renders the root as a labelled section landmark. */
export const AsSectionTag: Story = {
  name: "As section Tag",
  args: {
    tag: "section",
  },
  render: (args) => ({
    components: { ProfileSection, EyebrowText, HeroText, SocialIconsList },
    setup() {
      return { args };
    },
    template: `
      <ProfileSection v-bind="args">
        ${headerSlots}
        ${infoSlots}
      </ProfileSection>
    `,
  }),
};

/** Narrow canvas — the same section stacked into one column. */
export const NarrowContainer: Story = {
  name: "Narrow Container",
  render: Default.render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story: "At mobile width the picture stacks above the info column.",
      },
    },
  },
};

const unbroken = "Pneumonoultramicroscopicsilicovolcanoconiosis".repeat(3);
const longGerman =
  "Mit über zehn Jahren Berufserfahrung als mobile Friseurmeisterin bringt Alex den Salon direkt zu Ihnen nach Hause, ins Büro oder zur Hochzeitsvorbereitung, Donaudampfschifffahrtsgesellschaftskapitänsmütze inklusive.";

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    tag: "section",
    profilePicture: {
      src: "/images/does-not-exist.jpg",
      alt: "<b>Broken image</b> with HTML-like alt text that is also rather long",
      width: -1,
      height: 0,
    },
  },
  render: (args) => ({
    components: { ProfileSection, EyebrowText, HeroText, SocialIconsList },
    setup() {
      return { args, unbroken, longGerman };
    },
    template: `
      <ProfileSection v-bind="args">
        <template #eyebrowText>
          <EyebrowText tag="p" font-size="large" :text-content="unbroken" :style-class-passthrough="['mb-0']" />
        </template>
        <template #heroText="{ headingId }">
          <HeroText :id="headingId" tag="h2" font-size="title" :text-content="[{ text: longGerman, styleClass: 'normal' }]" />
        </template>
        <template #profile-info-12>
          <p class="page-body-normal">Slot 12 (should render last, after 2)</p>
        </template>
        <template #profile-info-2>
          <p class="page-body-normal location">Covering <span class="highlight">{{ unbroken }}</span> and https://example.com/a/very/long/url/without/any/spaces/that/keeps/going/and/going</p>
        </template>
        <template #profile-info-1>
          <p class="page-body-normal">{{ longGerman }} {{ longGerman }}</p>
          <p class="page-body-normal" dir="rtl">مرحبا بكم في صالوننا، نحن نقدم جميع خدمات الشعر 🦄💇‍♀️</p>
          <p class="page-body-normal">&lt;script&gt;alert(1)&lt;/script&gt; renders as text</p>
        </template>
        <template #profileLinks>
          <a v-for="n in 12" :key="n" href="#">Link number {{ n }}</a>
          <a href="#">{{ unbroken }}</a>
        </template>
      </ProfileSection>
      <ProfileSection v-bind="args" header-placement="picture-bottom" :profile-picture="{ src: '/images/services/service-colour.jpg', alt: 'Header within picture' }" style="margin-block-start: 4.8rem;">
        <template #eyebrowText>
          <EyebrowText tag="p" font-size="medium" :text-content="unbroken" :style-class-passthrough="['mb-0']" />
        </template>
        <template #heroText="{ headingId }">
          <HeroText :id="headingId" tag="h2" font-size="title" :text-content="[{ text: longGerman + ' ' + longGerman, styleClass: 'normal' }]" />
        </template>
        <template #profile-info-1>
          <p class="page-body-normal">The header above is long enough to overflow the 3:4 frame: the frame should grow to fit it, not clip it.</p>
        </template>
      </ProfileSection>
    `,
  }),
  parameters: {
    // Fixed showcase: hardcoded values, so Controls would do nothing here.
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Hostile content: a broken image with an invalid width and height and a long HTML-like alt, an unbroken eyebrow, a long German heading, " +
          "info slots given out of order with a gap (1, 2, 12), unbroken words and a long URL inside a `.location .highlight`, right-to-left text with emoji, " +
          "and a dozen profile links plus an unbroken one. Check at every canvas width that nothing overflows the dashed outline, the picture column " +
          "never pushes the info column off-screen, the info blocks render in numeric order, the links wrap, and the broken image keeps its 3:4 frame. " +
          "The second section puts an oversized header within the picture: the frame should grow taller than 3:4 to fit it, with nothing clipped.",
      },
    },
  },
};
