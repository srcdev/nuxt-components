<template>
  <Qrcode
    v-if="!hasEncodeError"
    :value="qrValue"
    class="display-qr-code"
    :variant
    :radius
    :black-color
    :white-color
    role="img"
    :aria-label="ariaLabel"
    :class="[elementClasses]"
  />
  <span v-else class="display-qr-code display-qr-code-fallback" :class="[elementClasses]" data-error>
    <slot name="fallback"></slot>
  </span>
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
  ariaLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  variant: () => ({ inner: "default", marker: "default", pixel: "default" }),
  radius: 0,
  blackColor: "currentColor",
  whiteColor: "transparent",
  size: "256px",
  ariaLabel: "QR code",
  styleClassPassthrough: () => [],
});

const emit = defineEmits<{
  error: [error: Error];
}>();

// The encoder throws while rendering when a value exceeds QR capacity (about 2.9KB).
const hasEncodeError = ref(false);

onErrorCaptured((error) => {
  hasEncodeError.value = true;
  emit("error", error instanceof Error ? error : new Error(String(error)));
  return false;
});

watch(
  () => props.qrValue,
  () => {
    hasEncodeError.value = false;
  }
);

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
    width: var(--display-qr-code-size, v-bind(size));
    max-inline-size: 100%;

    &.display-qr-code-fallback {
      display: inline-grid;
      place-items: center;
      overflow-wrap: anywhere;
    }
  }
}
</style>
