<template>
  <div class="decode-qr-code" :class="[elementClasses]">
    <label class="decode-qr-code-upload">
      <span class="decode-qr-code-upload-label">{{ uploadLabel }}</span>
      <QrcodeCapture class="decode-qr-code-capture" @detect="onDetect" />
    </label>
    <QrcodeDropZone
      class="decode-qr-code-dropzone"
      :data-dropping="isDropping ? '' : undefined"
      @detect="onDetect"
      @dragover="onDropping"
      @error="onDropError"
    >
      <p class="decode-qr-code-dropzone-label">{{ dropLabel }}</p>
    </QrcodeDropZone>
    <div class="decode-qr-code-results" aria-live="polite">
      <ul v-if="result?.length" class="decode-qr-code-results-list">
        <li v-for="(r, i) in result" :key="i" class="decode-qr-code-result">{{ r }}</li>
      </ul>
      <p v-else-if="status === 'empty' && noResultLabel" class="decode-qr-code-status">{{ noResultLabel }}</p>
      <p v-else-if="status === 'error' && readErrorLabel" class="decode-qr-code-status" data-error>{{ readErrorLabel }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetectedBarcode } from "nuxt-qrcode";

interface Props {
  uploadLabel?: string;
  dropLabel?: string;
  noResultLabel?: string;
  readErrorLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  uploadLabel: "Upload a QR code image",
  dropLabel: "Or drop a QR code image here",
  noResultLabel: "No QR code was found in that image.",
  readErrorLabel: "That file couldn't be read as an image.",
  styleClassPassthrough: () => [],
});

const result = ref<string[]>();
const status = ref<"idle" | "found" | "empty" | "error">("idle");
const isDropping = ref(false);

function onDropping(dropping: boolean) {
  isDropping.value = dropping;
}

function onDetect(detectedCodes: DetectedBarcode[]) {
  result.value = detectedCodes.map((code) => code.rawValue);
  status.value = result.value.length ? "found" : "empty";
}

function onDropError() {
  result.value = [];
  status.value = "error";
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
    min-inline-size: 0;

    .decode-qr-code-upload {
      display: grid;
      gap: var(--decode-qr-code-upload-gap, 0.6rem);
      overflow-wrap: anywhere;

      .decode-qr-code-capture {
        max-inline-size: 100%;
      }
    }

    .decode-qr-code-dropzone {
      --_decode-qr-code-dropzone-border-colour: var(--decode-qr-code-dropzone-border-colour, var(--theme-border));

      display: grid;
      place-items: center;
      min-height: var(--decode-qr-code-dropzone-min-height, 3rem);
      padding: var(--decode-qr-code-dropzone-padding, 1.2rem);
      border-radius: var(--decode-qr-code-dropzone-border-radius, 0.5rem);
      border: var(--decode-qr-code-dropzone-border-width, 0.2rem) dashed var(--_decode-qr-code-dropzone-border-colour);

      &[data-dropping] {
        border-color: var(
          --decode-qr-code-dropzone-border-colour-active,
          var(--_decode-qr-code-dropzone-border-colour)
        );
        background-color: var(--decode-qr-code-dropzone-background-active, var(--theme-surface-subtle));
      }

      .decode-qr-code-dropzone-label {
        margin: 0;
        overflow-wrap: anywhere;
        text-align: center;
      }
    }

    .decode-qr-code-results-list {
      margin: 0;
      padding-inline-start: var(--decode-qr-code-results-indent, 2rem);
    }

    .decode-qr-code-result,
    .decode-qr-code-status {
      overflow-wrap: anywhere;
    }

    .decode-qr-code-status {
      margin: 0;
    }
  }
}
</style>
