<template>
  <component
    :is="tag"
    :id
    class="page-row"
    :class="[elementClasses, variant]"
    :data-align="align || undefined"
    :aria-labelledby="ariaLabelledby"
  >
    <slot :heading-id="headingId"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "header" | "footer" | "main" | "nav";
  variant?: "full" | "popout" | "content" | "inset-content";
  align?: "start" | "end";
  id?: string | null;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  variant: "content",
  align: undefined,
  id: null,
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const { headingId, ariaLabelledby } = useAriaLabelledById(props.tag);
</script>

<style lang="css">
@layer components {
  /*
   * Page layout grid — https://layout-breakouts-builder.vercel.app
   * Each .page-row is both a CSS grid container and a grid item when nested.
   * Direct children default to the content column; nest a .page-row.{variant}
   * to break out to a wider or narrower track.
   */
  .page-row {
    --_minimum-content-padding: var(--page-row-minimum-content-padding, 1rem);
    --_popout-max-width: var(--page-row-popout-max-width, 1400px);
    --_content-max-width: var(--page-row-content-max-width, 1064px);
    --_inset-content-max-width: var(--page-row-inset-content-max-width, 840px);

    /* Minimum gutter for the outer (full) track: 1rem on narrow viewports, dissolves to 0
       once the viewport exceeds --_content-max-width + 2 × --_minimum-content-padding,
       at which point 1fr already provides centering space with no forced floor needed. */
    --_full-track-min: min(
      var(--_minimum-content-padding),
      max(0px, calc((var(--_content-max-width) + var(--_minimum-content-padding) * 2 - 100%) / 2))
    );

    --full: minmax(var(--_full-track-min), 1fr);
    --popout: minmax(0, calc((var(--_popout-max-width) - var(--_content-max-width)) * 0.5));
    --content: clamp(
      0px,
      calc((100% - var(--_minimum-content-padding) * 2 - var(--_inset-content-max-width)) * 0.5),
      calc((var(--_content-max-width) - var(--_inset-content-max-width)) * 0.5)
    );
    --inset-content: min(var(--_inset-content-max-width), 100% - var(--_minimum-content-padding) * 2);

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

    container-type: inline-size;
  }

  /* All direct children default to the content column */
  .page-row > * {
    grid-column: content;
  }

  /*
   * Variant propagation: a page-row's variant also sets the default column
   * for its direct non-PageRow children. This allows variant="full" to make
   * its own children span full width, not just control placement when nested.
   * Specificity (0,2,0) — nested .page-row variant overrides below win at (0,3,0).
   */
  .page-row.full > * {
    grid-column: full;
  }
  .page-row.popout > * {
    grid-column: popout;
  }
  .page-row.inset-content > * {
    grid-column: inset-content;
  }

  /* Nested page-rows: no additional viewport gutter — the outermost page-row already handles edge padding */
  .page-row > .page-row {
    --_minimum-content-padding: var(--page-row-minimum-content-padding, 0px);
  }

  /* Nested page-rows: symmetric placement by variant class */
  .page-row > .page-row {
    &.full {
      grid-column: full;
    }
    &.popout {
      grid-column: popout;
    }
    &.content {
      grid-column: content;
    }
    &.inset-content {
      grid-column: inset-content;
    }
  }

  /*
   * align="start": bleeds to the left (full-start) edge, stops at the variant's end line.
   * align="end":   starts at the variant's start line, bleeds to the right (full-end) edge.
   * Specificity (0,4,0) beats the symmetric rules above at (0,3,0).
   */
  .page-row > .page-row[data-align="start"] {
    &.popout {
      grid-column: full-start / popout-end;
    }
    &.content {
      grid-column: full-start / content-end;
    }
    &.inset-content {
      grid-column: full-start / inset-content-end;
    }
  }

  .page-row > .page-row[data-align="end"] {
    &.popout {
      grid-column: popout-start / full-end;
    }
    &.content {
      grid-column: content-start / full-end;
    }
    &.inset-content {
      grid-column: inset-content-start / full-end;
    }
  }
}
</style>
