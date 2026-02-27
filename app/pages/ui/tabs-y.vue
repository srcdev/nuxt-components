<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbs-32']">
          <h1 class="page-heading-2">Tabs #3</h1>
          <p>Data driven accordian navigation with custom content</p>

          <TabsCore axis="y" :nav-items="navLinks6" :style-class-passthrough="['class-modifier']">
            <template v-for="(item, key) in navLinks6" #[`tab-${key}-trigger`]>{{ item.name }}</template>
            <template #[`tab-0-content`]>
              <p class="p-24">This is content slot 0</p>
            </template>
            <template #[`tab-1-content`]>
              <p class="p-24">This is content slot 1</p>
            </template>
            <template #[`tab-2-content`]>
              <p class="p-24">This is content slot 2</p>
            </template>
            <template #[`tab-3-content`]>
              <p class="p-24">This is content slot 3</p>
            </template>
            <template #[`tab-4-content`]>
              <p class="p-24">This is content slot 4</p>
            </template>
            <template #[`tab-5-content`]>
              <p class="p-24">This is content slot 5</p>
            </template>
          </TabsCore>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { ITabNav } from "~/types/components";
definePageMeta({
  layout: false,
});

useHead({
  title: "UI Tabs",
  meta: [{ name: "description", content: "Examples of UI Component Tabs" }],
  bodyAttrs: {
    class: "home",
  },
});

const navLinks6: ITabNav[] = [
  { name: "Home", path: "/" },
  { name: "Layout Row", path: "/ui/layout-row" },
  { name: "Dialogs", path: "/ui/dialog" },
  { name: "Tabs", path: "/ui/tabs" },
  { name: "Something Else", path: "/ui/something" },
  { name: "Home Again", path: "/" },
];
</script>

<style lang="css">
.tabs-list.colour-test {
  --_default-text: light-dark(var(--green-04), var(--green-05));
  --_active-bg: light-dark(var(--red-10), var(--red-00));
  --_active-text: light-dark(var(--sunset-03), var(--sunset-06));
  --_active-indicator: light-dark(var(--orange-06), var(--orange-07));
  --_hovered-bg: light-dark(var(--blue-07), var(--blue-03));
  --_hovered-text: light-dark(var(--blue-04), var(--blue-10));
  --_border-bottom: light-dark(var(--red-07), var(--red-06));

  border-bottom: 0.1rem solid var(--_border-bottom);
  margin-block: 3rem;

  .nav__hovered {
    background: var(--_hovered-bg);
    color: var(--_hovered-text);
  }

  .nav__active {
    background: var(--_active-bg);
    color: var(--_active-text);
  }

  .nav__active-indicator {
    background: var(--_active-indicator);
    height: 0.4rem;
  }

  .tabs-list-item {
    background: transparent;
    border: 0;
    color: var(--_default-text);
    cursor: pointer;
    font: inherit;
    text-transform: uppercase;
    font-weight: 500;
    margin: 0;
    padding: 1em 2em;

    &:hover {
      color: var(--_hovered-text);
    }

    &[aria-selected="true"] {
      color: var(--_active-text);
    }
  }
}
</style>
