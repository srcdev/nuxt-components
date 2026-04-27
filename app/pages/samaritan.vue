<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width">
          <div class="samaritan-stage">
            <SamaritanPrompt :messages="messages" :effect="qaEffect" />
          </div>
        </LayoutRow>

        <div v-if="isDev" class="qa-panel">
          <details class="qa-panel__details">
            <summary class="qa-panel__summary">
              <span class="qa-panel__title">QA — SamaritanPrompt</span>
              <code class="qa-panel__status">effect:{{ qaEffect }}</code>
            </summary>
            <div class="qa-panel__body">
              <div class="qa-panel__group">
                <span class="qa-panel__label">Effect</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="opt in effectOptions"
                    :key="opt"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaEffect === opt }"
                    @click="qaEffect = opt"
                  >{{ opt }}</button>
                </div>
              </div>
            </div>
          </details>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "Samaritan",
  meta: [{ name: "description", content: "Samaritan prompt effect" }],
  bodyAttrs: { class: "samaritan-page" },
});

const messages = [
  "SURVEILLANCE ACTIVE.",
  "THREAT ASSESSMENT COMPLETE.",
  "ALL PERSONS OF INTEREST IDENTIFIED.",
  "MONITORING ALL COMMUNICATION CHANNELS.",
  "SAMARITAN IS WATCHING.",
];

// ── QA controls (dev only) ────────────────────────────────────────
const isDev = import.meta.dev;

const effectOptions = ["typewriter", "word-pulse"] as const;
const qaEffect = ref<"typewriter" | "word-pulse">("typewriter");
</script>

<style lang="css">
.samaritan-page {
  background: #0a0a0a;

  --samaritan-font-size: clamp(1.4rem, 2.5vw, 2.8rem);
  --samaritan-letter-spacing: 0.14em;

  .samaritan-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    min-block-size: 100dvh;
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
}
</style>
