<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="content" :style-class-passthrough="['expanding-panel-section', 'mb-20']">
          <!-- ── QA Panel (dev only) ───────────────────────────────── -->
          <div v-if="isDev" class="qa-panel">
            <details class="qa-panel__details" open>
              <summary class="qa-panel__summary">
                <span class="qa-panel__title">QA — ExpandingPanel</span>
                <code class="qa-panel__status">
                  duration:{{ qaAnimationDuration }}ms · forceOpened:{{ qaForceOpened }} · contentIsOnTop:{{
                    qaContentIsOnTop
                  }}
                  · linked:{{ qaLinked }}
                </code>
              </summary>
              <div class="qa-panel__body">
                <div class="qa-panel__group">
                  <span class="qa-panel__label">Animation Duration</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="d in animationDurations"
                      :key="d"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaAnimationDuration === d }"
                      @click="qaAnimationDuration = d"
                    >
                      {{ d }}ms
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Force Opened</span>
                  <div class="qa-panel__chips">
                    <button
                      class="qa-panel__chip"
                      :class="{ 'is-active': !qaForceOpened }"
                      @click="qaForceOpened = false"
                    >
                      off
                    </button>
                    <button
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaForceOpened }"
                      @click="qaForceOpened = true"
                    >
                      on
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Content Is On Top</span>
                  <div class="qa-panel__chips">
                    <button
                      class="qa-panel__chip"
                      :class="{ 'is-active': !qaContentIsOnTop }"
                      @click="qaContentIsOnTop = false"
                    >
                      off
                    </button>
                    <button
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaContentIsOnTop }"
                      @click="qaContentIsOnTop = true"
                    >
                      on
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Linked (shared name)</span>
                  <div class="qa-panel__chips">
                    <button class="qa-panel__chip" :class="{ 'is-active': !qaLinked }" @click="qaLinked = false">
                      off
                    </button>
                    <button class="qa-panel__chip" :class="{ 'is-active': qaLinked }" @click="qaLinked = true">
                      on
                    </button>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </PageRow>

        <PageRow tag="div" variant="content" :style-class-passthrough="['qa-panel__preview']">
          <section class="qa-panel__preview">
            <h2 class="page-heading-3">Interactive preview</h2>
            <div style="position: relative">
              <ExpandingPanel
                v-model="qaOpen1"
                :name="qaPanel1Name"
                :animation-duration="qaAnimationDuration"
                :force-opened="qaForceOpened"
                :content-is-on-top="qaContentIsOnTop"
                :style-class-passthrough="['qa-preview-panel']"
              >
                <template #summary>
                  <h3 class="page-heading-3 mb-2">Interactive preview panel 1</h3>
                </template>
                <template #content>
                  <!-- Wrapper INSIDE the slot carries visual styling — never .inner itself,
                         see .claude/skills/components/expanding-panel.md for why -->
                  <div class="qa-preview-panel-body">
                    <p class="mt-0">Content driven by the controls above.</p>
                    <p class="mb-0">
                      Toggle "Content Is On Top" to see it overlay the text below instead of pushing it down.
                    </p>
                  </div>
                </template>
              </ExpandingPanel>

              <!-- When "Linked" is on, this shares its name with panel 1 above, grouping them
                   into a native accordion (only one open at a time). -->
              <ExpandingPanel
                v-model="qaOpen2"
                :name="qaPanel2Name"
                :animation-duration="qaAnimationDuration"
                :force-opened="qaForceOpened"
                :content-is-on-top="qaContentIsOnTop"
                :style-class-passthrough="['qa-preview-panel']"
              >
                <template #summary>
                  <h3 class="page-heading-3 mb-2">Interactive preview panel 2</h3>
                </template>
                <template #content>
                  <div class="qa-preview-panel-body">
                    <p class="mt-0">
                      When "Linked" is on, opening this panel closes panel 1, and vice versa.
                    </p>
                    <p class="mb-0">Also driven by the controls above.</p>
                  </div>
                </template>
              </ExpandingPanel>

              <p class="mbs-16">Page content below the preview panel — stays in place when contentIsOnTop is on.</p>
            </div>
          </section>
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "Browser title tag",
  meta: [
    {
      name: "description",
      content: "Meta description content",
    },
  ],
  bodyAttrs: {
    class: "ui-expanding-panel-page",
  },
});

const isDev = import.meta.dev;

const animationDurations = [0, 300, 800] as const;
type AnimationDuration = (typeof animationDurations)[number];

const qaAnimationDuration = ref<AnimationDuration>(300);
const qaForceOpened = ref(false);
const qaContentIsOnTop = ref(false);
const qaLinked = ref(false);
const qaOpen1 = ref(false);
const qaOpen2 = ref(false);

const qaPanel1Name = "qa-preview-1";
const qaPanel2Name = computed(() => (qaLinked.value ? qaPanel1Name : "qa-preview-2"));

// forceOpened only forces panels *open*; a panel's own isPanelOpen state is left untouched
// by the component (see expanding-panel skill notes), so toggling forceOpened off can leave
// a panel open or closed depending on hidden prior clicks. Reset both panels to a known,
// visible state on every toggle so the QA control always produces an obvious response.
watch(qaForceOpened, () => {
  qaOpen1.value = false;
  qaOpen2.value = false;
});
</script>

<style lang="css">
.expanding-panel-section {
  .expanding-panel {
    + .expanding-panel {
      margin-block-start: 1rem;
    }
    &.custom-style-1 {
      .expanding-panel-summary {
        gap: 0;
        flex-direction: row-reverse;
      }
    }

    &.custom-style-2 {
      .expanding-panel-summary {
        gap: 0;
        flex-direction: row-reverse;
      }
    }
    &.linked {
      .expanding-panel-summary {
        gap: 0;
        flex-direction: row;
      }
    }
  }
}

.ui-expanding-panel-page {
  .qa-panel {
    background: oklch(15% 0 0);
    color: white;
    font-size: 1.3rem;
    margin-block-end: 2rem;
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

  .qa-panel__preview {
    padding: 0 2rem 2rem;

    .expanding-panel.qa-preview-panel {
      --expanding-panel-content-z-index: 20;

      + .expanding-panel.qa-preview-panel {
        margin-block-start: 1rem;
      }
    }

    .qa-preview-panel-body {
      background-color: white;
      color: black;
      border: 1px solid oklch(0% 0 0 / 0.15);
      border-radius: 0.4rem;
      padding: 1rem;
      box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
    }
  }
}
</style>
