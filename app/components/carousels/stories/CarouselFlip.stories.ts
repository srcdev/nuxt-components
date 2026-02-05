import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { computed } from "vue";
import StorybookComponent from "../CarouselFlip.vue";

// Define carousel item interface
interface CarouselItem {
  id: number | string;
  url: string;
  alt: string;
}

// Custom interface for story args
interface CarouselFlipStoryArgs {
  carouselDataIds: (string | number)[];
  allowCarouselOverflow: boolean;
  transitionSpeed: number;
  useFlipAnimation: boolean;
  useSpringEffect: boolean;
  styleClassPassthrough: string[];
  // Mock data for stories
  carouselData: CarouselItem[];
}

// Sample carousel data for stories
const sampleCarouselItems: CarouselItem[] = [
  {
    id: 1,
    url: "/images/rotating-carousel/image-1.webp",
    alt: "Sample Carousel Image 1",
  },
  {
    id: 2,
    url: "/images/rotating-carousel/image-2.webp",
    alt: "Sample Carousel Image 2",
  },
  {
    id: 3,
    url: "/images/rotating-carousel/image-4.webp",
    alt: "Sample Carousel Image 3",
  },
  {
    id: 4,
    url: "/images/rotating-carousel/image-5.webp",
    alt: "Sample Carousel Image 4",
  },
  {
    id: 5,
    url: "/images/rotating-carousel/image-6.webp",
    alt: "Sample Carousel Image 5",
  },
  {
    id: 6,
    url: "/images/banners/banner-1.webp",
    alt: "Sample Carousel Image 6",
  },
  {
    id: 7,
    url: "/images/banners/banner-2.webp",
    alt: "Sample Carousel Image 7",
  },
  {
    id: 8,
    url: "/images/banners/banner-3.webp",
    alt: "Sample Carousel Image 8",
  },
];

export default {
  title: "Components/UI/CarouselFlip",
  component: StorybookComponent,
  argTypes: {
    // Carousel Configuration
    carouselDataIds: {
      control: { type: "object" },
      description: "Array of carousel item IDs in display order",
      table: {
        category: "Data",
      },
    },
    allowCarouselOverflow: {
      control: { type: "boolean" },
      description: "Allow carousel items to overflow container",
      table: {
        category: "Layout",
      },
    },
    transitionSpeed: {
      control: { type: "range", min: 100, max: 3000, step: 100 },
      description: "Animation transition speed in milliseconds",
      table: {
        category: "Animation",
      },
    },
    useFlipAnimation: {
      control: { type: "boolean" },
      description: "Enable flip animation effect",
      table: {
        category: "Animation",
      },
    },
    useSpringEffect: {
      control: { type: "boolean" },
      description: "Enable spring physics effect",
      table: {
        category: "Animation",
      },
    },
    styleClassPassthrough: {
      control: { type: "object" },
      description: "Additional CSS classes to pass through",
      table: {
        category: "Layout",
      },
    },
    // Display data for reference
    carouselData: {
      control: { type: "object" },
      description: "Carousel data items (for display reference)",
      table: {
        category: "Data",
      },
    },
  },
  args: {
    carouselDataIds: [1, 2, 3, 4, 5],
    allowCarouselOverflow: true,
    transitionSpeed: 1000,
    useFlipAnimation: true,
    useSpringEffect: false,
    styleClassPassthrough: ["carousel-flip-demo"],
    carouselData: sampleCarouselItems,
  },
} as Meta<CarouselFlipStoryArgs>;

