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
import { computed } from "vue";
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
    // Strip non-prop extra args inside a computed, never at setup time (see below)
    const componentArgs = computed(() => {
      const { modelValue: _modelValue, useSlot: _useSlot, slotContent: _slotContent, ...rest } = args;
      return rest;
    });
    return { args, componentArgs };
  },
  template: `
    <StorybookComponent v-model="args.modelValue" v-bind="componentArgs">
      <template v-if="args.useSlot" #slotName>{{ args.slotContent }}</template>
    </StorybookComponent>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const WithSlot = Template.bind({});
WithSlot.args = { useSlot: true, slotContent: "Custom content" };
```

### Reacting to a Controls change

Storybook mounts the story once and mutates `args` in place on every Controls change; `setup()`
never re-runs. So:

- **Don't destructure or copy `args` at setup time** (`const { x, ...rest } = args`, `ref(args.x)`):
  it's a one-time snapshot and the control silently stops working. Read `args.x` in the template,
  or destructure inside a `computed()`. The Component Ledger's `story_args_bug` column flags this.
- **Don't `watch(() => args.x)` either.** The template does pick up the new value, but the
  watcher never fires (found 2026-09-27 in `InputCheckboxRadioButton`'s Option group story, where
  a `watch` meant to reset local state on a `type` switch did nothing). When a control change
  must reset local state, move that state into a small inline child component and key it on the
  arg, so the change remounts it:

```ts
const Group = defineComponent({
  props: { type: { type: String, required: true } },
  setup(props) {
    const selected = ref(props.type === "checkbox" ? [] : "");
    return { selected };
  },
  template: `...`,
});

const Template: StoryFn<StoryArgs> = (args) => ({
  components: { Group },
  setup: () => ({ args }),
  template: `<Group :key="args.type" :type="args.type" />`,
});
```

Don't name the inline component the same as an exported story (`TS2451: Cannot redeclare`).

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

### Label token controls as story-only

A control that drives a CSS token (a line clamp, a colour) looks exactly like a prop in the
Controls panel and the generated docs table, so a developer reading the story can assume it's a
prop and try to pass it. Make it unmistakable:

- Put it in the category `"CSS tokens (story only, set in your CSS)"`.
- Start the description with `**Story control, not a prop.**`, name the token, and show the CSS a
  consumer would write instead, e.g.
  `` `.salon-menu { --price-list-description-line-clamp: 2; }` ``.
- If a story's docs text tells people to try the control, say there too that it's a CSS token.

`PriceList.stories.ts` and `GoogleReviews.stories.ts` (line-clamp controls) follow this.

## Link to the stories of components that use this one

When the component you're working on is a building block of other components (it's rendered
inside them, or they're a specialised version of it), its stories only show it in isolation. Add a
short note to each story that names the components using it, says what they add, and links to their
stories, so a reader can see it in real use. Examples: `AlertContent` is the panel inside
`DisplayToast`, `DisplayPrompt` and `CookieConsentBanner`; `AlertContentInner` is shared by
`AlertContent` and `AlertMaskedContent`.

- **Say how they're related, not just "see also".** Name the parent and what it adds, e.g. "The
  #actions slot wired to real accept and reject handlers: see the CookieConsentBanner story."
- **Link to the story that shows the relevant feature**, not just any story. A story about a slot
  or behaviour links to the parent story that exercises it. Other stories can share one general
  note.
- **Check the parent story actually shows what the note says.** Read its component before writing
  the note. `DisplayToast` doesn't fill `AlertContent`'s `#actions` slot, so a toast note that
  promised action buttons would send people to the wrong place.
- **Put the note in the canvas**, as a `<p>` above the component, so it's visible on the Canvas tab
  as well as Docs. If the story has a `parameters.docs.description`, add the link there too.
- Find the parent's story id from its `title` and export name: `"Molecules/CookieConsentBanner"` +
  `Default` gives `molecules-cookieconsentbanner--default` (lowercase, `/` and spaces become `-`,
  then `--` and the kebab-cased export name).

```ts
// Links in the canvas open in the Storybook manager (target="_top"), not inside the preview iframe.
const storyNoteStyle = "margin: 0 0 1.6rem; font-size: 1.4rem;";
const cookieNote = `
  <p style="${storyNoteStyle}">
    For the #actions slot wired up to real accept and reject handlers, open the
    <a href="/?path=/story/molecules-cookieconsentbanner--default" target="_top">CookieConsentBanner</a> story.
  </p>
