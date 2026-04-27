<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <div v-if="isDev" class="qa-panel">
          <details class="qa-panel__details">
            <summary class="qa-panel__summary">
              <span class="qa-panel__title">QA — SamaritanPrompt</span>
              <code v-if="qaEffect === 'typewriter'" class="qa-panel__status">
                effect:typewriter · type:{{ qaTypeSpeed }}ms · hold:{{ qaHoldDuration }}ms · del:{{ qaDeleteSpeed }}ms ·
                pause:{{ qaPauseDuration }}ms
              </code>
              <code v-else class="qa-panel__status">
                effect:word-pulse · fade:{{ qaFadeDuration }}ms · visible:{{ qaWordDuration }}ms · pause:{{
                  qaPauseDuration
                }}ms
              </code>
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
                  >
                    {{ opt }}
                  </button>
                </div>
              </div>

              <!-- Typewriter controls -->
              <template v-if="qaEffect === 'typewriter'">
                <div class="qa-panel__group">
                  <span class="qa-panel__label">Type speed (ms/char)</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="n in [40, 80, 120, 200]"
                      :key="n"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaTypeSpeed === n }"
                      @click="qaTypeSpeed = n"
                    >
                      {{ n }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Hold duration (ms)</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="n in [500, 1000, 2000, 4000]"
                      :key="n"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaHoldDuration === n }"
                      @click="qaHoldDuration = n"
                    >
                      {{ n }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Delete speed (ms/char)</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="n in [20, 40, 80]"
                      :key="n"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaDeleteSpeed === n }"
                      @click="qaDeleteSpeed = n"
                    >
                      {{ n }}
                    </button>
                  </div>
                </div>
              </template>

              <!-- Word-pulse controls -->
              <template v-else>
                <div class="qa-panel__group">
                  <span class="qa-panel__label">Fade duration (ms)</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="n in [200, 400, 600, 1000]"
                      :key="n"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaFadeDuration === n }"
                      @click="qaFadeDuration = n"
                    >
                      {{ n }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Visible duration (ms)</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="n in [800, 1200, 2000, 3000]"
                      :key="n"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaWordDuration === n }"
                      @click="qaWordDuration = n"
                    >
                      {{ n }}
                    </button>
                  </div>
                </div>
              </template>

              <!-- Shared: pause before restart -->
              <div class="qa-panel__group">
                <span class="qa-panel__label">Pause before restart (ms)</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="n in [300, 500, 1000, 2000, 5000, 10000]"
                    :key="n"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaPauseDuration === n }"
                    @click="qaPauseDuration = n"
                  >
                    {{ n }}
                  </button>
                </div>
              </div>

              <!-- Shared: hide cursor in cycle -->
              <div class="qa-panel__group">
                <span class="qa-panel__label">Hide cursor in cycle</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="opt in [true, false]"
                    :key="String(opt)"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaHideCursorInCycle === opt }"
                    @click="qaHideCursorInCycle = opt"
                  >
                    {{ opt ? "on" : "off" }}
                  </button>
                </div>
              </div>
            </div>
          </details>
        </div>

        <LayoutRow tag="div" variant="full-width">
          <div class="samaritan-stage samaritan-stage--mixed">
            <SamaritanPromptMixed :message-configs="mixedMessages" />
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width">
          <div class="samaritan-stage">
            <SamaritanPrompt
              :messages="messages"
              :effect="qaEffect"
              :type-speed="qaTypeSpeed"
              :delete-speed="qaDeleteSpeed"
              :hold-duration="qaHoldDuration"
              :pause-duration="qaPauseDuration"
              :word-duration="qaWordDuration"
              :fade-duration="qaFadeDuration"
              :hide-cursor-in-cycle="qaHideCursorInCycle"
            />
          </div>
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
  title: "Samaritan",
  meta: [{ name: "description", content: "Samaritan prompt effect" }],
  bodyAttrs: { class: "samaritan-page" },
});

const messages = [
  "Surveillance Active",
  "Threat Assessment Complete",
  "All Persons of Interest Identified",
  "Monitoring All Communication Channels",
  "Samaritan Is Watching",
];

const mixedMessages = [
  { text: "What srcdev does?", effect: "typewriter" as const, holdDuration: 4000 },
  { text: "Brings your imaginaton to life", effect: "word-pulse" as const, holdDuration: 2000 },
  { text: "Craft beautiful interfaces", effect: "word-pulse" as const, wordDuration: 2000 },
  { text: "Keeps things simple", effect: "word-pulse" as const, wordDuration: 2000 },
  { text: "My work is?", effect: "typewriter" as const, wordDuration: 2500, fadeDuration: 4000 },
  { text: "Performance tested", effect: "word-pulse" as const, holdDuration: 2000 },
  { text: "Penetration tested", effect: "word-pulse" as const, wordDuration: 2000 },
  { text: "Accessible", effect: "word-pulse" as const, wordDuration: 2000 },
];

// ── QA controls (dev only) ────────────────────────────────────────
const isDev = import.meta.dev;

const effectOptions = ["typewriter", "word-pulse"] as const;
const qaEffect = ref<"typewriter" | "word-pulse">("typewriter");

const qaTypeSpeed = ref(80);
const qaDeleteSpeed = ref(40);
const qaHoldDuration = ref(2000);
const qaPauseDuration = ref(5000);
const qaWordDuration = ref(1200);
const qaFadeDuration = ref(400);
const qaHideCursorInCycle = ref(true);
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

    &--mixed {
      border-top: 1px solid oklch(100% 0 0 / 0.08);
    }
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
}
</style>
