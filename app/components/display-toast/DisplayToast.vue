<template>
  <Teleport to="body">
    <div
      v-if="privateDisplayToast"
      class="display-toast"
      :class="[
        elementClasses,
        cssStateClass,
        {
          'has-theme': !slots.default,
          'auto-dismiss': autoDismiss,
        },
      ]"
      :data-theme="theme"
      ref="displayToastRef"
    >
      <slot v-if="slots.default"></slot>

      <div v-else class="display-toast-inner">
        <div class="toast-icon" aria-hidden="true">
          <slot name="customToastIcon">
            <Icon :name="defaultThemeIcons[props.theme] ?? 'akar-icons:info'" class="icon" />
          </slot>
        </div>
        <div class="toast-message">{{ toastDisplayText }}</div>
        <div class="toast-action">
          <button @click.prevent="setDismissToast()">
            <Icon name="material-symbols:close" class="icon" />
            <span class="sr-only">Close</span>
          </button>
        </div>
      </div>
      <div v-if="autoDismiss" class="display-toast-progress" ref="displayToastProgressRef"></div>
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
 * Setup comonent refs
 */
const displayToastRef = useTemplateRef<HTMLElement | null>("displayToast")
const displayToastProgressRef = useTemplateRef<HTMLElement | null>("displayToastProgress")

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
const revealDurationInt = computed(() => props.revealDuration)
const revealDuration = computed(() => revealDurationInt.value + "ms")
const displayDurationInt = computed(() => props.duration)
const displayDuration = computed(() => displayDurationInt.value + "ms")

const progressDurationInt = computed(() => Math.floor(displayDurationInt.value - revealDurationInt.value / 2))
const progressDuration = computed(() => progressDurationInt.value + "ms")

/*
 * Lifecycle hooks
 */
const setDismissToast = () => {
  transitionalState.value = false
}

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)

watch(
  () => externalTriggerModel.value,
  (newValue, previousValue) => {
    console.log("externalTriggerModel changed: newValue", newValue, "previousValue", previousValue)
    if (newValue) privateDisplayToast.value = transitionalState.value = true

    if (!newValue && previousValue) {
      transitionalState.value = false
    }
  }
)

watch(
  () => transitionalState.value,
  (newValue, previousValue) => {
    console.log("transitionalState changed: newValue", newValue, "previousValue", previousValue)
  }
)
</script>

<style scoped lang="css">
@keyframes slide-in {
  from {
    opacity: 0;
    /* visibility: hidden; */
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    /* visibility: visible; */
    transform: translateY(0);
  }
}

@keyframes slide-out {
  from {
    opacity: 1;
    /* visibility: visible; */
    transform: translateY(0);
  }
  to {
    opacity: 0;
    /* visibility: hidden; */
    transform: translateY(20px);
  }
}

@keyframes slide-in-out {
  5% {
    opacity: 1;
    /* visibility: visible; */
    transform: translateY(0);
  }
  95% {
    opacity: 1;
    transform: translateY(0);
  }
}

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

  &.auto-dismiss {
    /* first run slide-in, then slide-out after a delay */
    animation: slide-in 400ms var(--spring-in-easing) forwards,
      slide-out 400ms var(--spring-out-easing) forwards v-bind(displayDuration);
  }

  &:not(&.auto-dismiss) {
    &.show {
      animation: show v-bind(revealDuration) var(--spring-easing) forwards;
    }

    &.hide {
      /* animation: hide v-bind(revealDuration) var(--spring-easing) forwards; */
      animation: hide 5s var(--spring-easing) forwards;
    }
  }

  &:hover {
    .display-toast-progress {
      animation-play-state: paused;
    }
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

          &:hover {
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
    animation: progress v-bind(progressDuration) linear forwards;
  }
}
</style>
