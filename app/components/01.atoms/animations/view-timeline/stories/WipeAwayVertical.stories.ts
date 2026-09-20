import WipeAwayVertical from "../WipeAwayVertical.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof WipeAwayVertical> = {
  title: "Atoms/Effects/WipeAwayVertical",
  component: WipeAwayVertical,
  argTypes: {
    tag: {
      control: "select",
      options: ["div", "section", "main", "article", "aside"],
      description: "Root element tag",
      table: { category: "Structure" },
    },
    itemCount: {
      control: { type: "number", min: 1, max: 5, step: 1 },
      description:
        "Number of sticky/scrolling section pairs. The demo below has a fixed set of 3 slotted panels, so changing this control past what's slotted will leave extra panels empty — see the FivePanels story for a differently-sized example.",
      table: { category: "Structure" },
    },
    styleClassPassthrough: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Scroll-driven vertical wipe effect: each sticky panel wipes away to reveal the next as its paired scrolling section crosses the viewport. Pure CSS — a single-column grid overlays `.sticky-items-container` across all `.scrolling-section` rows via `animation-timeline: view()`, so there's no scroll listener or JS measurement involved. Consumers supply `stickyItem-{n}` slots for each of `itemCount` panels, and `scrollingItem-{n}` slots for only the first `itemCount - 1` — the last panel has nothing left to reveal, so it has no wipe animation or scrolling section of its own, just a small built-in trailing buffer to release cleanly. The sticky panel's own visible height is `--wipe-away-vertical-height` (default `100vh`) — leave the root's own `height` unset (`auto`) so it sizes itself from its children. Browsers without `animation-timeline: view()` support (via `@supports not (...)`) just get the sticky items stacked in normal document flow instead.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WipeAwayVertical>;

const scrollNote = `
  <p style="text-align: center; font-size: 1.4rem; opacity: 0.5; padding-block: 2rem;">
    Scroll down to see each panel wipe away
  </p>
`;

const panel = (label: string, colour: string) => `
  <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: ${colour}; color: white; font-size: 2.4rem; font-weight: 600; border-radius: inherit;">
    ${label}
  </div>
`;

export const Default: Story = {
  args: {
    tag: "div",
    itemCount: 3,
  },
  render: (args) => ({
    components: { WipeAwayVertical },
    setup() {
      return { args };
    },
    template: `
      <div>
        ${scrollNote}
        <WipeAwayVertical v-bind="args">
          <template #stickyItem-0>${panel("Panel One", "#5b8def")}</template>
          <template #stickyItem-1>${panel("Panel Two", "#e0576b")}</template>
          <template #stickyItem-2>${panel("Panel Three", "#2fb380")}</template>
          <template #scrollingItem-0><div style="height: 100vh;"></div></template>
          <template #scrollingItem-1><div style="height: 100vh;"></div></template>
        </WipeAwayVertical>
        <p style="text-align: center; font-size: 1.4rem; opacity: 0.5; padding-block: 2rem;">End of timeline</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Three panels wiping in sequence as the page scrolls. The root's height is left as `auto` so it sizes itself from its scrolling sections — no manual height calculation needed.",
      },
    },
  },
};

export const RoundedPanels: Story = {
  args: {
    tag: "div",
    itemCount: 3,
  },
  render: (args) => ({
    components: { WipeAwayVertical },
    setup() {
      return { args };
    },
    template: `
      <div>
        ${scrollNote}
        <WipeAwayVertical v-bind="args" style="--wipe-away-vertical-border-radius: 2.4rem;">
          <template #stickyItem-0>${panel("Rounded One", "#5b8def")}</template>
          <template #stickyItem-1>${panel("Rounded Two", "#e0576b")}</template>
          <template #stickyItem-2>${panel("Rounded Three", "#2fb380")}</template>
          <template #scrollingItem-0><div style="height: 100vh;"></div></template>
          <template #scrollingItem-1><div style="height: 100vh;"></div></template>
        </WipeAwayVertical>
        <p style="text-align: center; font-size: 1.4rem; opacity: 0.5; padding-block: 2rem;">End of timeline</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "`--wipe-away-vertical-border-radius` rounds the sticky panels' corners.",
      },
    },
  },
};

