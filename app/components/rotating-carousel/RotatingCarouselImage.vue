<template>
  <component
    :is="tag"
    class="rotating-carousel"
    :class="[elementClasses]"
    :style="`--_rotate-x: ${rotateXProp}deg; --_perspective: ${perspectiveProp}; --_translateZ: ${translateZProp}; --_animation-play-state: ${
      pauseOnHover ? 'paused' : 'running'
    }`"
    ref="carouselRef"
  >
    <div class="slider" :style="`--quantity: ${Object.keys(data).length}`">
      <div v-for="(item, key) in data" :key="key" class="item" :style="`--_position: ${key}`">
        <NuxtImg :src="item.src" :alt="item.alt" />
      </div>
    </div>
  </component>
</template>

<script lang="ts">
interface IAccordianData {
  src: string
  alt: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Array as PropType<IAccordianData[]>,
    default: () => [],
  },
  tag: {
    type: String,
    default: "div",
    validator(value: string) {
      return [
        "div",
        "p",
        "span",
        "section",
        "article",
        "aside",
        "header",
        "footer",
        "main",
        "nav",
        "ul",
        "ol",
      ].includes(value)
    },
  },
  rotateX: {
    type: Number,
    default: 0,
  },
  perspective: {
    type: Number,
    default: 1000,
  },
  translateZ: {
    type: Number,
    default: 1000,
  },
  pauseOnHover: {
    type: Boolean,
    default: false,
  },
  useParallaxEffect: {
    type: Boolean,
    default: true,
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

const perspectiveProp = computed(() => `${props.perspective.toString()}px`)
const translateZProp = computed(() => `${props.translateZ.toString()}px`)

const carouselRef = ref<HTMLElement | null>(null)
const rotateXProp = ref(props.rotateX)
const minRotateX = -32
const maxRotateX = 32

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)

watch(
  () => props.rotateX,
  () => {
    if (!props.useParallaxEffect) {
      console.log("rotateXProp changed: ", rotateXProp.value)

      rotateXProp.value = props.rotateX
    }
  }
)

watch(
  () => props.useParallaxEffect,
  (currentValue) => {
    if (currentValue) {
      handleScroll()
      window.addEventListener("scroll", handleScroll)
    } else {
      window.removeEventListener("scroll", handleScroll)
    }
  }
)

const handleScroll = () => {
  if (!carouselRef.value) return
  if ("IntersectionObserver" in window) {
    const rect = carouselRef.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    const elementCenter = rect.top + rect.height / 2
    const viewportCenter = viewportHeight / 2
    const distanceFromCenter = viewportCenter - elementCenter
    const maxDistance = viewportHeight / 2 + rect.height / 2

    const progress = (distanceFromCenter + maxDistance) / (maxDistance * 2)
    const clampedProgress = Math.max(0, Math.min(1, progress))

    rotateXProp.value = minRotateX + (maxRotateX - minRotateX) * clampedProgress
  }
}

onMounted(async () => {
  if (props.useParallaxEffect) {
    handleScroll()
    await nextTick()
    window.addEventListener("scroll", handleScroll)
  }
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style lang="css">
/* @property --_rotate-x {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes autoRotateAnimation {
  from {
    --_rotate-x: -16deg;
  }
  to {
    --_rotate-x: 16deg;
  }
} */

@keyframes autoRun {
  from {
    transform: perspective(var(--_perspective)) rotateX(var(--_rotate-x)) rotateY(0deg);
  }
  to {
    transform: perspective(var(--_perspective)) rotateX(var(--_rotate-x)) rotateY(360deg);
  }
}

.rotating-carousel {
  width: 100%;
  height: 70svh;
  text-align: center;
  overflow: hidden;
  position: relative;

  /* padding-block: 800px; */

  /* &.scroll-effect {
    animation: autoRotateAnimation;
    animation-timeline: view();
  } */

  .slider {
    position: absolute;
    width: 200px;
    height: 250px;
    bottom: 35%;
    left: calc(50% - 100px);
    transform-style: preserve-3d;
    transform: perspective(var(--_perspective));
    animation: autoRun 30s linear infinite;
    z-index: 2;

    &:has(.item img:hover) {
      animation-play-state: var(--_animation-play-state);
    }

    .item {
      position: absolute;
      inset: 0 0 0 0;
      transform: rotateY(calc((var(--_position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(var(--_translateZ));

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
