<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout">
          <h1 class="page-heading-2">Display Pill</h1>

          <!-- ── QA Panel (dev only) ───────────────────────────────── -->
          <div v-if="isDev" class="qa-panel">
            <details class="qa-panel__details" open>
              <summary class="qa-panel__summary">
                <span class="qa-panel__title">QA — DisplayPill</span>
                <code class="qa-panel__status">
                  variant:{{ qaVariant }} · size:{{ qaSize }} · reversed:{{ qaReversed }}
                </code>
              </summary>
              <div class="qa-panel__body">

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Variant</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="v in variants"
                      :key="v"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaVariant === v }"
                      @click="qaVariant = v"
                    >{{ v }}</button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Size</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="s in sizes"
                      :key="s"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaSize === s }"
                      @click="qaSize = s"
                    >{{ s }}</button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Reversed</span>
                  <div class="qa-panel__chips">
                    <button
                      class="qa-panel__chip"
                      :class="{ 'is-active': !qaReversed }"
                      @click="qaReversed = false"
                    >icon → text</button>
                    <button
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaReversed }"
                      @click="qaReversed = true"
                    >text → icon</button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Tag</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="t in tags"
                      :key="t"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaTag === t }"
                      @click="qaTag = t"
                    >&lt;{{ t }}&gt;</button>
                  </div>
                </div>

              </div>
            </details>
          </div>

          <!-- ── Demos ─────────────────────────────────────────────── -->
          <section>
            <h2 class="page-heading-3">Interactive preview</h2>
            <div class="demo-row">
              <DisplayPill
                :tag="qaTag"
                label="Label text"
                :variant="qaVariant"
                :size="qaSize"
                :reversed="qaReversed"
              >
                <template #icon>
                  <Icon name="material-symbols:star-outline-rounded" class="demo-icon" aria-hidden="true" />
                </template>
              </DisplayPill>
            </div>

            <h2 class="page-heading-3">All variants</h2>
            <div class="dl">
              <template v-for="v in variants" :key="v">
                <div class="dt">{{ v }}</div>
                <div class="dd">
                  <DisplayPill :variant="v" label="Status" :size="qaSize" :reversed="qaReversed">
                    <template #icon>
                      <Icon name="material-symbols:circle" class="demo-icon" aria-hidden="true" />
                    </template>
                  </DisplayPill>
                </div>
              </template>
            </div>

            <h2 class="page-heading-3">All sizes</h2>
            <div class="dl">
              <template v-for="s in sizes" :key="s">
                <div class="dt">{{ s }}</div>
                <div class="dd">
                  <DisplayPill :size="s" :variant="qaVariant" label="Label" :reversed="qaReversed">
                    <template #icon>
                      <Icon name="material-symbols:bolt-rounded" class="demo-icon" aria-hidden="true" />
                    </template>
                  </DisplayPill>
                </div>
              </template>
            </div>

            <h2 class="page-heading-3">Border &amp; outline</h2>
            <div class="dl">
              <div class="dt">Solid border</div>
              <div class="dd">
                <DisplayPill
                  label="Bordered"
                  :variant="qaVariant"
                  :size="qaSize"
                  style-class-passthrough="demo-bordered"
                >
                  <template #icon>
                    <Icon name="material-symbols:circle-outline" class="demo-icon" aria-hidden="true" />
                  </template>
                </DisplayPill>
              </div>

              <div class="dt">Dashed border</div>
              <div class="dd">
                <DisplayPill
                  label="Dashed"
                  :variant="qaVariant"
                  :size="qaSize"
                  style-class-passthrough="demo-dashed"
                >
                  <template #icon>
                    <Icon name="material-symbols:circle-outline" class="demo-icon" aria-hidden="true" />
                  </template>
                </DisplayPill>
              </div>

              <div class="dt">Outline (focus-ring style)</div>
              <div class="dd">
                <DisplayPill
                  label="Outlined"
                  :variant="qaVariant"
                  :size="qaSize"
                  style-class-passthrough="demo-outlined"
                >
                  <template #icon>
                    <Icon name="material-symbols:circle-outline" class="demo-icon" aria-hidden="true" />
                  </template>
                </DisplayPill>
              </div>

              <div class="dt">Border + outline</div>
              <div class="dd">
                <DisplayPill
                  label="Both"
                  :variant="qaVariant"
                  :size="qaSize"
                  style-class-passthrough="demo-border-and-outline"
                >
                  <template #icon>
                    <Icon name="material-symbols:circle-outline" class="demo-icon" aria-hidden="true" />
                  </template>
                </DisplayPill>
              </div>
            </div>

            <h2 class="page-heading-3">Icon only / label only</h2>
            <div class="dl">
              <div class="dt">Icon + label (default)</div>
              <div class="dd">
                <DisplayPill :variant="qaVariant" label="With icon" :size="qaSize">
                  <template #icon>
                    <Icon name="material-symbols:check-circle-outline-rounded" class="demo-icon" aria-hidden="true" />
                  </template>
                </DisplayPill>
              </div>

              <div class="dt">Label only (no icon)</div>
              <div class="dd">
                <DisplayPill :variant="qaVariant" label="No icon" :size="qaSize" />
              </div>

              <div class="dt">Icon only (no label)</div>
              <div class="dd">
                <DisplayPill :variant="qaVariant" :size="qaSize" aria-label="Status icon">
                  <template #icon>
                    <Icon name="material-symbols:check-circle-outline-rounded" class="demo-icon" aria-hidden="true" />
                  </template>
                </DisplayPill>
              </div>

              <div class="dt">Default slot (custom content)</div>
              <div class="dd">
                <DisplayPill :variant="qaVariant" :size="qaSize">
                  <template #icon>
                    <Icon name="material-symbols:info-outline-rounded" class="demo-icon" aria-hidden="true" />
                  </template>
                  <strong>Custom</strong>&nbsp;slot
                </DisplayPill>
              </div>
            </div>
          </section>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "UI Display Pill",
  meta: [{ name: "description", content: "Examples of UI Display Pill" }],
  bodyAttrs: {
    class: "ui-display-pill-page",
  },
});

