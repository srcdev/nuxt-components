<template>
  <component
    :is="tag"
    class="page-hero-highlights"
    :class="[elementClasses, componentClasses]"
    :aria-labelledby="ariaLabelledby"
  >
    <div class="page-hero-highlights-grid">
      <div class="page-hero-highlights-header-row">
        <div class="page-hero-highlights-header-slot">
          <slot name="header" :heading-id="headingId"></slot>
        </div>
      </div>
      <div class="page-hero-highlights-strip" :class="highlightClasses">
        <slot name="highlights"></slot>
      </div>
      <div class="page-hero-highlights-content-row">
        <div class="page-hero-highlights-content-slot">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "main";
  highlightsEqualWidths?: boolean;
  highlightsJustify?: "start" | "center" | "end" | "space-between" | "space-around";
  widthConstrained?: boolean;
  contentAlign?: "start" | "center";
  contentPanel?: boolean;
  highlightTitleBaseline?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  highlightsEqualWidths: false,
  highlightsJustify: "start",
  widthConstrained: false,
  contentAlign: "center",
  contentPanel: true,
  highlightTitleBaseline: false,
  styleClassPassthrough: () => [],
});

const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);
const componentClasses = computed(() => ({
  "highlight-title-baseline": props.highlightTitleBaseline,
  [`content-align-${props.contentAlign}`]: true,
  "width-constrained": props.widthConstrained,
  "has-content-panel": props.contentPanel,
}));

const highlightClasses = computed(() => ({
  "equal-widths": props.highlightsEqualWidths,
  "flexible-widths": !props.highlightsEqualWidths,
  [`justify-${props.highlightsJustify}`]: true,
}));

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .page-hero-highlights {
    --_max-width: var(--page-hero-highlights-max-width, 1064px);
    --_gutter: var(--page-hero-highlights-gutter-mobile, 16px);
    --_strip-inset: var(--page-hero-highlights-strip-inset, 1.2rem);
    --_title-height: var(--page-hero-highlights-title-height, 1fr);
    --_item-padding: var(--page-hero-highlights-item-padding, 1.2rem);
    --_item-padding-block-start: var(--page-hero-highlights-item-padding-block-start, var(--_item-padding));
    --_header-slot-grid-row: 1;

    container: page-hero-highlights / inline-size;

    &.highlight-title-baseline {
      --_title-height: var(--page-hero-highlights-title-height-baseline, 4rem);
      --_item-padding-block-start: var(--page-hero-highlights-item-padding-block-start-baseline, 0);
      --_header-slot-grid-row: 1 / span 2;
    }

    .page-hero-highlights-grid {
      display: grid;
      grid-template-rows: auto var(--_title-height) 1fr auto;
      grid-template-columns: var(--_gutter) minmax(0, 1fr) var(--_gutter);
      gap: 0;

      @container page-hero-highlights (width >= 768px) {
        --_gutter: var(--page-hero-highlights-gutter-tablet, 40px);
      }

      @container page-hero-highlights (width >= 1024px) {
        --_gutter: var(--page-hero-highlights-gutter-desktop, 32px);
      }
    }

    &.width-constrained.content-align-start .page-hero-highlights-grid {
      grid-template-columns: var(--_gutter) minmax(0, var(--_max-width)) minmax(var(--_gutter), 1fr);
    }

    &.width-constrained.content-align-center .page-hero-highlights-grid {
      grid-template-columns:
        max(var(--_gutter), (100% - var(--_max-width)) / 2)
        minmax(0, 1fr)
        max(var(--_gutter), (100% - var(--_max-width)) / 2);
    }

    .page-hero-highlights-header-row {
      grid-column: 1 / -1;
      grid-row: 1 / 3;
      display: grid;
      grid-template-columns: subgrid;
      grid-template-rows: subgrid;
      background-color: var(--page-hero-highlights-header-background, var(--theme-surface-subtle));

      .page-hero-highlights-header-slot {
        grid-column: 2;
        grid-row: var(--_header-slot-grid-row);
        min-inline-size: 0;
        container-type: inline-size;
      }
    }

    .page-hero-highlights-strip {
      grid-column: 2;
      grid-row: 2 / 4;
      position: relative;
      z-index: 1;
      min-inline-size: 0;
      gap: var(--page-hero-highlights-strip-gap, 1rem);
      margin-inline-start: 0;

      &.equal-widths {
        display: grid;
        grid-template-columns: repeat(
          auto-fit,
          minmax(min(100%, var(--page-hero-highlights-item-min-width, 12rem)), 1fr)
        );
      }

      &.flexible-widths {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        & > * {
          min-inline-size: 0;
          max-inline-size: 100%;
        }
      }

      &.justify-start {
        justify-content: start;
      }

      &.justify-center {
        justify-content: center;
      }

      &.justify-end {
        justify-content: end;
      }

      &.justify-space-between {
        justify-content: space-between;
      }

      &.justify-space-around {
        justify-content: space-around;
      }

      .page-hero-highlights-item {
        display: grid;
        grid-template-rows: subgrid;
        grid-auto-flow: row;
        overflow-wrap: anywhere;
        padding-block: var(--_item-padding-block-start) var(--_item-padding);
        padding-inline: var(--_item-padding);
        background-color: var(--page-hero-highlights-item-background, var(--page-bg, Canvas));
        border: var(--page-hero-highlights-item-border, 1px solid var(--theme-border));
        border-radius: var(--page-hero-highlights-item-border-radius, 8px);
        color: var(--page-hero-highlights-item-colour, var(--theme-text));

        .page-hero-highlights-item-title {
          display: grid;
          grid-row: 2;
          align-items: end;
          block-size: var(--_title-height);
        }

        .page-hero-highlights-item-body {
          grid-row: 3;
          margin-block-start: var(--page-hero-highlights-item-rows-gap, 1.2rem);
        }
      }
    }

    .page-hero-highlights-content-row {
      grid-column: 1 / span 3;
      grid-row: 3 / span 2;
      display: grid;
      grid-template-columns: subgrid;
      grid-template-rows: subgrid;
      position: relative;
      isolation: isolate;
      background-color: var(--page-hero-highlights-content-background, transparent);
      padding-block-end: var(--page-hero-highlights-content-end-gap, 1.2rem);

      .page-hero-highlights-content-slot {
        grid-column: 2;
        grid-row: 2;
        min-inline-size: 0;
        margin-block: var(--page-hero-highlights-content-margin-block-start, 2.4rem)
          var(--page-hero-highlights-content-margin, var(--_strip-inset));
        margin-inline: 0;
      }
    }

    &.has-content-panel {
      .page-hero-highlights-strip {
        margin-inline: var(--_strip-inset);
      }

      .page-hero-highlights-content-row {
        &::before {
          content: "";
          grid-column: 2;
          grid-row: 1 / span 2;
          margin-block-start: var(--page-hero-highlights-content-start-gap, 1.2rem);
          background-color: var(--page-hero-highlights-panel-background, var(--theme-surface-subtle));
          border: var(--page-hero-highlights-panel-border, 1px solid var(--theme-border));
          outline: var(--page-hero-highlights-panel-outline, none);
          border-radius: var(--page-hero-highlights-panel-border-radius, 0.8rem);
        }

        .page-hero-highlights-content-slot {
          margin-inline: var(--page-hero-highlights-content-margin, var(--_strip-inset));
        }
      }
    }
  }
}
</style>
