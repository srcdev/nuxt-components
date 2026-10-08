<template>
  <component
    :is="chip ? DisplayChip : as"
    v-bind="chip ? { tag: chipTag, config: chipConfig, status, statusLabel } : {}"
    class="display-avatar"
    :class="[size, elementClasses]"
  >
    <slot name="default">
      <NuxtImg v-if="src" :src :alt="alt ?? ''" width="100%" height="100%" class="display-avatar-image" />
      <template v-else>
        <span :aria-hidden="alt ? 'true' : undefined">{{ fallback }}</span>
        <span v-if="alt" class="sr-only">{{ alt }}</span>
      </template>
    </slot>
    <slot name="icon"></slot>
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
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const fallback = computed(
  () =>
    props.text ||
    (props.alt || "")
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
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
    --_size: var(--display-avatar-size-md, 4rem);
    --_font-size: var(--display-avatar-font-size-md, 1.6rem);

    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--display-avatar-size, var(--_size));
    height: var(--display-avatar-size, var(--_size));
    font-size: var(--display-avatar-font-size, var(--_font-size));
    border-radius: var(--display-avatar-border-radius, 50%);
    background-color: var(--display-avatar-background, var(--theme-surface-subtle));
    color: var(--display-avatar-text-colour, var(--theme-text));

    isolation: isolate;

    &.xs {
      --_size: var(--display-avatar-size-xs, 2.4rem);
      --_font-size: var(--display-avatar-font-size-xs, 1.2rem);
    }
    &.s {
      --_size: var(--display-avatar-size-s, 3.2rem);
      --_font-size: var(--display-avatar-font-size-s, 1.4rem);
    }
    &.lg {
      --_size: var(--display-avatar-size-lg, 4.8rem);
      --_font-size: var(--display-avatar-font-size-lg, 1.8rem);
    }
    &.xl {
      --_size: var(--display-avatar-size-xl, 5.6rem);
      --_font-size: var(--display-avatar-font-size-xl, 2rem);
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
