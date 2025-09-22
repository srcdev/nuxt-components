<template>
  <div class="clip-element-wrapper" ref="container" :class="elementClasses">
    <div class="clipped-element" :style="`--_clip-path: inset(${clipOffset}px 0 0 0)`" ref="clipElement">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  maxClip: {
    type: Number,
    default: 100,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const container = ref(null)
const clipElement = ref<HTMLDivElement | null>(null)
const clipOffset = ref(0)

const updateClip = () => {
  if (clipElement.value) {
    const topPosition = Math.floor(clipElement.value.getBoundingClientRect().top)

    if (topPosition < props.maxClip && topPosition > 0) {
      clipOffset.value = props.maxClip - topPosition
    } else if (topPosition < 0) {
      clipOffset.value = props.maxClip + Math.abs(topPosition)
    } else if (topPosition > props.maxClip) {
      clipOffset.value = 0
    }
  }
}

onMounted(() => {
  if (import.meta.client) {
    updateClip() // Initial check
    window.addEventListener("scroll", updateClip, { passive: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateClip)
})
</script>

<style lang="css">
.clip-element-wrapper {
  position: relative;
  overflow: hidden;
}
.clipped-element {
  width: 100%;
  clip-path: var(--_clip-path);
  display: block;
}
</style>
