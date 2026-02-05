<template>
  <component
    :is="tag"
    :id
    class="layout-row"
    :class="elementClasses"
    :tab-index="isLandmark ? 0 : null"
    :aria-label="isLandmark ? 'Layout Row Landmark' : undefined"
  >
    <div :data-testid="dataTestid" class="layout-row-inner" :class="variant">
      <div>
        <slot name="default"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  dataTestid: {
    type: String,
    default: "layout-row",
  },
  tag: {
    type: String,
    default: "div",
    validator(value: string) {
      return ["div", "section", "article", "aside", "header", "footer", "main", "nav", "ul", "ol"].includes(value);
    },
  },
  variant: {
    type: String,
    required: true,
    validator(value: string) {
      return [
        "full",
        "full-start",
        "full-end",
        "popout",
        "popout-start",
        "popout-end",
        "content",
        "content-start",
        "content-end",
        "inset-content",
        "inset-content-start",
        "inset-content-end",
        "full-width",
        "full-content",
        "full-content-nopad",
      ].includes(value);
    },
  },
  id: {
    type: String,
    default: null,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  isLandmark: {
    type: Boolean,
    default: false,
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
/*
* Page Layout by https://layout-breakouts-builder.vercel.app
**/
.layout-row > *,
.full-width > * {
  grid-column: content;
}
.layout-row,
.full-width {
  --minimum-content-padding: 1rem;

  /** TRACK WIDTHS **/
  --full-max-width: 1fr;
  --popout-max-width: 1400px;
  --content-max-width: 1064px;
  --inset-content-max-width: 840px;

  /** TRACK SIZES **/
  --full: minmax(var(--minimum-content-padding), 1fr);
  --popout: minmax(0, calc((var(--popout-max-width) - var(--content-max-width)) * 0.5));
  --content: minmax(0, calc((var(--content-max-width) - var(--inset-content-max-width)) * 0.5));
  --inset-content: min(var(--inset-content-max-width), 100% - var(--minimum-content-padding) * 2);

  display: grid;
  grid-template-columns:
    [full-start]
    var(--full)
    [popout-start]
    var(--popout)
    [content-start]
    var(--content)
    [inset-content-start]
    var(--inset-content)
    [inset-content-end]
    var(--content)
    [content-end]
    var(--popout)
    [popout-end]
    var(--full)
    [full-end];

  .layout-row-inner {
    container-type: inline-size;
  }
}

/** CLASSES **/
.full {
  grid-column: full;
}
.full-start {
  grid-column-start: full-start;
}
.full-end {
  grid-column-end: full-end;
}

.popout {
  grid-column: popout;
}
.popout-start {
  grid-column-start: popout-start;
}
.popout-end {
  grid-column-end: popout-end;
}

.content {
  grid-column: content;
}
.content-start {
  grid-column-start: content-start;
}
.content-end {
  grid-column-end: content-end;
}

.inset-content {
  grid-column: inset-content;
}
.inset-content-start {
  grid-column-start: inset-content-start;
}
.inset-content-end {
  grid-column-end: inset-content-end;
}

.full-width {
  grid-column: full;
}
.full-content,
.full-content-nopad {
  grid-column: full;
}
.full-content {
  padding-inline: var(--minimum-content-padding);
}
</style>
