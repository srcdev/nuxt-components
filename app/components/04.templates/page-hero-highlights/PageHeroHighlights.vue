<template>
  <component :is="tag" class="page-hero-highlights" :class="elementClasses" :aria-labelledby="ariaLabelledby">
    <div class="header">
      <div class="header-inner">
        <slot name="header" :heading-id="headingId"></slot>
      </div>
    </div>
    <div class="highlights">
      <slot name="highlights"></slot>
    </div>
    <div class="content">
      <div class="content-inner">
        <slot name="content"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "main";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style scoped lang="css">
.page-hero-highlights {
  display: grid;
  grid-template-columns: 16px 1fr 16px;
  grid-template-rows: repeat(
    4,
    auto
  ); /* 4 rows of auto height: header content, highlights, main content, and bottom padding */
  /*                   r1   r2   r3   r4  */

  .header {
    grid-column: 1 / -1; /* edge-to-edge */
    grid-row: 1 / 3; /* rows 1–2: bg covers header content zone + highlights top zone */
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;

    .header-inner {
      grid-column: 2; /* centre column only */
      grid-row: 1; /* row 1 only — content height drives row 1, pushing highlights down */
    }
  }

  .highlights {
    grid-column: 2;
    grid-row: 2 / 4; /* rows 2–3: straddles header/content boundary */
    display: grid;
    grid-template-rows: subgrid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column; /* lay slotted items out horizontally */
    gap: 1rem;
    position: relative;
    z-index: 1;
  }

  .content {
    grid-column: 1 / span 3;
    grid-row: 3 / 5; /* rows 3–4: bg fills behind highlights + real content zone */
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;

    .content-inner {
      grid-column: 2;
      grid-row: 2; /* row 4 of main grid — content never underflows highlights */
    }
  }
}
</style>
