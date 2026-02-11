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
          <h1 class="page-heading-1 mbe-18">Default button elements</h1>

          <div class="mb-12">
            <p class="page-body-normal mbe-12"><code>class="test-button" data-theme="primary"</code></p>
            <button class="input-button-core" type="button">This is a button</button>
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1 mbe-18">Primary button elements</h1>

          <div class="mb-12" data-theme="primary">
            <p class="page-body-normal mbe-12"><code>class="test-button" data-theme="primary"</code></p>
            <button class="input-button-core" type="button">This is a button</button>
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1 mbe-18">Error button elements</h1>

          <div class="mb-12" data-theme="primary" data-error>
            <p class="page-body-normal mbe-12"><code>class="test-button" data-theme="error"</code></p>
            <button class="input-button-core" type="button">This is a button</button>
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1 mbe-18">Success button elements</h1>

          <div class="mb-12" data-theme="success">
            <p class="page-body-normal mbe-12"><code>class="test-button" data-theme="success"</code></p>
            <button class="input-button-core" type="button">This is a button</button>
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
    /* all: unset; */
    padding: 0.6rem 1.2rem;

    border: var(--colour-theme-10) solid 1px;
    outline: var(--colour-theme-10) solid 1px;
    outline-offset: 3px;
    background-color: var(--colour-theme-1);
    color: var(--colour-theme-10);
    border-radius: 100vw;
  }
}
</style>
