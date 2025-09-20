<template>
  <Teleport to="body">
    <div
      v-if="privateToastState"
      class="display-toast"
      :class="[
        elementClasses,
        {
          [theme]: !slots.default,
          'has-theme': !slots.default,
          show: publicToastState && !isHiding && displayDurationInt === 0,
          'use-timer': displayDurationInt > 0,
          hide: isHiding,
        },
      ]"
      :data-theme="theme"
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
          <button @click.prevent="closeToast">
            <Icon name="material-symbols:close" class="icon" />
            <span class="sr-only">Close</span>
          </button>
        </div>
      </div>
      <div v-if="displayDurationInt > 0" @transitionend="closeToast()" class="display-toast-progress"></div>
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
    default: 3000,
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
    type: Array as PropType<string[]>,
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

const privateToastState = ref(false)
const isHiding = ref(false)
const publicToastState = defineModel<boolean>({ default: false })

const revealDurationInt = computed(() => props.revealDuration)
const revealDuration = computed(() => revealDurationInt.value + "ms")
const displayDurationInt = computed(() => props.duration)
const displayDuration = computed(() => displayDurationInt.value + "ms")

const progressDurationInt = computed(() => Math.floor(displayDurationInt.value - revealDurationInt.value / 2))
const progressDuration = computed(() => progressDurationInt.value + "ms")

const sendCloseEvent = () => {
  publicToastState.value = false
  privateToastState.value = false
  isHiding.value = false
}

const closeToast = async () => {
  isHiding.value = true
  await useSleep(revealDurationInt.value)
  sendCloseEvent()
}

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)

watch(
  () => publicToastState.value,
  async (newValue, previousValue) => {
    if (!previousValue && newValue) {
      privateToastState.value = true

      if (newValue && displayDurationInt.value > 0) {
        await useSleep(displayDurationInt.value)
        sendCloseEvent()
      }
    } else if (previousValue && !newValue) {
      closeToast()
    }
  }
)
</script>

<style scoped lang="css">
@keyframes fade-in {
  5% {
    opacity: 1;
    visibility: visible;
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

  &.use-timer {
    animation: fade-in v-bind(displayDuration) linear;
  }

  &.show {
    animation: show v-bind(revealDuration)
      linear(
        0,
        0.029 1.6%,
        0.123 3.5%,
        0.651 10.6%,
        0.862 14.1%,
        1.002 17.7%,
        1.046 19.6%,
        1.074 21.6%,
        1.087 23.9%,
        1.086 26.6%,
        1.014 38.5%,
        0.994 46.3%,
        1
      )
      forwards;
  }

  &.hide {
    animation: hide v-bind(revealDuration)
      linear(
        0,
        0.006 53.7%,
        0.986 61.5%,
        1.014 73.4%,
        1.087 76.1%,
        1.074 78.4%,
        1.046 80.4%,
        1.002 82.3%,
        0.862 85.9%,
        0.651 89.4%,
        0.123 96.5%,
        0.029 98.4%,
        0
      )
      forwards;
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