export const SlowWipe: Story = {
  args: {
    tag: "div",
    itemCount: 2,
  },
  render: (args) => ({
    components: { WipeAwayVertical },
    setup() {
      return { args };
    },
    template: `
      <div>
        ${scrollNote}
        <WipeAwayVertical v-bind="args" style="--wipe-away-vertical-animation-duration: 3s;">
          <template #stickyItem-0>${panel("Slow One", "#5b8def")}</template>
          <template #stickyItem-1>${panel("Slow Two", "#e0576b")}</template>
          <template #scrollingItem-0><div style="height: 100vh;"></div></template>
        </WipeAwayVertical>
        <p style="text-align: center; font-size: 1.4rem; opacity: 0.5; padding-block: 2rem;">End of timeline</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "`--wipe-away-vertical-animation-duration` stretches the wipe animation across a larger portion of the scroll-linked entry range, in browsers that support `animation-timeline: view()`.",
      },
    },
  },
};

export const CompactHeight: Story = {
  args: {
    tag: "div",
    itemCount: 2,
  },
  render: (args) => ({
    components: { WipeAwayVertical },
    setup() {
      return { args };
    },
    template: `
      <div>
        ${scrollNote}
        <WipeAwayVertical v-bind="args" style="--wipe-away-vertical-height: 50vh;">
          <template #stickyItem-0>${panel("Compact One", "#5b8def")}</template>
          <template #stickyItem-1>${panel("Compact Two", "#e0576b")}</template>
          <template #scrollingItem-0><div style="height: 100vh;"></div></template>
        </WipeAwayVertical>
        <p style="text-align: center; font-size: 1.4rem; opacity: 0.5; padding-block: 2rem;">End of timeline</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "`--wipe-away-vertical-height` sizes the visible sticky panel independently of the root's total scroll height — here it's shrunk to 50vh instead of the 100vh default. The root's height is still left as `auto`.",
      },
    },
  },
};

export const FivePanels: Story = {
  args: {
    tag: "div",
    itemCount: 5,
  },
  render: (args) => ({
    components: { WipeAwayVertical },
    setup() {
      return { args };
    },
    template: `
      <div>
        ${scrollNote}
        <WipeAwayVertical v-bind="args">
          <template #stickyItem-0>${panel("Panel One", "#5b8def")}</template>
          <template #stickyItem-1>${panel("Panel Two", "#e0576b")}</template>
          <template #stickyItem-2>${panel("Panel Three", "#2fb380")}</template>
          <template #stickyItem-3>${panel("Panel Four", "#e0a83a")}</template>
          <template #stickyItem-4>${panel("Panel Five", "#8a5be0")}</template>
          <template #scrollingItem-0><div style="height: 100vh;"></div></template>
          <template #scrollingItem-1><div style="height: 100vh;"></div></template>
          <template #scrollingItem-2><div style="height: 100vh;"></div></template>
          <template #scrollingItem-3><div style="height: 100vh;"></div></template>
        </WipeAwayVertical>
        <p style="text-align: center; font-size: 1.4rem; opacity: 0.5; padding-block: 2rem;">End of timeline</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Five panels wiping in sequence — itemCount scales cleanly: the root's height stays auto regardless of itemCount, and z-index/view-timeline naming are generated per item automatically.",
      },
    },
  },
};

const loremParagraph = `
  <p style="max-width: 60ch; margin-inline: auto; font-size: 1.6rem; line-height: 1.6; padding-block: 2rem;">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  </p>
`;

const loremHeading = (text: string) => `
  <h2 style="max-width: 60ch; margin-inline: auto; font-size: 2.4rem; padding-top: 3rem;">${text}</h2>
`;

export const InRealisticPage: Story = {
  args: {
    tag: "div",
    itemCount: 3,
  },
  render: (args) => ({
    components: { WipeAwayVertical },
    setup() {
      return { args };
    },
    template: `
      <div>
        ${loremHeading("Before the effect")}
        ${loremParagraph}
        ${loremParagraph}
        ${loremHeading("Another section")}
        ${loremParagraph}
        <WipeAwayVertical v-bind="args">
          <template #stickyItem-0>${panel("Panel One", "#5b8def")}</template>
          <template #stickyItem-1>${panel("Panel Two", "#e0576b")}</template>
          <template #stickyItem-2>${panel("Panel Three", "#2fb380")}</template>
          <template #scrollingItem-0><div style="height: 100vh;"></div></template>
          <template #scrollingItem-1><div style="height: 100vh;"></div></template>
        </WipeAwayVertical>
        ${loremHeading("After the effect")}
        ${loremParagraph}
        ${loremParagraph}
        ${loremHeading("More reading")}
        ${loremParagraph}
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The component dropped into a realistic page: several rows of unrelated heading/paragraph content both before and after it, rather than the minimal scroll-note used by the other stories. Demonstrates that the wipe still starts fully un-wiped at initial page load and the sticky panel releases cleanly afterwards, regardless of how much content precedes or follows it.",
      },
    },
  },
};
