<template>
  <Teleport to="body">
    <div
      v-if="privateDisplayToast"
      ref="toastElement"
      class="display-toast"
      :class="[
        elementClasses,
        cssStateClass,
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
            <Icon :name="defaultThemeIcons[props.theme] ?? 'akar-icons:info'" class="icon" />
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
<script setup lang="ts">
const props = defineProps({
  theme: {
    type: String as PropType<"primary" | "secondary" | "tertiary" | "ghost" | "error" | "info" | "success" | "warning">,
    default: "ghost",
    validator(value: string) {
      return ["primary", "secondary", "tertiary", "ghost", "error", "info", "success", "warning"].includes(value)
    },
  },
  revealDuration: {
    type: Number,
    default: 550,
  },
  autoDismiss: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 5000,
  },
  toastDisplayText: {
    type: String,
    default: "",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

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

const slots = useSlots()
const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

/*
 * Accessibility setup
 */
const toastId = ref(Math.random().toString(36).substr(2, 9))
const toastElement = ref<HTMLElement>()

// Determine appropriate ARIA attributes based on theme
const toastRole = computed(() => {
  return ["error", "warning"].includes(props.theme) ? "alert" : "status"
})

const ariaLive = computed(() => {
  return ["error", "warning"].includes(props.theme) ? "assertive" : "polite"
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
 * Computed properties for durations (in ms for CSS
 */
const revealDuration = computed(() => props.revealDuration + "ms")
const displayDuration = computed(() => props.duration + "ms")

/*
 * Lifecycle hooks
 */
const setDismissToast = async () => {
  transitionalState.value = false
  await useSleep(props.revealDuration)
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

      if (props.autoDismiss) {
        await useSleep(props.duration)
        setDismissToast()
      }
    }
  }
)
</script>

<style scoped lang="css">
@keyframes show {
  to {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

@keyframes hide {
  0% {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    visibility: hidden;
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
  visibility: hidden;

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
    animation: show v-bind(revealDuration) var(--spring-easing) forwards;
  }

  &.hide {
    animation: hide v-bind(revealDuration) var(--spring-easing) forwards;
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
      left: 50%;
      /* transform: translateX(-50%); */
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
    animation: progress v-bind(displayDuration) linear forwards;
  }
}
</style>
