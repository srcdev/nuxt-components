<template>
  <component
    :is="props.chip ? DisplayChip : as"
    tag="div"
    v-bind="props.chip ? (typeof props.chip === 'object' ? { config: props.chip } : { config: chipDefaultConfig }) : {}"
    class="display-avatar"
    :class="[size, elementClasses]"
    :style-class-passthrough="[elementClasses]"
  >
    <slot name="default">
      <NuxtImg v-if="src" :src :alt="alt || 'Avatar'" width="100%" height="100%" class="avatar-image" />
      <span v-else>{{ fallback }}</span>
    </slot>
    <slot name="icon"></slot>
  </component>
</template>

<script lang="ts">
import DisplayChip from "../display-chip/DisplayChip.vue"
import type { DisplayChipProps, DisplayChipConfig } from "../../types"
export interface AvatarProps {
  as?: any
  src?: string
  alt?: string
  text?: string
  size?: "xs" | "s" | "md" | "lg" | "xl" | string
  chip?: boolean | DisplayChipProps
  class?: any
  style?: any
  styleClassPassthrough?: string | string[]
}

export interface AvatarSlots {
  default(props?: {}): any
  icon(props?: {}): any
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<AvatarProps>(), {
  as: "span",
  size: "md",
  styleClassPassthrough: () => [],
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

const chipDefaultConfig = defineModel<DisplayChipConfig>({
  type: Object as PropType<{
    size: string
    maskWidth: string
    offset: string
    angle: string
  }>,
  default: () => ({
    size: "12px",
    maskWidth: "4px",
    offset: "0px",
    angle: "90deg",
  }),
  required: false,
})

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
  border: 1px solid light-dark(var(--gray-7), var(--gray-3));

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
}
</style>
