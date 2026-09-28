<template>
  <div class="decode-qr-code" :class="[elementClasses]">
    <label class="decode-qr-code-upload">
      <span class="decode-qr-code-upload-label">{{ uploadLabel }}</span>
      <QrcodeCapture class="decode-qr-code-capture" @detect="onDetect" />
    </label>
    <QrcodeDropZone
      class="decode-qr-code-dropzone"
      :class="{ 'is-dropping': isDropping }"
      @detect="onDetect"
      @dragover="onDropping"
    >
      <p class="decode-qr-code-dropzone-label">{{ dropLabel }}</p>
    </QrcodeDropZone>
    <div class="decode-qr-code-results" aria-live="polite">
      <ul v-if="result?.length">
        <li v-for="(r, i) in result" :key="i">
          <span>{{ r }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetectedBarcode } from "nuxt-qrcode";

interface Props {
  uploadLabel?: string;
  dropLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  uploadLabel: "Upload a QR code image",
  dropLabel: "Or drop a QR code image here",
  styleClassPassthrough: () => [],
});

const result = ref<string[]>();
const isDropping = ref(false);

function onDropping(dropping: boolean) {
  isDropping.value = dropping;
}

function onDetect(detectedCodes: DetectedBarcode[]) {
  result.value = detectedCodes.map((code) => code.rawValue);
}

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .decode-qr-code {
    display: grid;
    gap: var(--decode-qr-code-gap, 1.2rem);

    .decode-qr-code-upload {
      display: grid;
      gap: var(--decode-qr-code-upload-gap, 0.6rem);
    }

    .decode-qr-code-dropzone {
      --_dropzone-border-colour: var(--decode-qr-code-dropzone-border-colour, gray);

      display: grid;
      place-items: center;
      min-height: var(--decode-qr-code-dropzone-min-height, 3rem);
      padding: var(--decode-qr-code-dropzone-padding, 1.2rem);
      border-radius: var(--decode-qr-code-dropzone-border-radius, 0.5rem);
      border: var(--decode-qr-code-dropzone-border-width, 2px) dashed var(--_dropzone-border-colour);

      &.is-dropping {
        border-color: var(--decode-qr-code-dropzone-border-colour-active, var(--_dropzone-border-colour));
        background-color: var(--decode-qr-code-dropzone-background-active, transparent);
      }

      .decode-qr-code-dropzone-label {
        margin: 0;
      }
    }
  }
}
</style>
