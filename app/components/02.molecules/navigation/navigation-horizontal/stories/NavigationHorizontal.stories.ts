import { ref, reactive, computed } from "vue";
import type { Meta, StoryFn } from "@nuxtjs/storybook";
import NavigationHorizontalComponent from "../NavigationHorizontal.vue";
import type { NavItemData } from "~/types/components/navigation-horizontal.d";

const meta: Meta<typeof NavigationHorizontalComponent> = {
  title: "Molecules/NavigationHorizontal",
  component: NavigationHorizontalComponent,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["ul", "ol", "div"],
      description: "HTML element to render the nav list as",
    },
    navItemData: { table: { disable: true } },
    styleClassPassthrough: { table: { disable: true } },
  },
  args: {
    tag: "ul",
  },
};

export default meta;

const navItemData: NavItemData = {
  main: [
    { text: "Home", href: "#" },
    { text: "About", href: "#" },
    { text: "Services", href: "#" },
    { text: "Contact", href: "#" },
  ],
};

type Theme = "light" | "dark";

const themeDefaults: Record<Theme, { linkColour: string; linkBg: string; borderColour: string; borderOpacity: number }> = {
  dark: { linkColour: "#ffffff", linkBg: "#333333", borderColour: "#ffffff", borderOpacity: 0.2 },
  light: { linkColour: "#1a1a1a", linkBg: "#e8e8e8", borderColour: "#000000", borderOpacity: 0.15 },
};

