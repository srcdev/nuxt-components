<template>
  <component
    :is="props.chip ? DisplayChip : as"
    v-bind="
      props.chip
        ? typeof props.chip === 'object'
          ? { tag: chipTag, config: props.chip }
          : { tag: chipTag, config: chipDefaultConfig }
        : {}
    "
    class="display-avatar"
    :class="[size, elementClasses]"
    :style-class-passthrough="elementClasses"
  >
    <slot name="default">
      <NuxtImg v-if="src" :src :alt="alt || 'Avatar'" width="100%" height="100%" class="avatar-image" />
      <span v-else>{{ fallback }}</span>
    </slot>
    <slot name="icon"></slot>
  </component>
</template>

<script setup lang="ts">
import DisplayChip from "../../02.molecules/display-chip/DisplayChip.vue";
import type { DisplayChipConfig } from "~/types/components";

interface Props {
  as?: string | object;
  src?: string;
  alt?: string;
  text?: string;
  size?: "xs" | "s" | "md" | "lg" | "xl" | string;
  chip?: boolean | DisplayChipConfig;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  as: "span",
  src: undefined,
  alt: undefined,
  text: undefined,
  size: "md",
  chip: undefined,
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses, updateElementClasses } = useStyleClassPassthrough(
  props.styleClassPassthrough
);

if (props.chip && typeof props.chip === "object" && !("styleClassPassthrough" in props.chip)) {
  updateElementClasses(["display-avatar", props.size]);
}

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

const chipTag = computed((): "div" | "span" => (props.as === "div" || props.as === "span" ? props.as : "span"));

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .display-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--slate-03);

    isolation: isolate;

    &.xs {
      width: 24px;
      height: 24px;
      font-size: 0.75rem;
    }
    &.s {
      width: 32px;
      height: 32px;
      font-size: 0.875rem;
    }
    &.md {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }
    &.lg {
      width: 48px;
      height: 48px;
      font-size: 1.125rem;
    }
    &.xl {
      width: 56px;
      height: 56px;
      font-size: 1.25rem;
    }

    .avatar-image {
      width: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .avatar-icon {
      font-size: 24px;
    }
  }
}
</style>
