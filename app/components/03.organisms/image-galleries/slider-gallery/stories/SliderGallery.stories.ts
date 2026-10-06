import { computed, ref } from "vue";
import SliderGallery from "../SliderGallery.vue";
import CanvasSwitcher from "../../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { IGalleryData, MediaCanvas } from "~/types/components";

type LineClamp = "none" | "1" | "2" | "3" | "4";

// Story-only args: each drives a CSS token, not a SliderGallery prop. See the argTypes entries.
const lineClampTokens = {
  authorLineClamp: { token: "--slider-gallery-author-line-clamp", label: "Author (stylist)", fallback: "none" },
  titleLineClamp: { token: "--slider-gallery-title-line-clamp", label: "Title", fallback: "none" },
  topicLineClamp: { token: "--slider-gallery-topic-line-clamp", label: "Topic (category)", fallback: "none" },
  descriptionLineClamp: { token: "--slider-gallery-description-line-clamp", label: "Description", fallback: "none" },
  thumbnailTitleLineClamp: { token: "--slider-gallery-thumbnail-title-line-clamp", label: "Thumbnail title", fallback: "2" },
  thumbnailDescriptionLineClamp: {
    token: "--slider-gallery-thumbnail-description-line-clamp",
    label: "Thumbnail description",
    fallback: "2",
  },
} as const;

type LineClampArg = keyof typeof lineClampTokens;

type StoryArgs = InstanceType<typeof SliderGallery>["$props"] & Record<LineClampArg, LineClamp>;

const lineClampArgTypes = Object.fromEntries(
  Object.entries(lineClampTokens).map(([arg, { token, label, fallback }]) => [
    arg,
    {
      name: `${label} line clamp`,
      control: "select",
      options: ["none", "1", "2", "3", "4"] satisfies LineClamp[],
      description:
        `**Story control, not a prop.** Sets the \`${token}\` CSS token on a wrapper so you can try it here. ` +
        `To use it in an app, set the token in your own CSS, e.g. \`.hero { ${token}: 2; }\`. ` +
        `\`1\` is single-line ellipsis, \`none\` shows everything.`,
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: fallback } },
    },
  ])
);

const lineClampArgs = Object.fromEntries(
  Object.entries(lineClampTokens).map(([arg, { fallback }]) => [arg, fallback])
) as Record<LineClampArg, LineClamp>;

