<template>
  <component
    :is="tag"
    class="page-hero-highlights"
    :class="[elementClasses, componentClasses]"
    :aria-labelledby="ariaLabelledby"
  >
    <div class="header-row">
      <div class="header-slot">
        <slot name="header" :heading-id="headingId"></slot>
      </div>
    </div>
    <div class="highlights-row" :class="highlightClasses">
      <slot name="highlights"></slot>
    </div>
    <div class="content-row">
      <div class="content-slot">
        <slot name="content"></slot>
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
  [props.contentAlign]: true,
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
.page-hero-highlights {
  /* Layout tokens */
  --max-width: 1064px;
  --page-hero-highlights-gutter-mobile: 16px;
  --page-hero-highlights-gutter-tablet: 40px;
  --page-hero-highlights-gutter-desktop: 32px;

  /* User themable tokens */

  --header-row-background-colour: darkblue;

  --highlights-row-item-gap: 1rem;
  --highlights-row-initial-item-offset: 1.2rem;

  --highlight-rows-gap: 1.2rem;
  --highlight-title-height: 1fr; /* see: highlight-title-baseline class below */
  --highlight-padding-block-start: 1.2rem;
  --highlight-padding: 1.2rem;

  --highlight-background-color: white;
  --highlight-border: 1px solid black;
  --highlight-border-radius: 8px;
  --highlight-color: black;

  --content-row-background-color: var(--slate-01); /* transparent */
  --content-row-start-gap: 1.2rem;
  --content-row-end-gap: 1.2rem;

  --content-slot-margin-block-start: 2.4rem;
  --content-slot-margin: var(--highlights-row-initial-item-offset);
  --content-slot-background-color: var(--slate-00);
  --content-slot-border: 1px solid var(--slate-06);
  --content-slot-border-radius: 0.8rem;
  --content-slot-outline: 1px solid var(--slate-02);

  &.highlight-title-baseline {
    --highlight-title-height: 4rem; /* We need to manually tweak height, preferrably a proportional value as we're not setting an top padding when not prop.highlight-title-baseline */
    --highlight-padding-block-start: 0; /* We're setting the title height via row height, so this should be exposed for override in consuming page */
  }

  /* Internal layout variables */
  --page-hero-highlights-gutter: var(--page-hero-highlights-gutter-mobile);

  @container (width >= 768px) {
    --page-hero-highlights-gutter: var(--page-hero-highlights-gutter-tablet);
  }
  @container (width >= 1024px) {
    --page-hero-highlights-gutter: var(--page-hero-highlights-gutter-desktop);
  }

  display: grid;
  /* grid-template-columns: v-bind(gridColumns); */
  grid-template-rows: auto var(--highlight-title-height) 1fr auto;
  gap: 0;

  &.width-constrained {
    grid-template-columns: var(--page-hero-highlights-gutter) 1fr var(--page-hero-highlights-gutter);
  }

  &:not(.width-constrained) {
    &.start {
      grid-template-columns: var(--page-hero-highlights-gutter) minmax(0, var(--max-width)) minmax(
          var(--page-hero-highlights-gutter),
          1fr
        );
    }
    &.center {
      grid-template-columns: max(var(--page-hero-highlights-gutter), (100% - var(--max-width)) / 2) 1fr max(
          var(--page-hero-highlights-gutter),
          (100% - var(--max-width)) / 2
        );
    }
  }

  .header-row {
    /* Element geometry */
    grid-column: 1 / -1;
    grid-row: 1 / 3;
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;

    /* Element theme */
    background-color: var(--header-row-background-colour);

    .header-slot {
      grid-column: 2;
      grid-row: 1 / span 2;
      container-type: inline-size;
    }
  }

  .highlights-row {
    /* Element geometry */
    grid-column: 2;
    grid-row: 2 / 4; /* rows 2–3: straddles header/content boundary */

    position: relative;
    z-index: 1;

    /* Element theme */
    gap: var(--highlights-row-item-gap);
    margin-inline-start: 0;

    &.equal-widths {
      display: grid;
      grid-auto-columns: 1fr;
      grid-auto-flow: column;
    }

    &.flexible-widths {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
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

    .highlight {
      /* Element geometry */
      display: grid;
      grid-template-rows: subgrid;
      grid-auto-flow: row;

      /* Element theme */
      padding-block: var(--highlight-padding-block-start) var(--highlight-padding);
      padding-inline: var(--highlight-padding);

      background-color: var(--highlight-background-color);
      border: var(--highlight-border);
      border-radius: var(--highlight-border-radius);
      color: var(--highlight-color);

      .title {
        display: grid;
        grid-row: 2;
        align-items: end;
        height: var(--highlight-title-height);
      }
      .body {
        /* Element geometry */
        grid-row: 3;
        margin-block-start: var(--highlight-rows-gap);

        /* Element theme */
      }
    }
  }

  .content-row {
    /* Element geometry */
    grid-column: 1 / span 3;
    grid-row: 3 / span 2;
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;

    position: relative;
    isolation: isolate;

    /* Element theme */
    background-color: var(--content-row-background-color);
    padding-block-end: var(--content-row-end-gap);

    .content-slot {
      grid-column: 2;
      grid-row: 2;
      margin-block: var(--content-slot-margin-block-start) var(--content-slot-margin);
      margin-inline: 0;
    }
  }

  &.has-content-panel {
    .highlights-row {
      margin-inline: var(--highlights-row-initial-item-offset);
    }
    .content-row {
      &:before {
        /* Element geometry */
        content: "";
        grid-template-columns: subgrid;
        grid-template-rows: subgrid;
        display: grid;
        grid-column: 2;
        grid-row: 1 / span 2;

        /* Element theme */
        margin-top: var(--content-row-start-gap);

        background-color: var(--content-slot-background-color);
        border: var(--content-slot-border);
        outline: var(--content-slot-outline);
        border-radius: var(--content-slot-border-radius);
      }

      .content-slot {
        margin-inline: var(--content-slot-margin);
      }
    }
  }
}
</style>
