<template>
  <component
    :is="tag"
    class="rotating-carousel"
    :class="[elementClasses]"
    :style="`--_rotate-x: ${rotateXProp}; --_perspective: ${perspectiveProp}; --_translateZ: ${translateZProp}; --_animation-play-state: ${pauseOnHover ? 'paused' : 'running'}`"
  >
    <div class="slider" :style="`--quantity: ${Object.keys(data).length}`">
      <div v-for="(item, key) in data" :key="key" class="item" :style="`--_position: ${key}`"><NuxtImg :src="item.src" :alt="item.alt" /></div>
    </div>
  </component>
</template>

<script lang="ts">
const TAGS_ALLOWED = <string[]>['div', 'p', 'span', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav', 'ul', 'ol'];
interface IAccordianData {
  src: string;
  alt: string;
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
    default: 'div',
    validator(value: string) {
      return TAGS_ALLOWED.includes(value);
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
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const rotateXProp = computed(() => `${props.rotateX.toString()}deg`);
const perspectiveProp = computed(() => `${props.perspective.toString()}px`);
const translateZProp = computed(() => `${props.translateZ.toString()}px`);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
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
  height: 100vh;
  text-align: center;
  overflow: hidden;
  position: relative;

  .slider {
    position: absolute;
    width: 200px;
    height: 250px;
    top: 10%;
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
