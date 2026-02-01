<template>
  <div class="control" ref="control">
    <div aria-hidden="true" class="tooltip" ref="toolTip">
      <div class="range-label range-low-label" ref="toolTipLow">
        {{ rangeLowLabel }}
        <span class="value">{{ lowValue }} %</span>
      </div>
      <div class="range-label range-high-label" ref="toolTipHigh">
        <span class="value">{{ highValue }} %</span>
        {{ rangeHighLabel }}
      </div>
    </div>
    <input
      type="range"
      v-model="modelValue"
      ref="inputRef"
      @input="update()"
      @pointerdown="update()"
      :id
      :name
      :min
      :max
      :step
    />

    <div class="control__track" ref="controlTrack">
      <div class="control__track-slide">
        <div class="control__fill"></div>
        <div class="control__indicator"></div>
        <div class="control__fill"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  step: {
    type: Number,
    default: 1,
  },
  rangeLowLabel: {
    type: String,
    required: true,
  },
  rangeHighLabel: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value)
    },
  },
  size: {
    type: String as PropType<string>,
    default: "medium",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  weight: {
    type: String as PropType<string>,
    default: "wght-400",
    validator(value: string) {
      return propValidators.weight.includes(value)
    },
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const modelValue = defineModel<number | readonly number[]>()

const control = ref<HTMLDivElement | null>(null)
const controlTrack = ref<HTMLDivElement | null>(null)
const toolTip = ref<HTMLDivElement | null>(null)
const toolTipLow = ref<HTMLDivElement | null>(null)
const toolTipHigh = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

// Box sizes
const toolTipWidth = ref(0)
const toolTipLowWidth = ref(0)
const toolTipHighWidth = ref(0)
const toolTipMargin = 20

const toolTipLowContainerEnd = computed(() => {
  return Math.floor(((toolTipHighWidth.value + toolTipMargin) / toolTipWidth.value) * 100) + "%"
})

const toolTipHighContainerStart = computed(() => {
  return Math.floor(((toolTipWidth.value - (toolTipHighWidth.value + toolTipMargin)) / toolTipWidth.value) * 100) + "%"
})

const lowValue = computed(() => {
  return Math.floor(Number(props.max) - Number(highValue.value))
})
const highValue = computed(() => {
  return Math.floor((Number(modelValue.value) / props.max) * 100)
})

const update = () => {
  control.value?.style.setProperty("--value", String(modelValue.value))
  const value = typeof modelValue.value === "number" ? modelValue.value : 0
  controlTrack.value?.style.setProperty("--shift", value > 40 && value < 68 ? "1" : "0")
  toolTip.value?.style.setProperty("--shift", value > 40 && value < 68 ? "1" : "0")
}

const updateBoxSizes = () => {
  toolTipWidth.value = toolTip.value?.offsetWidth || 0
  toolTipLowWidth.value = toolTipLow.value?.offsetWidth || 0
  toolTipHighWidth.value = toolTipHigh.value?.offsetWidth || 0
  console.log("toolTipWidth", toolTipWidth.value)
  console.log("toolTipLowContainerEnd", toolTipLowContainerEnd.value)
  console.log("toolTipHighContainerStart", toolTipHighContainerStart.value)
}

onMounted(() => {
  updateBoxSizes()
  if (!CSS.supports("animation-timeline: scroll()")) {
    update()
  }
})
</script>

<style lang="css">
@layer foundation {
  .control {
    position: relative;
    display: grid;
    place-items: center;
    margin: 0 auto;
  }

  .control:focus-within,
  .control:hover {
    --active: 1;
  }

  [type="range"] {
    width: 100%;
    opacity: 0;
    height: 6rem;
  }

  [type="range"]:hover {
    cursor: -webkit-grab;
  }
  [type="range"]:active {
    cursor: -webkit-grabbing;
  }

  [type="range"]:focus-visible {
    outline-offset: var(--form-element-outline-offset-focus);
    outline-color: transparent;
  }

  @property --shift {
    initial-value: 0;
    inherits: true;
    syntax: "<integer>";
  }

  .tooltip {
    font-size: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    pointer-events: none;
    transform: translateY(calc(var(--shift, 0) * 50%));
    transition: transform var(--speed) var(--timing);
    z-index: 2;
  }
  @keyframes shift {
    0%,
    31%,
    61%,
    100% {
      --shift: 0;
    }
    32%,
    60% {
      --shift: 1;
    }
  }

  /* .tooltip::after, */
  /* .tooltip::before, */
  .tooltip .range-label {
    display: block;
    font-variant: tabular-nums;
    position: absolute;
    top: 50%;
    translate: 0 -50%;
    font-weight: bold;
    color: white;
    font-weight: 40;
    font-family: monospace;
  }

  [type="range"]::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    height: 6rem;
    width: 4rem;
    margin-top: 0rem;
    opacity: 1;
  }
  [type="range"]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 6rem;
    /* background: hsl(10 80% 50% / 0.5); */
    margin-top: 0rem; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    box-shadow: 0.1rem 0.1rem 0.1rem #000000, 0rem 0rem 0.1rem #0d0d0d;
  }
  [type="range"]::-moz-range-track {
    height: 6rem;
    /* background: hsl(10 80% 50% / 0.5); */
    margin-top: 0rem; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    box-shadow: 0.1rem 0.1rem 0.1rem #000000, 0rem 0rem 0.1rem #0d0d0d;
  }
}

