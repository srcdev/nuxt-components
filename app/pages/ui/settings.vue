<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1 mbe-18">Settings</h1>
          <h2 class="page-heading-2 mbe-18">Theme Switcher</h2>

          <DisplayThemeSwitch />
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1 mbe-18">Test form element</h1>

          <div class="mbe-12">
            <button type="button" class="test-button class-theme">This is a button</button>
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
  title: "Settings",
  meta: [{ name: "description", content: "Settings Page" }],
  bodyAttrs: {
    class: "settings-page",
  },
});
</script>

<style lang="css">
.settings-page {
  .test-button {
    all: unset;
    padding: 0.6rem 1.2rem;

    &.class-theme {
      border: light-dark(black, white) solid 1px;
    }
  }
}
</style>
