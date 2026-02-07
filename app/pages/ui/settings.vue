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
          <h1 class="page-heading-1 mbe-18">Test button elements</h1>

          <div class="mb-12">
            <p class="page-body-normal mbe-12"><code>class="test-button"</code></p>
            <button type="button" class="test-button">This is a button</button>
          </div>

          <div class="mbe-12">
            <p class="page-body-normal mbe-12"><code>class="test-button class-theme"</code></p>
            <button type="button" class="test-button class-theme">This is a button</button>
          </div>
          <hr class="mb-12" />
          <div class="mb-12 p-24 test-div">
            <div class="test-button class-theme">This is a test</div>
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

    border: black solid 1px;
    outline: black solid 1px;
    outline-offset: 3px;
    background-color: lightslategray;
    color: white;
    border-radius: 100vw;

    &.class-theme {
      border: light-dark(black, white) solid 1px;
      outline: light-dark(black, white) solid 1px;
      background-color: light-dark(lightslategray, black);
      color: light-dark(white, yellow);
    }
  }

  .test-div {
    background-color: light-dark(red, green);
    border: light-dark(lightslategray, white) solid 3px;
    outline: light-dark(red, yellow) solid 3px;
    outline-offset: 3px;
    border-radius: 4px;
  }
}
</style>