@layer scrolls {
  @property --value {
    initial-value: 0;
    syntax: "<integer>";
    inherits: true;
  }

  @keyframes sync {
    to {
      --value: 100;
    }
  }

  [type="range"] {
    overflow: hidden;
    opacity: 0;
    touch-action: none;
    /* extras */
    accent-color: hsl(24 74% calc(24% + (30% * ((100 - var(--value, 0)) / 100)) / 1) / 0.4);
    outline: 0.2rem dashed #0000;
    transition-property: outline-color, opacity, translate;
    transition-duration: 0.25s;
  }

  [data-reveal="true"] [type="range"] {
    opacity: 1;
    translate: 0 -150%;
    outline-color: white;
  }

  .control {
    width: 100%;
    animation: sync both linear reverse, shift both linear;
    animation-timeline: --thumb;
    animation-range: contain;
    container-type: inline-size;
  }

  .control__track {
    --coffee: hsl(24 74% calc(24% + (30% * ((100 - var(--value, 0)) / 100)) / 1) / 0.4);
    --milk: hsl(0 0% 100% / calc(0.1 + (0.4 * ((100 - var(--value, 0)) / 100))));
    height: calc(50% + (var(--shift) * 50%));
    width: 100%;
    position: absolute;
    bottom: 0;
    pointer-events: none;
    transition: height var(--speed) var(--timing);
    z-index: 5;
    clip-path: inset(0 -0.25rem 0 -0.25rem round 0.6rem);
  }

  [data-reveal="true"] .control__track {
    clip-path: unset;
    outline: 0.2rem dashed white;
  }

  .control__track-slide {
    height: 100%;
    width: 100%;
    position: relative;
    translate: calc(-50% + (var(--value) * 1cqi)) 0;
    transition: translate var(--update);
  }
  .control__fill {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 0.6rem;

    &:nth-of-type(1) {
      background: var(--coffee);
      right: calc(50% + 0.5rem);
    }
    &:nth-of-type(3) {
      background: var(--milk);
      left: calc(50% + 0.5rem);
    }
  }

  .control__indicator {
    height: 75%;
    border-radius: 0.4rem;
    width: 0.4rem;
    position: absolute;
    top: 50%;
    left: 50%;
    background: hsl(0 0% 100% / calc((var(--active, 0) * 0.5) + 0.5));
    /* left: calc(var(--value, 0) * 1%); */
    z-index: 2;
    translate: -50% -50%;
    /* transition: left var(--update); */
  }

  :where(html) {
    --speed: 0.65s;
    --update: 0s;
    --timing: linear(
      0,
      0.5007 7.21%,
      0.7803 12.29%,
      0.8883 14.93%,
      0.9724 17.63%,
      1.0343 20.44%,
      1.0754 23.44%,
      1.0898 25.22%,
      1.0984 27.11%,
      1.1014 29.15%,
      1.0989 31.4%,
      1.0854 35.23%,
      1.0196 48.86%,
      1.0043 54.06%,
      0.9956 59.6%,
      0.9925 68.11%,
      1
    );
    timeline-scope: --thumb;
  }

  @supports (animation-timeline: scroll()) {
    :where(html) {
      --speed: 0.65s;
      --update: 0.1s;
      --timing: linear(
        0,
        0.5007 7.21%,
        0.7803 12.29%,
        0.8883 14.93%,
        0.9724 17.63%,
        1.0343 20.44%,
        1.0754 23.44%,
        1.0898 25.22%,
        1.0984 27.11%,
        1.1014 29.15%,
        1.0989 31.4%,
        1.0854 35.23%,
        1.0196 48.86%,
        1.0043 54.06%,
        0.9956 59.6%,
        0.9925 68.11%,
        1
      );
      timeline-scope: --thumb;
    }

    [type="range"]::-webkit-slider-thumb {
      view-timeline-name: --thumb;
      view-timeline-axis: inline;
    }
  }
}

@layer tip {
  .tooltip {
    counter-set: low var(--value) high calc(100 - var(--value));
    z-index: 6;

    /* .tooltip::before {
    --range: calc((70 - (var(--value) / 100 * 10)) * 1%);
    color: hsl(24 74% 54%);
    content: 'COFFEE ' counter(low) '%';
    mask: linear-gradient(90deg, hsl(0 0% 100% / 0.6) var(--range), hsl(0 0% 100% / 1) var(--range));
    left: 0.5rem;
  } */
    /* .tooltip::after {
    --range: calc((50 - (var(--value) / 100 * 10)) * 1%);
    content: counter(high) '% MILK';
    mask: linear-gradient(90deg, hsl(0 0% 100% / 1) var(--range), hsl(0 0% 100% / 0.5) var(--range));
    right: 0.5rem;
  } */

    .range-low-label {
      --range: calc((70 - (var(--value) / 100 * 10)) * 1%);

      display: flex;
      gap: 1.2rem;
      color: hsl(24 74% 54%);
      mask: linear-gradient(90deg, hsl(0 0% 100% / 0.6) var(--range), hsl(0 0% 100% / 1) var(--range));
      left: 0.5rem;
      .low-value {
        display: inline-block;
        border: 0.1rem solid white;
        height: 2rem;
        width: 5rem;
      }
    }

    .range-high-label {
      --range: calc((50 - (var(--value) / 100 * 10)) * 1%);

      display: flex;
      gap: 1.2rem;
      mask: linear-gradient(90deg, hsl(0 0% 100% / 1) var(--range), hsl(0 0% 100% / 0.5) var(--range));
      right: 0.5rem;
      .high-value {
        display: inline-block;
        border: 0.1rem solid white;
        height: 2rem;
        width: 5rem;
      }
    }
  }
}
</style>
