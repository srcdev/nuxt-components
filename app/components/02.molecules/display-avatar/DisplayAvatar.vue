<template>
  <component
    :is="chip ? DisplayChip : as"
    v-bind="chip ? { tag: chipTag, config: chipConfig, status, statusLabel } : {}"
    class="display-avatar"
    :class="elementClasses"
    :data-size="size"
  >
    <span class="display-avatar-surface">
      <slot name="default">
        <NuxtImg
          v-if="src && !imageFailed"
          :src
          :alt="alt ?? ''"
          :width="imageSize"
          :height="imageSize"
          class="display-avatar-image"
          @error="imageFailed = true"
        />
        <template v-else>
          <span class="display-avatar-fallback" :aria-hidden="alt ? 'true' : undefined">{{ fallback }}</span>
          <span v-if="alt" class="sr-only">{{ alt }}</span>
        </template>
      </slot>
      <slot name="icon"></slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import DisplayChip from "../display-chip/DisplayChip.vue";
import type { DisplayChipConfig, DisplayChipStatus } from "~/types/components";

interface Props {
  as?: string | object;
  src?: string;
  alt?: string;
  text?: string;
  size?: "xs" | "s" | "md" | "lg" | "xl" | string;
  chip?: boolean | DisplayChipConfig;
  status?: DisplayChipStatus;
  statusLabel?: string;
  imageSize?: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  as: "span",
  src: undefined,
  alt: undefined,
  text: undefined,
  size: "md",
  chip: undefined,
  status: undefined,
  statusLabel: undefined,
  imageSize: 112,
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const imageFailed = ref(false);

watch(
  () => props.src,
  () => (imageFailed.value = false)
);

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const firstGrapheme = (word: string) => graphemes.segment(word)[Symbol.iterator]().next().value?.segment ?? "";

const fallback = computed(
  () =>
    props.text?.trim() ||
    (props.alt || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(firstGrapheme)
      .join("")
);

const chipDefaultConfig: DisplayChipConfig = {
  size: "12px",
  maskWidth: "4px",
  offset: "0px",
  angle: "90deg",
};

const chipConfig = computed(() => (typeof props.chip === "object" ? props.chip : chipDefaultConfig));

const chipTag = computed((): "div" | "span" => (props.as === "div" || props.as === "span" ? props.as : "span"));
</script>

<style lang="css">
@layer components {
  .display-avatar {
    --_avatar-size: var(--display-avatar-size-md, 4rem);
    --_avatar-font-size: var(--display-avatar-font-size-md, 1.6rem);

    display: flex;
    flex-shrink: 0;
    width: var(--display-avatar-size, var(--_avatar-size));
    height: var(--display-avatar-size, var(--_avatar-size));
    font-size: var(--display-avatar-font-size, var(--_avatar-font-size));
    border-radius: var(--display-avatar-border-radius, 50%);

    isolation: isolate;

    /* Fills the root so DisplayChip's per-child cutout mask is sized to the whole avatar. */
    .display-avatar-surface {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background-color: var(--display-avatar-background, var(--theme-surface-subtle));
      color: var(--display-avatar-text-colour, var(--theme-text));
    }

    &[data-size="xs"] {
      --_avatar-size: var(--display-avatar-size-xs, 2.4rem);
      --_avatar-font-size: var(--display-avatar-font-size-xs, 1.2rem);
    }
    &[data-size="s"] {
      --_avatar-size: var(--display-avatar-size-s, 3.2rem);
      --_avatar-font-size: var(--display-avatar-font-size-s, 1.4rem);
    }
    &[data-size="lg"] {
      --_avatar-size: var(--display-avatar-size-lg, 4.8rem);
      --_avatar-font-size: var(--display-avatar-font-size-lg, 1.8rem);
    }
    &[data-size="xl"] {
      --_avatar-size: var(--display-avatar-size-xl, 5.6rem);
      --_avatar-font-size: var(--display-avatar-font-size-xl, 2rem);
    }

    .display-avatar-fallback {
      min-inline-size: 0;
      max-inline-size: 100%;
      overflow: hidden;
      white-space: nowrap;
    }

    .display-avatar-image {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      object-fit: cover;
    }

    .display-avatar-icon {
      font-size: var(--display-avatar-icon-size, 2.4rem);
    }
  }
}
</style>
