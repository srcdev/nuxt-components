import { ref, reactive, computed } from "vue";
import type { Meta, StoryFn, StoryObj } from "@nuxtjs/storybook";
import TabNavigationComponent from "../TabNavigation.vue";
import CanvasSwitcher from "../../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { NavItemData } from "~/types/components/nav-item.d";
import type { MediaCanvas } from "~/types/components";

const meta: Meta<typeof TabNavigationComponent> = {
  title: "Molecules/TabNavigation",
  component: TabNavigationComponent,
  parameters: {
    docs: {
      description: {
        component:
          "**Deprecated: use ResponsiveHeader.** It handles the same route and `#anchor` links (with " +
          "`anchorScrollOffset`) and collapses item by item rather than all-or-nothing. See \"Migrating from " +
          "TabNavigation\" in the ResponsiveHeader skill doc. TabNavigation stays until existing consumers have moved.",
      },
    },
  },
  argTypes: {
    navAlign: {
      control: { type: "select" },
      options: ["left", "center", "right"],
      description: "Horizontal alignment of the nav list",
    },
    ariaLabel: { control: "text", description: "aria-label on the nav landmark; override for localisation" },
    openMenuLabel: { control: "text", description: "Burger button label while the menu is closed" },
    closeMenuLabel: { control: "text", description: "Burger button label while the menu is open" },
    navItemData: { table: { disable: true } },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    navAlign: "left",
    ariaLabel: "Site navigation",
    openMenuLabel: "Open navigation menu",
    closeMenuLabel: "Close navigation menu",
  },
};

export default meta;

const navItemData: NavItemData = {
  main: [
    { text: "Home", href: "#" },
    { text: "About", href: "#" },
    { text: "Services", href: "#" },
    { text: "Work", href: "#" },
    { text: "Contact", href: "#" },
  ],
};

// Playground: every control starts unset, so the nav shows the component's own (light) defaults.
// Picking a colour sets that token as an override; Reset removes it again.
const tokenControls = [
  { group: "Indicator", label: "Indicator colour", token: "--tab-nav-decorator-indicator-color" },
  { group: "Horizontal nav links", label: "Link colour", token: "--tab-nav-link-color" },
  { group: "Horizontal nav links", label: "Hover colour", token: "--tab-nav-link-hover-color" },
  { group: "Horizontal nav links", label: "Active colour", token: "--tab-nav-link-active-color" },
  { group: "Horizontal nav links", label: "Focus ring colour", token: "--tab-nav-focus-ring-colour" },
  { group: "Mobile panel", label: "Panel background", token: "--tab-nav-panel-bg" },
  { group: "Mobile panel", label: "Panel link colour", token: "--tab-nav-panel-link-color" },
  { group: "Burger", label: "Burger colour", token: "--tab-nav-burger-color" },
] as const;

type Token = (typeof tokenControls)[number]["token"];

