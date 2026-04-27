<template>
  <div :class="['samaritan-prompt', elementClasses]">
    <div class="samaritan-prompt__stage">
      <span
        ref="textRef"
        class="samaritan-prompt__text"
        :style="effect === 'word-pulse' ? { opacity: textOpacity } : undefined"
      >{{ displayText }}</span>
    </div>
    <div class="samaritan-prompt__underline"></div>
    <span class="samaritan-prompt__cursor" aria-hidden="true">▲</span>
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
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const textRef = ref<HTMLElement | null>(null);
const displayText = ref("");
const textWidth = ref(0);
const textOpacity = ref(1);

const underlineWidthCss = computed(() => `${textWidth.value}px`);
const fadeDurationCss = computed(() => `${props.fadeDuration}ms`);

let resizeObserver: ResizeObserver | null = null;
let isActive = true;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const wait = (ms: number): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!isActive) { reject(); return; }
    timeoutId = setTimeout(() => {
      if (isActive) resolve(); else reject();
    }, ms);
  });

// --- Typewriter ---
type Phase = "typing" | "holding" | "deleting" | "pausing";
const phase = ref<Phase>("typing");
const messageIndex = ref(0);

const schedule = (fn: () => void, ms: number) => {
  timeoutId = setTimeout(fn, ms);
};

const typeTick = () => {
  const message = props.messages[messageIndex.value];
  if (!message) return;

  switch (phase.value) {
    case "typing":
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
    while (isActive) {
      for (const message of props.messages) {
        if (!isActive) return;

        displayText.value = message;
        textOpacity.value = 0;
        await nextTick();

        // Allow ResizeObserver + underline transition to start before revealing text
        await wait(120);

        textOpacity.value = 1;
        await wait(props.wordDuration);

        textOpacity.value = 0;
        await wait(props.fadeDuration);
      }

      // Collapse underline between cycles
      displayText.value = "";
      await nextTick();
      await wait(props.pauseDuration);
    }
  } catch {
    // component unmounted — exit cleanly
  }
};

onMounted(() => {
  if (textRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) textWidth.value = entry.contentRect.width;
    });
    resizeObserver.observe(textRef.value);
  }

  if (props.effect === "typewriter") {
    schedule(typeTick, props.typeSpeed);
  } else {
    runWordPulse();
  }
});

onUnmounted(() => {
  isActive = false;
  resizeObserver?.disconnect();
  if (timeoutId !== null) clearTimeout(timeoutId);
});
</script>

<style scoped>
.samaritan-prompt {
  --_font-size: var(--samaritan-font-size, 2rem);
  --_color-text: var(--samaritan-color-text, #ffffff);
  --_color-underline: var(--samaritan-color-underline, #ffffff);
  --_color-cursor: var(--samaritan-color-cursor, #cc2200);
  --_font-family: var(--samaritan-font-family, "Nova Mono", "Courier New", monospace);
  --_letter-spacing: var(--samaritan-letter-spacing, 0.08em);

  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.6rem;
  font-family: var(--_font-family);
  font-size: var(--_font-size);
  letter-spacing: var(--_letter-spacing);
}

.samaritan-prompt__stage {
  display: flex;
  justify-content: center;
  min-height: 1.2em;
}

.samaritan-prompt__text {
  color: var(--_color-text);
  white-space: nowrap;
  transition: opacity v-bind(fadeDurationCss) ease;
}

.samaritan-prompt__underline {
  width: v-bind(underlineWidthCss);
  height: 0.15rem;
  background: var(--_color-underline);
  transition: width 0.15s ease;
  min-width: 0;
}

.samaritan-prompt__cursor {
  color: var(--_color-cursor);
  font-size: 1.2em;
  line-height: 1;
  animation: samaritan-pulse 2.5s ease-in-out infinite;
}

@keyframes samaritan-pulse {
  0%,
  100% {
    color: var(--_color-cursor);
  }
  50% {
    color: #0d0000;
  }
}
</style>
