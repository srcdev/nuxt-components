<template>
  <component
    :is="tag"
    class="page-hero-highlights"
    :class="[elementClasses, componentClasses]"
    :aria-labelledby="ariaLabelledby"
  >
    <div class="header">
      <div class="header-column">
        <slot name="header" :heading-id="headingId"></slot>
      </div>
    </div>
    <div class="highlights" :class="highlightClasses">
      <slot name="highlights"></slot>
    </div>
    <div class="content">
      <div class="content-column">
        <div class="content-slot">
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
  maxWidth?: string;
  contentAlign?: "start" | "center";
  highlightTitleTracksHeaderBsaeline?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  highlightsEqualWidths: false,
  highlightsJustify: "start",
  maxWidth: undefined,
  contentAlign: "center",
  highlightTitleTracksHeaderBsaeline: false,
  styleClassPassthrough: () => [],
});

const gridColumns = computed(() => {
  if (!props.maxWidth) return "16px 1fr 16px";
  if (props.contentAlign === "start") return `16px minmax(0, ${props.maxWidth}) 1fr`;
  return `max(16px, (100% - ${props.maxWidth}) / 2) 1fr max(16px, (100% - ${props.maxWidth}) / 2)`;
});

const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);
const componentClasses = computed(() => ({
  "highlight-title-tracks-header-bsaeline": props.highlightTitleTracksHeaderBsaeline,
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
  --phl-header-bg: darkblue;
  --phl-content-bg: lightslategray;
  --phl-content-inner: white;

  --highlight-title-height: 1fr;
  --highlight-padding: 1.2rem;

  &.highlight-title-tracks-header-bsaeline {
    --highlight-title-height: 4rem; /* We need to manually tweak height, preferrably a proportional value as we're not setting an top padding when not prop.highlight-title-tracks-header-bsaeline */
    --highlight-padding: 0; /* We're setting the title height via row height, so this should be exposed for override in consuming page */
  }

  display: grid;
  grid-template-columns: v-bind(gridColumns);
  grid-template-rows: auto var(--highlight-title-height) 1fr auto;
  gap: 0;

  .header {
    grid-column: 1 / -1; /* edge-to-edge */
    grid-row: 1 / 3; /* rows 1–2: bg covers header content zone + highlights top zone */
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
    background-color: var(--phl-header-bg);

    .header-column {
      grid-column: 2; /* centre column only */
      grid-row: 1; /* row 1 only — content height drives row 1, pushing highlights down */
    }
  }

  .highlights {
    grid-column: 2;
    grid-row: 2 / 4; /* rows 2–3: straddles header/content boundary */

    gap: 1rem;
    position: relative;
    z-index: 1;

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
      display: grid;
      grid-template-rows: subgrid;
      grid-auto-flow: row;

      padding-block-start: var(--highlight-padding);

      .title {
        display: grid;
        grid-row: 2;
        align-items: end;
        height: var(--highlight-title-height);
      }
      .body {
        grid-row: 3;
      }
    }
  }

  .content {
    grid-column: 1 / span 3;
    grid-row: 3 / span 2; /* rows 3–4: bg fills behind highlights + real content zone */
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;

    position: relative;
    isolation: isolate;

    .content-column {
      grid-template-columns: subgrid;
      grid-template-rows: subgrid;
      display: grid;
      /* bottom padding to ensure content can scroll above highlights without reaching the end of the background */
      grid-column: 2;
      grid-row: 1 / span 2; /* rows 2–3: fills behind highlights + real content zone */

      /* z-index: -1; */

      .content-slot {
        grid-column: 2;
        grid-row: 2; /* row 4 of main grid — content never underflows highlights */
      }
    }
  }
}
</style>
