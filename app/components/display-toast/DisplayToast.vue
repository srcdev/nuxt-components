<template>
  <Teleport to="body">
    <div
      v-if="privateDisplayToast"
      ref="toastElementRef"
      class="display-toast"
      :class="[
        elementClasses,
        cssStateClass,
        positionClasses,
        theme,
        {
          'has-theme': !slots.default,
        },
      ]"
      :role="toastRole"
      :aria-live="ariaLive"
      :tabindex="slots.default ? undefined : '0'"
      :aria-describedby="slots.default ? undefined : 'toast-message-' + toastId"
      @keydown.escape="setDismissToast"
    >
      <slot v-if="slots.default"></slot>

      <DefaultToastContent
        v-else
        :theme="theme"
        :custom-icon="customIcon"
        :toast-id="toastId"
        :toast-display-text="toastDisplayText"
        :toast-title="toastTitle"
        :toast-description="toastDescription"
        :auto-dismiss="autoDismiss"
        :set-dismiss-toast="setDismissToast"
      >
        <template #customToastIcon>
          <slot name="customToastIcon" />
        </template>
        <template #title>
          <slot name="title" />
        </template>
        <template #description>
          <slot name="description" />
        </template>
      </DefaultToastContent>
      <div v-if="autoDismiss" class="display-toast-progress"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type {
  DisplayToastProps,
  DisplayToastTheme,
  DisplayToastPosition,
  DisplayToastAlignment,
  ToastSlots,
} from "../../types/components/display-toast.d"

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

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

// Computed properties for accessing config values with defaults
const theme = computed(() => props.config?.appearance?.theme ?? "ghost")
const position = computed(() => props.config?.appearance?.position ?? "top")
const alignment = computed(() => props.config?.appearance?.alignment ?? "right")
const fullWidth = computed(() => props.config?.appearance?.fullWidth ?? false)
const autoDismiss = computed(() => props.config?.behavior?.autoDismiss ?? true)
const duration = computed(() => props.config?.behavior?.duration ?? 5000)
const revealDuration = computed(() => props.config?.behavior?.revealDuration ?? 550)
const returnFocusTo = computed(() => props.config?.behavior?.returnFocusTo ?? null)
const toastDisplayText = computed(() => props.config?.content?.text ?? "")
const toastTitle = computed(() => props.config?.content?.title ?? "")
const toastDescription = computed(() => props.config?.content?.description ?? "")
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
const toastElementRef = useTemplateRef<HTMLElement>("toastElementRef")

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

  // Return focus to specified element if provided
  if (returnFocusTo.value) {
    // Handle both HTMLElement and ComponentPublicInstance
    let focusTarget: HTMLElement | null = null

    if (returnFocusTo.value instanceof HTMLElement) {
      focusTarget = returnFocusTo.value
    } else if (returnFocusTo.value && "$el" in returnFocusTo.value) {
      focusTarget = returnFocusTo.value.$el as HTMLElement
    }

    if (focusTarget && typeof focusTarget.focus === "function") {
      focusTarget.focus()
    }
  }

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
          toastElementRef.value?.focus()
        }, 100)
      }

      if (autoDismiss.value) {
        await useSleep(duration.value)
        setDismissToast()
      }
    } else if (!newValue && previousValue) {
      // If external model is set to false, dismiss the toast
      setDismissToast()
    }
  }
)

onBeforeRouteLeave(() => {
  setDismissToast()
})
</script>

<style lang="css">
@keyframes show {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hideTop {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
}

@keyframes hideBottom {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(30px);
  }
}

@keyframes progress {
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
  position: fixed;
  margin: 0;
  opacity: 0;

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
    @supports (animation-timing-function: linear(0, 1)) {
      animation: show v-bind(revealDurationMs) var(--spring-easing) forwards;
    }

    @supports not (animation-timing-function: linear(0, 1)) {
      animation: show calc(v-bind(revealDurationMs) / 2) linear forwards;
    }
  }

  &.hide {
    @supports (animation-timing-function: linear(0, 1)) {
      animation: hideTop v-bind(revealDurationMs) var(--spring-easing) forwards;
    }

    @supports not (animation-timing-function: linear(0, 1)) {
      animation: hideTop calc(v-bind(revealDurationMs) / 2) linear forwards;
    }

    &.bottom {
      @supports (animation-timing-function: linear(0, 1)) {
        animation: hideBottom v-bind(revealDurationMs) var(--spring-easing) forwards;
      }

      @supports not (animation-timing-function: linear(0, 1)) {
        animation: hideBottom calc(v-bind(revealDurationMs) / 2) linear forwards;
      }
    }
  }

  /*
  * Default is centre for smaller screens
  */
  inset-inline: var(--_toast-gutter);
  margin-inline: auto;

  @media (width >= 600px) {
    &.left {
      inset-inline-start: var(--_toast-gutter);
      inset-inline-end: unset;
    }

    &.right {
      inset-inline-end: var(--_toast-gutter);
      inset-inline-start: unset;
    }

    &.center {
      &:not(.full-width) {
        inset-inline: 0;
        margin-inline: auto;
        width: max-content;
      }
    }
  }

  &.top {
    inset-block-start: var(--_toast-gutter);
    transform: translateY(-30px);
  }
  &.bottom {
    inset-block-end: var(--_toast-gutter);
    transform: translateY(30px);
  }

  /*
  * Styles for the display toast component if slot is empty
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

    /* .display-toast-inner {
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
    } */
  }

  .display-toast-progress {
    position: absolute;
    inset-block-end: 4px;
    inset-inline: 15px 8px;
    height: 3px;
    transform: scaleX(0);
    transform-origin: right;
    background: linear-gradient(to right, var(--colour-theme-2), var(--colour-theme-8));
    border-radius: inherit;
    animation: progress v-bind(displayDurationMs) linear forwards;
  }
}
</style>
