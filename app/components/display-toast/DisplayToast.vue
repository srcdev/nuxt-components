<template>
  <Teleport to="body">
    <div
      v-if="triggerToastElem"
      class="display-notification"
      :class="[
        elementClasses,
        {
          [theme]: !slots.default,
          'has-theme': !slots.default,
          show: showToast && displayDurationInt === 0,
          'use-timer': displayDurationInt > 0,
        },
      ]"
      ref="toastElement"
    >
      <slot v-if="slots.default"></slot>

      <div v-else class="display-notification-body">
        <div class="display-notification-description">
          <div class="description-icon icon__wrapper" :class="[theme]">
            <Icon name="akar-icons:circle-check-fill" class="icon-circle-check-fill" />
          </div>
          <div class="description-text page-body-normal">{{ toastDisplayText }}</div>
          <div class="description-close">
            <button class="description-close-btn" @click.prevent="closeToast()">
              <Icon name="material-symbols:close" class="close" :class="[theme]" />
            </button>
          </div>
        </div>
      </div>
      <div v-if="displayDurationInt > 0" @transitionend="closeToast()" class="display-notification-progress"></div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import type { IToastConfig } from "@/types/display-toast"
const props = defineProps({
  theme: {
    type: String,
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

const slots = useSlots()
const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)

const toastElementRef = useTemplateRef<HTMLDivElement | null>("toastElement")
const triggerToastElem = ref(false)
const showToast = defineModel<boolean>({ default: false })

const revealDurationInt = computed(() => props.revealDuration)
const revealDuration = computed(() => revealDurationInt.value + "ms")
const displayDurationInt = computed(() => props.duration)
const displayDuration = computed(() => displayDurationInt.value + "ms")

const progressDurationInt = computed(() => Math.floor(displayDurationInt.value - revealDurationInt.value / 2))
const progressDuration = computed(() => progressDurationInt.value + "ms")

const sendCloseEvent = () => {
  console.log("sendCloseEvent triggered")
  showToast.value = false
  triggerToastElem.value = false
}

const closeToast = async () => {
  console.log("closeToast triggered")
  toastElementRef.value?.classList.remove("show")
  toastElementRef.value?.classList.add("hide")

  await useSleep(Math.floor(2 * revealDurationInt.value))
  sendCloseEvent()
}

watch(
  () => showToast.value,
  async (newValue, previousValue) => {
    console.log("Toast Config Changed: newValue", newValue, "previousValue", previousValue)

    if (!previousValue && newValue) {
      console.log("Showing toast...")
      triggerToastElem.value = true

      if (newValue && displayDurationInt.value > 0) {
        console.log("Setting timeout to hide toast after duration:", displayDurationInt.value)

        await useSleep(displayDurationInt.value)
        sendCloseEvent()
      }
    } else if (previousValue && !newValue) {
      console.log("Hiding toast...")
      // closeToast()
      await useSleep(displayDurationInt.value)
      closeToast()
    }
  }
)
</script>

<style lang="css">
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
    /* opacity: 0; */
    /* visibility: hidden; */
    transform: translateY(-30px);
  }
}

@keyframes progress {
  to {
    transform: scaleX(1);
  }
}

.display-notification {
  display: block;
  overflow: hidden;
  position: fixed;
  margin: 0;
  opacity: 0;
  visibility: hidden;
  /* animation: fade-in v-bind(displayDuration) linear; */

  transition: all 0.3s ease-in-out;

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

  &:hover {
    .display-notification-progress {
      animation-play-state: paused;
    }
  }

  &.full-width {
    left: 24px;
    right: 24px;
  }

  &.left {
    left: 24px;
  }

  &.right {
    right: 24px;
  }

  &.top {
    top: 24px;
    transform: translateY(-30px);
  }
  &.bottom {
    bottom: 24px;
    transform: translateY(30px);
  }

  &.has-theme {
    align-items: center;
    border: 2px solid transparent;
    border-radius: 12px;
    background-color: #9ce6a8;
    color: white;

    &.success {
      background-color: var(--green-4);
      border-color: var(--green-2);
    }
    &.error {
      background-color: var(--red-3);
      border-color: var(--red-2);
    }
  }

  .display-notification-body {
    display: flex;
    flex-direction: row;
    padding: 6px 12px 10px 12px;
  }

  .display-notification-description {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    flex-grow: 2;

    .description {
      .description-icon {
        transform: translateY(2px);

        &.success {
          background-color: var(--green-4);
          border-color: var(--green-2);
        }
        &.error {
          background-color: var(--red-3);
          border-color: var(--red-2);
        }
      }

      .description-text {
        flex-grow: 1;
        text-align: right;
      }
      .description-close {
        .description-close-btn {
          background-color: transparent;
          border: none;
          outline: 0;
          margin: 0;
          padding: 0;
          line-height: initial;

          svg {
            border-radius: 50%;
            border-width: 1px;
            border-style: solid;
            color: var(--gray-0);

            &.success {
              background-color: var(--green-2);
              border-color: var(--green-2);
            }
            &.error {
              background-color: var(--red-2);
              border-color: var(--red-2);
            }
          }
        }
      }
    }
  }

  .display-notification-progress {
    position: absolute;
    right: 8px;
    bottom: 4px;
    width: calc(100% - 16px);
    height: 3px;
    transform: scaleX(0);
    transform-origin: right;
    background: linear-gradient(to right, #9ce6a8, #9ce6a8);
    border-radius: inherit;
    animation: progress v-bind(progressDuration) linear forwards;
  }
}
</style>
