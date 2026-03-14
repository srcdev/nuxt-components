<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Navigation Horizontal</h2>
          <p class="page-body-medium">This navigation has a reflective glow effect</p>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <DisplayThemeSwitch />
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-4']">
          <LayoutRow tag="div" variant="content">
            <h3 class="page-heading-3">Control settings</h3>
          </LayoutRow>
          <div class="nav-preview" :class="`theme-${theme}`" :style="navStyle">
            <NavigationHorizontal :nav-item-data="navItemData" />
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-4']">
          <LayoutRow tag="div" variant="content">
            <h3 class="page-heading-3">User controllable</h3>
          </LayoutRow>
          <div class="nav-preview" :class="`theme-${theme}`" :style="navStyle">
            <NavigationHorizontalAdvanced :nav-item-data="navItemData" />
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <div class="nav-playground">
            <fieldset>
              <legend>Theme</legend>
              <div class="control-row">
                <label>Light / Dark</label>
                <div class="theme-toggle">
                  <button :class="{ active: theme === 'light' }" @click="setTheme('light')">Light</button>
                  <button :class="{ active: theme === 'dark' }" @click="setTheme('dark')">Dark</button>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Colours</legend>
              <div class="control-row">
                <label for="active-colour">Active / glow colour</label>
                <input id="active-colour" v-model="controls.activeColour" type="color" />
              </div>
              <div class="control-row">
                <label for="link-colour">Link text colour</label>
                <input id="link-colour" v-model="controls.linkColour" type="color" />
              </div>
              <div class="control-row">
                <label for="link-bg">Link background</label>
                <input id="link-bg" v-model="controls.linkBg" type="color" />
              </div>
              <div class="control-row">
                <label for="border-colour">Border colour</label>
                <input id="border-colour" v-model="controls.borderColour" type="color" />
              </div>
              <div class="control-row">
                <label for="border-opacity">Border opacity — {{ controls.borderOpacity }}</label>
                <input
                  id="border-opacity"
                  v-model.number="controls.borderOpacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>Borders</legend>
              <div class="control-row">
                <label for="border-start">Border top — {{ controls.borderStart }}px</label>
                <input id="border-start" v-model.number="controls.borderStart" type="range" min="0" max="10" step="1" />
              </div>
              <div class="control-row">
                <label for="border-end">Border bottom — {{ controls.borderEnd }}px</label>
                <input id="border-end" v-model.number="controls.borderEnd" type="range" min="0" max="10" step="1" />
              </div>
            </fieldset>

            <fieldset>
              <legend>Layout</legend>
              <div class="control-row">
                <label for="list-padding">List padding — {{ controls.listPadding }}rem</label>
                <input
                  id="list-padding"
                  v-model.number="controls.listPadding"
                  type="range"
                  min="0"
                  max="6"
                  step="0.5"
                />
              </div>
              <div class="control-row">
                <label for="list-gap">List gap — {{ controls.listGap }}rem</label>
                <input id="list-gap" v-model.number="controls.listGap" type="range" min="0" max="10" step="0.25" />
              </div>
              <div class="control-row">
                <label for="link-padding-block">Link vertical padding — {{ controls.linkPaddingBlock }}rem</label>
                <input
                  id="link-padding-block"
                  v-model.number="controls.linkPaddingBlock"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                />
              </div>
              <div class="control-row">
                <label for="link-padding-inline">Link horizontal padding — {{ controls.linkPaddingInline }}rem</label>
                <input
                  id="link-padding-inline"
                  v-model.number="controls.linkPaddingInline"
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                />
              </div>
              <div class="control-row">
                <label for="link-border-radius">Link border radius — {{ controls.linkBorderRadius }}rem</label>
                <input
                  id="link-border-radius"
                  v-model.number="controls.linkBorderRadius"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>Glow Effect</legend>
              <div class="control-row">
                <label for="glow-pos-x">Origin X — {{ controls.glowPosX }}%</label>
                <input id="glow-pos-x" v-model.number="controls.glowPosX" type="range" min="-100" max="100" step="1" />
              </div>
              <div class="control-row">
                <label for="glow-pos-y">Origin Y — {{ controls.glowPosY }}%</label>
                <input id="glow-pos-y" v-model.number="controls.glowPosY" type="range" min="-100" max="200" step="1" />
              </div>
              <div class="control-row">
                <label for="glow-inner-stop">Inner gradient stop — {{ controls.glowInnerStop }}%</label>
                <input
                  id="glow-inner-stop"
                  v-model.number="controls.glowInnerStop"
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                />
              </div>
              <div class="control-row">
                <label for="glow-outer-stop">Outer gradient stop — {{ controls.glowOuterStop }}%</label>
                <input
                  id="glow-outer-stop"
                  v-model.number="controls.glowOuterStop"
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                />
              </div>
              <div class="control-row">
                <label for="glow-size">Glow spread — {{ controls.glowSize }}px</label>
                <input id="glow-size" v-model.number="controls.glowSize" type="range" min="0" max="100" step="1" />
              </div>
              <div class="control-row">
                <label for="glow-opacity">Glow opacity — {{ controls.glowOpacity }}</label>
                <input
                  id="glow-opacity"
                  v-model.number="controls.glowOpacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                />
              </div>
              <div class="control-row">
                <label for="anchor-offset">Anchor spread — {{ controls.anchorOffset }}px</label>
                <input
                  id="anchor-offset"
                  v-model.number="controls.anchorOffset"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>Animation</legend>
              <div class="control-row">
                <label for="transition-duration">Transition — {{ controls.transitionDuration }}ms</label>
                <input
                  id="transition-duration"
                  v-model.number="controls.transitionDuration"
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                />
              </div>
            </fieldset>
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <div class="css-snippet">
            <div class="css-snippet-header">
              <h3 class="page-heading-3">CSS Token Snippet</h3>
              <button class="copy-btn" @click="copySnippet">{{ copied ? "Copied!" : "Copy" }}</button>
            </div>
            <pre class="css-snippet-code">{{ cssSnippet }}</pre>
          </div>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { NavItemData } from "~/types/components/navigation-horizontal.d";
