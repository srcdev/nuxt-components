<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="content" :style-class-passthrough="['pb-12']">
          <h1 class="page-heading-2">Display Prompts</h1>

          <div v-if="isDev" class="qa-panel">
            <details class="qa-panel__details">
              <summary class="qa-panel__summary">
                <span class="qa-panel__title">QA — DisplayPrompt</span>
                <code class="qa-panel__status">
                  {{ qaTheme }} · {{ qaDismissible ? "dismissible" : "static" }} ·
                  {{ qaOutlined ? "outlined" : "no-outline" }} · {{ qaHighContrast ? "high-contrast" : "standard" }} ·
                  {{ qaMasked ? "masked" : "unmasked" }}
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
                  <span class="qa-panel__label">Dismissible</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in [true, false]"
                      :key="String(opt)"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaDismissible === opt }"
                      @click="qaDismissible = opt"
                    >
                      {{ opt ? "yes" : "no" }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Outlined</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in [true, false]"
                      :key="String(opt)"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaOutlined === opt }"
                      @click="qaOutlined = opt"
                    >
                      {{ opt ? "yes" : "no" }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">High Contrast</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in [true, false]"
                      :key="String(opt)"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaHighContrast === opt }"
                      @click="qaHighContrast = opt"
                    >
                      {{ opt ? "yes" : "no" }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Auto Focus</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in [true, false]"
                      :key="String(opt)"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaAutoFocus === opt }"
                      @click="qaAutoFocus = opt"
                    >
                      {{ opt ? "yes" : "no" }}
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
                      :class="{ 'is-active': qaMasked === opt }"
                      @click="qaMasked = opt"
                    >
                      {{ opt ? "yes" : "no" }}
                    </button>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <section class="prompt-examples pb-12">
            <div :class="{ 'masked-bg': qaMasked }">
              <DisplayPrompt
                :key="promptKey"
                :theme="qaTheme"
                :dismissible="qaDismissible"
                :use-auto-focus="qaAutoFocus"
                :masked="qaMasked"
                :style-class-passthrough="styleClasses"
              >
                <template #customDecoratorIcon>
                  <Icon :name="themeIcons[qaTheme]" class="icon" />
                </template>
                <template #title>{{ themeLabels[qaTheme] }} Prompt Title</template>
                <template #content>This is prompt content, it can contain html or plain text.</template>
              </DisplayPrompt>
            </div>
          </section>
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { DisplayPromptTheme } from "~/types/components";

definePageMeta({ layout: false });

useHead({
  title: "UI Display Prompts",
  meta: [{ name: "description", content: "Examples of UI Display Prompts" }],
  bodyAttrs: { class: "displayPrompt-page" },
});

const isDev = import.meta.dev;

const themes = ["info", "success", "warning", "error"] as const;

const qaTheme = ref<DisplayPromptTheme>("info");
const qaDismissible = ref(true);
const qaOutlined = ref(false);
const qaHighContrast = ref(false);
const qaAutoFocus = ref(false);
const qaMasked = ref(false);

const themeIcons: Record<DisplayPromptTheme, string> = {
  info: "akar-icons:info",
  success: "akar-icons:check",
  warning: "akar-icons:circle-alert",
  error: "akar-icons:circle-alert",
};

const themeLabels: Record<DisplayPromptTheme, string> = {
  info: "Info",
  success: "Success",
  warning: "Warning",
  error: "Error",
};

const styleClasses = computed(() => {
  const classes: string[] = [];
  if (qaOutlined.value) classes.push("outlined");
  if (qaHighContrast.value) classes.push("high-contrast");
  return classes;
});

const promptKey = computed(() => `${qaTheme.value}-${qaDismissible.value}-${qaMasked.value}`);
</script>

<style lang="css">
.prompt-examples {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .masked-bg {
    padding: 2rem;
    border-radius: 0.8rem;
    background: linear-gradient(135deg, oklch(40% 0.15 250), oklch(25% 0.1 300));
  }
}

.displayPrompt-page {
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
}
</style>
