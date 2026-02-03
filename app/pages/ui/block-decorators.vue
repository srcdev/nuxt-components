<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Block Decorators</h2>
        </LayoutRow>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h3 class="page-heading-3">Configuration options</h3>
          <p class="page-body-normal">
            Use the select drop down to adjust the shadow, inner shadow, and border strength.
          </p>
          <p class="page-body-normal">
            NOTE: These are visual decorators only and can be confugured in the UiBlockDecorated component decorator
            stylesheet.
          </p>
          <div class="select-controls">
            <div class="select-group">
              <label for="shadow-strength">Shadow Strength</label>
              <select id="shadow-strength" v-model="shadowStrength">
                <option value="0">No shadow</option>
                <option value="1">Shadow 1</option>
                <option value="2">Shadow 2</option>
                <option value="3">Shadow 3</option>
                <option value="4">Shadow 4</option>
                <option value="5">Shadow 5</option>
                <option value="6">Shadow 6</option>
              </select>
            </div>
            <div class="select-group">
              <label for="inner-shadow-strength">Inner Shadow Strength</label>
              <select id="inner-shadow-strength" v-model="innerShadowStrength">
                <option value="0">No inner shadow</option>
                <option value="1">Inner Shadow 1</option>
                <option value="2">Inner Shadow 2</option>
                <option value="3">Inner Shadow 3</option>
                <option value="4">Inner Shadow 4</option>
              </select>
            </div>
            <div class="select-group">
              <label for="border-strength">Border Strength</label>
              <select id="border-strength" v-model="borderStrength">
                <option value="0">No border</option>
                <option value="1">Border 1</option>
                <option value="2">Border 2</option>
                <option value="3">Border 3</option>
                <option value="4">Border 4</option>
                <option value="5">Border 5</option>
                <option value="6">Border 6</option>
              </select>
            </div>
          </div>
        </LayoutRow>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <UiBlockDecorated
            tag="div"
            :shadow-strength
            :inner-shadow-strength
            :border-strength
            :style-class-passthrough="['demo-element']"
          >
            <p class="page-body-normal">1</p>
          </UiBlockDecorated>
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
  title: "Block Decorators",
  meta: [
    {
      name: "description",
      content: "Block Decorators Meta description content",
    },
  ],
  bodyAttrs: {
    class: "block-decorators-page",
  },
})

const shadowStrength = ref(3)
const innerShadowStrength = ref(4)
const borderStrength = ref(0)
</script>

<style lang="css">
.block-decorators-page {
  /* CSS styles */

  .select-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
    margin-block: 1.5rem;
  }

  .select-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .select-group label {
    font-weight: 500;
    font-size: var(--step-4);
    color: inherit;
  }

  .select-group select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    /* background-color: white; */
    font-size: var(--step-4);
    min-width: 200px;
  }

  .select-group select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .demo-element {
    aspect-ratio: 1 / 1;
    width: 20rem;
    display: grid;
    place-content: center;

    /* box-shadow: var(--shadow-6); */

    /* background-color: light-dark(#2526271a, #d2d9e0d1); */
  }
}
</style>
