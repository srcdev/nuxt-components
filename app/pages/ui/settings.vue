<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1 mbe-18">Settings</h1>
          <h2 class="page-heading-2 mbe-18">Theme Switcher</h2>

          <DisplayThemeSwitch />
        </PageRow>

        <PageRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <div class="theme-test" data-theme="error">
            <h2 class="page-heading-2 mbe-18">Theme test (error)</h2>

            <div class="mb-12">
              <p class="page-body-normal mbe-12">This is test text</p>
            </div>
          </div>
        </PageRow>
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
  .theme-test {
    margin: 2rem;
    padding: 0.6rem 1.2rem;

    border: var(--colour-theme-10) solid 1px;
    outline: var(--colour-theme-10) solid 1px;
    outline-offset: 3px;
    background-color: var(--colour-theme-1);
    color: var(--colour-theme-7);
    border-radius: 0.4rem;
  }
}
</style>
