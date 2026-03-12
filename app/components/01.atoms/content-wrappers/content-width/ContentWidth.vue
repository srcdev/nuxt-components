<template>
  <component
    :is="tag"
    :id="id"
    class="content-width-wrapper"
    :class="elementClasses"
    :tab-index="isLandmark ? 0 : null"
    :aria-label="isLandmark ? 'Content Width Landmark' : undefined"
  >
    <div class="content-width" :class="justifyContent">
      <div class="content-width-inner">
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
  justifyContent?: "start" | "center" | "end";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  label: "",
  isLandmark: false,
  justifyContent: "center",
  styleClassPassthrough: () => [],
});

const id = useId();

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .content-width-wrapper {
    container-type: inline-size;
    container-name: content-width;

    .content-width {
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

      @container content-width (width >= 1092px) {
        --gutter: 0;
        --content-max-width: 1064px;
        --justify-content: center;

        &.start {
          --gutter: 16px;
          --justify-content: start;
        }

        &.end {
          --gutter: 16px;
          --justify-content: end;
        }
      }

      .content-width-inner {
        grid-column: content;
        background-color: var(--page-bg);
      }
    }
  }
}
</style>
