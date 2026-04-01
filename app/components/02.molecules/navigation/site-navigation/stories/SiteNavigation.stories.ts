import { ref, reactive, computed } from "vue";
import type { Meta, StoryFn } from "@nuxtjs/storybook";
import SiteNavigationComponent from "../SiteNavigation.vue";
import type { NavItemData } from "~/types/components/navigation-horizontal.d";

const meta: Meta<typeof SiteNavigationComponent> = {
  title: "Molecules/SiteNavigation",
  component: SiteNavigationComponent,
  argTypes: {
    navAlign: {
      control: { type: "select" },
      options: ["left", "center", "right"],
      description: "Horizontal alignment of the nav list",
    },
    navItemData: { table: { disable: true } },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    navAlign: "left",
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

type Theme = "light" | "dark";

const themeDefaults: Record<
  Theme,
  {
    indicatorColor: string;
    linkColor: string;
    linkHoverColor: string;
    linkActiveColor: string;
    panelBg: string;
    panelLinkColor: string;
    burgerColor: string;
    pageBg: string;
  }
> = {
  dark: {
    indicatorColor: "#c0847a",
    linkColor: "#f0ece8",
    linkHoverColor: "#e09890",
    linkActiveColor: "#c0847a",
    panelBg: "#1a1614",
    panelLinkColor: "#f0ece8",
    burgerColor: "#f0ece8",
    pageBg: "#1a1614",
  },
  light: {
    indicatorColor: "#b05a50",
    linkColor: "#1a1614",
    linkHoverColor: "#b05a50",
    linkActiveColor: "#8c3a30",
    panelBg: "#f5f2f0",
    panelLinkColor: "#1a1614",
    burgerColor: "#1a1614",
    pageBg: "#f5f2f0",
  },
};

const DefaultTemplate: StoryFn<typeof SiteNavigationComponent> = (args) => ({
  components: { SiteNavigationComponent },
  setup() {
    const theme = ref<Theme>("dark");

    const controls = reactive({ ...themeDefaults.dark });

    const setTheme = (newTheme: Theme) => {
      theme.value = newTheme;
      Object.assign(controls, themeDefaults[newTheme]);
    };

    const navStyle = computed(() => ({
      "--site-nav-decorator-indicator-color": controls.indicatorColor,
      "--site-nav-link-color": controls.linkColor,
      "--site-nav-link-hover-color": controls.linkHoverColor,
      "--site-nav-link-active-color": controls.linkActiveColor,
      "--site-nav-panel-bg": controls.panelBg,
      "--site-nav-panel-link-color": controls.panelLinkColor,
      "--site-nav-panel-decorator-indicator-color": controls.indicatorColor,
      "--site-nav-burger-color": controls.burgerColor,
      "--page-bg": controls.pageBg,
      "margin-block": "3.6rem",
    }));

    const cssSnippet = computed(
      () => `.your-selector {
  /* Indicator */
  --site-nav-decorator-indicator-color: ${controls.indicatorColor};

  /* Horizontal nav links */
  --site-nav-link-color: ${controls.linkColor};
  --site-nav-link-hover-color: ${controls.linkHoverColor};
  --site-nav-link-active-color: ${controls.linkActiveColor};

  /* Mobile panel */
  --site-nav-panel-bg: ${controls.panelBg};
  --site-nav-panel-link-color: ${controls.panelLinkColor};
  --site-nav-panel-decorator-indicator-color: ${controls.indicatorColor};

  /* Burger */
  --site-nav-burger-color: ${controls.burgerColor};
}`
    );

    const copied = ref(false);
    const copySnippet = async () => {
      await navigator.clipboard.writeText(cssSnippet.value);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    };

    return { args, navItemData, theme, controls, setTheme, navStyle, cssSnippet, copied, copySnippet };
  },
  template: `
    <div class="sb-sitenav-story">

      <!-- Preview: simulated header bar -->
      <div class="sb-sitenav-note">
        Resize the browser window to see the navigation collapse into a burger menu.
      </div>
      <div class="sb-sitenav-header" :class="'theme-' + theme" :style="navStyle">
        <div class="sb-sitenav-logo">LOGO</div>
        <SiteNavigationComponent
          :nav-item-data="navItemData"
          :nav-align="args.navAlign"
        />
      </div>

      <!-- Controls -->
      <div class="sb-sitenav-playground">

        <fieldset>
          <legend>Theme</legend>
          <div class="sb-control-row">
            <label>Light / Dark</label>
            <div class="sb-theme-toggle">
              <button :class="{ active: theme === 'light' }" @click="setTheme('light')">Light</button>
              <button :class="{ active: theme === 'dark' }" @click="setTheme('dark')">Dark</button>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Indicator</legend>
          <div class="sb-control-row">
            <label for="sb-indicator-color">Indicator colour</label>
            <input id="sb-indicator-color" v-model="controls.indicatorColor" type="color" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Horizontal nav links</legend>
          <div class="sb-control-row">
            <label for="sb-link-color">Link colour</label>
            <input id="sb-link-color" v-model="controls.linkColor" type="color" />
          </div>
          <div class="sb-control-row">
            <label for="sb-link-hover-color">Hover colour</label>
            <input id="sb-link-hover-color" v-model="controls.linkHoverColor" type="color" />
          </div>
          <div class="sb-control-row">
            <label for="sb-link-active-color">Active colour</label>
            <input id="sb-link-active-color" v-model="controls.linkActiveColor" type="color" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Mobile panel</legend>
          <div class="sb-control-row">
            <label for="sb-panel-bg">Panel background</label>
            <input id="sb-panel-bg" v-model="controls.panelBg" type="color" />
          </div>
          <div class="sb-control-row">
            <label for="sb-panel-link-color">Panel link colour</label>
            <input id="sb-panel-link-color" v-model="controls.panelLinkColor" type="color" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Burger</legend>
          <div class="sb-control-row">
            <label for="sb-burger-color">Burger colour</label>
            <input id="sb-burger-color" v-model="controls.burgerColor" type="color" />
          </div>
        </fieldset>

      </div>

      <!-- CSS snippet -->
      <div class="sb-css-snippet">
        <div class="sb-css-snippet-header">
          <strong>CSS Token Snippet</strong>
          <button class="sb-copy-btn" @click="copySnippet">{{ copied ? 'Copied!' : 'Copy' }}</button>
        </div>
        <pre class="sb-css-snippet-code">{{ cssSnippet }}</pre>
      </div>

    </div>

    <style>
      .sb-sitenav-story {
        font-size: 1.4rem;
        display: grid;
        gap: 2.4rem;
        padding: 2.4rem;
      }
      .sb-sitenav-note {
        font-size: 1.3rem;
        color: #888;
        font-style: italic;
      }
      .sb-sitenav-header {
        display: flex;
        align-items: center;
        gap: 3.2rem;
        padding: 1.2rem 2.4rem;
        transition: background 300ms;
        position: relative;
        min-height: 6rem;
        border-radius: 0.4rem;
      }
      .sb-sitenav-header.theme-dark {
        background: var(--page-bg, #1a1614);
        color-scheme: dark;
      }
      .sb-sitenav-header.theme-light {
        background: var(--page-bg, #f5f2f0);
        color-scheme: light;
      }
      .sb-sitenav-logo {
        font-size: 1.8rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        flex-shrink: 0;
        opacity: 0.5;
      }
      .sb-sitenav-header .site-navigation {
        flex: 1;
        min-width: 0;
      }
      .sb-sitenav-playground {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
        gap: 1.6rem;
      }
      .sb-sitenav-playground fieldset {
        border: 1px solid #ccc;
        border-radius: 0.4rem;
        padding: 1.6rem;
      }
      .sb-sitenav-playground legend {
        font-weight: bold;
        padding: 0 0.8rem;
        font-size: 1.4rem;
      }
      .sb-control-row {
        display: grid;
        grid-template-columns: 1fr 14rem;
        gap: 1rem;
        align-items: center;
        padding: 0.5rem 0;
        font-size: 1.3rem;
      }
      .sb-control-row input[type="color"] {
        height: 3.2rem;
        width: 100%;
        padding: 0.2rem;
        border: 1px solid #ccc;
        border-radius: 0.2rem;
        cursor: pointer;
        background: transparent;
      }
      .sb-theme-toggle { display: flex; gap: 0.4rem; }
      .sb-theme-toggle button {
        padding: 0.4rem 1.6rem;
        border: 1px solid #ccc;
        border-radius: 0.2rem;
        cursor: pointer;
        background: transparent;
        font-size: 1.3rem;
        color: inherit;
      }
      .sb-theme-toggle button.active { background: #e0e0e0; font-weight: bold; }
      .sb-css-snippet {
        border: 1px solid #ccc;
        border-radius: 0.4rem;
        overflow: hidden;
      }
      .sb-css-snippet-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.6rem;
        border-bottom: 1px solid #ccc;
        font-size: 1.4rem;
      }
      .sb-css-snippet-code {
        margin: 0;
        padding: 1.6rem;
        font-family: monospace;
        font-size: 1.3rem;
        line-height: 1.6;
        overflow-x: auto;
        white-space: pre;
      }
      .sb-copy-btn {
        padding: 0.4rem 1.2rem;
        border: 1px solid #ccc;
        border-radius: 0.2rem;
        cursor: pointer;
        background: transparent;
        font-size: 1.3rem;
        color: inherit;
      }
      .sb-copy-btn:hover { background: #e0e0e0; }
    </style>
  `,
});

export const Default = DefaultTemplate.bind({});
Default.args = { navAlign: "left" };
