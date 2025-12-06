<template>
  <h2>Capture QR Code</h2>
</template>

<script setup lang="ts">
const props = defineProps({
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
.capture-qr-code {
  aspect-ratio: 1 / 1;
}
</style>
