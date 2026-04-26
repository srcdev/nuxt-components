<template>
  <div class="capture-qr-stream" :class="[elementClasses]">
    <div v-if="!state.error">
      <QrcodeStream v-if="state.cameraOn" ref="qrcodeStreamRef" @error="onError" @detect="onDetect" />
      <div v-else class="camera-stopped">
        <p>Camera stopped</p>
      </div>
      <div v-if="result?.length" class="scanned-results">
        <ul>
          <li v-for="(r, i) in result" :key="i">
            <span>{{ r }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="camera-error">
      <p>{{ state.errorMsg }}</p>
      <button @click="resetCamera">Reset camera</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetectedBarcode } from "nuxt-qrcode";

interface Props {
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
});

const qrcodeStreamRef = ref();
const result = ref<string[]>();
const state = reactive({
  errorMsg: "",
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

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .capture-qr-stream {
    aspect-ratio: 1 / 1;
  }
}
</style>
