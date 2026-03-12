<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <div class="dashboard-skeleton">
            <div class="header">
              <div class="inner">
                <p class="page-heading-1">Header section</p>
                <p class="page-body-normal">
                  Lorum ipsum dolor sit amet, consectetur adipiscing elit. Lorum ipsum dolor sit amet, consectetur
                  adipiscing elit.
                </p>
              </div>
            </div>
            <div class="highlights">
              <div class="highlight">
                <p class="page-heading-2">Highlight 1</p>
                <p class="page-body-normal">Details here</p>
              </div>

              <div class="highlight">
                <p class="page-heading-2">Highlight item 2</p>
                <p class="page-body-normal">Details here</p>
              </div>
            </div>
            <div class="content">
              <div class="content-inner">
                <p class="page-heading-2">Content section</p>
                <p class="page-body-normal">
                  Lorum ipsum dolor sit amet, consectetur adipiscing elit. Lorum ipsum dolor sit amet, consectetur
                  adipiscing elit.
                </p>
              </div>
            </div>
          </div>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "Test",
  meta: [
    {
      name: "description",
      content: "Test Meta description content",
    },
  ],
  bodyAttrs: {
    class: "test-page",
  },
});
</script>

<style lang="css">
.test-page {
  /* CSS styles */

  .dashboard-skeleton {
    display: grid;
    grid-template-columns: 16px 1fr 16px;
    grid-template-rows: auto auto auto auto;
    /*                   r1   r2   r3   r4  */

    > div {
      outline: 1px solid red;
    }

    .header {
      grid-column: 1 / -1; /* edge-to-edge */
      grid-row: 1 / 3; /* rows 1–2: bg covers header content zone + highlights top zone */
      display: grid;
      grid-template-columns: subgrid;
      grid-template-rows: subgrid;
      background-color: blueviolet;

      .inner {
        grid-column: 2; /* centre column only */
        grid-row: 1; /* row 1 only — content height drives row 1, pushing highlights down */
        background-color: violet;
      }
    }

    .highlights {
      grid-column: 2;
      grid-row: 2 / 4; /* rows 2–3: straddles header/content boundary */
      display: grid;
      grid-template-rows: subgrid;
      grid-auto-columns: 1fr;
      grid-auto-flow: column; /* lay cards out horizontally */
      gap: 1rem;
      position: relative;
      z-index: 1;

      .highlight {
        grid-row: 1 / -1; /* each card spans both subgrid rows */
        border: 1px solid black;
        border-radius: 12px;
        background-color: darkblue;
        color: white;
        padding: 1rem;
      }
    }

    .content {
      grid-column: 1 / span 3;
      grid-row: 3 / 5; /* rows 3–4: bg fills behind highlights + real content zone */
      display: grid;
      grid-template-columns: subgrid;
      grid-template-rows: subgrid;
      background-color: lightgray;
      min-height: 400px;

      .content-inner {
        grid-column: 2;
        grid-row: 2; /* row 4 of main grid — content never underflows highlights */
      }
    }
  }
}
</style>