const DefaultTemplate: StoryFn<typeof TabNavigationComponent> = (args) => ({
  components: { TabNavigationComponent },
  setup() {
    const overrides = reactive<Partial<Record<Token, string>>>({});
    const groups = [...new Set(tokenControls.map((control) => control.group))].map((group) => ({
      group,
      controls: tokenControls.filter((control) => control.group === group),
    }));

    const setOverride = (token: Token, event: Event) => {
      overrides[token] = (event.target as HTMLInputElement).value;
    };
    const resetOverride = (token: Token) => {
      overrides[token] = undefined;
    };

    const activeOverrides = computed(() => Object.entries(overrides).filter(([, value]) => value));

    const navStyle = computed(() => Object.fromEntries(activeOverrides.value));

    const cssSnippet = computed(() => {
      const lines = activeOverrides.value.map(([token, value]) => `  ${token}: ${value};`);
      return lines.length
        ? `.your-selector {\n${lines.join("\n")}\n}`
        : "/* No overrides: the nav is using its default (light theme) colours. */";
    });

    const copied = ref(false);
    const copySnippet = async () => {
      await navigator.clipboard.writeText(cssSnippet.value);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    };

    return { args, navItemData, groups, overrides, setOverride, resetOverride, navStyle, cssSnippet, copied, copySnippet };
  },
  template: `
    <div class="sb-tabnav-story">

      <div class="sb-tabnav-note">
        Resize the browser window to see the navigation collapse into a burger menu.
        The active indicator uses CSS <code>anchor-name</code> / <code>position-anchor</code> —
        no JavaScript required. Unsupported browsers fall back to link colour changes only.
        The colours below start at the component defaults (light theme); dark mode is the consumer app's
        call, e.g. with <code>light-dark()</code> in its own token overrides.
      </div>

      <div class="sb-tabnav-header" :style="navStyle">
        <div class="sb-tabnav-logo">LOGO</div>
        <TabNavigationComponent v-bind="args" :nav-item-data="navItemData" />
      </div>

      <div class="sb-tabnav-playground">
        <fieldset v-for="{ group, controls } in groups" :key="group">
          <legend>{{ group }}</legend>
          <div v-for="control in controls" :key="control.token" class="sb-control-row">
            <label :for="control.token">{{ control.label }}</label>
            <input
              :id="control.token"
              type="color"
              :value="overrides[control.token] ?? '#000000'"
              @input="setOverride(control.token, $event)"
            />
            <button
              v-if="overrides[control.token]"
              type="button"
              class="sb-reset-btn"
              @click="resetOverride(control.token)"
            >
              Reset
            </button>
            <span v-else class="sb-default-badge">default</span>
          </div>
        </fieldset>
      </div>

      <div class="sb-css-snippet">
        <div class="sb-css-snippet-header">
          <strong>CSS Token Snippet</strong>
          <button class="sb-copy-btn" type="button" @click="copySnippet">{{ copied ? 'Copied!' : 'Copy' }}</button>
        </div>
        <pre class="sb-css-snippet-code">{{ cssSnippet }}</pre>
      </div>

      <component is="style">
        .sb-tabnav-story { font-size: 1.4rem; display: grid; gap: 2.4rem; padding: 2.4rem; }
        .sb-tabnav-note { font-size: 1.3rem; opacity: 0.7; font-style: italic; }
        .sb-tabnav-note code { font-family: monospace; background: rgba(128,128,128,0.15); padding: 0.1em 0.4em; border-radius: 0.2rem; }
        .sb-tabnav-header {
          display: flex; align-items: center; gap: 3.2rem; padding: 1.2rem 2.4rem;
          position: relative; min-height: 6rem; border-radius: 0.4rem;
          border: 1px solid rgba(128,128,128,0.3);
        }
        .sb-tabnav-logo { font-size: 1.8rem; font-weight: 700; letter-spacing: 0.1em; flex-shrink: 0; opacity: 0.5; }
        .sb-tabnav-header .tab-navigation { flex: 1; min-width: 0; }
        .sb-tabnav-playground { display: grid; grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr)); gap: 1.6rem; }
        .sb-tabnav-playground fieldset { border: 1px solid #ccc; border-radius: 0.4rem; padding: 1.6rem; }
        .sb-tabnav-playground legend { font-weight: bold; padding: 0 0.8rem; font-size: 1.4rem; }
        .sb-control-row { display: grid; grid-template-columns: 1fr 8rem 6rem; gap: 1rem; align-items: center; padding: 0.5rem 0; font-size: 1.3rem; }
        .sb-control-row input[type="color"] { height: 3.2rem; width: 100%; padding: 0.2rem; border: 1px solid #ccc; border-radius: 0.2rem; cursor: pointer; background: transparent; }
        .sb-default-badge { font-size: 1.1rem; opacity: 0.6; text-align: center; }
        .sb-css-snippet { border: 1px solid #ccc; border-radius: 0.4rem; overflow: hidden; }
        .sb-css-snippet-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.6rem; border-bottom: 1px solid #ccc; font-size: 1.4rem; }
        .sb-css-snippet-code { margin: 0; padding: 1.6rem; font-family: monospace; font-size: 1.3rem; line-height: 1.6; overflow-x: auto; white-space: pre; }
        .sb-copy-btn, .sb-reset-btn { padding: 0.4rem 1.2rem; border: 1px solid #ccc; border-radius: 0.2rem; cursor: pointer; background: transparent; font-size: 1.3rem; color: inherit; }
        .sb-copy-btn:hover, .sb-reset-btn:hover { background: #e0e0e0; }
      </component>
    </div>
  `,
});

export const Default = DefaultTemplate.bind({});
Default.args = { navAlign: "left" };

// ─── Stress test ──────────────────────────────────────────────────────────────

const longGerman = "Haarverlängerungsbehandlungsberatungsterminvereinbarung";

const stressNavItemData: NavItemData = {
  main: [
    { text: "Startseite", href: "#start" },
    { text: `${longGerman} und mehr`, href: "#lang" },
    { text: "", href: "#blank" },
    { text: "   ", href: "#spaces" },
    { text: "😀 Emoji first", href: "#emoji", iconName: "this-icon:does-not-exist" },
    { text: "<b>not bold</b>", href: "#html" },
    { text: "تسريحات شعر جديدة", href: "#rtl" },
    { text: "https://example.com/a/very/long/url/that/never/breaks/at/all", href: "https://example.com", isExternal: true },
    { text: "Same href one", href: "#same" },
    { text: "Same href two", href: "#same" },
    { text: "No href" },
    { text: "A", href: "#a" },
  ],
};

export const StressTest: StoryObj<typeof TabNavigationComponent> = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    ariaLabel: "Hauptnavigation",
    openMenuLabel: "Navigationsmenü öffnen",
    closeMenuLabel: "Navigationsmenü schließen",
  },
  render: (args) => ({
    components: { TabNavigationComponent },
    setup() {
      return { args, stressNavItemData };
    },
    template: `
      <div
        style="position: relative; display: flex; align-items: center; gap: 2.4rem; padding: 1.2rem 2.4rem; min-height: 6rem;"
      >
        <strong style="flex-shrink: 0;">LOGO</strong>
        <TabNavigationComponent v-bind="args" :nav-item-data="stressNavItemData" style="flex: 1; min-inline-size: 0;" />
      </div>
    `,
  }),
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
        <div :class="canvasName" style="margin-inline: auto; padding-block-end: 40rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    initialCanvas: "fullWidthCanvas",
    docs: {
      description: {
        story:
          "Deliberately hostile data to find breakage: twelve items including a long German compound word, an unbroken " +
          "URL, emoji (with a broken icon name), HTML-like text (must render as text), right-to-left Arabic, a single " +
          "character, two items sharing an href, one with no href, and two blank labels (skipped: a link with no text " +
          "has no accessible name), plus German landmark and burger labels." +
          " Check at every canvas width: the bar " +
          "collapses to the burger as soon as the items don\x27t fit rather than overflowing; in the open panel every " +
          "label wraps inside the panel; Tab shows a focus ring on each link; and the burger\x27s label switches language.",
      },
    },
  },
};
