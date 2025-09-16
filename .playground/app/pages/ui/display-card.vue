<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section', 'mbe-20']">
          <h1 class="page-heading-1">DisplayCard Component</h1>
          <p class="mbe-12">Static image displayed as page scrolls through it.</p>
          <form class="mb-12">
            <label for="variant" class="form-label mie-12">Variant:</label>
            <select id="variant" v-model="variant" class="form-select mbe-12">
              <option value="solid">Solid</option>
              <option value="subtle">Subtle</option>
              <option value="soft">Soft</option>
              <option value="outline">Outline</option>
            </select>
          </form>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['expanding-panel-section', 'mbe-20']">
          <DisplayCard :variant :style-class-passthrough="['mbe-20']">
            <template #header>
              <h2 class="page-heading-2">DisplayCard Header</h2>
            </template>
            <template #default>
              <h3 class="page-heading-3">DisplayCard Content</h3>
              <p class="page-body-normal">This is default slot content for the DisplayCard component.</p>
              <p class="page-body-normal">As it's a slot, any html content can be placed here.</p>
            </template>
            <template #footer>
              <p class="page-body-small">DisplayCard Footer</p>
            </template>
          </DisplayCard>
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
  title: "DisplayCard Component",
  meta: [
    {
      name: "description",
      content: "DisplayCard Component description content",
    },
  ],
  bodyAttrs: {
    class: "display-card-page",
  },
})

const variant = ref("solid")
</script>

<style lang="css">
.display-card-page {
  .display-card {
  }
}
</style>
