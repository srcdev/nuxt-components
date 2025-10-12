<template>
  <Teleport to="body">
    <div
      v-if="privateDisplayToast"
      ref="toastElement"
      class="display-toast"
      :class="[
        elementClasses,
        cssStateClass,
        positionClasses,
        {
          'has-theme': !slots.default,
        },
      ]"
      :data-theme="theme"
      :role="toastRole"
      :aria-live="ariaLive"
      :tabindex="slots.default ? undefined : '0'"
      :aria-describedby="slots.default ? undefined : 'toast-message-' + toastId"
      @keydown.escape="setDismissToast"
    >
      <slot v-if="slots.default"></slot>

      <div v-else class="display-toast-inner">
        <div class="toast-icon" aria-hidden="true">
          <slot name="customToastIcon">
            <Icon :name="customIcon || defaultThemeIcons[theme] || 'akar-icons:info'" class="icon" />
          </slot>
        </div>
        <div class="toast-message" :id="'toast-message-' + toastId">{{ toastDisplayText }}</div>
        <div class="toast-action">
          <button @click.prevent="setDismissToast()">
            <Icon name="material-symbols:close" class="icon" />
            <span class="sr-only">Close</span>
          </button>
        </div>
      </div>
      <div v-if="autoDismiss" class="display-toast-progress"></div>
    </div>
  </Teleport>
</template>

<script lang="ts">
/**
 * DisplayToast - Configurable toast notification component
 *
 * Example usage with config object:
 * <DisplayToast
 *   v-model="showToast"
 *   :config="{
 *     appearance: { theme: 'success', position: 'top', alignment: 'right' },
 *     behavior: { autoDismiss: true, duration: 3000 },
 *     content: { text: 'Operation completed successfully!' }
 *   }"
 * />
 *
 * Types exported for use in other components:
 * - DisplayToastConfig
 * - DisplayToastProps
 * - DisplayToastTheme
 * - DisplayToastAppearanceConfig
 * - DisplayToastBehaviorConfig
 * - DisplayToastContentConfig
 * - ToastSlots
 */

export type DisplayToastTheme =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "error"
  | "info"
  | "success"
  | "warning"

export type DisplayToastPosition = "top" | "bottom"
export type DisplayToastAlignment = "left" | "center" | "right"

export interface DisplayToastAppearanceConfig {
  theme?: DisplayToastTheme
  position?: DisplayToastPosition
  alignment?: DisplayToastAlignment
  fullWidth?: boolean
}

export interface DisplayToastBehaviorConfig {
  autoDismiss?: boolean
  duration?: number
  revealDuration?: number
}

export interface DisplayToastContentConfig {
  text?: string
  customIcon?: string
}

export interface DisplayToastConfig {
  appearance?: DisplayToastAppearanceConfig
  behavior?: DisplayToastBehaviorConfig
  content?: DisplayToastContentConfig
}

export interface DisplayToastProps {
  config?: DisplayToastConfig
  styleClassPassthrough?: string | string[]
}

export interface ToastSlots {
  default?(props?: {}): any
  customToastIcon?(props?: {}): any
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<DisplayToastProps>(), {
  config: () => ({
    appearance: {
      theme: "ghost" as DisplayToastTheme,
      position: "top" as DisplayToastPosition,
      alignment: "right" as DisplayToastAlignment,
      fullWidth: false,
    },
    behavior: {
      autoDismiss: true,
      duration: 5000,
      revealDuration: 550,
    },
    content: {
      text: "",
      customIcon: undefined,
    },
  }),
  styleClassPassthrough: () => [],
})

const slots = defineSlots<ToastSlots>()

const defaultThemeIcons = {
  primary: "akar-icons:info",
  secondary: "akar-icons:info",
  tertiary: "akar-icons:info",
  ghost: "akar-icons:info",
  error: "akar-icons:circle-alert",
  info: "akar-icons:info",
  success: "akar-icons:info",
  warning: "akar-icons:circle-alert",
}

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

// Computed properties for accessing config values with defaults
const theme = computed(() => props.config?.appearance?.theme ?? "ghost")
const position = computed(() => props.config?.appearance?.position ?? "top")
const alignment = computed(() => props.config?.appearance?.alignment ?? "right")
const fullWidth = computed(() => props.config?.appearance?.fullWidth ?? false)
const autoDismiss = computed(() => props.config?.behavior?.autoDismiss ?? true)
const duration = computed(() => props.config?.behavior?.duration ?? 5000)
const revealDuration = computed(() => props.config?.behavior?.revealDuration ?? 550)
const toastDisplayText = computed(() => props.config?.content?.text ?? "")
const customIcon = computed(() => props.config?.content?.customIcon)

// Computed classes for positioning
const positionClasses = computed(() => {
  const classes = []
  classes.push(position.value)
  if (fullWidth.value) {
    classes.push("full-width")
  } else {
    classes.push(alignment.value)
  }
  return classes
})

/*
 * Accessibility setup
 */
const toastId = useId()
const toastElement = ref<HTMLElement>()

// Determine appropriate ARIA attributes based on theme
const toastRole = computed(() => {
  return ["error", "warning"].includes(theme.value) ? "alert" : "status"
})

