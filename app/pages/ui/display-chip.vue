<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="popout">
          <h1 class="page-heading-2">Display Chip</h1>

          <!-- ── QA Panel (dev only) ───────────────────────────────── -->
          <div v-if="isDev" class="qa-panel">
            <details class="qa-panel__details">
              <summary class="qa-panel__summary">
                <span class="qa-panel__title">QA — DisplayChip</span>
                <code class="qa-panel__status">
                  size:{{ qaSize }}px · mask:{{ qaMaskWidth }}px · offset:{{ qaOffset }}px · angle:{{ qaAngle }}deg
                </code>
              </summary>
              <div class="qa-panel__body">
                <div class="qa-panel__group">
                  <span class="qa-panel__label">Size</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="preset in sizePresets"
                      :key="preset"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaSize === preset }"
                      @click="qaSize = preset"
                    >
                      {{ preset }}px
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Mask Width</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="preset in maskWidthPresets"
                      :key="preset"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaMaskWidth === preset }"
                      @click="qaMaskWidth = preset"
                    >
                      {{ preset }}px
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Offset</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="preset in offsetPresets"
                      :key="preset"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaOffset === preset }"
                      @click="qaOffset = preset"
                    >
                      {{ preset }}px
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Angle — {{ qaAngle }}deg</span>
                  <input v-model.number="qaAngle" type="range" min="0" max="360" step="1" class="qa-panel__range" />
                </div>
              </div>
            </details>
          </div>

          <section>
            <div class="dl">
              <div class="dt">Round</div>
              <div class="dd">
                <DisplayChip shape="circle" :config="chipConfig" :style-class-passthrough="['online']">
                  <div class="demo-content round">
                    <Icon name="akar-icons:info" class="icon" />
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Round + Icon</div>
              <div class="dd">
                <DisplayChip
                  shape="circle"
                  :config="{ ...chipConfig, icon: 'material-symbols:star-outline' }"
                  :style-class-passthrough="['online']"
                >
                  <div class="demo-content round">
                    <p class="page-body-normal">SRC</p>
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Round + Text (1 character)</div>
              <div class="dd">
                <DisplayChip
                  shape="circle"
                  :config="{ ...chipConfig, label: '2' }"
                  :style-class-passthrough="['online']"
                >
                  <div class="demo-content round">
                    <p class="page-body-normal">SRC</p>
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Round + Text (2 character)</div>
              <div class="dd">
                <DisplayChip
                  shape="circle"
                  :config="{ ...chipConfig, label: '+2' }"
                  :style-class-passthrough="['online']"
                >
                  <div class="demo-content round">
                    <p class="page-body-normal">SRC</p>
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Round + Text (3 character)</div>
              <div class="dd">
                <DisplayChip
                  shape="circle"
                  :config="{ ...chipConfig, label: '314' }"
                  :style-class-passthrough="['online']"
                >
                  <div class="demo-content round">
                    <p class="page-body-normal">SRC</p>
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Square</div>
              <div class="dd">
                <DisplayChip shape="square" :config="chipConfig" :style-class-passthrough="['idle']">
                  <div class="demo-content square">
                    <Icon name="akar-icons:info" class="icon" />
                  </div>
                </DisplayChip>
              </div>
            </div>
          </section>
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { DisplayChipConfig } from "~/types/components";

definePageMeta({
  layout: false,
});

useHead({
  title: "UI Display Chips",
  meta: [{ name: "description", content: "Examples of UI Display Chips" }],
  bodyAttrs: {
    class: "ui-display-chip-page",
  },
});

// ── QA controls (dev only) ────────────────────────────────────────
const isDev = import.meta.dev;

const qaSize = ref(12);
const qaMaskWidth = ref(4);
const qaOffset = ref(2);
const qaAngle = ref(45);

const sizePresets = [8, 10, 12, 16, 20, 24];
const maskWidthPresets = [0, 2, 4, 6, 8];
const offsetPresets = [-4, 0, 2, 4, 8];

const chipConfig = computed(
  (): DisplayChipConfig => ({
    size: `${qaSize.value}px`,
    maskWidth: `${qaMaskWidth.value}px`,
    offset: `${qaOffset.value}px`,
    angle: `${qaAngle.value}deg`,
  })
);
</script>

<style lang="css">
.ui-display-chip-page {
  /* ── QA Panel ──────────────────────────────────────────────────── */

  .qa-panel {
    background: oklch(15% 0 0);
    color: white;
    font-size: 1.3rem;
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
    padding-block: 1.2rem 0.4rem;
  }

  .qa-panel__group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
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

  /* ── Demo grid ─────────────────────────────────────────────────── */

  section {
    margin-top: 2rem;

    .dl {
      display: grid;
      grid-template-columns: auto auto;
      gap: 2rem;
      align-items: center;
      justify-content: start;

      .dt {
        font-weight: bold;
      }

      .dd {
        margin: 0;

        .demo-content {
          display: flex;
          align-items: center;
          justify-content: center;

          .page-body-normal {
            color: light-dark(var(--slate-10), var(--slate-10));
          }

          .icon {
            width: 24px;
            height: 24px;
            color: light-dark(var(--slate-10), var(--slate-10));
          }

          &.round {
            width: 50px;
            height: 50px;
            background-color: light-dark(var(--slate-03), var(--slate-04));
            border-radius: 50%;
          }

          &.square {
            width: 50px;
            height: 50px;
            background-color: light-dark(var(--slate-03), var(--slate-04));
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>