const Template: StoryFn<CarouselFlipStoryArgs> = (args) => ({
  components: {
    StorybookComponent,
  },
  setup() {
    // Filter carousel data based on selected IDs
    const filteredCarouselData = computed(() =>
      args.carouselData.filter((item) => args.carouselDataIds.includes(item.id))
    );

    // Inject essential CSS styles for proper carousel rendering
    const styleId = "carousel-flip-storybook-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @property --glow-deg {
          syntax: "<angle>";
          inherits: true;
          initial-value: -90deg;
        }

        @keyframes glow {
          100% {
            --glow-deg: 270deg;
          }
        }

        .carousel-flip-demo.carousel-flip {
          --_carousel-item-track-gap: 12px;
          --_carousel-container-max-inline-size: 800px;
          --_carousel-item-edge-preview-width: 12px;
        }

        @media (width >= 768px) {
          .carousel-flip-demo.carousel-flip {
            --_carousel-item-track-gap: 24px;
            --_carousel-item-edge-preview-width: 80px;
          }
        }

        .carousel-flip-demo.carousel-flip .item-container {
          max-inline-size: 800px;
          margin-inline: auto;
          outline: 1px solid light-dark(var(--gray-8, #666), var(--gray-1, #f5f5f5));
          padding-block: 6px;
          padding-inline: 6px;
        }

        @media (width >= 768px) {
          .carousel-flip-demo.carousel-flip .item-container {
            padding-block: 12px;
            padding-inline: 12px;
          }
        }

        .carousel-flip-demo.carousel-flip .item {
          background-color: light-dark(var(--gray-5, #e5e5e5), var(--gray-6, #999));
          contain: layout style paint;
        }

        .carousel-flip-demo.carousel-flip .item:nth-child(odd) {
          background-color: light-dark(var(--gray-6, #999), var(--gray-5, #e5e5e5));
        }

        .custom-carousel-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          aspect-ratio: 4 / 3;
          inline-size: 100%;
          color: light-dark(#aaa, #333);
          padding-block: 10px;
          padding-inline: 10px;
          border-radius: 4px;
          outline: 1px solid light-dark(#00000090, #ffffff90);
        }

        .carousel-flip-demo.carousel-flip .controls-container {
          gap: 20px;
          max-inline-size: 800px;
        }

        .carousel-flip-demo.carousel-flip .markers-container {
          --marker-height: 12px;
          --marker-width: 12px;
          --marker-border-radius: 100vw;
        }

        @media (width >= 768px) {
          .carousel-flip-demo.carousel-flip .markers-container {
            --marker-height: 22px;
            --marker-width: 22px;
          }
        }

        .carousel-flip-demo.carousel-flip .markers-item {
          width: var(--marker-width);
          height: var(--marker-height);
          border-radius: var(--marker-border-radius);
          line-height: var(--marker-height);
        }

        .carousel-flip-demo.carousel-flip .btn-marker {
          width: var(--marker-width);
          height: var(--marker-height);
          border-radius: var(--marker-border-radius);
          background-color: light-dark(var(--gray-5, #e5e5e5), var(--gray-7, #666));
          line-height: 3px;
          transition: all 0.3s linear;
          border: 1px solid transparent;
          outline: 1px solid transparent;
        }

        .carousel-flip-demo.carousel-flip .btn-marker.active {
          background-color: light-dark(var(--gray-12, #000), var(--gray-00, #fff));
          will-change: background-color;
        }

        .carousel-flip-demo.carousel-flip .btn-marker:hover,
        .carousel-flip-demo.carousel-flip .btn-marker:focus-visible {
          outline-color: light-dark(#000, #fff);
          will-change: background-color, outline-color;
        }
      `;
      document.head.appendChild(style);
    }

    return { args, filteredCarouselData };
  },
  template: `
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px;">CarouselFlip Component</h3>
        <p style="color: #666; margin-bottom: 20px;">
          Displaying {{ args.carouselDataIds.length }} carousel items with {{ args.transitionSpeed }}ms transition speed
        </p>
        <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
          <div style="padding: 4px 8px; border: 1px solid light-dark(#ccc, #666); border-radius: 4px; font-size: 12px; color: light-dark(#333, #ddd);">
            Overflow: {{ args.allowCarouselOverflow ? 'Enabled' : 'Disabled' }}
          </div>
          <div style="padding: 4px 8px; border: 1px solid light-dark(#ccc, #666); border-radius: 4px; font-size: 12px; color: light-dark(#333, #ddd);">
            Flip Animation: {{ args.useFlipAnimation ? 'Enabled' : 'Disabled' }}
          </div>
          <div style="padding: 4px 8px; border: 1px solid light-dark(#ccc, #666); border-radius: 4px; font-size: 12px; color: light-dark(#333, #ddd);">
            Spring Effect: {{ args.useSpringEffect ? 'Enabled' : 'Disabled' }}
          </div>
        </div>
      </div>

      <StorybookComponent
        :carousel-data-ids="args.carouselDataIds"
        :allow-carousel-overflow="args.allowCarouselOverflow"
        :transition-speed="args.transitionSpeed"
        :use-flip-animation="args.useFlipAnimation"
        :use-spring-effect="args.useSpringEffect"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template v-for="(item, index) in filteredCarouselData" #[item.id] :key="index">
          <div class="custom-carousel-item">
            <h3>{{ index + 1 }}</h3>
            <p>{{ item.alt }}</p>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const Default = Template.bind({});

export const FastTransition = Template.bind({});
FastTransition.args = {
  carouselDataIds: [1, 2, 3, 4],
  transitionSpeed: 300,
  useFlipAnimation: true,
  useSpringEffect: false,
  allowCarouselOverflow: true,
};

export const SlowTransition = Template.bind({});
SlowTransition.args = {
  carouselDataIds: [1, 2, 3, 4, 5],
  transitionSpeed: 2000,
  useFlipAnimation: true,
  useSpringEffect: false,
  allowCarouselOverflow: true,
};

export const WithSpringEffect = Template.bind({});
WithSpringEffect.args = {
  carouselDataIds: [1, 2, 3, 4],
  transitionSpeed: 800,
  useFlipAnimation: true,
  useSpringEffect: true,
  allowCarouselOverflow: true,
};

export const NoFlipAnimation = Template.bind({});
NoFlipAnimation.args = {
  carouselDataIds: [1, 2, 3],
  transitionSpeed: 1000,
  useFlipAnimation: false,
  useSpringEffect: false,
  allowCarouselOverflow: true,
};

export const NoOverflow = Template.bind({});
NoOverflow.args = {
  carouselDataIds: [1, 2, 3, 4, 5],
  transitionSpeed: 1000,
  useFlipAnimation: true,
  useSpringEffect: false,
  allowCarouselOverflow: false,
  styleClassPassthrough: ["carousel-flip-demo", "no-overflow"],
};

export const ManyItems = Template.bind({});
ManyItems.args = {
  carouselDataIds: [1, 2, 3, 4, 5, 6, 7, 8],
  transitionSpeed: 1200,
  useFlipAnimation: true,
  useSpringEffect: false,
  allowCarouselOverflow: true,
};

export const FewItems = Template.bind({});
FewItems.args = {
  carouselDataIds: [2, 4],
  transitionSpeed: 800,
  useFlipAnimation: true,
  useSpringEffect: true,
  allowCarouselOverflow: true,
};

export const CustomStyling = Template.bind({});
CustomStyling.args = {
  carouselDataIds: [1, 3, 5, 7],
  transitionSpeed: 1000,
  useFlipAnimation: true,
  useSpringEffect: false,
  allowCarouselOverflow: true,
  styleClassPassthrough: ["carousel-flip-demo", "custom-styling"],
};

// Template with rich content demonstration
const RichContentTemplate: StoryFn<CarouselFlipStoryArgs> = (args) => ({
  components: {
    StorybookComponent,
  },
  setup() {
    // Filter carousel data based on selected IDs
    const filteredCarouselData = computed(() =>
      args.carouselData.filter((item) => args.carouselDataIds.includes(item.id))
    );

    // Ensure CSS is injected for proper carousel rendering
    const styleId = "carousel-flip-storybook-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .carousel-flip-demo.carousel-flip {
          --_carousel-item-track-gap: 12px;
          --_carousel-container-max-inline-size: 800px;
          --_carousel-item-edge-preview-width: 12px;
        }

        @media (width >= 768px) {
          .carousel-flip-demo.carousel-flip {
            --_carousel-item-track-gap: 24px;
            --_carousel-item-edge-preview-width: 80px;
          }
        }

        .carousel-flip-demo.carousel-flip .item-container {
          max-inline-size: 800px;
          margin-inline: auto;
          outline: 1px solid light-dark(var(--gray-8, #666), var(--gray-1, #f5f5f5));
          padding-block: 6px;
          padding-inline: 6px;
        }

        @media (width >= 768px) {
          .carousel-flip-demo.carousel-flip .item-container {
            padding-block: 12px;
            padding-inline: 12px;
          }
        }

        .carousel-flip-demo.carousel-flip .item {
          background-color: light-dark(var(--gray-5, #e5e5e5), var(--gray-6, #999));
          contain: layout style paint;
        }

        .carousel-flip-demo.carousel-flip .item:nth-child(odd) {
          background-color: light-dark(var(--gray-6, #999), var(--gray-5, #e5e5e5));
        }
      `;
      document.head.appendChild(style);
    }

    return { args, filteredCarouselData };
  },
  template: `
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px;">Rich Content Carousel</h3>
        <p style="color: #666; margin-bottom: 20px;">
          Demonstration of carousel with enhanced visual content
        </p>
      </div>

      <StorybookComponent
        :carousel-data-ids="args.carouselDataIds"
        :allow-carousel-overflow="args.allowCarouselOverflow"
        :transition-speed="args.transitionSpeed"
        :use-flip-animation="args.useFlipAnimation"
        :use-spring-effect="args.useSpringEffect"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template v-for="(item, index) in filteredCarouselData" #[item.id] :key="index">
          <div
            class="rich-carousel-item"
            style="
              width: 100%;
              height: 100%;
              min-height: 450px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              padding: 20px;
              text-align: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              position: relative;
              overflow: hidden;
              box-sizing: border-box;
            "
          >
            <div
              style="
                position: absolute;
                top: 12px;
                right: 12px;
                background: rgba(255,255,255,0.2);
                backdrop-filter: blur(4px);
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
              "
            >
              {{ index + 1 }}
            </div>
            <div style="z-index: 2; position: relative;">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">
                Slide {{ index + 1 }}
              </h3>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                {{ item.alt }}
              </p>
            </div>
            <div
              style="
                position: absolute;
                bottom: -20px;
                right: -20px;
                width: 80px;
                height: 80px;
                background: rgba(255,255,255,0.1);
                border-radius: 50%;
                transform: rotate(45deg);
              "
            />
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const RichContent = RichContentTemplate.bind({});
RichContent.args = {
  carouselDataIds: [1, 2, 3, 4, 5, 6],
  transitionSpeed: 1200,
  useFlipAnimation: true,
  useSpringEffect: true,
  allowCarouselOverflow: true,
  styleClassPassthrough: ["carousel-flip-demo"],
};

// Template showing different animation combinations
const AnimationShowcaseTemplate: StoryFn<CarouselFlipStoryArgs> = (args) => ({
  components: {
    StorybookComponent,
  },
  setup() {
    const filteredCarouselData = computed(() =>
      args.carouselData.filter((item) => args.carouselDataIds.includes(item.id))
    );

    // Inject gradient animation styles
    const animationStyleId = "gradient-animation-styles";
    if (!document.getElementById(animationStyleId)) {
      const style = document.createElement("style");
      style.id = animationStyleId;
      style.textContent = `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animation-demo-item {
          animation: gradientShift 4s ease infinite !important;
          background-size: 400% 400% !important;
        }
      `;
      document.head.appendChild(style);
    }

    return { args, filteredCarouselData };
  },
  template: `
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px;">Animation Showcase</h3>
        <p style="color: #666; margin-bottom: 20px;">
          Testing different animation combinations and timing
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; margin-bottom: 20px;">
          <div style="padding: 8px; border: 1px solid light-dark(#ccc, #666); border-radius: 6px; text-align: center; font-size: 12px; color: light-dark(#333, #ddd); background: args.useFlipAnimation ? 'light-dark(#e7f5e7, #2d4a2d)' : 'transparent';">
            Flip: {{ args.useFlipAnimation ? '✓' : '✗' }}
          </div>
          <div style="padding: 8px; border: 1px solid light-dark(#ccc, #666); border-radius: 6px; text-align: center; font-size: 12px; color: light-dark(#333, #ddd); background: args.useSpringEffect ? 'light-dark(#e7f5e7, #2d4a2d)' : 'transparent';">
            Spring: {{ args.useSpringEffect ? '✓' : '✗' }}
          </div>
          <div style="padding: 8px; border: 1px solid light-dark(#ccc, #666); border-radius: 6px; text-align: center; font-size: 12px; color: light-dark(#333, #ddd); background: args.allowCarouselOverflow ? 'light-dark(#e7f5e7, #2d4a2d)' : 'transparent';">
            Overflow: {{ args.allowCarouselOverflow ? '✓' : '✗' }}
          </div>
          <div style="padding: 8px; border: 1px solid light-dark(#ccc, #666); border-radius: 6px; text-align: center; font-size: 12px; color: light-dark(#333, #ddd);">
            Speed: {{ args.transitionSpeed }}ms
          </div>
        </div>
      </div>

      <StorybookComponent
        :carousel-data-ids="args.carouselDataIds"
        :allow-carousel-overflow="args.allowCarouselOverflow"
        :transition-speed="args.transitionSpeed"
        :use-flip-animation="args.useFlipAnimation"
        :use-spring-effect="args.useSpringEffect"
        :style-class-passthrough="args.styleClassPassthrough"
      >
        <template v-for="(item, index) in filteredCarouselData" #[item.id] :key="index">
          <div
            class="animation-demo-item"
            style="
              width: 100%;
              height: 100%;
              max-width: 400px;
              min-height: 450px;
              background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
              background-size: 400% 400%;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              position: relative;
              box-sizing: border-box;
            "
          >
            <div style="text-align: center;">
              <div style="font-size: 24px; margin-bottom: 4px;">{{ index + 1 }}</div>
              <div style="font-size: 12px; opacity: 0.9;">{{ item.alt.split(' ').slice(-2).join(' ') }}</div>
            </div>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const AnimationShowcase = AnimationShowcaseTemplate.bind({});
AnimationShowcase.args = {
  carouselDataIds: [1, 2, 3, 4],
  transitionSpeed: 1500,
  useFlipAnimation: true,
  useSpringEffect: true,
  allowCarouselOverflow: true,
  styleClassPassthrough: ["carousel-flip-demo", "animation-showcase"],
};
