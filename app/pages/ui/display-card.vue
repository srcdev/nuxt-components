<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">DisplayCard Component</h1>
          <form class="mb-12">
            <div>
              <label for="variant" class="form-label mie-12">Variant:</label>
              <select id="variant" v-model="displayCardVariant" class="form-select">
                <option value="solid">Solid</option>
                <option value="subtle">Subtle</option>
                <option value="soft">Soft</option>
                <option value="outline">Outline</option>
              </select>
            </div>
            <div>
              <label for="hasDividers" class="form-label mie-12">Has Dividers:</label>
              <input type="checkbox" id="hasDividers" v-model="hasDividers" class="form-checkbox" />
            </div>
            <div>
              <label for="noOutline" class="form-label mie-12">No Outline:</label>
              <input type="checkbox" id="noOutline" v-model="noOutline" class="form-checkbox" />
            </div>
          </form>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayCard :variant="displayCardVariant" :has-dividers="hasDividers" :no-outline="noOutline">
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

const displayCardVariant = ref("solid")
const hasDividers = ref(false)
const noOutline = ref(false)
</script>

<style lang="css">
.display-card-page {
  form {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
  .display-card {
  }
}
</style>
