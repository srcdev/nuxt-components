<template>
  <div
    :class="['samaritan-prompt', elementClasses]"
    :style="{ '--_fade-duration': fadeDurationCss }"
    :data-paused="isPaused || undefined"
    @pointerenter="pause"
    @pointerleave="resume"
  >
    <div
      class="samaritan-prompt__content"
      :style="effect === 'word-pulse' ? { opacity: textOpacity } : undefined"
      aria-hidden="true"
    >
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
import type { SamaritanPromptEffect } from "~/types/components/samaritan-prompt";

interface Props {
  messages: string[];
  effect?: SamaritanPromptEffect;
  typeSpeed?: number;
  deleteSpeed?: number;
  holdDuration?: number;
  pauseDuration?: number;
  wordDuration?: number;
  fadeDuration?: number;
  hideCursorInCycle?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  effect: "typewriter",
  typeSpeed: 80,
  deleteSpeed: 40,
  holdDuration: 2000,
  pauseDuration: 500,
  wordDuration: 1200,
  fadeDuration: 400,
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
const fadeDurationCss = computed(() => `${props.fadeDuration}ms`);
const cursorOpacity = computed(() => (props.hideCursorInCycle && !cursorVisible.value ? 0 : 1));

const timer = useCancellableTimer();
const { wait, schedule, stop, start } = timer;

const pause = () => {
  isPaused.value = true;
  timer.pause();
};

const resume = () => {
  isPaused.value = false;
  timer.resume();
};

const startEffect = () => {
  start();
  displayText.value = "";
  announcedText.value = "";
  textOpacity.value = 1;
  cursorVisible.value = true;
  phase.value = "typing";
  messageIndex.value = 0;
  if (props.effect === "typewriter") {
    schedule(typeTick, props.typeSpeed);
  } else {
    runWordPulse();
  }
};

// --- Typewriter ---
type Phase = "typing" | "holding" | "deleting" | "pausing";
const phase = ref<Phase>("typing");
const messageIndex = ref(0);

const typeTick = () => {
  const message = props.messages[messageIndex.value];
  if (!message) return;

  switch (phase.value) {
    case "typing":
      if (displayText.value.length === 0 && props.hideCursorInCycle) {
        cursorVisible.value = false;
      }
      if (displayText.value.length < message.length) {
        displayText.value = message.slice(0, displayText.value.length + 1);
        schedule(typeTick, props.typeSpeed);
      } else {
        phase.value = "holding";
        announcedText.value = message;
        schedule(typeTick, props.holdDuration);
      }
      break;

    case "holding":
      phase.value = "deleting";
      announcedText.value = "";
      schedule(typeTick, props.deleteSpeed);
      break;

    case "deleting":
      if (displayText.value.length > 0) {
        displayText.value = displayText.value.slice(0, -1);
        schedule(typeTick, props.deleteSpeed);
      } else {
        phase.value = "pausing";
        if (props.hideCursorInCycle) cursorVisible.value = true;
        schedule(typeTick, props.pauseDuration);
      }
      break;

    case "pausing":
      messageIndex.value = (messageIndex.value + 1) % props.messages.length;
      phase.value = "typing";
      schedule(typeTick, props.typeSpeed);
      break;
  }
};

// --- Word pulse ---
const runWordPulse = async () => {
  try {
    while (true) {
      await wait(props.pauseDuration);

      if (props.hideCursorInCycle) cursorVisible.value = false;

      textOpacity.value = 0;
      await wait(props.fadeDuration);

      for (const message of props.messages) {
        displayText.value = message;
        await nextTick();
        await wait(120);

        textOpacity.value = 1;
        announcedText.value = message;
        await wait(props.wordDuration);

        announcedText.value = "";
        textOpacity.value = 0;
        await wait(props.fadeDuration);
      }

      displayText.value = "";
      textOpacity.value = 1;
      if (props.hideCursorInCycle) cursorVisible.value = true;
      await nextTick();
    }
  } catch {
    // component unmounted — exit cleanly
  }
};

watch(
  () => props.effect,
  () => {
    stop();
    startEffect();
  }
);

onMounted(startEffect);

onUnmounted(stop);
</script>

<style lang="css">
@font-face {
  font-family: "Mono MMM 5";
  src: url("/fonts/monoMMM_5.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
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