const ariaLive = computed(() => {
  return ["error", "warning"].includes(theme.value) ? "assertive" : "polite"
})

/*
 * Setup component state
 */
const externalTriggerModel = defineModel<boolean>({ default: false })
const privateDisplayToast = ref(false)
const transitionalState = ref(false)
const cssStateClass = computed(() => {
  return transitionalState.value ? "show" : "hide"
})

/*
 * Computed properties for durations (in ms for CSS)
 */
const revealDurationMs = computed(() => revealDuration.value + "ms")
const displayDurationMs = computed(() => duration.value + "ms")

/*
 * Lifecycle hooks
 */
const setDismissToast = async () => {
  transitionalState.value = false
  await useSleep(revealDuration.value)
  externalTriggerModel.value = false
  privateDisplayToast.value = false
}

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)

watch(
  () => externalTriggerModel.value,
  async (newValue, previousValue) => {
    if (newValue) {
      privateDisplayToast.value = true
      transitionalState.value = true

      // Focus management for accessibility when not using custom slots
      if (!slots.default) {
        await nextTick()
        // Wait for animation to start before focusing
        setTimeout(() => {
          toastElement.value?.focus()
        }, 100)
      }

      if (autoDismiss.value) {
        await useSleep(duration.value)
        setDismissToast()
      }
    }
  }
)
</script>

<style lang="css">
@keyframes show {
  to {
    opacity: 1;
    /* visibility: visible; */
    transform: translateY(0);
  }
}

@keyframes hide {
  0% {
    opacity: 1;
    /* visibility: visible; */
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    /* visibility: hidden; */
    transform: translateY(-30px);
  }
}

@keyframes progress {
  to {
    transform: scaleX(1);
  }
}

.display-toast {
  display: block;
  overflow: hidden;
  position: fixed;
  margin: 0;
  opacity: 0;
  /* visibility: hidden; */

  z-index: 100;

  /* Focus styles for accessibility */
  &:focus {
    outline: 2px solid var(--colour-theme-3, #007acc);
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &.show {
    /* animation: show v-bind(revealDurationMs) var(--spring-easing) forwards; */
    animation: show v-bind(revealDurationMs) linear forwards;
  }

  &.hide {
    /* animation: hide v-bind(revealDurationMs) var(--spring-easing) forwards; */
    animation: hide v-bind(revealDurationMs) linear forwards;
  }

  &.full-width {
    left: 24px;
    right: 24px;
  }

  &:not(.full-width) {
    &.left {
      left: 24px;
    }

    &.right {
      right: 24px;
    }

    &.center {
      inset-inline: 0;
      margin-inline: auto;
      width: max-content;
    }
  }

  &.top {
    top: 24px;
    transform: translateY(-30px);
  }
  &.bottom {
    bottom: 24px;
    transform: translateY(30px);
  }

  /*
  * Styles for the display toast component
  */
  &.has-theme {
    padding-inline-start: 6px;
    background-color: var(--colour-theme-8);

    border: 0.1rem solid var(--colour-theme-8);
    border-start-start-radius: 8px;
    border-end-start-radius: 8px;
    border-start-end-radius: 4px;
    border-end-end-radius: 4px;

    overflow: hidden;

    .display-toast-inner {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 12px;
      align-items: center;
      background-color: var(--gray-10);
      border-start-start-radius: 8px;
      border-end-start-radius: 8px;
      padding: 12px 14px;
      overflow: hidden;

      .toast-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;

        .icon {
          color: var(--colour-theme-0);
          display: inline-block;
          font-size: 2.5rem;
          font-style: normal;
          font-weight: normal;
          overflow: hidden;
        }
      }

      .toast-message {
        display: flex;
        align-items: center;
        font-size: var(--step-4);
        font-weight: normal;
        line-height: 1.3;
        color: var(--colour-theme-0);
        margin: 0;
        padding: 0;
      }

      .toast-action {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 12px;

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--colour-theme-10);
          border: 0.1rem solid var(--colour-theme-8);
          outline: 0.1rem solid transparent;
          border-radius: 50%;
          box-shadow: none;
          color: var(--colour-theme-0);
          cursor: pointer;
          font-size: var(--step-4);
          font-weight: bold;
          padding: 0.5rem;
          text-decoration: underline;

          transition: all 0.3s ease;

          .icon {
            font-size: 1.5rem;
            vertical-align: middle;
          }

          &:hover,
          &:focus-visible {
            box-shadow: none;
            background-color: var(--colour-theme-8);
            color: var(--colour-theme-0);
            outline: 0.1rem solid var(--colour-theme-3);
            outline-offset: 0.2rem;
          }
        }
      }
    }
  }

  .display-toast-progress {
    position: absolute;
    right: 8px;
    bottom: 4px;
    width: calc(100% - 16px);
    height: 3px;
    transform: scaleX(0);
    transform-origin: right;
    background: linear-gradient(to right, var(--colour-theme-2), var(--colour-theme-8));
    border-radius: inherit;
    animation: progress v-bind(displayDurationMs) linear forwards;
  }
}
</style>