`;

// In the story template:
template: `
  <div style="max-width: 600px; padding: 2rem;">
    ${cookieNote}
    <AlertContent v-bind="componentArgs">...</AlertContent>
  </div>
`,

// In parameters.docs.description (markdown): use "?path=..." with no leading slash.
story: "See the [CookieConsentBanner](?path=/story/molecules-cookieconsentbanner--default) story. ...",
```

- Canvas links need `target="_top"` and a leading `/` (`/?path=...`). Without `target="_top"` the
  whole Storybook UI loads inside the preview frame. The leading `/` assumes Storybook is served
  from the root of its domain, which holds locally and on the deployed Storybook.
- Define each note once as a constant at the top of the file and interpolate it, rather than
  repeating the markup in every story.

`AlertContent.stories.ts` follows this.

## Notes

- **Colour scheme:** `.storybook/preview.ts` pins every story to the light scheme
  (`html[data-color-scheme="light"]`, off-white `--slate-00` stage) by default, whatever the OS
  setting. Use the toolbar "Colour scheme" menu (Light / Dark / Follow OS) to check dark mode.
  Don't hardcode a stage background in a story to get a light canvas; it's already the default.
- **Edge-aware components need `layout: "fullscreen"`** in the meta's `parameters`. Storybook's
  default `"padded"` layout insets the canvas by 1rem, which masks viewport gutters, full-bleed
  tracks and edge alignment (`PageRow`, `SliderGallery`). To swap canvas widths inside a story,
  add the `CanvasSwitcher` decorator from `PageRow.stories.ts` (container-sized components only;
  see `components/canvas-switcher.md`).
- Use `table: { category: "..." }` in `argTypes` when a component has many props — it groups
  them in the Storybook controls panel (e.g. `"Model"`, `"Basic"`, `"Validation"`, `"Styling"`, `"Slots"`).
- Export multiple named stories (`Default`, `WithError`, `Outlined`, etc.) when you want
  Playwright to test distinct visual states via separate story URLs.
- **Every story inherits the meta's `argTypes`**, so its Controls panel shows them even if the
  story ignores `args`. A template written as `StoryFn = () => ({...})` never receives `args`, so
  those controls silently do nothing (found 2026-09-25 on `InputCheckboxRadioButton`'s
  `OptionGroup`: switching `type` to `radio` changed nothing). Either take `(args)` and bind the
  controls that make sense (hide irrelevant ones with `Story.argTypes = { x: { table: { disable: true } } }`),
  or, for a fixed showcase (comparisons, all-themes grids, composition examples), add
  `controls: { disable: true }` to that story's `parameters`.

## Scroll/animation-driven effects need surrounding chrome, not just the bare component

A story that renders a scroll- or timer-driven component with no other markup often fails to
show the effect at all — not because the component is broken, but because the demo gives the
viewer nothing to judge it against. Things that make an animated/scroll-driven effect illegible
in isolation:

- The effect resolves over a short distance/time relative to the page (e.g. a 100px scroll
  window on an otherwise-long page) — easy to scroll straight past it.
- The visual change is a subtle crop/shift on photographic content, where the eye has no
  reference point to notice a boundary moving.
- There's no indicator of *where* or *when* the effect completes.

Add scaffolding around the component to fix this, rather than assuming a bigger/slower prop
value alone solves it:

- A fixed marker (a line, label) at the point in the viewport where the effect's key transition
  happens (e.g. `position: fixed; top: 0` for a component that resolves when its own top hits
  the viewport top).
- A ruled/striped overlay or contrasting background behind the animated content so a boundary
  (clip edge, wipe line, fade) is visible against it, not just a crop of photo pixels.
- Short on-page instructions telling the viewer what to do and what to watch for ("scroll
  slowly — the image clips in over the last 100px before the red line").
- A second story with an exaggerated prop value (larger distance/duration) purely so the effect
  is easy to preview without precise scrolling/timing — see `ClipElement`'s `LargeClipDistance`
  story for the pattern (`.claude/skills/components/clip-element.md`).

This is a documentation-only concern — it doesn't change the component's default props, just
how the story demonstrates it.
