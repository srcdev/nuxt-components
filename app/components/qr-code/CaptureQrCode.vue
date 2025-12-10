<template>
  <div class="capture-qr-stream">
    <h2>Capture QR Code</h2>
    <div v-if="!state.error">
      <QrcodeStream v-if="state.cameraOn" ref="qrcodeStreamRef" @error="onError" @detect="onDetect" />
      <div v-else class="camera-stopped">
        <p>Camera stopped</p>
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
    <div v-else>
      <h3>
        {{ state.errorMsg }}
      </h3>
      <button @click="resetCamera">reset</button>
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

const qrcodeStreamRef = ref()
const result = ref<string[]>()
const state = reactive({
  errorMsg: "",
  error: false,
  cameraOn: true,
})

// Reset camera state when component mounts
onMounted(() => {
  // Reset to default state on mount
  state.cameraOn = true
  state.error = false
  state.errorMsg = ""
  result.value = []

  const handleVisibilityChange = () => {
    if (document.hidden) {
      state.cameraOn = false
      stopAllMediaStreams()
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange)

  // Cleanup listener on unmount
  onBeforeUnmount(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange)
  })
})

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

function onError(err: Error) {
  state.error = true
  state.errorMsg = `[${err.name}]: ${err.message}`
}

function resetCamera() {
  state.error = false
  state.cameraOn = true
}

// Function to stop all media streams
function stopAllMediaStreams() {
  // Stop streams via the QrcodeStream component ref
  if (qrcodeStreamRef.value) {
    try {
      // Try to access the video element and stop its tracks
      const videoElement = qrcodeStreamRef.value.$el?.querySelector("video")
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach((track) => {
          track.stop()
        })
        videoElement.srcObject = null
      }
    } catch (error) {
      console.warn("Error stopping camera stream:", error)
    }
  }

  // Global cleanup: Find all video elements and stop their streams
  try {
    const allVideoElements = document.querySelectorAll("video")
    allVideoElements.forEach((video) => {
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach((track) => {
          track.stop()
        })
        video.srcObject = null
      }
    })
  } catch (error) {
    console.warn("Error in global video cleanup:", error)
  }
}

// Watch for camera state changes
watch(
  () => state.cameraOn,
  (newValue) => {
    if (!newValue) {
      // Wait a tick for the component to unmount, then clean up
      nextTick(() => {
        stopAllMediaStreams()
      })
    }
  }
)

// Stop camera when component is unmounted (e.g., route change)
onBeforeUnmount(() => {
  state.cameraOn = false
  stopAllMediaStreams()
})

// Also handle dynamic component switching (like in [componentName].vue)
onDeactivated(() => {
  state.cameraOn = false
  stopAllMediaStreams()
})

onActivated(() => {
  // Reset state when component becomes active again
  state.cameraOn = true
  state.error = false
  state.errorMsg = ""
})

// Use Nuxt's navigation guard to stop camera before route changes
onBeforeRouteLeave(() => {
  state.cameraOn = false
  stopAllMediaStreams()
})

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
.capture-qr-stream {
  aspect-ratio: 1 / 1;
}
</style>
