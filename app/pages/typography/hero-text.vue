<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Typography - Hero Text</h1>
          <p class="page-body-normal">Hero text styles</p>
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
                <option value="display">Display</option>
                <option value="title">Title</option>
                <option value="heading">Heading</option>
                <option value="subheading">Subheading</option>
                <option value="label">Label</option>
              </select>
            </div>
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">{{ axisOptions }}: {{ fontSizeOptions }} Variant</h2>
          <HeroText
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
  title: "Typography - Hero Text",
  meta: [{ name: "description", content: "Typography - Hero Text" }],
  bodyAttrs: {
    class: "page-typography-hero-text",
  },
});

const axisOptions = ref<"horizontal" | "vertical">("horizontal");
const fontSizeOptions = ref<"display" | "title" | "heading" | "subheading" | "label">("display");
</script>

<style lang="css">
.page-typography-hero-text {
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
