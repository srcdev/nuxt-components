<template>
  <component :is="tag" :class="[classLevelClass, elementClasses]">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
const props = defineProps<{
  tagLevel?: number | string
  classLevel?: number | string
  styleClassPassthrough?: string | string[]
}>()

const tagLevel = computed(() => {
  const n = Number(props.tagLevel ?? 1)
  return [1, 2, 3, 4, 5, 6].includes(n) ? n : 1
})

const classLevel = computed(() => {
  const n = Number(props.classLevel ?? 1)
  return [1, 2, 3, 4, 5, 6].includes(n) ? n : 1
})

const tag = computed(() => `h${tagLevel.value}`)
const classLevelClass = computed(() => `page-header-${classLevel.value}`)

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough ?? [])

watch(
  () => props.styleClassPassthrough,
  (newVal) => {
    resetElementClasses(newVal ?? [])
  }
)
</script>
