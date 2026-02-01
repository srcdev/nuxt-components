<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">GlowingBorder Component</h1>
          <form class="mb-12">
            <div>
              <label for="variant" class="form-label mie-12">Variant:</label>
              <select id="variant" v-model="glowingBorderVariant" class="form-select">
                <option value="vivid">Vivid</option>
                <option value="subtle">Subtle</option>
                <option value="silver">Silver</option>
                <option value="steel">Steel</option>
              </select>
            </div>
          </form>

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
          <h2 class="page-heading-2">Default</h2>

          <GlowingBorder :variant="glowingBorderVariant" :style-class-passthrough="['mbe-20']">
            <div class="p-20">
              <h3 class="page-heading-2">GlowingBorder Header</h3>
              <h4 class="page-heading-3">GlowingBorder Content</h4>
              <p class="page-body-normal">This is default slot content for the GlowingBorder component.</p>
              <p class="page-body-normal">As it's a slot, any html content can be placed here.</p>
              <p class="page-body-small">GlowingBorder Footer</p>
            </div>
          </GlowingBorder>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Default</h2>

          <GlowingBorder :variant="glowingBorderVariant" :style-class-passthrough="['mbe-20']">
            <DisplayCard :variant="displayCardVariant" :has-dividers :no-outline>
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
          </GlowingBorder>
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
  title: "GlowingBorder Component",
  meta: [
    {
      name: "description",
      content: "GlowingBorder Component description content",
    },
  ],
  bodyAttrs: {
    class: "glowing-border-page",
  },
})

const glowingBorderVariant = ref("vivid")
const displayCardVariant = ref("solid")
const hasDividers = ref(false)
const noOutline = ref(false)
</script>

<style lang="css">
.glowing-border-page {
  form {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
}
</style>
