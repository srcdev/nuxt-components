<template>
  <div class="decode-qr-code" :class="[elementClasses]">
    <QrcodeCapture class="qr-code-capture" @detect="onDetect" />
    <QrcodeDropZone class="qr-code-dropzone" @detect="onDetect" @dragover="onDropping" />
    <div v-if="result?.length" class="scanned-results">
      <ul>
        <li v-for="(r, i) in result" :key="i">
          <span>{{ r }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetectedBarcode } from "nuxt-qrcode"

interface Props {
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
});

const result = ref<string[]>()
const isDropping = ref(false)

function onDropping(dropping: boolean) {
  isDropping.value = dropping
}

function onDetect(detectedCodes: DetectedBarcode[]) {
  result.value = detectedCodes.map((code) => code.rawValue)
}

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
@layer components {
.decode-qr-code {
  aspect-ratio: 1 / 1;

  .qr-code-capture {
  }

  .qr-code-dropzone {
    min-height: 3rem;
    border-radius: 0.5rem;
    border: 2px dashed gray;
  }
}
}
</style>
