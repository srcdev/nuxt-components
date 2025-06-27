<template>
  <component :is="tag" class="display-banner" :class="[elementClasses]">
    <div v-if="$slots.canvas" class="canvas">
      <slot name="canvas"></slot>
    </div>
    <div v-if="$slots.content" class="content">
      <slot name="content"></slot>
    </div>
  </component>
</template>

<script lang="ts">
const TAGS_ALLOWED = <string[]>['div', 'p', 'span', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav', 'ul', 'ol'];
</script>

<script setup lang="ts">

const props = defineProps({
  tag: {
    type: String,
    default: 'div',
    validator(value: string) {
      return TAGS_ALLOWED.includes(value);
    },
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
.display-banner {
  display: grid;
  grid-template-areas: 'banner';
  container-type: inline-size;
  overflow: hidden;

  .canvas {
    grid-area: banner;

    .image {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .content {
    grid-area: banner;
  }
}
</style>