const meta: Meta<StoryArgs> = {
  title: "Organisms/Image Galleries/Slider Gallery",
  component: SliderGallery,
  argTypes: {
    ...lineClampArgTypes,
    autoRun: {
      control: { type: "boolean" },
      description: "Automatically advance to the next slide",
    },
    autoRunInterval: {
      control: { type: "number", min: 1000, step: 500 },
      description: "Time between auto-advances in milliseconds",
    },
    animationDuration: {
      control: { type: "number", min: 100, step: 100 },
      description: "Slide transition duration in milliseconds",
    },
    ariaLabel: {
      control: { type: "text" },
      description: "aria-label on the carousel region",
    },
    seeMoreText: {
      control: { type: "text" },
      description: "Link text for slides that have an href",
    },
    prevAriaLabel: { control: { type: "text" }, description: "Previous button aria-label" },
    nextAriaLabel: { control: { type: "text" }, description: "Next button aria-label" },
    prevIcon: { control: { type: "text" }, description: "Previous button icon" },
    nextIcon: { control: { type: "text" }, description: "Next button icon" },
    textScrim: {
      control: { type: "boolean" },
      description: "Gradient behind the slide text, matched to each slide's textBrightness",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    ...lineClampArgs,
    autoRun: true,
    autoRunInterval: 7000,
    animationDuration: 3000,
    textScrim: true,
    ariaLabel: "Image gallery",
    seeMoreText: "SEE MORE",
    prevAriaLabel: "Previous image",
    nextAriaLabel: "Next image",
    prevIcon: "ic:outline-keyboard-arrow-left",
    nextIcon: "ic:outline-keyboard-arrow-right",
    styleClassPassthrough: [],
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A full-screen image slider gallery with animated slide transitions, thumbnail navigation, arrow controls, and keyboard support. Gallery data is passed via v-model:galleryData. Auto-advance pauses on hover/focus and is off under reduced motion; slides with an href get a see-more link.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const sampleSlides: IGalleryData[] = [
  {
    src: "https://picsum.photos/seed/gallery1/1920/1080",
    alt: "Mountain landscape at sunrise",
    stylist: "NATURE PHOTOGRAPHY",
    title: "Into the Wild",
    category: "Landscape",
    description: "Vast mountain ranges stretching to the horizon at the golden hour of sunrise.",
    thumbnail: { title: "Into the Wild", description: "Landscape" },
    textBrightness: "light",
    href: "#into-the-wild",
  },
  {
    src: "https://picsum.photos/seed/gallery2/1920/1080",
    alt: "Urban architecture at dusk",
    stylist: "URBAN SERIES",
    title: "City Lights",
    category: "Architecture",
    description: "Modern skyscrapers reflecting the warm hues of the setting sun.",
    thumbnail: { title: "City Lights", description: "Architecture" },
    textBrightness: "light",
    href: "#city-lights",
  },
  {
    src: "https://picsum.photos/seed/gallery3/1920/1080",
    alt: "Ocean waves on a sandy beach",
    stylist: "COASTAL COLLECTION",
    title: "Shoreline",
    category: "Seascape",
    description: "Gentle waves rolling over golden sand as the tide comes in.",
    thumbnail: { title: "Shoreline", description: "Seascape" },
    textBrightness: "light",
  },
  {
    src: "https://picsum.photos/seed/gallery4/1920/1080",
    alt: "Dense forest path in autumn",
    stylist: "FOREST SERIES",
    title: "Through the Trees",
    category: "Nature",
    description: "A winding path through autumn foliage in a dense woodland.",
    thumbnail: { title: "Through the Trees", description: "Nature" },
    textBrightness: "dark",
  },
  {
    src: "https://picsum.photos/seed/gallery5/1920/1080",
    alt: "Snow-capped peaks in winter",
    stylist: "WINTER COLLECTION",
    title: "Frozen Peaks",
    category: "Winter",
    description: "Remote snow-capped summits under a crystal-clear winter sky.",
    thumbnail: { title: "Frozen Peaks", description: "Winter" },
    textBrightness: "light",
  },
];

const longGerman =
  "Donaudampfschifffahrtsgesellschaftskapitänsmützenbandherstellungsbetriebsgenossenschaftsvorsitzender";
const longUrl =
  "https://example.com/a/very/long/path/that/never/breaks/because/it/has/no/spaces/at/all?utm_source=newsletter&utm_medium=email&utm_campaign=autumn-collection-2026-final-final-v3";
const longParagraph =
  "Eine ausgesprochen lange Beschreibung, wie sie ein CMS liefert, wenn niemand die Zeichenanzahl prüft. ".repeat(8);

const stressSlides: IGalleryData[] = [
  {
    src: "https://picsum.photos/seed/stress1/1920/1080",
    alt: "Long German copy in every field",
    stylist: `STYLISTIN ${longGerman.toUpperCase()}`,
    title: `${longGerman} und Freunde`,
    category: "Haarverlängerungen, Strähnchen und vollständige Farbkorrekturen",
    description: longParagraph,
    thumbnail: { title: longGerman, description: longParagraph },
    textBrightness: "light",
    href: longUrl,
  },
  {
    src: "https://picsum.photos/seed/stress2/1920/1080",
    alt: "Emoji and HTML-like text",
    stylist: "💇‍♀️✨ SALON 🎉",
    title: "<script>alert('xss')</script>",
    category: "<b>not bold</b> &amp; &lt;tags&gt;",
    description: "🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈",
    thumbnail: { title: "😀 Emoji first", description: "<img src=x onerror=alert(1)>" },
    textBrightness: "dark",
    href: "#emoji",
  },
  {
    src: "https://picsum.photos/seed/stress3/1920/1080",
    alt: "صورة لصالون تصفيف الشعر",
    stylist: "مصففة الشعر",
    title: "تسريحات شعر جديدة لموسم الخريف",
    category: "تلوين الشعر",
    description: "وصف طويل باللغة العربية يمتد عبر عدة أسطر للتحقق من أن النص من اليمين إلى اليسار يعرض بشكل صحيح.",
    thumbnail: { title: "تسريحات", description: "تلوين الشعر" },
    textBrightness: "light",
  },
  {
    src: "https://example.invalid/this-image-does-not-exist.jpg",
    alt: "Broken image URL: the alt text should show instead",
    stylist: "A",
    title: "B",
    category: "C",
    description: "",
    thumbnail: { title: "", description: "" },
    textBrightness: "dark",
    href: "",
  },
  {
    src: "https://picsum.photos/seed/stress5/1920/1080",
    alt: "",
    textBrightness: "light",
  },
  {
    src: "https://picsum.photos/seed/stress6/1920/1080",
    alt: "Unbroken URL as description",
    title: "Link soup",
    description: longUrl,
    thumbnail: { title: longUrl, description: longUrl },
    textBrightness: "light",
    href: "#link-soup",
  },
  ...Array.from({ length: 24 }, (_, index): IGalleryData => ({
    src: `https://picsum.photos/seed/stress-many-${index}/1920/1080`,
    alt: `Filler slide ${index + 7}`,
    title: `Slide ${index + 7}`,
    thumbnail: { title: `Slide ${index + 7}`, description: "Filler" },
    textBrightness: "light",
  })),
];

// ─── Stories ──────────────────────────────────────────────────────────────────

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() =>
    Object.fromEntries(Object.entries(args).filter(([arg]) => !(arg in lineClampTokens)))
  );
  const tokenStyles = computed(() =>
    Object.fromEntries(
      Object.entries(lineClampTokens).map(([arg, { token }]) => [token, args[arg as LineClampArg]])
    )
  );
  return { componentArgs, tokenStyles };
}

const renderWith = (slides: IGalleryData[]) => (args: StoryArgs) => ({
  components: { SliderGallery },
  setup() {
    const galleryData = ref<IGalleryData[]>(slides);
    return { ...useStorySetup(args), galleryData };
  },
  template: `<div :style="tokenStyles"><SliderGallery v-bind="componentArgs" v-model:gallery-data="galleryData" /></div>`,
});

export const Default: Story = {
  render: renderWith(sampleSlides),
};

export const AutoRunDisabled: Story = {
  name: "Auto-Run Disabled",
  args: {
    autoRun: false,
  },
  render: renderWith(sampleSlides),
  parameters: {
    docs: {
      description: {
        story: "Slides only advance when the user clicks the arrow buttons or uses arrow keys.",
      },
    },
  },
};

export const FastTransition: Story = {
  name: "Fast Transition (500ms)",
  args: {
    animationDuration: 500,
    autoRunInterval: 3000,
  },
  render: renderWith(sampleSlides),
};

export const SlowTransition: Story = {
  name: "Slow Transition (5000ms)",
  args: {
    animationDuration: 5000,
    autoRunInterval: 10000,
  },
  render: renderWith(sampleSlides),
};

export const SingleSlide: Story = {
  name: "Single Slide",
  args: {
    autoRun: false,
  },
  render: renderWith([sampleSlides[0]!]),
  parameters: {
    docs: {
      description: {
        story: "Gallery with only one image — navigation buttons are still rendered.",
      },
    },
  },
};

export const MinimalSlideData: Story = {
  name: "Minimal Slide Data",
  args: {
    autoRun: false,
  },
  render: renderWith([
    { src: "https://picsum.photos/seed/min1/1920/1080", alt: "Image one", textBrightness: "light" },
    { src: "https://picsum.photos/seed/min2/1920/1080", alt: "Image two", textBrightness: "dark" },
    { src: "https://picsum.photos/seed/min3/1920/1080", alt: "Image three", textBrightness: "light" },
  ]),
  parameters: {
    docs: {
      description: {
        story: "Only src, alt, and textBrightness are required — all content overlay fields are optional.",
      },
    },
  },
};

export const EmptyGallery: Story = {
  name: "Empty Gallery",
  render: renderWith([]),
  parameters: {
    docs: {
      description: {
        story: "When galleryData is empty the loading state is dismissed immediately.",
      },
    },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    autoRunInterval: 0,
    loadingText: "Die Galerie wird geladen, bitte haben Sie einen Augenblick Geduld...",
    seeMoreText: "WEITERE INFORMATIONEN ZU DIESEM BEITRAG ANZEIGEN",
    ariaLabel: "",
  },
  render: renderWith(stressSlides),
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
        <div
          :class="canvasName"
          style="position: relative; block-size: 80svh; margin-inline: auto; outline: 1px dashed currentColor; --slider-gallery-width: 100%; --slider-gallery-height: 100%;"
        >
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Deliberately hostile data to find breakage, sized to the canvas with `--slider-gallery-width: 100%` and " +
          "`--slider-gallery-height: 100%`: long German copy and unbroken strings (a 100-character compound word, a long URL) " +
          "in every field including the see-more and loading copy, emoji (including first), HTML-like text (must render as text), " +
          "right-to-left Arabic, a broken image URL (its alt text shows), single characters, empty strings (no empty elements or " +
          "empty link are rendered), a slide with an empty alt and no text, an empty carousel label, and 30 slides. " +
          "`autoRunInterval` is 0: auto-advance is floored to the transition length (minimum 1s), so it keeps cycling rather than " +
          "stalling; try a negative `animationDuration` too. Hover the gallery to pause it while you look. " +
          "Check at every canvas width: no text runs off the slide, thumbnail text stays inside its card (2 lines each by default), " +
          "and the arrows stay usable. Try the line clamp controls too: they set CSS tokens, they are not props.",
      },
    },
  },
};
