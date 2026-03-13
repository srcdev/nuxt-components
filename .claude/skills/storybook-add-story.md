# Adding a Storybook Story

## Overview

Stories live alongside the component in a `stories/` subfolder and are the source for both
manual visual review and Playwright visual regression tests.

## File location

```url
app/components/<component-folder>/stories/<ComponentName>.stories.ts
```

## Two patterns

### Simple component — `StoryObj`

Use when the component has no v-model and one representative story is enough.

```ts
import ComponentName from "../ComponentName.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ComponentName> = {
  title: "Category/Subcategory/ComponentName",
  component: ComponentName,
  argTypes: {
    propName: {
      control: { type: "select" },
      options: ["a", "b", "c"],
      description: "What this prop does",
    },
    booleanProp: {
      control: "boolean",
      description: "What this prop does",
    },
    textProp: {
      control: "text",
      description: "What this prop does",
    },
    objectProp: {
      control: "object",
      description: "What this prop does",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    propName: "a",
    booleanProp: false,
    textProp: "Hello",
    objectProp: [],
  },
  render: (args) => ({
    components: { ComponentName },
    setup() {
      return { args };
    },
    template: `<ComponentName v-bind="args" />`,
  }),
};
```

### Component with v-model or slots — `StoryFn` with Template

Use when the component has `v-model`, reactive state, or named slots that need toggling.

```ts
import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../ComponentName.vue";

interface ComponentStoryArgs {
  modelValue: string;
  propName: string;
  useSlot: boolean;
  slotContent: string;
}

export default {
  title: "Category/Subcategory/ComponentName",
  component: StorybookComponent,
  argTypes: {
    modelValue: {
      control: "text",
      description: "The bound value",
      table: { category: "Model" },
    },
    propName: {
      control: { type: "select" },
      options: ["a", "b"],
      description: "What this prop does",
      table: { category: "Basic" },
    },
    useSlot: {
      control: "boolean",
      description: "Toggle named slot",
      table: { category: "Slots" },
    },
    slotContent: {
      control: "text",
      description: "Content for the slot",
      table: { category: "Slots" },
    },
  },
  args: {
    modelValue: "",
    propName: "a",
    useSlot: false,
    slotContent: "Slot text",
  },
} as Meta<typeof StorybookComponent>;

const Template: StoryFn<ComponentStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const { modelValue, ...otherArgs } = args;
    const inputValue = ref(modelValue);
    return { inputValue, args: otherArgs, useSlot: args.useSlot, slotContent: args.slotContent };
  },
  template: `
    <StorybookComponent v-model="inputValue" v-bind="args">
      <template v-if="useSlot" #slotName>{{ slotContent }}</template>
    </StorybookComponent>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const WithSlot = Template.bind({});
WithSlot.args = { useSlot: true, slotContent: "Custom content" };
```

## Title format

`"Category/Subcategory/ComponentName"` — this becomes the Storybook sidebar path and the
Playwright `STORY_BASE` slug. The slug is derived by lowercasing and replacing spaces and
`/` with `-`:

| Title                                         | STORY_BASE slug                             |
| --------------------------------------------- | ------------------------------------------- |
| `"Atoms/Text Blocks/HeroText"`                | `atoms-text-blocks-herotext`                |
| `"Components/Forms/Input Text/InputTextCore"` | `components-forms-input-text-inputtextcore` |

## argTypes control types

| Prop type      | `control`                        |
| -------------- | -------------------------------- |
| String         | `"text"`                         |
| Boolean        | `"boolean"`                      |
| Number         | `{ type: "number", min, max }`   |
| Enum / union   | `{ type: "select" }` + `options` |
| Array / object | `"object"`                       |

## Scoped slots

When a component exposes data via slot props (e.g. an internally-generated `headingId`),
use the scoped slot destructuring syntax directly in the inline template string:

```ts
template: `
  <ComponentName v-bind="args">
    <template #heroText="{ headingId }">
      <HeroText :id="headingId" tag="h2" ... />
    </template>
  </ComponentName>
`,
```

This keeps the ID wiring self-contained inside the component — the parent story just
consumes what the slot exposes, rather than generating its own ID.

### Extra controls that are not component props

Use when you want a Storybook control that sets something other than a component prop — e.g. a CSS custom property toggle.

`Meta<typeof Component>` is strict: its `argTypes`/`args` keys must match the component's actual props. Adding extras causes a TypeScript error. The fix is a `StoryArgs` type that covers both:

```ts
import { computed } from "vue"; // ← must be explicit in .ts files (not auto-imported)
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import ComponentName from "../ComponentName.vue";

type StoryArgs = {
  // mirror the component props you want controls for
  tag?: "div" | "section";
  // plus any extras
  headerBackground?: string;
};

const meta: Meta<StoryArgs> = {  // ← StoryArgs, not typeof ComponentName
  title: "...",
  component: ComponentName,
  argTypes: {
    headerBackground: { control: "color", description: "Sets --my-header-bg" },
  },
  args: { headerBackground: "" },
};

export default meta;
type Story = StoryObj<typeof ComponentName>; // ← still strict for individual stories
```

Strip extra args before `v-bind` using a `useStorySetup` helper in `setup()`:

```ts
function useStorySetup(args: StoryArgs) {
  const bgStyles = computed(() => ({
    ...(args.headerBackground ? { "--my-header-bg": args.headerBackground } : {}),
  }));
  const componentArgs = computed(() => {
    const { headerBackground: _h, ...rest } = args;
    return rest;
  });
  return { bgStyles, componentArgs };
}

export const Default: Story = {
  render: (args: StoryArgs) => ({
    components: { ComponentName },
    setup() { return useStorySetup(args); },
    template: `<ComponentName v-bind="componentArgs" :style="bgStyles" />`,
  }),
};
```

Key points:

- `computed` is **not** auto-imported in `.ts` story files — import it explicitly from `"vue"`.
- Extra args must be stripped before `v-bind` — spreading unknown keys onto a component makes them unknown HTML attributes.
- CSS custom properties set via `:style` on the component root are picked up by `var()` in the component's scoped CSS.

## Notes

- Use `table: { category: "..." }` in `argTypes` when a component has many props — it groups
  them in the Storybook controls panel (e.g. `"Model"`, `"Basic"`, `"Validation"`, `"Styling"`, `"Slots"`).
- Export multiple named stories (`Default`, `WithError`, `Outlined`, etc.) when you want
  Playwright to test distinct visual states via separate story URLs.
