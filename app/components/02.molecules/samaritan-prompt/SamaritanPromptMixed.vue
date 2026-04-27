<template>
  <div :class="['samaritan-prompt', elementClasses]">
    <div class="samaritan-prompt__content" :style="{ opacity: textOpacity }">
      <div class="samaritan-prompt__stage">
        <span class="samaritan-prompt__text">{{ displayText }}</span>
      </div>
      <div class="samaritan-prompt__underline"></div>
    </div>
    <span class="samaritan-prompt__cursor" :style="{ opacity: cursorOpacity }" aria-hidden="true">▲</span>
  </div>
</template>

<script setup lang="ts">
export interface MessageConfig {
  text: string;
  effect?: "typewriter" | "word-pulse";
  typeSpeed?: number;
  deleteSpeed?: number;
  holdDuration?: number;
  pauseDuration?: number;
  wordDuration?: number;
  fadeDuration?: number;
  hideCursorInCycle?: boolean;
}

interface Props {
  messageConfigs: MessageConfig[];
  effect?: "typewriter" | "word-pulse";
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

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const displayText = ref("");
const textOpacity = ref(1);
const cursorVisible = ref(true);
const activeFadeDuration = ref(props.fadeDuration);
const fadeDurationCss = computed(() => `${activeFadeDuration.value}ms`);
const cursorOpacity = computed(() => (cursorVisible.value ? 1 : 0));

const { wait, stop, start } = useCancellableTimer();

type ResolvedConfig = Required<MessageConfig>;

const resolveConfig = (msg: MessageConfig): ResolvedConfig => ({
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

  await wait(holdDuration);

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
  await wait(wordDuration);

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

      // if (props.hideCursorInCycle) cursorVisible.value = false;

      for (const msg of props.messageConfigs) {
        const config = resolveConfig(msg);
        if (config.effect === "typewriter") {
          await runTypewriter(config);
        } else {
          await runWordPulse(config);
        }
      }

      // if (props.hideCursorInCycle) cursorVisible.value = true;
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
