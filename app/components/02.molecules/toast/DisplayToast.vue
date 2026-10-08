<template>
  <Teleport to="body">
    <div
      v-if="privateDisplayToast"
      ref="toastElementRef"
      class="display-toast"
      :class="elementClasses"
      :data-state="toastState"
      :data-position="position"
      :data-alignment="fullWidth ? 'full-width' : alignment"
      :data-paused="isPaused ? '' : undefined"
      :data-theme="theme"
      :role="toastRole"
      :aria-live="ariaLive"
      :tabindex="slots.default ? undefined : '0'"
      :aria-describedby="slots.default ? undefined : 'toast-message-' + toastId"
      @keydown.escape="setDismissToast"
      @pointerenter="isHovered = true"
      @pointerleave="isHovered = false"
      @focusin="handleFocusIn"
      @focusout="handleFocusOut"
    >
      <slot v-if="slots.default"></slot>

      <component
        :is="contentComponent"
        v-else
        :theme="theme"
        :custom-icon="customIcon"
        :content-id="'toast-message-' + toastId"
        :dismissible="!autoDismiss"
        @dismiss="setDismissToast"
      >
        <template v-if="slots.customToastIcon" #icon>
          <slot name="customToastIcon"></slot>
        </template>
        <template v-if="slots.title || toastTitle || toastDisplayText" #title>
          <slot name="title">{{ toastTitle || toastDisplayText }}</slot>
        </template>
        <template v-if="slots.description || toastDescription" #content>
          <slot name="description">{{ toastDescription }}</slot>
        </template>
        <template v-if="dismissLabel" #dismissLabel>{{ dismissLabel }}</template>
      </component>
      <div v-if="autoDismiss" class="display-toast-progress"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import AlertContent from "~/components/02.molecules/alert-content/AlertContent.vue";
import AlertMaskedContent from "~/components/02.molecules/alert-masked-content/AlertMaskedContent.vue";
import type { DisplayToastConfig, ToastSlots } from "~/types/components";

interface Props {
  config?: DisplayToastConfig;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  config: undefined,
  styleClassPassthrough: () => [],
});

const slots = defineSlots<ToastSlots>();

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const appConfig = useAppConfig();

// Computed properties for accessing config values with defaults
// Resolution chain: prop config → app.config → hardcoded fallback
const theme = computed(() => props.config?.appearance?.theme ?? appConfig.srcdev?.displayToast?.appearance?.theme ?? "info");
const position = computed(() => props.config?.appearance?.position ?? appConfig.srcdev?.displayToast?.appearance?.position ?? "top");
const alignment = computed(() => props.config?.appearance?.alignment ?? appConfig.srcdev?.displayToast?.appearance?.alignment ?? "right");
const fullWidth = computed(() => props.config?.appearance?.fullWidth ?? appConfig.srcdev?.displayToast?.appearance?.fullWidth ?? false);
const masked = computed(() => props.config?.appearance?.masked ?? appConfig.srcdev?.displayToast?.appearance?.masked ?? false);
const contentComponent = computed(() => (masked.value ? AlertMaskedContent : AlertContent));
const autoDismiss = computed(() => props.config?.behavior?.autoDismiss ?? appConfig.srcdev?.displayToast?.behavior?.autoDismiss ?? true);
const duration = computed(() => props.config?.behavior?.duration ?? appConfig.srcdev?.displayToast?.behavior?.duration ?? 5000);
const revealDuration = computed(() => props.config?.behavior?.revealDuration ?? appConfig.srcdev?.displayToast?.behavior?.revealDuration ?? 550);
const returnFocusTo = computed(() => props.config?.behavior?.returnFocusTo ?? null);
const toastDisplayText = computed(() => props.config?.content?.text ?? "");
const toastTitle = computed(() => props.config?.content?.title ?? "");
const toastDescription = computed(() => props.config?.content?.description ?? "");
const customIcon = computed(() => props.config?.content?.customIcon);
const dismissLabel = computed(() => props.config?.content?.dismissLabel);

/*
 * Accessibility setup
 */
const toastId = useId();
const toastElementRef = useTemplateRef<HTMLElement>("toastElementRef");

// Determine appropriate ARIA attributes based on theme
const toastRole = computed(() => {
  return ["error", "warning"].includes(theme.value) ? "alert" : "status";
});

const ariaLive = computed(() => {
  return ["error", "warning"].includes(theme.value) ? "assertive" : "polite";
});

/*
 * Setup component state
 */
const externalTriggerModel = defineModel<boolean>({ default: false });
const privateDisplayToast = ref(false);
const transitionalState = ref(false);
const toastState = computed(() => (transitionalState.value ? "show" : "hide"));

/*
 * Auto-dismiss pauses while hovered or keyboard-focused (WCAG 2.2.2)
 */
const isHovered = ref(false);
const isFocusPaused = ref(false);
const isPaused = computed(() => autoDismiss.value && (isHovered.value || isFocusPaused.value));
let dismissTimer: ReturnType<typeof createPausableTimeout> | null = null;

const handleFocusIn = (event: FocusEvent) => {
  if (toastElementRef.value) isFocusPaused.value = focusPausesAutoDismiss(toastElementRef.value, event.target);
};

const handleFocusOut = (event: FocusEvent) => {
  if (!toastElementRef.value?.contains(event.relatedTarget as Node | null)) isFocusPaused.value = false;
};

watch(isPaused, (paused) => (paused ? dismissTimer?.pause() : dismissTimer?.resume()));

const clearDismissTimer = () => {
  dismissTimer?.clear();
  dismissTimer = null;
};

/*
 * Computed properties for durations (in ms for CSS)
 */
