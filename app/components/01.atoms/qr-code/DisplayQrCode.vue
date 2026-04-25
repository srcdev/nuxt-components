<template>
  <Qrcode
    :value="qrValue"
    class="display-qr-code"
    :variant
    :radius
    :black-color
    :white-color
    :class="[elementClasses]"
  />
</template>

<script setup lang="ts">
import type { QrCodeVariant } from "~/types/components";

interface Props {
  qrValue: string;
  variant?: QrCodeVariant;
  radius?: number;
  blackColor?: string;
  whiteColor?: string;
  size?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  variant: () => ({ inner: "default", marker: "default", pixel: "default" }),
  radius: 0,
  blackColor: "currentColor",
  whiteColor: "transparent",
  size: "256px",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .display-qr-code {
    aspect-ratio: 1 / 1;
    width: v-bind(size);
  }
}
</style>
