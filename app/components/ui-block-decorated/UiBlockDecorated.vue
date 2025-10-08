<template>
  <component
    :is="tag"
    class="ui-block-decorated"
    :class="[
      { ['border-' + borderStrength]: borderStrength > 0 },
      { ['shadow-' + shadowStrength]: shadowStrength > 0 },
      { ['inner-shadow-' + innerShadowStrength]: innerShadowStrength > 0 },
      elementClasses,
    ]"
  >
    <slot name="default"></slot>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
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
  borderStrength: {
    type: Number,
    default: 0,
    validator(value: number) {
      return value >= 0 && value <= 6
    },
  },
  shadowStrength: {
    type: Number,
    default: 0,
    validator(value: number) {
      return value >= 0 && value <= 6
    },
  },
  innerShadowStrength: {
    type: Number,
    default: 0,
    validator(value: number) {
      return value >= 0 && value <= 4
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">
.ui-block-decorated {
  /* Component styles */
}

/*
* Border utility classes
*/
.border-1 {
  border: var(--border-1);
}
.border-2 {
  border: var(--border-2);
}
.border-3 {
  border: var(--border-3);
}
.border-4 {
  border: var(--border-4);
}
.border-5 {
  border: var(--border-5);
}
.border-6 {
  border: var(--border-6);
}
/*
* Shadow utility classes
*/
.shadow-1 {
  box-shadow: var(--shadow-1);
}

.shadow-2 {
  box-shadow: var(--shadow-2);
}
.shadow-3 {
  box-shadow: var(--shadow-3);
}
.shadow-4 {
  box-shadow: var(--shadow-4);
}
.shadow-5 {
  box-shadow: var(--shadow-5);
}
.shadow-6 {
  box-shadow: var(--shadow-6);
}

/*
* Inner shadow utility classes
* Could use substring match [class*="inner-shadow"] but not as performant
*/

.inner-shadow-1,
.inner-shadow-2,
.inner-shadow-3,
.inner-shadow-4 {
  position: relative;
  isolation: isolate;
}

.inner-shadow-1::before,
.inner-shadow-2::before,
.inner-shadow-3::before,
.inner-shadow-4::before {
  content: "";
  display: block;
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  z-index: 2;
}

.inner-shadow-1::before {
  box-shadow: var(--inner-shadow-1), var(--inner-shadow-highlight);
}

.inner-shadow-2::before {
  box-shadow: var(--inner-shadow-2), var(--inner-shadow-highlight);
}

.inner-shadow-3::before {
  box-shadow: var(--inner-shadow-3), var(--inner-shadow-highlight);
}

.inner-shadow-4::before {
  box-shadow: var(--inner-shadow-4), var(--inner-shadow-highlight);
}
</style>
