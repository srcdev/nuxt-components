import SliderGallery from "../SliderGallery.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { IGalleryData } from "../../../../types/components";

const meta: Meta<typeof SliderGallery> = {
  title: "Organisms/Image Galleries/Slider Gallery",
  component: SliderGallery,
  argTypes: {
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
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    autoRun: true,
    autoRunInterval: 7000,
    animationDuration: 3000,
    styleClassPassthrough: [],
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A full-screen image slider gallery with animated slide transitions, thumbnail navigation, arrow controls, and keyboard support. Gallery data is passed via v-model:galleryData.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SliderGallery>;

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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    components: { SliderGallery },
    setup() {
      const galleryData = ref<IGalleryData[]>(sampleSlides);
      return { args, galleryData };
    },
    template: `<SliderGallery v-bind="args" v-model:gallery-data="galleryData" />`,
  }),
};

export const AutoRunDisabled: Story = {
  name: "Auto-Run Disabled",
  args: {
    autoRun: false,
  },
  render: (args) => ({
    components: { SliderGallery },
    setup() {
      const galleryData = ref<IGalleryData[]>(sampleSlides);
      return { args, galleryData };
    },
    template: `<SliderGallery v-bind="args" v-model:gallery-data="galleryData" />`,
  }),
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
  render: (args) => ({
    components: { SliderGallery },
    setup() {
      const galleryData = ref<IGalleryData[]>(sampleSlides);
      return { args, galleryData };
    },
    template: `<SliderGallery v-bind="args" v-model:gallery-data="galleryData" />`,
  }),
};

export const SlowTransition: Story = {
  name: "Slow Transition (5000ms)",
  args: {
    animationDuration: 5000,
    autoRunInterval: 10000,
  },
  render: (args) => ({
    components: { SliderGallery },
    setup() {
      const galleryData = ref<IGalleryData[]>(sampleSlides);
      return { args, galleryData };
    },
    template: `<SliderGallery v-bind="args" v-model:gallery-data="galleryData" />`,
  }),
};

export const SingleSlide: Story = {
  name: "Single Slide",
  args: {
    autoRun: false,
  },
  render: (args) => ({
    components: { SliderGallery },
    setup() {
      const galleryData = ref<IGalleryData[]>([sampleSlides[0]!]);
      return { args, galleryData };
    },
    template: `<SliderGallery v-bind="args" v-model:gallery-data="galleryData" />`,
  }),
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
  render: (args) => ({
    components: { SliderGallery },
    setup() {
      const galleryData = ref<IGalleryData[]>([
        { src: "https://picsum.photos/seed/min1/1920/1080", alt: "Image one", textBrightness: "light" },
        { src: "https://picsum.photos/seed/min2/1920/1080", alt: "Image two", textBrightness: "dark" },
        { src: "https://picsum.photos/seed/min3/1920/1080", alt: "Image three", textBrightness: "light" },
      ]);
      return { args, galleryData };
    },
    template: `<SliderGallery v-bind="args" v-model:gallery-data="galleryData" />`,
  }),
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
  render: (args) => ({
    components: { SliderGallery },
    setup() {
      const galleryData = ref<IGalleryData[]>([]);
      return { args, galleryData };
    },
    template: `<SliderGallery v-bind="args" v-model:gallery-data="galleryData" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: "When galleryData is empty the loading state is dismissed immediately.",
      },
    },
  },
};
