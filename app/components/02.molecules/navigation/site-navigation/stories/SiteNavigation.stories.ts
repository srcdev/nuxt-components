import { ref, computed } from "vue";
import type { Meta, StoryFn } from "@nuxtjs/storybook";
import SiteNavigationComponent from "../SiteNavigation.vue";
import type { NavItemData } from "~/types/components/navigation-horizontal.d";

const meta: Meta<typeof SiteNavigationComponent> = {
  title: "Molecules/SiteNavigation",
  component: SiteNavigationComponent,
  argTypes: {
    align: {
      control: { type: "select" },
      options: ["left", "center", "right"],
      description: "Alignment of the horizontal nav list",
    },
    navItemData: { table: { disable: true } },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    align: "left",
  },
};

export default meta;

const navItemData: NavItemData = {
  main: [
    { text: "Home", href: "#" },
    { text: "Services", href: "#" },
    { text: "Treatment Consultant", href: "#" },
    { text: "Prices", href: "#" },
    { text: "Contact", href: "#" },
  ],
};

type Theme = "light" | "dark";

const DefaultTemplate: StoryFn<typeof SiteNavigationComponent> = (args) => ({
  components: { SiteNavigationComponent },
  setup() {
    const theme = ref<Theme>("dark");

    const controls = ref({
      linkColor: "#ffffff",
      linkHoverColor: "#c0847a",
      linkActiveColor: "#a86b61",
      linkSize: 1.6,
      linkGap: 2.5,
      panelBg: "#1a1614",
      burgerColor: "#ffffff",
      transitionDuration: 250,
    });

    const setTheme = (newTheme: Theme) => {
      theme.value = newTheme;
      if (newTheme === "light") {
        controls.value.linkColor = "#1a1a1a";
        controls.value.linkHoverColor = "#c0847a";
        controls.value.panelBg = "#f5f0ee";
        controls.value.burgerColor = "#1a1a1a";
      } else {
        controls.value.linkColor = "#ffffff";
        controls.value.linkHoverColor = "#c0847a";
        controls.value.panelBg = "#1a1614";
        controls.value.burgerColor = "#ffffff";
      }
    };

    const navStyle = computed(() => ({
      "--site-nav-link-color": controls.value.linkColor,
      "--site-nav-link-hover-color": controls.value.linkHoverColor,
      "--site-nav-link-active-color": controls.value.linkActiveColor,
      "--site-nav-link-size": `${controls.value.linkSize}rem`,
      "--site-nav-gap": `${controls.value.linkGap}rem`,
      "--site-nav-panel-bg": controls.value.panelBg,
      "--site-nav-burger-color": controls.value.burgerColor,
      "--site-nav-transition": `${controls.value.transitionDuration}ms ease`,
    }));

    const cssSnippet = computed(() => {
      return `.your-selector {
  --site-nav-link-color: ${controls.value.linkColor};
  --site-nav-link-hover-color: ${controls.value.linkHoverColor};
  --site-nav-link-active-color: ${controls.value.linkActiveColor};
  --site-nav-link-size: ${controls.value.linkSize}rem;
  --site-nav-gap: ${controls.value.linkGap}rem;
  --site-nav-panel-bg: ${controls.value.panelBg};
  --site-nav-burger-color: ${controls.value.burgerColor};
  --site-nav-transition: ${controls.value.transitionDuration}ms ease;
}`;
    });

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
    <div class="sb-nav-story">

      <!-- Nav preview -->
      <div class="sb-nav-preview" :class="'theme-' + theme" :style="navStyle">
        <div class="sb-nav-host">
          <SiteNavigationComponent :align="args.align" :nav-item-data="navItemData" />
        </div>
      </div>

      <!-- Controls -->
      <div class="sb-nav-playground">

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
          <legend>Link colours</legend>
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
          <legend>Layout</legend>
          <div class="sb-control-row">
            <label for="sb-link-size">Font size — {{ controls.linkSize }}rem</label>
            <input id="sb-link-size" v-model.number="controls.linkSize" type="range" min="1.2" max="2.4" step="0.1" />
          </div>
          <div class="sb-control-row">
            <label for="sb-link-gap">Gap — {{ controls.linkGap }}rem</label>
            <input id="sb-link-gap" v-model.number="controls.linkGap" type="range" min="0.5" max="6" step="0.25" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Panel</legend>
          <div class="sb-control-row">
            <label for="sb-panel-bg">Panel background</label>
            <input id="sb-panel-bg" v-model="controls.panelBg" type="color" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Burger</legend>
          <div class="sb-control-row">
            <label for="sb-burger-color">Burger colour</label>
            <input id="sb-burger-color" v-model="controls.burgerColor" type="color" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Animation</legend>
          <div class="sb-control-row">
            <label for="sb-transition">Transition — {{ controls.transitionDuration }}ms</label>
            <input id="sb-transition" v-model.number="controls.transitionDuration" type="range" min="0" max="800" step="50" />
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
      .sb-nav-story {
        font-size: 1.4rem;
        display: grid;
        gap: 2.4rem;
        padding: 2.4rem;
      }
      .sb-nav-preview {
        padding: 2rem 0;
        transition: background 300ms;
        border-radius: 0.4rem;
        overflow: hidden;
      }
      .sb-nav-preview.theme-dark { --page-bg: hsl(15 10% 8%); color-scheme: dark; background: var(--page-bg); color: #fff; }
      .sb-nav-preview.theme-light { --page-bg: hsl(0 0% 95%); color-scheme: light; background: var(--page-bg); color: #1a1a1a; }
      /* Simulate a positioned header so the absolute panel works correctly */
      .sb-nav-host {
        position: relative;
        padding-inline: 2.4rem;
        padding-block: 1.2rem;
      }
      .sb-nav-playground {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(28rem, 1fr));
        gap: 1.6rem;
      }
      .sb-nav-playground fieldset {
        border: 1px solid #ccc;
        border-radius: 0.4rem;
        padding: 1.6rem;
      }
      .sb-nav-playground legend {
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
      .sb-control-row input[type="range"] { width: 100%; cursor: pointer; }
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
Default.args = { align: "left" };

export const AlignCenter = DefaultTemplate.bind({});
AlignCenter.args = { align: "center" };
AlignCenter.storyName = "Align — Center";

export const AlignRight = DefaultTemplate.bind({});
AlignRight.args = { align: "right" };
AlignRight.storyName = "Align — Right";
