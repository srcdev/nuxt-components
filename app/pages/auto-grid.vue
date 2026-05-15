<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="full" :style-class-passthrough="['mbe-32']">
          <h1 class="page-heading-1">AutoGrid</h1>
          <p class="page-body-normal">
            Responsive auto-fit CSS grid wrapper. Columns auto-fit to a minimum width; when
            <code>is-responsive</code>
            is enabled, the minimum shifts at container breakpoints via
            <code>@container</code>
            queries.
          </p>
        </PageRow>

        <div v-if="isDev" class="qa-panel">
          <details class="qa-panel__details">
            <summary class="qa-panel__summary">
              <span class="qa-panel__title">QA — AutoGrid</span>
              <code class="qa-panel__status">
                tag:{{ qaTag }} · responsive:{{ qaIsResponsive ? "on" : "off" }} · small:{{ qaMinColSizeSmall }} ·
                default:{{ qaMinColSizeDefault }} · large:{{ qaMinColSizeLarge }} · gap:{{ qaGap }}
              </code>
            </summary>
            <div class="qa-panel__body">
              <div class="qa-panel__group">
                <span class="qa-panel__label">tag</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="opt in tagOptions"
                    :key="opt"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaTag === opt }"
                    @click="qaTag = opt"
                  >
                    {{ opt }}
                  </button>
                </div>
              </div>

              <div class="qa-panel__group">
                <span class="qa-panel__label">is-responsive</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="opt in [true, false]"
                    :key="String(opt)"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaIsResponsive === opt }"
                    @click="qaIsResponsive = opt"
                  >
                    {{ opt ? "on" : "off" }}
                  </button>
                </div>
              </div>

              <div class="qa-panel__group">
                <span class="qa-panel__label">min-col-size-small</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="preset in sizePresets"
                    :key="preset"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaMinColSizeSmall === preset }"
                    @click="qaMinColSizeSmall = preset"
                  >
                    {{ preset }}
                  </button>
                </div>
                <input v-model="qaMinColSizeSmall" placeholder="e.g. 200px" class="qa-panel__input" />
              </div>

              <div class="qa-panel__group">
                <span class="qa-panel__label">min-col-size-default</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="preset in sizePresets"
                    :key="preset"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaMinColSizeDefault === preset }"
                    @click="qaMinColSizeDefault = preset"
                  >
                    {{ preset }}
                  </button>
                </div>
                <input v-model="qaMinColSizeDefault" placeholder="e.g. 300px" class="qa-panel__input" />
              </div>

              <div class="qa-panel__group">
                <span class="qa-panel__label">min-col-size-large</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="preset in sizePresets"
                    :key="preset"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaMinColSizeLarge === preset }"
                    @click="qaMinColSizeLarge = preset"
                  >
                    {{ preset }}
                  </button>
                </div>
                <input v-model="qaMinColSizeLarge" placeholder="e.g. 350px" class="qa-panel__input" />
              </div>

              <div class="qa-panel__group">
                <span class="qa-panel__label">gap</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="preset in gapPresets"
                    :key="preset"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaGap === preset }"
                    @click="qaGap = preset"
                  >
                    {{ preset }}
                  </button>
                </div>
                <input v-model="qaGap" placeholder="e.g. 2rem" class="qa-panel__input" />
              </div>
            </div>
          </details>
        </div>

        <PageRow tag="div" variant="full" :style-class-passthrough="['mbe-32']">
          <div class="auto-grid-demo-container">
            <AutoGrid
              :tag="qaTag"
              :is-responsive="qaIsResponsive"
              :min-col-size-small="qaMinColSizeSmall"
              :min-col-size-default="qaMinColSizeDefault"
              :min-col-size-large="qaMinColSizeLarge"
              :style="qaStyle"
            >
              <template v-for="card in statCards" #[card.id] :key="card.id">
                <div class="stat-card">
                  <span class="stat-card__label">{{ card.label }}</span>
                  <span class="stat-card__value">{{ card.value }}</span>
                </div>
              </template>
            </AutoGrid>
          </div>
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

useHead({
  title: "AutoGrid",
  meta: [{ name: "description", content: "AutoGrid component demo" }],
  bodyAttrs: { class: "auto-grid-page" },
});

const isDev = import.meta.dev;

const tagOptions = ["div", "section", "article", "main"] as const;
const qaTag = ref<"div" | "section" | "article" | "main">("div");
const qaIsResponsive = ref(false);
const qaMinColSizeSmall = ref("250px");
const qaMinColSizeDefault = ref("300px");
const qaMinColSizeLarge = ref("350px");
const qaGap = ref("1rem");

const sizePresets = ["150px", "200px", "250px", "300px", "350px", "400px"];
const gapPresets = ["0.5rem", "1rem", "1.6rem", "2.4rem", "3.2rem"];

const qaStyle = computed(() => ({
  "--auto-grid-min-col-size-small": qaMinColSizeSmall.value,
  "--auto-grid-min-col-size-default": qaMinColSizeDefault.value,
  "--auto-grid-min-col-size-large": qaMinColSizeLarge.value,
  "--auto-grid-gap": qaGap.value,
}));

const statCards = [
  { id: "item-1", label: "Revenue", value: "£24,500" },
  { id: "item-2", label: "Clients", value: "142" },
  { id: "item-3", label: "Bookings", value: "38" },
  { id: "item-4", label: "Avg. Rating", value: "4.9" },
  { id: "item-5", label: "New Users", value: "76" },
  { id: "item-6", label: "Retention", value: "91%" },
];
</script>

<style lang="css">
.auto-grid-page {
  code {
    font-family: monospace;
    font-size: 0.9em;
    background: var(--slate-02);
    padding: 0.1em 0.4em;
    border-radius: 0.3rem;
  }

  .auto-grid-demo-container {
    container-type: inline-size;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 2.4rem;
    background: white;
    border-radius: 0.8rem;
    box-shadow: 0 2px 8px oklch(0% 0 0 / 0.08);
  }

  .stat-card__label {
    font-size: 1.2rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--slate-08, #6b7280);
  }

  .stat-card__value {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--slate-12, #111827);
  }

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

  .qa-panel__input {
    font-family: monospace;
    font-size: 1.2rem;
    color: white;
    background: oklch(0% 0 0 / 0.25);
    border: 1px solid oklch(100% 0 0 / 0.18);
    padding: 0.3rem 1rem;
    border-radius: 0.4rem;
    width: 18rem;

    &::placeholder {
      opacity: 0.45;
    }
  }
}
</style>
