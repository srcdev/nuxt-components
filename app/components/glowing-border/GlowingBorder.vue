<template>
  <component :is="tag" class="glowing-border" :class="[elementClasses, variant]">
    <slot></slot>
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
  variant: {
    type: String,
    default: "subtle",
    validator(value: string) {
      return ["subtle", "vivid", "silver", "steel"].includes(value)
    },
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
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

<style scoped lang="css">
@property --glow-deg {
  syntax: "<angle>";
  inherits: true;
  initial-value: -90deg;
}

/* the colors don't need to be registed */
@property --clr-1 {
  syntax: "<color>";
  inherits: true;
  initial-value: red;
}

@property --clr-2 {
  syntax: "<color>";
  inherits: true;
  initial-value: yellow;
}

@property --clr-3 {
  syntax: "<color>";
  inherits: true;
  initial-value: green;
}

@property --clr-4 {
  syntax: "<color>";
  inherits: true;
  initial-value: blue;
}

@property --clr-5 {
  syntax: "<color>";
  inherits: true;
  initial-value: purple;
}

.glowing-border {
  &.vivid {
    --clr-1: #ff0000;
    --clr-2: #ffa500;
    --clr-3: #ffff00;
    --clr-4: #008000;
    --clr-5: #0000ff;
  }

  &.subtle {
    --clr-1: #ff9a9e;
    --clr-2: #fad0c4;
    --clr-3: #fad0c4;
    --clr-4: #fbc2eb;
    --clr-5: #a18cd1;
  }

  &.silver {
    --clr-1: #d4d4d4;
    --clr-2: #e4e4e4;
    --clr-3: #f5f5f5;
    --clr-4: #e4e4e4;
    --clr-5: #d4d4d4;
  }

  &.steel {
    --clr-1: #434343;
    --clr-2: #5a5a5a;
    --clr-3: #6e6e6e;
    --clr-4: #5a5a5a;
    --clr-5: #434343;
  }

  --gradient-glow: var(--clr-1), var(--clr-2), var(--clr-3), var(--clr-4), var(--clr-5), var(--clr-1);

  border: var(--border-width, 3px) solid transparent;
  border-radius: 30px;
  background: linear-gradient(var(--surface, canvas) 0 0) padding-box,
    conic-gradient(from var(--glow-deg), var(--gradient-glow)) border-box;

  animation: glow 10s infinite linear;

  overflow: hidden;
}

@keyframes glow {
  100% {
    --glow-deg: 270deg;
  }
}
</style>