definePageMeta({
  layout: false,
});

useHead({
  title: "Navigation Horizontal",
  meta: [
    {
      name: "description",
      content: "Navigation Horizontal Meta description content",
    },
  ],
  bodyAttrs: {
    class: "navigation-horizontal-page",
  },
});

const navItemData: NavItemData = {
  main: [
    { text: "Home", href: "#", isExternal: true, iconName: "home", cssName: "home-link" },
    { text: "About", href: "#", isExternal: true, iconName: "info", cssName: "about-link" },
    { text: "Services", href: "#", isExternal: true, iconName: "services", cssName: "services-link" },
    { text: "Contact", href: "#", isExternal: true, iconName: "contact", cssName: "contact-link" },
  ],
};

type Theme = "light" | "dark";

const themeDefaults: Record<
  Theme,
  { linkColour: string; linkBg: string; borderColour: string; borderOpacity: number }
> = {
  dark: { linkColour: "#ffffff", linkBg: "#333333", borderColour: "#ffffff", borderOpacity: 0.2 },
  light: { linkColour: "#1a1a1a", linkBg: "#e8e8e8", borderColour: "#000000", borderOpacity: 0.15 },
};

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
  setTimeout(() => {
    copied.value = false;
  }, 2000);
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
</script>

<style lang="css">
.navigation-horizontal-page {
  .nav-preview {
    padding: 4rem 0;
    transition: background 300ms;

    &.theme-dark {
      --page-bg: hsl(0 0% 8%);
      /* background: var(--page-bg); */
    }

    &.theme-light {
      --page-bg: hsl(0 0% 95%);
      /* background: var(--page-bg); */
    }
  }

  .nav-playground {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
    gap: 2rem;
    padding-block: 2rem;

    fieldset {
      border: 1px solid light-dark(var(--slate-04), var(--slate-06));
      border-radius: 0.4rem;
      padding: 1.6rem;

      legend {
        font-weight: bold;
        padding: 0 0.8rem;
        font-size: 1.4rem;
      }

      .control-row {
        display: grid;
        grid-template-columns: 1fr 14rem;
        gap: 1rem;
        align-items: center;
        padding: 0.5rem 0;

        label {
          font-size: 1.3rem;
        }

        input[type="range"] {
          width: 100%;
          cursor: pointer;
        }

        input[type="color"] {
          height: 3.2rem;
          width: 100%;
          padding: 0.2rem;
          border: 1px solid light-dark(var(--slate-04), var(--slate-06));
          border-radius: 0.2rem;
          cursor: pointer;
          background: transparent;
        }
      }
    }

    .theme-toggle {
      display: flex;
      gap: 0.4rem;

      button {
        padding: 0.4rem 1.6rem;
        border: 1px solid light-dark(var(--slate-05), var(--slate-06));
        border-radius: 0.2rem;
        cursor: pointer;
        background: transparent;
        font-size: 1.3rem;
        color: inherit;

        &.active {
          background: light-dark(var(--slate-03), var(--slate-07));
          font-weight: bold;
        }
      }
    }
  }

  .css-snippet {
    border: 1px solid light-dark(var(--slate-04), var(--slate-06));
    border-radius: 0.4rem;
    overflow: hidden;

    .css-snippet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.6rem;
      border-block-end: 1px solid light-dark(var(--slate-04), var(--slate-06));
      /* background: light-dark(var(--slate-02), var(--slate-08)); */
    }

    .css-snippet-code {
      margin: 0;
      padding: 1.6rem;
      font-family: monospace;
      font-size: 1.3rem;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
      /* background: light-dark(var(--slate-01), var(--slate-09)); */
    }

    .copy-btn {
      padding: 0.4rem 1.2rem;
      border: 1px solid light-dark(var(--slate-05), var(--slate-06));
      border-radius: 0.2rem;
      cursor: pointer;
      background: transparent;
      font-size: 1.3rem;
      color: inherit;

      &:hover {
        background: light-dark(var(--slate-03), var(--slate-07));
      }
    }
  }
}
</style>
