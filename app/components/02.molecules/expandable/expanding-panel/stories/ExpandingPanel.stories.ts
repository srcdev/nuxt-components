import ExpandingPanel from "../ExpandingPanel.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import { ref } from "vue";
import CanvasSwitcher from "../../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof ExpandingPanel> = {
  title: "Molecules/Expandable/Expanding Panel",
  component: ExpandingPanel,
  parameters: {
    docs: {
      description: {
        component:
          "A single expand/collapse panel on native <details>/<summary>. To render a set of these from slots, optionally exclusive-open, use " +
          "[AccordionGroup](?path=/story/molecules-expandable-accordiongroup--exclusive-open), which renders this panel for every item when `variant=\"modern\"`.",
      },
    },
  },
  argTypes: {
    name: {
      control: { type: "text" },
      description: "The <details> name: panels sharing it form an exclusive-open group. Element ids come from useId(), not from this.",
    },
    animationDuration: {
      control: { type: "number", min: 0, step: 50 },
      description: "Expand/collapse animation duration in milliseconds",
    },
    forceOpened: {
      control: { type: "boolean" },
      description: "When true, the panel is always open and the toggle icon is hidden",
    },
    contentIsOnTop: {
      control: { type: "boolean" },
      description:
        "When true, the content region is positioned absolutely below the summary and raised above surrounding page content via z-index, instead of pushing layout down",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    name: "panel-demo",
    animationDuration: 400,
    forceOpened: false,
    contentIsOnTop: false,
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof ExpandingPanel>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Panel Summary</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            This is the panel content. It can contain any markup — text, images, or components.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const InitiallyOpen: Story = {
  name: "Initially Open",
  args: {
    name: "initially-open",
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <ExpandingPanel v-bind="args" v-model="isOpen">
        <template #summary>
          <span>This panel starts open</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            The panel was opened via v-model on mount.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const ForceOpened: Story = {
  name: "Force Opened",
  args: {
    name: "force-opened",
    forceOpened: true,
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Always open — toggle icon hidden</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            When <code>forceOpened</code> is true the panel stays open and the icon is not rendered.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const CustomIcon: Story = {
  name: "Custom Icon",
  args: {
    name: "custom-icon",
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Panel with a custom icon</span>
        </template>
        <template #icon>
          <span style="font-size:1.2rem">＋</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            Replace the default caret with any element via the <code>icon</code> slot.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const SlowAnimation: Story = {
  name: "Slow Animation (800ms)",
  args: {
    name: "slow-animation",
    animationDuration: 800,
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Slow animation panel</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            The expand/collapse transition runs over 800 ms.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const NoAnimation: Story = {
  name: "No Animation (0ms)",
  args: {
    name: "no-animation",
    animationDuration: 0,
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Instant toggle</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            The panel opens and closes with no transition.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const RichContent: Story = {
  name: "Rich Slot Content",
  args: {
    name: "rich-content",
    animationDuration: 400,
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <strong>Materials &amp; Care</strong>
        </template>
        <template #content>
          <ul style="margin:0;padding:0.5rem 0 0.5rem 1.2rem">
            <li>100% organic cotton</li>
            <li>Machine wash at 30°C</li>
            <li>Do not tumble dry</li>
            <li>Iron on low heat</li>
          </ul>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const ContentIsOnTop: Story = {
  name: "Content Is On Top",
  args: {
    name: "content-is-on-top",
    contentIsOnTop: true,
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <div style="position:relative;padding-bottom:4rem">
        <ExpandingPanel v-bind="args">
          <template #summary>
            <span>Open me — content overlays what's below</span>
          </template>
          <template #content>
            <!--
              Background/border/shadow can go directly on .expanding-panel-content (or, as
              here, a wrapper inside the slot — either works). ::details-content (the native
              anonymous box wrapping this content) is what clips to 0 height when collapsed,
              via overflow:clip on the parent — so this element's own box, including padding
              and background, is clipped correctly regardless of where the styling lives.
            -->
            <div style="color: #808080; background-color:#fff;border:1px solid #ddd;border-radius:0.4rem;padding:1rem;box-shadow:0 4px 12px rgb(0 0 0 / 15%)">
              <p style="margin:0">
                With <code>contentIsOnTop</code>, this content is absolutely positioned below the
                summary and raised above surrounding page content via <code>z-index</code>,
                instead of pushing the "Page content below" text further down.
              </p>
            </div>
          </template>
        </ExpandingPanel>
        <p style="margin-top:1rem;padding:1rem;">
          Page content below — stays in place when the panel opens.
        </p>
      </div>
    `,
  }),
};

export const WithStyleClassPassthrough: Story = {
  name: "With styleClassPassthrough",
  args: {
    name: "style-passthrough",
    styleClassPassthrough: ["custom-class", "another-class"],
  },
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      return { args };
    },
    template: `
      <ExpandingPanel v-bind="args">
        <template #summary>
          <span>Custom classes applied to root</span>
        </template>
        <template #content>
          <p style="margin:0;padding:0.5rem 0">
            Inspect the root element to see <code>custom-class</code> and <code>another-class</code>.
          </p>
        </template>
      </ExpandingPanel>
    `,
  }),
};

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  render: (args) => ({
    components: { ExpandingPanel },
    setup() {
      const longUnbroken = "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft";
      const longUrl = "https://example.com/" + "a-very-long-path-segment-without-spaces".repeat(4);
      const longCopy = "Unsere Behandlungen werden individuell auf Ihre Bedürfnisse abgestimmt, damit Sie sich rundum wohlfühlen. ".repeat(6);
      return { args, longUnbroken, longUrl, longCopy };
    },
    template: `
      <div style="padding: 1.6rem; display: grid; gap: 1.6rem;">
        <ExpandingPanel v-bind="args" name="stress-a">
          <template #summary><span>{{ longUnbroken }}</span></template>
          <template #content><p style="margin: 0; padding-block: 0.8rem;">{{ longUrl }}</p></template>
        </ExpandingPanel>
        <ExpandingPanel v-bind="args" name="stress-a">
          <template #summary><span>{{ longCopy.slice(0, 220) }}</span></template>
          <template #content><p style="margin: 0; padding-block: 0.8rem;">{{ longCopy }}</p></template>
        </ExpandingPanel>
        <ExpandingPanel v-bind="args">
          <template #summary><span>🎉 Emoji first, then &lt;b&gt;html&lt;/b&gt; as text</span></template>
          <template #content><p style="margin: 0; padding-block: 0.8rem;">&lt;script&gt;alert(1)&lt;/script&gt;</p></template>
        </ExpandingPanel>
        <ExpandingPanel v-bind="args" dir="rtl">
          <template #summary><span>سؤال طويل من اليمين إلى اليسار للتحقق من الاتجاه</span></template>
          <template #content><p style="margin: 0; padding-block: 0.8rem;">إجابة قصيرة.</p></template>
        </ExpandingPanel>
        <ExpandingPanel v-bind="args">
          <template #summary><span>A</span></template>
        </ExpandingPanel>
        <ExpandingPanel v-bind="args">
          <template #content><p style="margin: 0; padding-block: 0.8rem;">No summary slot: only the icon is clickable.</p></template>
        </ExpandingPanel>
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
      story: { inline: false, height: "640px" },
      description: {
        story:
          "Open each panel at every canvas width. The long unbroken summary wraps and the caret stays visible (until 2026-10-20 it pushed the " +
          "caret out of the clipped summary); long URLs and copy wrap in the content; the first two panels share a name, so opening one closes " +
          "the other, and each keeps its own ids; emoji and HTML-like text render as text; the RTL panel puts the caret on the left; the " +
          "single-letter, no-content and no-summary panels keep their shape.",
      },
    },
  },
};