const isDev = import.meta.dev;

const variants = ["default", "primary", "success", "warning", "danger", "neutral"] as const;
const sizes = ["sm", "md", "lg"] as const;
const tags = ["span", "div", "button", "a"] as const;

type Variant = (typeof variants)[number];
type Size = (typeof sizes)[number];
type Tag = (typeof tags)[number];

const qaVariant = ref<Variant>("default");
const qaSize = ref<Size>("md");
const qaReversed = ref(false);
const qaTag = ref<Tag>("span");
</script>

<style lang="css">
.ui-display-pill-page {
  .qa-panel {
    background: oklch(15% 0 0);
    color: white;
    font-size: 1.3rem;
    margin-block: 2rem;
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

    &::-webkit-details-marker { display: none; }
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

    &:hover { background: oklch(0% 0 0 / 0.4); }

    &.is-active {
      background: oklch(55% 0.18 240);
      border-color: oklch(55% 0.18 240);
    }
  }

  /* ── Demo sections ─────────────────────────────────────────────── */

  section {
    margin-top: 2rem;

    .demo-row {
      display: flex;
      align-items: center;
      gap: 1.6rem;
      flex-wrap: wrap;
      padding-block: 2rem;
    }

    .dl {
      display: grid;
      grid-template-columns: auto auto;
      gap: 1.6rem;
      align-items: center;
      justify-content: start;
      margin-block: 1.6rem 2.4rem;

      .dt {
        font-weight: bold;
        font-size: 1.3rem;
      }

      .dd {
        margin: 0;
      }
    }

    .demo-icon {
      width: 1em;
      height: 1em;
      font-size: var(--theme-pill-icon-size, 1.4rem);
    }

    /* ── Border / outline demo overrides ──────────────────────────── */

    .demo-bordered.display-pill {
      --theme-pill-border-color: currentColor;
      --theme-pill-border-width: 1.5px;
    }

    .demo-dashed.display-pill {
      --theme-pill-border-color: currentColor;
      --theme-pill-border-width: 1.5px;
      --theme-pill-border-style: dashed;
    }

    .demo-outlined.display-pill {
      --theme-pill-outline: 2px solid currentColor;
      --theme-pill-outline-offset: 3px;
    }

    .demo-border-and-outline.display-pill {
      --theme-pill-border-color: currentColor;
      --theme-pill-border-width: 1.5px;
      --theme-pill-outline: 2px solid currentColor;
      --theme-pill-outline-offset: 3px;
    }
  }
}
</style>