const revealDurationMs = computed(() => revealDuration.value + "ms");
const displayDurationMs = computed(() => duration.value + "ms");

/*
 * Lifecycle hooks
 */
const setDismissToast = async () => {
  clearDismissTimer();
  transitionalState.value = false;
  await useSleep(revealDuration.value);

  // Return focus to specified element if provided
  if (returnFocusTo.value) {
    // Handle both HTMLElement and ComponentPublicInstance
    let focusTarget: HTMLElement | null = null;

    if (returnFocusTo.value instanceof HTMLElement) {
      focusTarget = returnFocusTo.value;
    } else if (returnFocusTo.value && "$el" in returnFocusTo.value) {
      focusTarget = returnFocusTo.value.$el as HTMLElement;
    }

    if (focusTarget && typeof focusTarget.focus === "function") {
      focusTarget.focus();
    }
  }

  externalTriggerModel.value = false;
  privateDisplayToast.value = false;
  isHovered.value = false;
  isFocusPaused.value = false;
};

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

watch(
  () => externalTriggerModel.value,
  async (newValue, previousValue) => {
    if (newValue) {
      privateDisplayToast.value = true;
      transitionalState.value = true;

      // Focus management for accessibility when not using custom slots
      if (!slots.default) {
        await nextTick();
        // Wait for animation to start before focusing
        setTimeout(() => {
          toastElementRef.value?.focus();
        }, 100);
      }

      if (autoDismiss.value) {
        clearDismissTimer();
        dismissTimer = createPausableTimeout(setDismissToast, duration.value);
        if (isPaused.value) dismissTimer.pause();
      }
    } else if (!newValue && previousValue) {
      // If external model is set to false, dismiss the toast
      setDismissToast();
    }
  }
);

onBeforeRouteLeave(() => {
  setDismissToast();
});

onBeforeUnmount(clearDismissTimer);
</script>

<style lang="css">
@layer components {
  @keyframes display-toast-show {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes display-toast-hide-top {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-30px);
    }
  }

  @keyframes display-toast-hide-bottom {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(30px);
    }
  }

  @keyframes display-toast-fade-in {
    to {
      opacity: 1;
    }
  }

  @keyframes display-toast-fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes display-toast-progress {
    to {
      transform: scaleX(1);
    }
  }

  .display-toast {
    --_toast-gutter: 12px;
    @media (width >= 600px) {
      --_toast-gutter: 24px;
    }

    display: block;
    overflow: hidden;
    overflow-wrap: anywhere;
    position: fixed;
    margin: 0;
    opacity: 0;
    max-inline-size: var(--display-toast-max-width, min(48rem, 100% - 2 * var(--_toast-gutter)));

    z-index: var(--display-toast-z-index, 999999);

    &:focus {
      outline: 2px solid var(--display-toast-focus-ring-colour, var(--theme-ring));
      outline-offset: 2px;
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }

    &[data-state="show"] {
      @supports (animation-timing-function: linear(0, 1)) {
        animation: display-toast-show v-bind(revealDurationMs) var(--spring-easing) forwards;
      }

      @supports not (animation-timing-function: linear(0, 1)) {
        animation: display-toast-show calc(v-bind(revealDurationMs) / 2) linear forwards;
      }
    }

    &[data-state="hide"] {
      @supports (animation-timing-function: linear(0, 1)) {
        animation: display-toast-hide-top v-bind(revealDurationMs) var(--spring-easing) forwards;
      }

      @supports not (animation-timing-function: linear(0, 1)) {
        animation: display-toast-hide-top calc(v-bind(revealDurationMs) / 2) linear forwards;
      }

      &[data-position="bottom"] {
        @supports (animation-timing-function: linear(0, 1)) {
          animation: display-toast-hide-bottom v-bind(revealDurationMs) var(--spring-easing) forwards;
        }

        @supports not (animation-timing-function: linear(0, 1)) {
          animation: display-toast-hide-bottom calc(v-bind(revealDurationMs) / 2) linear forwards;
        }
      }
    }

    /* Centred on small screens */
    inset-inline: var(--_toast-gutter);
    margin-inline: auto;

    @media (width >= 600px) {
      &[data-alignment="left"] {
        inset-inline-start: var(--_toast-gutter);
        inset-inline-end: unset;
      }

      &[data-alignment="right"] {
        inset-inline-end: var(--_toast-gutter);
        inset-inline-start: unset;
      }

      &[data-alignment="center"] {
        inset-inline: 0;
        margin-inline: auto;
        width: fit-content;
      }
    }

    &[data-alignment="full-width"] {
      max-inline-size: none;
    }

    &[data-position="top"] {
      inset-block-start: var(--_toast-gutter);
      transform: translateY(-30px);
    }

    &[data-position="bottom"] {
      inset-block-end: var(--_toast-gutter);
      transform: translateY(30px);
    }

    /* After the position and state rules so it wins at equal specificity. */
    @media (prefers-reduced-motion: reduce) {
      &[data-position] {
        transform: none;
      }

      &[data-state="show"][data-position] {
        animation: display-toast-fade-in v-bind(revealDurationMs) linear forwards;
      }

      &[data-state="hide"][data-position] {
        animation: display-toast-fade-out v-bind(revealDurationMs) linear forwards;
      }
    }

    &[data-paused] .display-toast-progress {
      animation-play-state: paused;
    }

    .display-toast-progress {
      position: absolute;
      inset-block-end: 4px;
      inset-inline: 15px 8px;
      height: 3px;
      transform: scaleX(0);
      transform-origin: right;
      background: var(--display-toast-progress-colour, var(--theme-accent));
      border-radius: inherit;
      animation: display-toast-progress v-bind(displayDurationMs) linear forwards;
    }
  }
}
</style>
