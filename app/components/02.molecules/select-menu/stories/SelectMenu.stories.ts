import { ref } from "vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import SelectMenu from "../SelectMenu.vue";
import type { SelectMenuOption } from "~/types/components/select-menu";

// ─── Meta ─────────────────────────────────────────────────────────────────────

interface StoryArgs {
  options?: SelectMenuOption[];
  label?: string;
  placeholder?: string;
  showIcon?: boolean;
  showLabel?: boolean;
  showChevron?: boolean;
  modelValue?: string | number;
  styleClassPassthrough?: string | string[];
}

const meta: Meta<StoryArgs> = {
  title: "Molecules/SelectMenu",
  component: SelectMenu,
  argTypes: {
    label: {
      control: { type: "text" },
      description: "Accessible name for the trigger/listbox. Also the trigger's fallback text when nothing is selected and no placeholder is set.",
      table: { category: "Content" },
    },
    placeholder: {
      control: { type: "text" },
      description: "Trigger text shown when nothing is selected. Falls back to `label`.",
      table: { category: "Content" },
    },
    showIcon: {
      control: { type: "boolean" },
      description: "Show the selected option's icon in the trigger.",
      table: { category: "Trigger content" },
    },
    showLabel: {
      control: { type: "boolean" },
      description: "Show the selected option's label text in the trigger. Turn off for an icon-only compact trigger.",
      table: { category: "Trigger content" },
    },
    showChevron: {
      control: { type: "boolean" },
      description: "Show the trailing chevron in the trigger.",
      table: { category: "Trigger content" },
    },
    styleClassPassthrough: {
      table: { disable: true },
    },
  },
  args: {
    label: "Language",
    showIcon: true,
    showLabel: true,
    showChevron: true,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A custom listbox trigger + popover, built on the same Popover API / CSS anchor-positioning " +
          "approach as `ActionMenu`, but for single-value selection rather than actions: options carry a " +
          "value/label/icon, the selected option shows a checkmark, and `v-model` drives the current value. " +
          "The trigger's content (icon, text, chevron) is independently togglable, so the same component " +
          "covers an icon-only switcher, a text+chevron category filter, or a full icon+text+chevron select. " +
          "Defaults to a look consistent with the library's other select-like inputs. " +
          "Set shared CSS tokens globally — see `CONSUMER-STYLING.md` in the component folder.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

// ─── Shared data ──────────────────────────────────────────────────────────────

const languageOptions: SelectMenuOption[] = [
  { value: "en", label: "English", icon: "flag:gb-4x3" },
  { value: "fr", label: "Français", icon: "flag:fr-4x3" },
  { value: "de", label: "Deutsch", icon: "flag:de-4x3" },
  { value: "es", label: "Español", icon: "flag:es-4x3" },
];

const serviceOptions: SelectMenuOption[] = [
  { value: "balayage", label: "Balayage" },
  { value: "highlights", label: "Highlights" },
  { value: "full-colour", label: "Full Colour" },
  { value: "cut-and-finish", label: "Cut & Finish" },
];

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Default — icon + text + chevron trigger, matching a typical language switcher.
 */
export const Default: Story = {
  args: {
    label: "Language",
  },
  render: (args) => ({
    components: { SelectMenu },
    setup() {
      const value = ref("en");
      return { args, value, languageOptions };
    },
    template: `
      <div style="padding: 4rem 8rem;">
        <SelectMenu v-bind="args" v-model="value" :options="languageOptions" />
      </div>
    `,
  }),
};

/**
 * Icon-only trigger — the compact variant for tight header/nav spaces, showing
 * only the selected option's icon (e.g. a flag) with no text or chevron.
 */
export const IconOnly: Story = {
  name: "Icon Only — Compact Switcher",
  args: {
    label: "Language",
    showLabel: false,
    showChevron: false,
  },
  render: (args) => ({
    components: { SelectMenu },
    setup() {
      const value = ref("en");
      return { args, value, languageOptions };
    },
    template: `
      <div style="padding: 4rem 8rem;">
        <SelectMenu v-bind="args" v-model="value" :options="languageOptions" />
      </div>
    `,
  }),
};

/**
 * Icon + chevron, no text — the selected option's icon plus the dropdown
 * chevron, with the label text hidden. Useful when the icon alone (e.g. a
 * flag) is identifiable, but you still want the chevron affordance showing
 * it's an interactive dropdown.
 */
export const IconWithChevron: Story = {
  name: "Icon + Chevron — No Text",
  args: {
    label: "Language",
    showLabel: false,
  },
  render: (args) => ({
    components: { SelectMenu },
    setup() {
      const value = ref("en");
      return { args, value, languageOptions };
    },
    template: `
      <div style="padding: 4rem 8rem;">
        <SelectMenu v-bind="args" v-model="value" :options="languageOptions" />
      </div>
    `,
  }),
};

/**
 * Category filter — text + chevron only (no per-option icons), with the
 * trigger showing the category label ("Choose a service") until a value is
 * picked. Useful for faceted filters where several SelectMenu instances sit
 * side by side, each covering one filter category.
 */
export const CategoryFilter: Story = {
  name: "Category Filter",
  args: {
    label: "Choose a service",
    showIcon: false,
  },
  render: (args) => ({
    components: { SelectMenu },
    setup() {
      const value = ref<string | undefined>(undefined);
      return { args, value, serviceOptions };
    },
    template: `
      <div style="padding: 4rem 8rem;">
        <SelectMenu v-bind="args" v-model="value" :options="serviceOptions" />
      </div>
    `,
  }),
};

/**
 * Multiple filter categories side by side — each SelectMenu instance is an
 * independent single-select v-model, so a faceted filter bar is built by
 * placing several instances next to each other.
 */
export const FilterBar: Story = {
  name: "Filter Bar — Multiple Categories",
  args: {},
  render: () => ({
    components: { SelectMenu },
    setup() {
      const service = ref<string | undefined>(undefined);
      const stylist = ref<string | undefined>(undefined);
      const stylistOptions: SelectMenuOption[] = [
        { value: "any", label: "Any stylist" },
        { value: "alex", label: "Alex Morgan" },
        { value: "sam", label: "Sam Patel" },
      ];
      return { service, stylist, serviceOptions, stylistOptions };
    },
    template: `
      <div style="padding: 4rem 8rem; display: flex; gap: 1.2rem; flex-wrap: wrap;">
        <SelectMenu label="Choose a service" v-model="service" :options="serviceOptions" />
        <SelectMenu label="Choose a stylist" v-model="stylist" :options="stylistOptions" />
      </div>
    `,
  }),
};

/**
 * Custom tokens — a per-instance styleClassPassthrough overriding the public
 * --select-menu-* tokens to demonstrate full visual customisation.
 */
export const CustomTokens: Story = {
  name: "Custom Tokens",
  args: {
    label: "Language",
  },
  render: (args) => ({
    components: { SelectMenu },
    setup() {
      const value = ref("en");
      return { args, value, languageOptions };
    },
    template: `
      <div style="padding: 4rem 8rem;">
        <style>
          .select-menu.dark-pill {
            --select-menu-trigger-border-radius: 999rem;
            --select-menu-trigger-surface: #1a1a1a;
            --select-menu-trigger-text-color: #ffffff;
            --select-menu-trigger-border: #333333;
            --select-menu-popover-surface: #1a1a1a;
            --select-menu-popover-border: #333333;
            --select-menu-item-text-color: #ffffff;
            --select-menu-item-surface-hover: #2a2a2a;
          }
        </style>
        <SelectMenu v-bind="args" v-model="value" :options="languageOptions" :style-class-passthrough="['dark-pill']" />
      </div>
    `,
  }),
};
