<template>
  <component
    :is="tag"
    :id="id"
    class="content-container-wrapper"
    :class="elementClasses"
    :tab-index="isLandmark ? 0 : null"
    :aria-label="isLandmark ? 'Content Container Landmark' : undefined"
  >
    <div class="content-container">
      <div class="content-container-inner">
        <slot name="default"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav";
  label?: string;
  isLandmark?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  label: "",
  isLandmark: false,
  styleClassPassthrough: () => [],
});

const id = useId();

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .content-container-wrapper {
    container-type: inline-size;
    container-name: content-container;

    .content-container {
      --gutter: 16px;
      --content-max-width: auto;
      --justify-content: initial;

      display: grid;

      grid-template-columns:
        [gutter-start]
        var(--gutter)
        [content-start]
        var(--content-max-width)
        [content-end]
        var(--gutter)
        [gutter-end];

      justify-content: var(--justify-content);
      box-sizing: border-box;

      @container content-container (width >= 1092px) {
        --gutter: 0;
        --content-max-width: 1064px;
        --justify-content: center;
      }

      .content-container-inner {
        grid-column: content;

        @container content-container (width >= 1092px) {
          grid-column: gutter;
        }
      }
    }
  }
}
</style>
