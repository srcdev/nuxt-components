<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Typography - Block Headings</h1>
          <p class="page-body-normal">Page heading styles</p>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Change variants</h2>
          <div class="demo-row">
            <div>
              <strong>Axis:</strong>
              <select v-model="axisOptions">
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            <div>
              <strong>Font Size:</strong>
              <select v-model="fontSizeOptions">
                <option value="large">Large</option>
                <option value="medium">Medium</option>
                <option value="small">Small</option>
              </select>
            </div>
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">{{ axisOptions }}: {{ fontSizeOptions }} Variant</h2>
          <HeroHeading
            tag="h1"
            :axis="axisOptions"
            :font-size="fontSizeOptions"
            :text-content="[
              {
                text: 'Designing',
                styleClass: 'normal',
              },
              {
                text: 'Artistry',
                styleClass: 'accent',
              },
              {
                text: 'at Home',
                styleClass: 'normal',
              },
            ]"
            :style-class-passthrough="['class-demo']"
          />
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
  title: "Typography - Block Headings",
  meta: [{ name: "description", content: "Typography - Block Headings" }],
  bodyAttrs: {
    class: "page-typography-block-heading",
  },
});

const axisOptions = ref<"horizontal" | "vertical">("horizontal");
const fontSizeOptions = ref<"large" | "medium" | "small">("large");
</script>

<style lang="css">
.page-typography-block-heading {
  .demo-row {
    display: flex;
    gap: 2rem;
    margin-block: 1.5rem;

    & > div {
      display: flex;
      flex-direction: column;
      gap: 1.6rem;

      select {
        padding: 0.25rem;
        font-size: 1.6rem;
      }
    }
  }
}
</style>