const DefaultTemplate: StoryFn<typeof NavigationHorizontalComponent> = (args) => ({
  components: { NavigationHorizontalComponent },
  setup() {
    const theme = ref<Theme>("dark");

    const controls = reactive({
      activeColour: "#00ff00",
      linkColour: themeDefaults.dark.linkColour,
      linkBg: themeDefaults.dark.linkBg,
      borderColour: themeDefaults.dark.borderColour,
      borderOpacity: themeDefaults.dark.borderOpacity,
      borderStart: 0,
      borderEnd: 3,
      listPadding: 2,
      listGap: 3,
      linkPaddingBlock: 0.5,
      linkPaddingInline: 1,
      linkBorderRadius: 0.2,
      glowPosX: 50,
      glowPosY: 100,
      glowInnerStop: 10,
      glowOuterStop: 75,
      glowSize: 32,
      glowOpacity: 0.5,
      anchorOffset: 40,
      transitionDuration: 300,
    });

    const setTheme = (newTheme: Theme) => {
      theme.value = newTheme;
      const defaults = themeDefaults[newTheme];
      controls.linkColour = defaults.linkColour;
      controls.linkBg = defaults.linkBg;
      controls.borderColour = defaults.borderColour;
      controls.borderOpacity = defaults.borderOpacity;
    };

    const navStyle = computed(() => ({
      "--nav-active-colour": controls.activeColour,
      "--nav-link-colour": controls.linkColour,
      "--nav-link-bg": controls.linkBg,
      "--nav-border-colour": `color-mix(in srgb, ${controls.borderColour} ${Math.round(controls.borderOpacity * 100)}%, transparent)`,
      "--nav-border-start": `${controls.borderStart}px`,
      "--nav-border-end": `${controls.borderEnd}px`,
      "--nav-list-padding": `${controls.listPadding}rem`,
      "--nav-list-gap": `${controls.listGap}rem`,
      "--nav-link-padding-block": `${controls.linkPaddingBlock}rem`,
      "--nav-link-padding-inline": `${controls.linkPaddingInline}rem`,
      "--nav-link-border-radius": `${controls.linkBorderRadius}rem`,
      "--nav-glow-pos-x": `${controls.glowPosX}%`,
      "--nav-glow-pos-y": `${controls.glowPosY}%`,
      "--nav-glow-inner-stop": `${controls.glowInnerStop}%`,
      "--nav-glow-outer-stop": `${controls.glowOuterStop}%`,
      "--nav-glow-size": `${controls.glowSize}px`,
      "--nav-glow-opacity": String(controls.glowOpacity),
      "--nav-anchor-offset": `${controls.anchorOffset}px`,
      "--nav-transition-duration": `${controls.transitionDuration}ms`,
      "color-scheme": theme.value,
    }));

    const cssSnippet = computed(() => {
      const borderColour = `color-mix(in srgb, ${controls.borderColour} ${Math.round(controls.borderOpacity * 100)}%, transparent)`;
      return `.your-selector {
  /* Colours */
  --nav-active-colour: ${controls.activeColour};
  --nav-link-colour: ${controls.linkColour};
  --nav-link-bg: ${controls.linkBg};
  --nav-border-colour: ${borderColour};

  /* Borders */
  --nav-border-start: ${controls.borderStart}px;
  --nav-border-end: ${controls.borderEnd}px;

  /* Layout */
  --nav-list-padding: ${controls.listPadding}rem;
  --nav-list-gap: ${controls.listGap}rem;
  --nav-link-padding-block: ${controls.linkPaddingBlock}rem;
  --nav-link-padding-inline: ${controls.linkPaddingInline}rem;
  --nav-link-border-radius: ${controls.linkBorderRadius}rem;

  /* Glow effect */
  --nav-glow-pos-x: ${controls.glowPosX}%;
  --nav-glow-pos-y: ${controls.glowPosY}%;
  --nav-glow-inner-stop: ${controls.glowInnerStop}%;
  --nav-glow-outer-stop: ${controls.glowOuterStop}%;
  --nav-glow-size: ${controls.glowSize}px;
  --nav-glow-opacity: ${controls.glowOpacity};
  --nav-anchor-offset: ${controls.anchorOffset}px;

  /* Animation */
  --nav-transition-duration: ${controls.transitionDuration}ms;
}`;
    });

    const copied = ref(false);
    const copySnippet = async () => {
      await navigator.clipboard.writeText(cssSnippet.value);
      copied.value = true;
      setTimeout(() => { copied.value = false; }, 2000);
    };

    return { args, navItemData, theme, controls, setTheme, navStyle, cssSnippet, copied, copySnippet };
  },
  template: `
    <div class="sb-nav-story">

      <!-- Nav preview -->
      <div class="sb-nav-preview" :class="'theme-' + theme" :style="navStyle">
        <NavigationHorizontalComponent :tag="args.tag" :nav-item-data="navItemData" />
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
          <legend>Colours</legend>
          <div class="sb-control-row">
            <label for="sb-active-colour">Active / glow colour</label>
            <input id="sb-active-colour" v-model="controls.activeColour" type="color" />
          </div>
          <div class="sb-control-row">
            <label for="sb-link-colour">Link text colour</label>
            <input id="sb-link-colour" v-model="controls.linkColour" type="color" />
          </div>
          <div class="sb-control-row">
            <label for="sb-link-bg">Link background</label>
            <input id="sb-link-bg" v-model="controls.linkBg" type="color" />
          </div>
          <div class="sb-control-row">
            <label for="sb-border-colour">Border colour</label>
            <input id="sb-border-colour" v-model="controls.borderColour" type="color" />
          </div>
          <div class="sb-control-row">
            <label for="sb-border-opacity">Border opacity — {{ controls.borderOpacity }}</label>
            <input id="sb-border-opacity" v-model.number="controls.borderOpacity" type="range" min="0" max="1" step="0.05" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Borders</legend>
          <div class="sb-control-row">
            <label for="sb-border-start">Border top — {{ controls.borderStart }}px</label>
            <input id="sb-border-start" v-model.number="controls.borderStart" type="range" min="0" max="10" step="1" />
          </div>
          <div class="sb-control-row">
            <label for="sb-border-end">Border bottom — {{ controls.borderEnd }}px</label>
            <input id="sb-border-end" v-model.number="controls.borderEnd" type="range" min="0" max="10" step="1" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Layout</legend>
          <div class="sb-control-row">
            <label for="sb-list-padding">List padding — {{ controls.listPadding }}rem</label>
            <input id="sb-list-padding" v-model.number="controls.listPadding" type="range" min="0" max="6" step="0.5" />
          </div>
          <div class="sb-control-row">
            <label for="sb-list-gap">List gap — {{ controls.listGap }}rem</label>
            <input id="sb-list-gap" v-model.number="controls.listGap" type="range" min="0" max="10" step="0.25" />
          </div>
          <div class="sb-control-row">
            <label for="sb-link-padding-block">Link vertical padding — {{ controls.linkPaddingBlock }}rem</label>
            <input id="sb-link-padding-block" v-model.number="controls.linkPaddingBlock" type="range" min="0" max="2" step="0.1" />
          </div>
          <div class="sb-control-row">
            <label for="sb-link-padding-inline">Link horizontal padding — {{ controls.linkPaddingInline }}rem</label>
            <input id="sb-link-padding-inline" v-model.number="controls.linkPaddingInline" type="range" min="0" max="3" step="0.1" />
          </div>
          <div class="sb-control-row">
            <label for="sb-link-border-radius">Link border radius — {{ controls.linkBorderRadius }}rem</label>
            <input id="sb-link-border-radius" v-model.number="controls.linkBorderRadius" type="range" min="0" max="2" step="0.1" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Glow Effect</legend>
          <div class="sb-control-row">
            <label for="sb-glow-pos-x">Origin X — {{ controls.glowPosX }}%</label>
            <input id="sb-glow-pos-x" v-model.number="controls.glowPosX" type="range" min="-100" max="100" step="1" />
          </div>
          <div class="sb-control-row">
            <label for="sb-glow-pos-y">Origin Y — {{ controls.glowPosY }}%</label>
            <input id="sb-glow-pos-y" v-model.number="controls.glowPosY" type="range" min="-100" max="200" step="1" />
          </div>
          <div class="sb-control-row">
            <label for="sb-glow-inner-stop">Inner gradient stop — {{ controls.glowInnerStop }}%</label>
            <input id="sb-glow-inner-stop" v-model.number="controls.glowInnerStop" type="range" min="0" max="50" step="1" />
          </div>
          <div class="sb-control-row">
            <label for="sb-glow-outer-stop">Outer gradient stop — {{ controls.glowOuterStop }}%</label>
            <input id="sb-glow-outer-stop" v-model.number="controls.glowOuterStop" type="range" min="50" max="100" step="1" />
          </div>
          <div class="sb-control-row">
            <label for="sb-glow-size">Glow spread — {{ controls.glowSize }}px</label>
            <input id="sb-glow-size" v-model.number="controls.glowSize" type="range" min="0" max="100" step="1" />
          </div>
          <div class="sb-control-row">
            <label for="sb-glow-opacity">Glow opacity — {{ controls.glowOpacity }}</label>
            <input id="sb-glow-opacity" v-model.number="controls.glowOpacity" type="range" min="0" max="1" step="0.05" />
          </div>
          <div class="sb-control-row">
            <label for="sb-anchor-offset">Anchor spread — {{ controls.anchorOffset }}px</label>
            <input id="sb-anchor-offset" v-model.number="controls.anchorOffset" type="range" min="0" max="100" step="1" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Animation</legend>
          <div class="sb-control-row">
            <label for="sb-transition-duration">Transition — {{ controls.transitionDuration }}ms</label>
            <input id="sb-transition-duration" v-model.number="controls.transitionDuration" type="range" min="0" max="1000" step="50" />
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
        padding: 4rem 0;
        transition: background 300ms;
      }
      .sb-nav-preview.theme-dark { --page-bg: hsl(0 0% 8%); color-scheme: dark; background: var(--page-bg); }
      .sb-nav-preview.theme-light { --page-bg: hsl(0 0% 95%); color-scheme: light; background: var(--page-bg); }
      .sb-nav-playground {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
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
Default.args = { tag: "ul" };
