import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import AccordionChat from "../AccordionChat.vue";
import CanvasSwitcher from "../../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

interface StoryArgs {
  name?: string;
  animationDuration?: number;
  avatarLabel?: string;
  showAvatar?: boolean;
  radius?: string;
  bubbleMaxWidth?: string;
  gap?: string;
  styleClassPassthrough?: string | string[];
}

const tokenCategory = "CSS tokens (story only, set in your CSS)";

const meta: Meta<StoryArgs> = {
  title: "Molecules/Expandable/AccordionChat",
  component: AccordionChat,
  argTypes: {
    name: {
      control: { type: "text" },
      description: "Shared `name` on every panel's `<details>`: only one answer open at a time. Leave empty for independent panels.",
    },
    animationDuration: {
      control: { type: "number", min: 0, step: 50 },
      description: "Open/close (row height) animation in milliseconds, passed to every panel.",
    },
    avatarLabel: {
      control: { type: "text" },
      description: "Initials in the avatar circle (first two characters). Used when no `#avatar` or `item-{n}-avatar` slot is filled.",
    },
    showAvatar: {
      control: { type: "boolean" },
      description: "`false` removes the avatar column entirely, even when an avatar slot is filled.",
    },
    radius: {
      control: { type: "select" },
      options: ["0.8rem", "1.2rem", "2rem", "3rem"],
      description: "**Story control, not a prop.** Sets `--accordion-chat-radius`. In your CSS: `.faq { --accordion-chat-radius: 1.2rem; }`",
      table: { category: tokenCategory },
    },
    bubbleMaxWidth: {
      control: { type: "select" },
      options: ["60%", "82%", "100%"],
      description: "**Story control, not a prop.** Sets `--accordion-chat-bubble-max-width`. In your CSS: `.faq { --accordion-chat-bubble-max-width: 70%; }`",
      table: { category: tokenCategory },
    },
    gap: {
      control: { type: "select" },
      options: ["0.8rem", "1.4rem", "2.4rem"],
      description: "**Story control, not a prop.** Sets `--accordion-chat-gap`. In your CSS: `.faq { --accordion-chat-gap: 2rem; }`",
      table: { category: tokenCategory },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    name: "",
    animationDuration: 300,
    avatarLabel: "S",
    showAvatar: true,
    radius: "2rem",
    bubbleMaxWidth: "82%",
    gap: "1.4rem",
  },
  parameters: {
    docs: {
      description: {
        component:
          "An accordion drawn as a chat: each `item-{n}-summary` slot is a question bubble on the right, and its `item-{n}-content` slot is the " +
          "answer bubble on the left, which can hold any rich content. The avatar beside each answer comes from `item-{n}-avatar`, then the " +
          "group `#avatar` slot, then `avatarLabel`; with none of them there's no avatar column. `name` makes it exclusive-open. Built on " +
          "[ExpandingPanelClassic](?path=/story/molecules-expandable-expanding-panel-classic--default), so it opens and closes, and animates, in every browser. " +
          "Every colour, size, radius, font and duration is a `--accordion-chat-*` token: the Default and Dark Theme stories are two token sets for the same markup.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

const richItems = [
  {
    q: "Delivery & Returns",
    a: "<p style='margin: 0;'>Free standard delivery on orders over £50. Returns accepted within 30 days.</p>",
  },
  {
    q: "Materials & Care",
    a:
      "<ul style='margin: 0; padding-inline-start: 1.8rem;'><li>100% organic cotton</li><li>Machine wash at 30°C</li><li>Do not tumble dry</li></ul>",
  },
  {
    q: "Sizing Guide",
    a: "<p style='margin: 0;'>Our pieces run true to size. If you're between sizes, we recommend sizing up.</p>",
  },
];

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => ({
    name: args.name || undefined,
    animationDuration: args.animationDuration,
    avatarLabel: args.avatarLabel,
    showAvatar: args.showAvatar,
  }));
  const tokenStyle = computed(() => ({
    "--accordion-chat-radius": args.radius,
    "--accordion-chat-bubble-max-width": args.bubbleMaxWidth,
    "--accordion-chat-gap": args.gap,
  }));
  return { componentArgs, tokenStyle, items: richItems };
}

const itemsTemplate = `
  <template v-for="(item, i) in items" :key="'s' + i" #[\`item-\${i}-summary\`]>{{ item.q }}</template>
  <template v-for="(item, i) in items" :key="'c' + i" #[\`item-\${i}-content\`]><div v-html="item.a"></div></template>
`;

const stage = "padding: 3.2rem 2.4rem; max-inline-size: 64rem; margin-inline: auto;";

const lightTokens = {
  background: "#f9f9f9",
  "--accordion-chat-question-surface": "#ececec",
  "--accordion-chat-question-colour": "#1d1d1f",
  "--accordion-chat-question-surface-open": "#1d1d1f",
  "--accordion-chat-question-colour-open": "#ffffff",
  "--accordion-chat-answer-surface": "#ffffff",
  "--accordion-chat-answer-border": "#e6e4e1",
  "--accordion-chat-answer-colour": "#2a2a2c",
  "--accordion-chat-avatar-surface": "#1d1d1f",
  "--accordion-chat-avatar-colour": "#ffffff",
};

const darkTokens = {
  background: "#0f0e0d",
  "--accordion-chat-question-font-family": "'Playfair Display', Georgia, serif",
  "--accordion-chat-question-font-size": "1.9rem",
  "--accordion-chat-question-font-weight": "400",
  "--accordion-chat-question-surface": "#1a1615",
  "--accordion-chat-question-colour": "#f2ece2",
  "--accordion-chat-question-border": "#2b2422",
  "--accordion-chat-question-surface-open": "#c9a961",
  "--accordion-chat-question-colour-open": "#14100f",
  "--accordion-chat-question-border-open": "#c9a961",
  "--accordion-chat-icon-surface": "rgb(255 255 255 / 0.08)",
  "--accordion-chat-icon-surface-open": "rgb(0 0 0 / 0.12)",
  "--accordion-chat-answer-surface": "#1a1615",
  "--accordion-chat-answer-border": "#2b2422",
  "--accordion-chat-answer-colour": "#cbbfb4",
  "--accordion-chat-answer-font-family": "Poppins, system-ui, sans-serif",
  "--accordion-chat-answer-font-weight": "300",
  "--accordion-chat-answer-font-size": "1.45rem",
  "--accordion-chat-answer-line-height": "1.7",
  "--accordion-chat-avatar-surface": "#c9a961",
  "--accordion-chat-avatar-colour": "#14100f",
  "--accordion-chat-avatar-font-family": "'Playfair Display', Georgia, serif",
  "--accordion-chat-avatar-font-weight": "400",
  "--accordion-chat-avatar-font-size": "1.4rem",
  "--accordion-chat-focus-ring-colour": "#c9a961",
};

const renderWith = (extraStyle: Record<string, string> = {}, slotsTemplate = itemsTemplate) => (args: StoryArgs) => ({
  components: { AccordionChat },
  setup() {
    return { ...useStorySetup(args), extraStyle };
  },
  template: `
    <div style="${stage}" :style="[extraStyle, tokenStyle]">
      <AccordionChat v-bind="componentArgs">${slotsTemplate}</AccordionChat>
    </div>
  `,
});

export const Default: Story = {
  render: renderWith(lightTokens),
  parameters: {
    docs: {
      description: {
        story:
          "The neutral light look: token values set to match the design reference. Without them, the colours come from the `--theme-*` tokens " +
          "(see Theme Defaults). Click a question to open its answer.",
      },
    },
  },
};

export const ThemeDefaults: Story = {
  name: "Theme Defaults (no tokens set)",
  render: renderWith(),
  parameters: {
    docs: { description: { story: "No `--accordion-chat-*` colour tokens set: every colour falls back to the active theme's `--theme-*` slots." } },
  },
};

export const DarkTheme: Story = {
  name: "Dark Theme (tokens only)",
  args: { avatarLabel: "N" },
  render: renderWith(darkTokens),
  parameters: {
    docs: {
      description: {
        story:
          "The same markup with only token overrides: serif questions, gold open state and avatar, light-weight answers on dark bubbles, " +
          "and a question border that turns gold when open. Copy the token set from the story source.",
      },
    },
  },
};

const monogramSvg = `<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><rect width="30" height="30" fill="#2f6f5e"></rect><path d="M8 21 L15 8 L22 21 Z" fill="#dce9e2"></path></svg>`;

export const LogoAvatar: Story = {
  name: "Logo Avatar (#avatar slot)",
  render: renderWith(lightTokens, `${itemsTemplate}<template #avatar>${monogramSvg}</template>`),
  parameters: {
    docs: { description: { story: "A group-wide `#avatar` slot (here an inline SVG logo; a `NuxtImg` works the same) fills the circle beside every answer, overriding `avatarLabel`." } },
  },
};

export const IconAvatar: Story = {
  name: "Icon Avatar (#avatar slot)",
  render: renderWith(lightTokens, `${itemsTemplate}<template #avatar><Icon name="lucide:sparkles" style="font-size: 1.6rem;" /></template>`),
};

export const NoAvatar: Story = {
  name: "No Avatar",
  args: { avatarLabel: "" },
  render: renderWith(lightTokens),
  parameters: {
    docs: { description: { story: "No avatar slot and an empty `avatarLabel`: no avatar column, and the answer bubble sits flush left. `showAvatar=false` does the same even when a slot is filled." } },
  },
};

export const PerPanelAvatar: Story = {
  name: "Per-Panel Avatar Override",
  render: renderWith(lightTokens, `${itemsTemplate}<template #item-1-avatar><Icon name="lucide:shirt" style="font-size: 1.6rem;" /></template>`),
  parameters: {
    docs: { description: { story: "`item-1-avatar` replaces the avatar for the second answer only; the others keep `avatarLabel`." } },
  },
};

export const ExclusiveOpen: Story = {
  name: "Exclusive Open (shared name)",
  args: { name: "faq" },
  render: renderWith(lightTokens),
  parameters: {
    docs: { description: { story: "With `name` set, opening one question closes the others (native `<details name>` grouping)." } },
  },
};

export const RichContent: Story = {
  name: "Rich Answer Content",
  render: renderWith(
    lightTokens,
    `
      <template #item-0-summary>What does a consultation include?</template>
      <template #item-0-content>
        <p style="margin: 0 0 0.8rem;">A 30-minute chat about your goals, then a written plan. It covers:</p>
        <ol style="margin: 0 0 0.8rem; padding-inline-start: 1.8rem;"><li>Your history and routine</li><li>A patch test</li><li>Pricing for the full course</li></ol>
        <p style="margin: 0;"><a href="#">Book a consultation</a> or call <strong>01234 567890</strong>.</p>
      </template>
      <template #item-1-summary>Where are you?</template>
      <template #item-1-content>
        <p style="margin: 0 0 0.8rem;">12 High Street, Northtown. Here's the studio:</p>
        <img src="/images/rotating-carousel/image-1.webp" alt="The Northtown studio" width="600" height="400" style="border-radius: 1rem; display: block;">
      </template>
    `
  ),
  parameters: {
    docs: { description: { story: "Answers take any markup: paragraphs, lists, links, images (capped to the bubble width)." } },
  },
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: { avatarLabel: "Alexandra" },
  render: (args) => ({
    components: { AccordionChat },
    setup() {
      const longUnbroken = "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft";
      const longUrl = "https://example.com/" + "a-very-long-path-segment-without-spaces".repeat(4);
      const longCopy = "Unsere Behandlungen werden individuell auf Ihre Bedürfnisse abgestimmt, damit Sie sich rundum wohlfühlen. ".repeat(6);
      const many = Array.from({ length: 12 }, (_, i) => ({
        question: `Question ${i + 6}`,
        summarySlot: `item-${i + 6}-summary`,
        contentSlot: `item-${i + 6}-content`,
      }));
      return { ...useStorySetup(args), longUnbroken, longUrl, longCopy, many, lightTokens };
    },
    template: `
      <div style="padding: 1.6rem; display: grid; gap: 3.2rem;" :style="[lightTokens, tokenStyle]">
        <AccordionChat v-bind="componentArgs">
          <template #item-0-summary>{{ longUnbroken }}</template>
          <template #item-0-content><p style="margin: 0;">{{ longUrl }}</p></template>
          <template #item-1-summary>{{ longCopy.slice(0, 200) }}</template>
          <template #item-1-content><p style="margin: 0;">{{ longCopy }}</p></template>
          <template #item-2-summary>🎉 Emoji first, then &lt;b&gt;html&lt;/b&gt; as text</template>
          <template #item-2-content><img src="/images/banners/banner-ginger.webp" alt="Wide banner, wider than the bubble" width="1600" height="400"></template>
          <template #item-3-summary>A</template>
          <template #item-4-summary>No content slot: opens to nothing</template>
          <template v-for="item in many" :key="item.summarySlot" #[item.summarySlot]>{{ item.question }}</template>
          <template v-for="item in many" :key="item.contentSlot" #[item.contentSlot]><p style="margin: 0;">Answer to {{ item.question }}.</p></template>
        </AccordionChat>

        <div dir="rtl">
          <AccordionChat v-bind="componentArgs" avatar-label="👩‍🔬">
            <template #item-0-summary>سؤال طويل من اليمين إلى اليسار للتحقق من الاتجاه</template>
            <template #item-0-content><p style="margin: 0;">إجابة قصيرة. يجب أن تنعكس زوايا الفقاعات.</p></template>
          </AccordionChat>
        </div>
      </div>
    `,
  }),
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
        <div :class="canvasName" style="margin-inline: auto; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      story: { inline: false, height: "760px" },
      description: {
        story:
          "Open every question at each canvas width. Long unbroken words and URLs wrap inside both bubbles and the icon stays visible; the " +
          "avatar shows \"Al\" for the label \"Alexandra\"; the wide image shrinks to the bubble; the single-letter and no-content panels still " +
          "look like bubbles; 12 more panels follow item-4 after a gap in the indexes; in the RTL group the question sits on the left, the " +
          "answer on the right, the tail corners flip, and the emoji avatar label stays whole.",
      },
    },
  },
};
