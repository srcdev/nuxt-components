<template>
  <div class="capture-qr-code" :class="[elementClasses]">
    <div v-if="!state.error" class="capture-qr-code-camera">
      <QrcodeStream v-if="state.cameraOn" ref="qrcodeStreamRef" @error="onError" @detect="onDetect" />
      <div v-else class="capture-qr-code-stopped">
        <p>{{ cameraStoppedLabel }}</p>
      </div>
      <div class="capture-qr-code-results" aria-live="polite">
        <ul v-if="result?.length">
          <li v-for="(r, i) in result" :key="i">
            <span>{{ r }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="capture-qr-code-error" role="alert">
      <slot name="error" :error="state.errorName" :message="state.errorMsg" :reset="resetCamera">
        <p>{{ state.errorMsg }}</p>
        <InputButtonCore variant="secondary" :button-text="resetCameraLabel" @click="resetCamera" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetectedBarcode } from "nuxt-qrcode";

interface Props {
  cameraStoppedLabel?: string;
  resetCameraLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  cameraStoppedLabel: "Camera stopped",
  resetCameraLabel: "Reset camera",
  styleClassPassthrough: () => [],
});

const qrcodeStreamRef = ref();
const result = ref<string[]>();
const state = reactive({
  errorMsg: "",
  errorName: "",
  error: false,
  cameraOn: true,
});

onMounted(() => {
  state.cameraOn = true;
  state.error = false;
  state.errorMsg = "";
  result.value = [];

  const handleVisibilityChange = () => {
    if (document.hidden) {
      state.cameraOn = false;
      stopAllMediaStreams();
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  onBeforeUnmount(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });
});

function onDetect(detectedCodes: DetectedBarcode[]) {
  result.value = detectedCodes.map((code) => code.rawValue);
}

function onError(err: Error) {
  state.error = true;
  state.errorName = err.name;
  state.errorMsg = `[${err.name}]: ${err.message}`;
}

function resetCamera() {
  state.error = false;
  state.cameraOn = true;
}

function stopAllMediaStreams() {
  if (qrcodeStreamRef.value) {
    try {
      const videoElement = qrcodeStreamRef.value.$el?.querySelector("video");
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoElement.srcObject = null;
      }
    } catch (error) {
      console.warn("Error stopping camera stream:", error);
    }
  }

  try {
    document.querySelectorAll("video").forEach((video) => {
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    });
  } catch (error) {
    console.warn("Error in global video cleanup:", error);
  }
}

watch(
  () => state.cameraOn,
  (newValue) => {
    if (!newValue) {
      nextTick(() => stopAllMediaStreams());
    }
  }
);

onBeforeUnmount(() => {
  state.cameraOn = false;
  stopAllMediaStreams();
});

onDeactivated(() => {
  state.cameraOn = false;
  stopAllMediaStreams();
});

onActivated(() => {
  state.cameraOn = true;
  state.error = false;
  state.errorMsg = "";
});

onBeforeRouteLeave(() => {
  state.cameraOn = false;
  stopAllMediaStreams();
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .capture-qr-code {
    aspect-ratio: var(--capture-qr-code-aspect-ratio, 1 / 1);

    .capture-qr-code-error {
      display: grid;
      gap: var(--capture-qr-code-error-gap, 1.2rem);
      justify-items: start;
    }
  }
}
</style>
