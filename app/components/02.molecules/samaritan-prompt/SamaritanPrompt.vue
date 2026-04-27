<template>
  <div :class="['samaritan-prompt', elementClasses]">
    <div class="samaritan-prompt__content" :style="effect === 'word-pulse' ? { opacity: textOpacity } : undefined">
      <div class="samaritan-prompt__stage">
        <span class="samaritan-prompt__text">{{ displayText }}</span>
      </div>
      <div class="samaritan-prompt__underline"></div>
    </div>
    <span class="samaritan-prompt__cursor" :style="{ opacity: cursorOpacity }" aria-hidden="true">▲</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  messages: string[];
  effect?: "typewriter" | "word-pulse";
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

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const displayText = ref("");
const textOpacity = ref(1);
const cursorVisible = ref(true);
const fadeDurationCss = computed(() => `${props.fadeDuration}ms`);
const cursorOpacity = computed(() => (props.hideCursorInCycle && !cursorVisible.value ? 0 : 1));

const { wait, schedule, stop, start } = useCancellableTimer();

const startEffect = () => {
  start();
  displayText.value = "";
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
        schedule(typeTick, props.holdDuration);
      }
      break;

    case "holding":
      phase.value = "deleting";
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
      // Underline and cursor visible during the pre-cycle pause
      await wait(props.pauseDuration);

      if (props.hideCursorInCycle) cursorVisible.value = false;

      // Fade out the underline before the first word appears
      textOpacity.value = 0;
      await wait(props.fadeDuration);

      for (const message of props.messages) {
        displayText.value = message;
        await nextTick();
        await wait(120);

        textOpacity.value = 1;
        await wait(props.wordDuration);

        textOpacity.value = 0;
        await wait(props.fadeDuration);
      }

      // Reset between cycles — underline and cursor visible again for next pause
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

<style scoped>
@font-face {
  font-family: "Mono MMM 5";
  src: url("/fonts/monoMMM_5.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.samaritan-prompt {
  --_font-size: var(--samaritan-font-size, 2rem);
  --_color-text: var(--samaritan-color-text, #ffffff);
  --_color-underline: var(--samaritan-color-underline, #ffffff);
  --_color-cursor: var(--samaritan-color-cursor, #cc0000);
  --_font-family: var(--samaritan-font-family, "Mono MMM 5", "Nova Mono", "Courier New", monospace);
  --_letter-spacing: var(--samaritan-letter-spacing, 0.08em);

  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.6rem;
  font-family: var(--_font-family);
  font-size: var(--_font-size);
  letter-spacing: var(--_letter-spacing);

  .samaritan-prompt__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 0.6rem;
    width: 100%;
    transition: opacity v-bind(fadeDurationCss) ease;

    .samaritan-prompt__stage {
      display: flex;
      justify-content: center;
      min-height: 1.2em;

      .samaritan-prompt__text {
        color: var(--_color-text);
        white-space: nowrap;
        text-transform: uppercase;
      }
    }

    .samaritan-prompt__underline {
      width: 100%;
      min-width: 4ch;
      height: 0.15rem;
      background: var(--_color-underline);
    }
  }

  .samaritan-prompt__cursor {
    color: var(--_color-cursor);
    font-size: 2.4rem;
    line-height: 1;
    animation: samaritan-pulse 2.5s ease-in-out infinite;
    transition: opacity 400ms ease;
  }
}

@keyframes samaritan-pulse {
  0%,
  100% {
    color: var(--_color-cursor);
  }
  50% {
    color: #330000;
  }
}
</style>
