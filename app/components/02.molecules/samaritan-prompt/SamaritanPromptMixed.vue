<template>
  <div
    :class="['samaritan-prompt', elementClasses]"
    :style="{ '--_fade-duration': fadeDurationCss }"
    :data-paused="isPaused || undefined"
    @pointerenter="pause"
    @pointerleave="resume"
  >
    <div class="samaritan-prompt__content" :style="{ opacity: textOpacity }" aria-hidden="true">
      <div class="samaritan-prompt__stage">
        <span class="samaritan-prompt__text">{{ displayText }}</span>
      </div>
      <div class="samaritan-prompt__underline"></div>
    </div>
    <span class="samaritan-prompt__cursor" :style="{ opacity: cursorOpacity }" aria-hidden="true">
      <slot name="cursor">▲</slot>
    </span>
    <span class="samaritan-prompt__sr-text" aria-live="polite" aria-atomic="true">{{ announcedText }}</span>
  </div>
</template>

<script setup lang="ts">
import type { SamaritanPromptEffect, SamaritanPromptMessageConfig } from "~/types/components/samaritan-prompt";

interface Props {
  messageConfigs: SamaritanPromptMessageConfig[];
  effect?: SamaritanPromptEffect;
  typeSpeed?: number;
  deleteSpeed?: number;
  holdDuration?: number;
  pauseDuration?: number;
  wordDuration?: number;
  fadeDuration?: number;
  introDelay?: number;
  hideCursorInCycle?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  effect: "typewriter",
  typeSpeed: 80,
  deleteSpeed: 40,
  holdDuration: 7000,
  pauseDuration: 1000,
  wordDuration: 1200,
  fadeDuration: 400,
  introDelay: 2000,
  hideCursorInCycle: true,
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const displayText = ref("");
const announcedText = ref("");
const textOpacity = ref(1);
const cursorVisible = ref(true);
const isPaused = ref(false);
const activeFadeDuration = ref(props.fadeDuration);
const fadeDurationCss = computed(() => `${activeFadeDuration.value}ms`);
const cursorOpacity = computed(() => (cursorVisible.value ? 1 : 0));

const timer = useCancellableTimer();
const { wait, stop, start } = timer;

const pause = () => {
  isPaused.value = true;
  timer.pause();
};

const resume = () => {
  isPaused.value = false;
  timer.resume();
};

type ResolvedConfig = Required<SamaritanPromptMessageConfig>;

const resolveConfig = (msg: SamaritanPromptMessageConfig): ResolvedConfig => ({
  text: msg.text,
  effect: msg.effect ?? props.effect,
  typeSpeed: msg.typeSpeed ?? props.typeSpeed,
  deleteSpeed: msg.deleteSpeed ?? props.deleteSpeed,
  holdDuration: msg.holdDuration ?? props.holdDuration,
  pauseDuration: msg.pauseDuration ?? props.pauseDuration,
  wordDuration: msg.wordDuration ?? props.wordDuration,
  fadeDuration: msg.fadeDuration ?? props.fadeDuration,
  hideCursorInCycle: msg.hideCursorInCycle ?? props.hideCursorInCycle,
});

const runTypewriter = async (config: ResolvedConfig) => {
  const { text, typeSpeed, deleteSpeed, holdDuration, pauseDuration, hideCursorInCycle } = config;

  if (hideCursorInCycle) cursorVisible.value = false;

  for (let i = 1; i <= text.length; i++) {
    displayText.value = text.slice(0, i);
    await wait(typeSpeed);
  }

  announcedText.value = text;
  await wait(holdDuration);
  announcedText.value = "";

  while (displayText.value.length > 0) {
    displayText.value = displayText.value.slice(0, -1);
    await wait(deleteSpeed);
  }

  if (hideCursorInCycle) cursorVisible.value = true;
  await wait(pauseDuration);
};

const runWordPulse = async (config: ResolvedConfig) => {
  const { text, fadeDuration, wordDuration, pauseDuration, hideCursorInCycle } = config;

  activeFadeDuration.value = fadeDuration;
  await nextTick();

  if (hideCursorInCycle) cursorVisible.value = false;

  textOpacity.value = 0;
  await wait(fadeDuration);

  displayText.value = text;
  await nextTick();
  await wait(120);

  textOpacity.value = 1;
  announcedText.value = text;
  await wait(wordDuration);

  announcedText.value = "";
  textOpacity.value = 0;
  await wait(fadeDuration);

  displayText.value = "";
  textOpacity.value = 1;
  if (hideCursorInCycle) cursorVisible.value = true;
  await nextTick();

  await wait(pauseDuration);
};

const runLoop = async () => {
  try {
    while (true) {
      if (props.introDelay > 0) await wait(props.introDelay);

      for (const msg of props.messageConfigs) {
        const config = resolveConfig(msg);
        if (config.effect === "typewriter") {
          await runTypewriter(config);
        } else {
          await runWordPulse(config);
        }
      }
    }
  } catch {
    // component unmounted — exit cleanly
  }
};

const startLoop = () => {
  start();
  displayText.value = "";
  textOpacity.value = 1;
  cursorVisible.value = true;
  runLoop();
};

onMounted(startLoop);
onUnmounted(stop);
</script>

<style lang="css">
@font-face {
  font-family: "Mono MMM 5";
  src: url("/fonts/monoMMM_5.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: optional;
}

@layer components {
  .samaritan-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: var(--samaritan-prompt-cursor-gap, 0.6rem);
    font-family: var(--samaritan-prompt-font-family, "Mono MMM 5", "Nova Mono", "Courier New", monospace);
    font-size: var(--samaritan-prompt-font-size, 2rem);
    letter-spacing: var(--samaritan-prompt-letter-spacing, 0.08em);

    .samaritan-prompt__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: var(--samaritan-prompt-underline-gap, 0.6rem);
      width: 100%;
      transition: opacity var(--_fade-duration, 400ms) ease;

      .samaritan-prompt__stage {
        display: flex;
        justify-content: center;
        min-height: 1.2em;

        .samaritan-prompt__text {
          color: var(--samaritan-prompt-text-colour, #ffffff);
          white-space: nowrap;
          text-transform: var(--samaritan-prompt-text-transform, uppercase);
        }
      }

      .samaritan-prompt__underline {
        width: 100%;
        min-width: 4ch;
        height: var(--samaritan-prompt-underline-height, 0.15rem);
        background: var(--samaritan-prompt-underline-colour, #ffffff);
      }
    }

    .samaritan-prompt__cursor {
      color: var(--samaritan-prompt-cursor-colour, #cc0000);
      font-size: var(--samaritan-prompt-cursor-size, 2.4rem);
      line-height: 1;
      animation: samaritan-prompt-pulse var(--samaritan-prompt-cursor-pulse-duration, 2.5s) ease-in-out infinite;
      transition: opacity 400ms ease;
    }

    &[data-paused] .samaritan-prompt__cursor {
      animation-play-state: paused;
    }

    .samaritan-prompt__sr-text {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .samaritan-prompt {
      .samaritan-prompt__content {
        transition: none;
      }

      .samaritan-prompt__cursor {
        animation: none;
      }
    }
  }
}

@keyframes samaritan-prompt-pulse {
  0%,
  100% {
    color: var(--samaritan-prompt-cursor-colour, #cc0000);
  }
  50% {
    color: var(--samaritan-prompt-cursor-colour-off, transparent);
  }
}
</style>
