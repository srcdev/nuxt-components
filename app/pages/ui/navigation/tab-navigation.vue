<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="popout">
          <h1 class="page-heading-2">TabNavigation</h1>

          <!-- ── QA Panel (dev only) ───────────────────────────────── -->
          <div v-if="isDev" class="qa-panel">
            <details class="qa-panel__details" open>
              <summary class="qa-panel__summary">
                <span class="qa-panel__title">QA — TabNavigation</span>
                <code class="qa-panel__status">
                  align:{{ navAlign }} · size:{{ qaLinkSize }}rem · gap:{{ qaGap }}rem ·
                  dur:{{ qaTransitionDuration }}ms
                </code>
              </summary>
              <div class="qa-panel__body">
                <!-- Props -->
                <div class="qa-panel__group qa-panel__group--full">
                  <span class="qa-panel__section">Props</span>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">nav-align</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="a in ['left', 'center', 'right']"
                      :key="a"
                      class="qa-panel__chip"
                      :class="{ 'is-active': navAlign === a }"
                      @click="navAlign = a as 'left' | 'center' | 'right'"
                    >
                      {{ a }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">container width</span>
                  <div class="qa-panel__chips">
                    <button
                      class="qa-panel__chip"
                      :class="{ 'is-active': !isNarrow }"
                      @click="isNarrow = false"
                    >
                      full
                    </button>
                    <button
                      class="qa-panel__chip"
                      :class="{ 'is-active': isNarrow }"
                      @click="isNarrow = true"
                    >
                      narrow (burger)
                    </button>
                  </div>
                </div>

                <!-- Link tokens -->
                <div class="qa-panel__group qa-panel__group--full">
                  <span class="qa-panel__section">Link tokens</span>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">link-color</span>
                  <input v-model="qaLinkColor" type="color" class="qa-panel__color" />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">link-hover-color</span>
                  <input v-model="qaLinkHoverColor" type="color" class="qa-panel__color" />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">link-active-color</span>
                  <input v-model="qaLinkActiveColor" type="color" class="qa-panel__color" />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">link-size — {{ qaLinkSize }}rem</span>
                  <input
                    v-model.number="qaLinkSize"
                    type="range"
                    min="1.2"
                    max="2.4"
                    step="0.1"
                    class="qa-panel__range"
                  />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">link-weight</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="w in [300, 400, 500, 600]"
                      :key="w"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaLinkWeight === w }"
                      @click="qaLinkWeight = w"
                    >
                      {{ w }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">link-tracking — {{ qaLinkTracking }}em</span>
                  <input
                    v-model.number="qaLinkTracking"
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.01"
                    class="qa-panel__range"
                  />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">gap — {{ qaGap }}rem</span>
                  <input
                    v-model.number="qaGap"
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    class="qa-panel__range"
                  />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">transition — {{ qaTransitionDuration }}ms</span>
                  <input
                    v-model.number="qaTransitionDuration"
                    type="range"
                    min="0"
                    max="800"
                    step="25"
                    class="qa-panel__range"
                  />
                </div>

                <!-- Indicator tokens -->
                <div class="qa-panel__group qa-panel__group--full">
                  <span class="qa-panel__section">Indicator tokens</span>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">indicator-color</span>
                  <input v-model="qaIndicatorColor" type="color" class="qa-panel__color" />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">hovered-bg color</span>
                  <input v-model="qaHoveredBgColor" type="color" class="qa-panel__color" />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">hovered-bg opacity — {{ qaHoveredBgOpacity }}</span>
                  <input
                    v-model.number="qaHoveredBgOpacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    class="qa-panel__range"
                  />
                </div>

                <!-- Panel tokens -->
                <div class="qa-panel__group qa-panel__group--full">
                  <span class="qa-panel__section">Panel tokens (visible in narrow mode)</span>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">panel-bg</span>
                  <input v-model="qaPanelBg" type="color" class="qa-panel__color" />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">panel-link-color</span>
                  <input v-model="qaPanelLinkColor" type="color" class="qa-panel__color" />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">panel-slide-duration — {{ qaPanelSlideDuration }}ms</span>
                  <input
                    v-model.number="qaPanelSlideDuration"
                    type="range"
                    min="0"
                    max="800"
                    step="25"
                    class="qa-panel__range"
                  />
                </div>

                <!-- Burger tokens -->
                <div class="qa-panel__group qa-panel__group--full">
                  <span class="qa-panel__section">Burger tokens (visible in narrow mode)</span>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">burger-color</span>
                  <input v-model="qaBurgerColor" type="color" class="qa-panel__color" />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">burger-width — {{ qaBurgerWidth }}px</span>
                  <input
                    v-model.number="qaBurgerWidth"
                    type="range"
                    min="14"
                    max="36"
                    step="1"
                    class="qa-panel__range"
                  />
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">burger-gap — {{ qaBurgerGap }}px</span>
                  <input
                    v-model.number="qaBurgerGap"
                    type="range"
                    min="2"
                    max="12"
                    step="1"
                    class="qa-panel__range"
                  />
                </div>
              </div>
            </details>
          </div>

          <!-- ── Component stage ───────────────────────────────────── -->
          <div class="tab-nav-demo-stage" :class="{ 'is-narrow': isNarrow }" :style="tokenStyles">
            <TabNavigation :nav-item-data="navData" :nav-align="navAlign" />
          </div>
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { NavItemData } from "~/types/components";

definePageMeta({ layout: false });
useHead({
  title: "TabNavigation — Component Demo",
  bodyAttrs: { class: "tab-nav-demo-page" },
});

const isDev = import.meta.dev;

// ── Props ──────────────────────────────────────────────────────────────────
const navAlign = ref<"left" | "center" | "right">("left");
const isNarrow = ref(false);

// ── Link tokens ────────────────────────────────────────────────────────────
const qaLinkColor = ref("#e8e8e8");
const qaLinkHoverColor = ref("#999999");
const qaLinkActiveColor = ref("#e8e8e8");
const qaLinkSize = ref(1.6);
const qaLinkWeight = ref(400);
const qaLinkTracking = ref(0.06);
const qaGap = ref(2.2);
const qaTransitionDuration = ref(250);

// ── Indicator tokens ───────────────────────────────────────────────────────
const qaIndicatorColor = ref("#e8e8e8");
const qaHoveredBgColor = ref("#ffffff");
const qaHoveredBgOpacity = ref(0.08);

// ── Panel tokens ───────────────────────────────────────────────────────────
const qaPanelBg = ref("#1a1614");
const qaPanelLinkColor = ref("#e8e8e8");
const qaPanelSlideDuration = ref(350);

// ── Burger tokens ──────────────────────────────────────────────────────────
const qaBurgerColor = ref("#e8e8e8");
const qaBurgerWidth = ref(22);
const qaBurgerGap = ref(5);

function hexToRgbParts(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

const tokenStyles = computed(() => ({
  "--tab-nav-link-color": qaLinkColor.value,
  "--tab-nav-link-hover-color": qaLinkHoverColor.value,
  "--tab-nav-link-active-color": qaLinkActiveColor.value,
  "--tab-nav-link-size": `${qaLinkSize.value}rem`,
  "--tab-nav-link-weight": String(qaLinkWeight.value),
  "--tab-nav-link-tracking": `${qaLinkTracking.value}em`,
  "--tab-nav-gap": `${qaGap.value}rem`,
  "--tab-nav-transition": `${qaTransitionDuration.value}ms ease`,
  "--tab-nav-decorator-indicator-color": qaIndicatorColor.value,
  "--tab-nav-decorator-hovered-bg": `rgb(${hexToRgbParts(qaHoveredBgColor.value)} / ${qaHoveredBgOpacity.value})`,
  "--tab-nav-panel-bg": qaPanelBg.value,
  "--tab-nav-panel-link-color": qaPanelLinkColor.value,
  "--tab-nav-panel-slide-duration": `${qaPanelSlideDuration.value}ms`,
  "--tab-nav-burger-color": qaBurgerColor.value,
  "--tab-nav-burger-width": `${qaBurgerWidth.value}px`,
  "--tab-nav-burger-gap": `${qaBurgerGap.value}px`,
}));

const navData: NavItemData = {
  main: [
    { text: "Components", href: "/ui/anchor-scroll" },
    { text: "Layouts", href: "/ui/page-row" },
    { text: "Forms", href: "/forms/examples/buttons" },
    { text: "Typography", href: "/typography/hero-text" },
  ],
};
</script>

<style lang="css">
.tab-nav-demo-page {
  .tab-nav-demo-stage {
    margin-block-start: 2rem;
    border: 1px solid oklch(100% 0 0 / 12%);
    border-radius: 0.8rem;
    padding: 2rem;
    background-color: oklch(100% 0 0 / 3%);
    position: relative;
    transition: max-inline-size 0.3s ease;

    &.is-narrow {
      max-inline-size: 260px;
      overflow: hidden;
    }
  }

  .qa-panel {
    background: oklch(15% 0 0);
    color: white;
    font-size: 1.3rem;
    margin-block-start: 2rem;
    border-radius: 0.6rem;
    overflow: hidden;
  }

  .qa-panel__details {
    padding: 1rem 2rem;
  }

  .qa-panel__summary {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1.6rem;
    list-style: none;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }
  }

  .qa-panel__title {
    font-weight: 600;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .qa-panel__status {
    font-family: monospace;
    font-size: 1.2rem;
    background: oklch(0% 0 0 / 0.3);
    padding: 0.2rem 0.8rem;
    border-radius: 0.4rem;
    user-select: text;
    cursor: text;
  }

  .qa-panel__body {
    display: flex;
    flex-wrap: wrap;
    gap: 2.4rem;
    padding-block: 1.2rem 1.6rem;
  }

  .qa-panel__group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    &.qa-panel__group--full {
      flex-basis: 100%;
      margin-block-start: 0.8rem;
      padding-block-end: 0.4rem;
      border-block-end: 1px solid oklch(100% 0 0 / 0.1);

      &:first-child {
        margin-block-start: 0;
      }
    }
  }

  .qa-panel__section {
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: oklch(65% 0.18 240);
  }

  .qa-panel__label {
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.55;
  }

  .qa-panel__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .qa-panel__chip {
    font-family: monospace;
    font-size: 1.2rem;
    color: white;
    background: oklch(0% 0 0 / 0.25);
    border: 1px solid oklch(100% 0 0 / 0.18);
    padding: 0.3rem 1rem;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: oklch(0% 0 0 / 0.4);
    }

    &.is-active {
      background: oklch(55% 0.18 240);
      border-color: oklch(55% 0.18 240);
    }
  }

  .qa-panel__range {
    appearance: none;
    width: 18rem;
    height: 0.4rem;
    background: oklch(100% 0 0 / 0.18);
    border-radius: 0.4rem;
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 50%;
      background: oklch(55% 0.18 240);
      cursor: pointer;
      transition: background 0.15s;
    }

    &::-moz-range-thumb {
      width: 1.4rem;
      height: 1.4rem;
      border: none;
      border-radius: 50%;
      background: oklch(55% 0.18 240);
      cursor: pointer;
      transition: background 0.15s;
    }

    &:hover::-webkit-slider-thumb {
      background: oklch(62% 0.18 240);
    }

    &:hover::-moz-range-thumb {
      background: oklch(62% 0.18 240);
    }
  }

  .qa-panel__color {
    width: 4rem;
    height: 2.8rem;
    border: 1px solid oklch(100% 0 0 / 0.18);
    border-radius: 0.4rem;
    background: none;
    cursor: pointer;
    padding: 0.2rem;
  }
}
</style>
