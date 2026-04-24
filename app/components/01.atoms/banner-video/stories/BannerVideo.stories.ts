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
    depth: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Responsive max-height tier. Each maps to a clamp() scale; override via --theme-banner-video-max-height-{depth}",
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
          "A full-width banner that plays a muted, looping mp4 video. The poster image is shown before the video loads, when the video fails to play, and whenever the user has `prefers-reduced-motion: reduce` set. The banner is sized via `aspect-ratio` with a responsive `max-height` driven by the `depth` tier (`xs` → `xl`). Each tier uses a `clamp()` scale and exposes a `--theme-banner-video-max-height-{depth}` token for consuming pages to override. `objectFit` controls how media fills the frame. `verticalPosition` and `horizontalPosition` control the crop focal point.",
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
    depth: "md",
    aspectRatio: "21/9",
    objectFit: "cover",
    verticalPosition: "center",
    horizontalPosition: "center",
  },
  parameters: {
    docs: {
      description: {
        story: "Default props. The lake video plays muted and looped at a 21/9 aspect ratio with the md depth tier (clamp 28rem → 56rem).",
      },
    },
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    depth: "xs",
    verticalPosition: "end",
  },
  parameters: {
    docs: {
      description: {
        story: "xs depth tier (clamp 12rem → 24rem) — a thin strip banner. verticalPosition: 'end' crops to the bottom of the frame.",
      },
    },
  },
};

export const Shallow: Story = {
  args: {
    ...Default.args,
    depth: "sm",
  },
  parameters: {
    docs: {
      description: {
        story: "sm depth tier (clamp 18rem → 36rem) — a shorter banner suitable for secondary sections.",
      },
    },
  },
};

export const Deep: Story = {
  args: {
    ...Default.args,
    depth: "lg",
    aspectRatio: "21/9",
  },
  parameters: {
    docs: {
      description: {
        story: "lg depth tier (clamp 40rem → 72rem) — a tall cinematic banner with more vertical presence on large screens.",
      },
    },
  },
};

export const Hero: Story = {
  args: {
    ...Default.args,
    depth: "xl",
    aspectRatio: "16/9",
  },
  parameters: {
    docs: {
      description: {
        story: "xl depth tier (clamp 52rem → 90rem) — near full-screen hero. Pair with a 16/9 ratio to maximise coverage.",
      },
    },
  },
};

export const Standard169: Story = {
  args: {
    ...Default.args,
    aspectRatio: "16/9",
    depth: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Standard 16/9 aspect ratio with md depth — matches a typical video's native ratio.",
      },
    },
  },
};
