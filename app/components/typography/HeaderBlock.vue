<template>
  <component :is="tag" :class="[classLevel, elementClasses]">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  tagLevel: {
    type: Number,
    default: 1,
    validator(value: number) {
      return [1, 2, 3, 4, 5, 6].includes(value)
    },
  },
  classLevel: {
    type: Number,
    default: 1,
    validator(value: number) {
      return [1, 2, 3, 4, 5, 6].includes(value)
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const tag = computed(() => `h${props.tagLevel}`)
const classLevel = computed(() => `page-header-${props.classLevel}`)

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>
