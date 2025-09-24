<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout">
          <h1 class="page-heading-2">Display Chip</h1>

          <section>
            <div class="dl">
              <div class="dt">Round</div>
              <div class="dd">
                <DisplayChip shape="circle" :style-class-passthrough="['online']">
                  <div class="chip-content round">
                    <Icon name="akar-icons:info" size="24" color="white" />
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Square</div>
              <div class="dd">
                <DisplayChip shape="square" :style-class-passthrough="['idle']">
                  <div class="chip-content square">
                    <Icon name="akar-icons:info" size="24" color="white" />
                  </div>
                </DisplayChip>
              </div>
            </div>
          </section>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: "UI Display Chips",
  meta: [{ name: "description", content: "Examples of UI Display Chips" }],
  bodyAttrs: {
    class: "ui-display-chip-page",
  },
})
</script>

<style lang="css">
.ui-display-chip-page {
  section {
    margin-top: 2rem;

    .dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2rem;
      align-items: center;

      /* background-color: var(--gray-5); */

      .dt {
        font-weight: bold;
      }
      .dd {
        margin: 0;

        .chip-content {
          display: flex;
          align-items: center;
          justify-content: center;

          &.round {
            width: 50px;
            height: 50px;
            background-color: var(--gray-12);
            border-radius: 50%;
          }

          &.square {
            width: 50px;
            height: 50px;
            background-color: var(--gray-12);
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>
