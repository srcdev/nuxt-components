<template>
  <div v-if="displayComponent" class="marquee-scroller" :reverse>
    <ul class="list">
      <li v-for="item in marqueeData" :key="item.id" class="item" :style="{ '--position': item.id }">
        <slot :name="item.id"></slot>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  animationRuntime: {
    type: String,
    default: "40s",
  },
  reverse: {
    type: Boolean,
    default: false,
  },
  marqueeData: {
    type: Array as PropType<Array<{ id: number; content: string }>>,
    default: () => [],
  },
  itemConfig: {
    type: Object,
    default: () => ({
      width: "50px",
      height: "50px",
      quantity: 30,
    }),
    required: true,
  },
})

const displayComponent = ref(false)

const height = computed(() => props.itemConfig.height)
const quantity = computed(() => props.itemConfig.quantity)
const width = computed(() => props.itemConfig.width)

const animationRuntimeNumber = computed(() => {
  const [seconds] = props.animationRuntime.split("s")
  return parseFloat(seconds ?? "0")
})

const animationDelay = computed(() => {
  return Math.floor(animationRuntimeNumber.value * 1.25) + "s"
})

onMounted(() => {
  console.log(`Mounted: quantity(${quantity.value}) | animationDelay(${animationDelay.value})`)
  displayComponent.value = true
})
</script>

<style lang="css">
.marquee-scroller {
  width: 100%;
  height: v-bind(height);
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);

  &:hover .item {
    animation-play-state: paused !important;
    filter: grayscale(1);
  }

  &[reverse="true"] .item {
    animation: reversePlay v-bind(animationRuntime) linear infinite;
  }

  .list {
    display: flex;
    width: 100%;
    height: v-bind(height);
    min-width: calc(v-bind(width) * v-bind(quantity));
    position: relative;

    .item {
      width: v-bind(width);
      height: v-bind(height);
      display: grid;
      place-items: center;
      position: absolute;
      aspect-ratio: 1 / 1;
      left: 100%;
      animation: autoRun v-bind(animationRuntime) linear infinite;
      transition: filter 0.5s;
      /* animation-delay: calc((50s / v-bind(quantity)) * (var(--position) - 1) - 50s) !important; */
      animation-delay: calc(
        (v-bind(animationDelay) / v-bind(quantity)) * (var(--position) - 1) - v-bind(animationDelay)
      ) !important;

      border: 1px solid light-dark(var(--gray-12), var(--gray-0));
      border-radius: 4px;

      &:hover {
        filter: grayscale(0);
      }
    }
  }
}

@keyframes autoRun {
  from {
    left: 100%;
  }
  to {
    left: calc(v-bind(width) * -1);
  }
}

@keyframes reversePlay {
  from {
    left: calc(v-bind(width) * -1);
  }
  to {
    left: 100%;
  }
}
</style>
