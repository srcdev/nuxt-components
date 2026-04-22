import BannerVideo from "../BannerVideo.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof BannerVideo> = {
  title: "Atoms/Media/BannerVideo",
  component: BannerVideo,
  argTypes: {
    src: {
      control: "text",
      description: "Path to the mp4 video source file",
      table: { category: "Media" },
    },
    poster: {
      control: "text",
      description: "Path to the fallback/poster image — shown before video loads, on error, and when prefers-reduced-motion is active",
      table: { category: "Media" },
    },
    alt: {
      control: "text",
      description: "Alt text for the fallback image",
      table: { category: "Media" },
    },
    imgWidth: {
      control: { type: "number" },
      description: "Intrinsic width of the poster image — required for NuxtImg optimisation",
      table: { category: "Media" },
    },
    imgHeight: {
      control: { type: "number" },
      description: "Intrinsic height of the poster image — required for NuxtImg optimisation",
      table: { category: "Media" },
    },
    tag: {
      control: "select",
      options: ["section", "div", "header", "main", "article"],
      description: "HTML element rendered as the root",
      table: { category: "Markup" },
    },
    maxHeight: {
      control: "text",
      description: "Maximum height at desktop (≥64em). Defaults to 56rem",
      table: { category: "Layout" },
    },
    maxHeightTablet: {
      control: "text",
      description: "Maximum height at tablet (48em–64em). Falls back to maxHeight when unset",
      table: { category: "Layout" },
    },
    maxHeightMobile: {
      control: "text",
      description: "Maximum height on mobile (<48em). Falls back through tablet → desktop when unset",
      table: { category: "Layout" },
    },
    aspectRatio: {
      control: "text",
      description: "CSS aspect-ratio of the banner container (e.g. '16/9', '21/9', '4/3')",
      table: { category: "Layout" },
    },
    objectFit: {
      control: "select",
      options: ["cover", "contain", "fill", "none", "scale-down"],
      description: "How the video and fallback image fill the banner frame",
      table: { category: "Appearance" },
    },
    verticalPosition: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Vertical crop position — start (top), center, or end (bottom). Maps to align-self on the video and object-position on the fallback image",
      table: { category: "Appearance" },
    },
    horizontalPosition: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Horizontal crop position — start (left), center, or end (right). Maps to object-position on the fallback image",
      table: { category: "Appearance" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A full-width banner that plays a muted, looping mp4 video. The poster image is shown before the video loads, when the video fails to play, and whenever the user has `prefers-reduced-motion: reduce` set. The banner is sized via `aspect-ratio` with per-breakpoint `max-height` caps — no fixed pixel heights. `objectFit` controls how media fills the frame. `verticalPosition` and `horizontalPosition` control the crop focal point — the video uses CSS grid alignment (`align-self`/`justify-self`) while the fallback image uses `object-position`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BannerVideo>;

export const Default: Story = {
  args: {
    src: "/images/banners/video/lake-banner.mp4",
    poster: "/images/banners/video/lake-banner.jpg",
    alt: "A serene lake landscape",
    imgWidth: 1920,
    imgHeight: 1080,
    tag: "section",
    maxHeight: "56rem",
    aspectRatio: "21/9",
    objectFit: "cover",
    verticalPosition: "center",
    horizontalPosition: "center",
  },
  parameters: {
    docs: {
      description: {
        story: "Default props. The lake video plays muted and looped at a 21/9 aspect ratio, capped at 56rem on desktop.",
      },
    },
  },
};

export const Widescreen: Story = {
  args: {
    ...Default.args,
    aspectRatio: "21/9",
    maxHeight: "80rem",
  },
  parameters: {
    docs: {
      description: {
        story: "A wider cinematic crop with a raised maxHeight, giving the banner more vertical presence on large screens.",
      },
    },
  },
};

export const Standard169: Story = {
  args: {
    ...Default.args,
    aspectRatio: "16/9",
    maxHeight: "56rem",
  },
  parameters: {
    docs: {
      description: {
        story: "Standard 16/9 aspect ratio — matches a typical video's native ratio, so objectPosition has minimal visible effect unless the frame is very narrow.",
      },
    },
  },
};

export const ShortBanner: Story = {
  args: {
    ...Default.args,
    maxHeight: "32rem",
    verticalPosition: "end",
  },
  parameters: {
    docs: {
      description: {
        story: "A shallower banner capped at 32rem. verticalPosition: 'end' shifts the crop to show the bottom of the frame.",
      },
    },
  },
};

export const FullViewportHeight: Story = {
  args: {
    ...Default.args,
    maxHeight: "100vh",
    aspectRatio: "16/9",
  },
  parameters: {
    docs: {
      description: {
        story: "maxHeight set to 100vh — the banner fills the full viewport height on large screens and aspect-ratio controls height on smaller ones.",
      },
    },
  },
};

export const ResponsiveBreakpoints: Story = {
  args: {
    ...Default.args,
    maxHeight: "56rem",
    maxHeightTablet: "40rem",
    maxHeightMobile: "24rem",
  },
  parameters: {
    docs: {
      description: {
        story: "Per-breakpoint max-height: 56rem desktop, 40rem tablet (≥48em), 24rem mobile (<48em). Resize the viewport to see each cap take effect.",
      },
    },
  },
};
