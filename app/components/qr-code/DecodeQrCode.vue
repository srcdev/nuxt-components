<template>
  <div class="decode-qr-code" :class="[elementClasses]">
    <h2>Upload QR Code</h2>
    <QrcodeCapture class="qr-code-capture" @detect="onDetect" />

    <h2>Drop QR Code</h2>
    <QrcodeDropZone class="qr-code-dropzone" @detect="onDetect" @dragover="onDropping" />

    <div v-if="isDropping">
      <h5>Scanned QRCodes (Dropped): {{ isDropping ? "Dropping..." : "" }}</h5>
    </div>

    <div class="pt-4">
      <h5>Scanned QRCodes:</h5>
      <ul v-if="result" class="list-disc pl-4">
        <li v-for="(r, i) in result" :key="i">
          <span class="text-wrap wrap-anywhere">
            {{ r }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetectedBarcode } from "nuxt-qrcode"

const props = defineProps({
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const result = ref<string[]>()
const isDropping = ref(false)

function onDropping(dropping: boolean) {
  isDropping.value = dropping
}

function onDetect(detectedCodes: DetectedBarcode[]) {
  result.value = detectedCodes.map((code) => {
    // toast.add({
    //   title: 'Detected',
    //   description: `Value: ${code.rawValue}`,
    //   actions: [
    //     {
    //       label: 'Copy',
    //       onClick: () => {
    //         navigator.clipboard.writeText(code.rawValue)
    //       },
    //     },
    //   ],
    // })
    return code.rawValue
  })
}

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
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
</style>
