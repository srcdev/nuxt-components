<template>
  <div ref="rootRef" class="capture-qr-code" :class="[elementClasses]">
    <div v-if="!state.error" class="capture-qr-code-camera">
      <QrcodeStream v-if="state.cameraOn" @error="onError" @detect="onDetect" />
      <div v-else class="capture-qr-code-stopped">
        <p>{{ cameraStoppedLabel }}</p>
      </div>
      <div class="capture-qr-code-results" aria-live="polite">
        <ul v-if="result?.length" class="capture-qr-code-results-list">
          <li v-for="(r, i) in result" :key="i" class="capture-qr-code-result">{{ r }}</li>
        </ul>
      </div>
    </div>
    <div v-else class="capture-qr-code-error" role="alert">
      <slot name="error" :error="state.errorName" :message="state.errorMsg" :reset="resetCamera">
        <p class="capture-qr-code-error-message">{{ state.errorMsg }}</p>
        <InputButton variant="secondary" :button-text="resetCameraLabel" @click="resetCamera" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import type { DetectedBarcode } from "nuxt-qrcode";
import type { CaptureQrCodeErrorMessages, CaptureQrCodeErrorName } from "~/types/components";

interface Props {
  cameraStoppedLabel?: string;
  resetCameraLabel?: string;
  errorMessages?: CaptureQrCodeErrorMessages;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  cameraStoppedLabel: "Camera stopped",
  resetCameraLabel: "Reset camera",
  errorMessages: () => ({}),
  styleClassPassthrough: () => [],
});

const defaultErrorMessages: Required<CaptureQrCodeErrorMessages> = {
  NotAllowedError: "Camera access was blocked. Allow it in your browser settings, then try again.",
  NotFoundError: "No camera was found on this device.",
  NotSupportedError: "This page needs a secure (HTTPS) connection to use the camera.",
  NotReadableError: "The camera is already in use by another app or tab.",
  OverconstrainedError: "No suitable camera was found on this device.",
  StreamApiNotSupportedError: "This browser can't use the camera for scanning.",
  InsecureContextError: "This page needs a secure (HTTPS) connection to use the camera.",
  StreamLoadTimeoutError: "The camera took too long to start. Try again.",
  default: "The camera couldn't be started. Try again.",
};

const rootRef = ref<HTMLElement | null>(null);
const result = ref<string[]>();
const state = reactive({
  errorMsg: "",
  errorName: "",
  error: false,
  cameraOn: true,
});

function onDetect(detectedCodes: DetectedBarcode[]) {
  result.value = detectedCodes.map((code) => code.rawValue);
}

function onError(err: Error) {
  const name = err.name as CaptureQrCodeErrorName;
  state.error = true;
  state.errorName = err.name;
  state.errorMsg =
    props.errorMessages[name] ??
    defaultErrorMessages[name] ??
    props.errorMessages.default ??
    defaultErrorMessages.default;
}

function resetCamera() {
  state.error = false;
  state.cameraOn = true;
}

function stopMediaStreams() {
  rootRef.value?.querySelectorAll("video").forEach((video) => {
    if (!video.srcObject) return;
    (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  });
}

function stopCamera() {
  state.cameraOn = false;
  stopMediaStreams();
}

useEventListener(
  import.meta.client ? document : null,
  "visibilitychange",
  () => {
    if (document.hidden) stopCamera();
    else if (!state.error) state.cameraOn = true;
  }
);

watch(
  () => state.cameraOn,
  (cameraOn) => {
    if (!cameraOn) nextTick(stopMediaStreams);
  }
);

onBeforeUnmount(stopCamera);
onDeactivated(stopCamera);
onBeforeRouteLeave(stopCamera);

onActivated(() => {
  state.cameraOn = true;
  state.error = false;
  state.errorMsg = "";
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
    min-inline-size: 0;

    .capture-qr-code-results-list {
      margin: 0;
      padding-inline-start: var(--capture-qr-code-results-indent, 2rem);
    }

    .capture-qr-code-result,
    .capture-qr-code-error-message {
      overflow-wrap: anywhere;
    }

    .capture-qr-code-error {
      display: grid;
      gap: var(--capture-qr-code-error-gap, 1.2rem);
      justify-items: start;
    }
  }
}
</style>
