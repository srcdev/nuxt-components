<template>
  <component
    :is="props.chip ? DisplayChip : as"
    v-bind="props.chip ? (typeof props.chip === 'object' ? { config: props.chip } : { config: chipDefaultConfig }) : {}"
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
import DisplayChip from "../display-chip/DisplayChip.vue"
import type { DisplayChipProps } from "../../types/components"

export interface AvatarSlots {
  default(props?: {}): any
  icon(props?: {}): any
}

const props = defineProps({
  as: {
    type: [String, Object] as PropType<any>,
    default: "span",
  },
  src: {
    type: String,
    default: undefined,
  },
  alt: {
    type: String,
    default: undefined,
  },
  text: {
    type: String,
    default: undefined,
  },
  size: {
    type: String as PropType<"xs" | "s" | "md" | "lg" | "xl" | string>,
    default: "md",
  },
  chip: {
    type: [Boolean, Object] as PropType<boolean | DisplayChipProps>,
    default: undefined,
  },
  class: {
    type: [String, Array, Object] as PropType<any>,
    default: undefined,
  },
  style: {
    type: [String, Array, Object] as PropType<any>,
    default: undefined,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

defineSlots<AvatarSlots>()

const { elementClasses, resetElementClasses, updateElementClasses } = useStyleClassPassthrough(
  props.styleClassPassthrough
)

if (props.chip && typeof props.chip === "object" && !("styleClassPassthrough" in props.chip)) {
  updateElementClasses(["display-avatar", props.size])
}

const fallback = computed(
  () =>
    props.text ||
    (props.alt || "")
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
)

const chipDefaultConfig = {
  size: "12px",
  maskWidth: "4px",
  offset: "0px",
  angle: "90deg",
}

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">
.display-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--gray-3);

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
</style>
