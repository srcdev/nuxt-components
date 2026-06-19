<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20', 'p-20']">
          <h2 class="page-heading-2">DisplayToast Masked / DisplayToastProvider</h2>

          <div v-if="isDev" class="qa-panel">
            <details class="qa-panel__details">
              <summary class="qa-panel__summary">
                <span class="qa-panel__title">QA — DisplayToastProvider</span>
                <code class="qa-panel__status">
                  {{ qaTheme }} · {{ qaPosition }}-{{ qaAlignment }} ·
                  {{ qaAutoDismiss ? `auto ${qaDuration}ms` : "manual" }} · max:{{ qaMaxVisible }} ·
                  {{ qaIsMasked ? "masked" : "solid" }}
                </code>
              </summary>
              <div class="qa-panel__body">
                <div class="qa-panel__group">
                  <span class="qa-panel__label">Theme</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in themes"
                      :key="opt"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaTheme === opt }"
                      @click="qaTheme = opt"
                    >
                      {{ opt }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Position</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in positions"
                      :key="opt"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaPosition === opt }"
                      @click="qaPosition = opt"
                    >
                      {{ opt }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Alignment</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in alignments"
                      :key="opt"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaAlignment === opt }"
                      @click="qaAlignment = opt"
                    >
                      {{ opt }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Masked</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in [true, false]"
                      :key="String(opt)"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaIsMasked === opt }"
                      @click="qaIsMasked = opt"
                    >
                      {{ opt ? "yes" : "no" }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Full Width</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in [true, false]"
                      :key="String(opt)"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaFullWidth === opt }"
                      @click="qaFullWidth = opt"
                    >
                      {{ opt ? "yes" : "no" }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Auto Dismiss</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in [true, false]"
                      :key="String(opt)"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaAutoDismiss === opt }"
                      @click="qaAutoDismiss = opt"
                    >
                      {{ opt ? "yes" : "no" }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Duration</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in durations"
                      :key="opt"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaDuration === opt }"
                      @click="qaDuration = opt"
                    >
                      {{ opt }}ms
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Max Visible</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in [1, 2, 3, 4, 5]"
                      :key="opt"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaMaxVisible === opt }"
                      @click="qaMaxVisible = opt"
                    >
                      {{ opt }}
                    </button>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <form class="form-wrapper">
            <div class="demo-buttons">
              <InputButtonCore button-text="Trigger Toast" theme="default" @click.prevent="triggerToast" />
              <InputButtonCore button-text="Queue Multiple" theme="default" @click.prevent="queueMultiple" />
            </div>
          </form>
        </PageRow>

        <DisplayToastProvider
          :position="qaPosition"
          :alignment="qaAlignment"
          :full-width="qaFullWidth"
          :max-visible="qaMaxVisible"
        />
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { DisplayToastTheme, DisplayToastPosition, DisplayToastAlignment } from "~/types/components";

definePageMeta({ layout: false });

useHead({
  title: "DisplayToast Masked / DisplayToastProvider",
  meta: [{ name: "description", content: "DisplayToast Masked component demo" }],
  bodyAttrs: { class: "displayToast-page" },
});

const isDev = import.meta.dev;
const { show } = useToastQueue();

const themes = ["info", "success", "warning", "error"] as const;
const positions = ["top", "bottom"] as const;
const alignments = ["left", "center", "right"] as const;
const durations = [2000, 3000, 5000, 8000] as const;

const qaTheme = ref<DisplayToastTheme>("info");
const qaPosition = ref<DisplayToastPosition>("top");
const qaAlignment = ref<DisplayToastAlignment>("right");
const qaIsMasked = ref(true);
const qaFullWidth = ref(false);
const qaAutoDismiss = ref(true);
const qaDuration = ref(5000);
const qaMaxVisible = ref(1);

const messages: Record<DisplayToastTheme, { title: string; description: string }> = {
  info: { title: "Information", description: "This is an informational notification." },
  success: { title: "Success!", description: "Your action completed successfully." },
  warning: { title: "Warning", description: "Please review this before continuing." },
  error: { title: "Error", description: "Something went wrong. Please try again." },
};

const triggerToast = () => {
  show({
    appearance: { theme: qaTheme.value, masked: qaIsMasked.value },
    behavior: { autoDismiss: qaAutoDismiss.value, duration: qaDuration.value },
    content: messages[qaTheme.value],
  });
};

const queueMultiple = () => {
  themes.forEach((theme) => {
    show({
      appearance: { theme, masked: qaIsMasked.value },
      behavior: { autoDismiss: qaAutoDismiss.value, duration: qaDuration.value },
      content: messages[theme],
    });
  });
};
</script>

<style lang="css">
.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
}

.displayToast-page {
  .qa-panel {
    background: oklch(15% 0 0);
    color: white;
    font-size: 1.3rem;
    margin-block: 1.2rem;
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
    background-color: oklch(0% 0 0 / 0.25);
    border: 1px solid oklch(100% 0 0 / 0.18);
    padding: 0.3rem 1rem;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: oklch(0% 0 0 / 0.4);
    }

    &.is-active {
      background-color: oklch(55% 0.18 240);
      border-color: oklch(55% 0.18 240);
    }
  }
}
</style>
