<template>
  <Qrcode :value="qrValue" class="display-qr-code" :variant :radius :blackColor :whiteColor :class="[elementClasses]" />
</template>

<script setup lang="ts">
import type { QrCodeVariant } from "../../types/components";

const props = defineProps({
  qrValue: {
    type: String,
    required: true,
  },
  variant: {
    type: Object as PropType<QrCodeVariant>,
    default: () => ({
      inner: "default",
      marker: "default",
      pixel: "default",
    }),
  },
  radius: {
    type: Number,
    default: 0,
  },
  blackColor: {
    type: String,
    default: "currentColor",
  },
  whiteColor: {
    type: String,
    default: "transparent",
  },
  size: {
    type: String,
    default: "256px",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.display-qr-code {
  aspect-ratio: 1 / 1;
  width: v-bind(size);
}
</style>
