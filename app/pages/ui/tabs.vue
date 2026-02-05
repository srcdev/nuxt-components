<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbs-32']">
          <h1 class="page-heading-2">Tabs #1</h1>
          <p>Static tabs</p>

          <TabsCore
            :navItems="navLinks3"
            :itemCount="3"
            :transitionDuration="300"
            :style-class-passthrough="['class-modifier']"
          >
            <template v-slot:[`tab-0-trigger`]>0 - Tab 1</template>
            <template v-slot:[`tab-1-trigger`]>1 - Tab 2</template>
            <template v-slot:[`tab-2-trigger`]>2 - Tab 3</template>
            <template v-slot:[`tab-0-content`]>
              <p class="p-24">This is content slot 0</p>
            </template>
            <template v-slot:[`tab-1-content`]>
              <p class="p-24">This is content slot 1</p>
            </template>
            <template v-slot:[`tab-2-content`]>
              <p class="p-24">This is content slot 2</p>
            </template>
          </TabsCore>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbs-32']">
          <h2 class="page-heading-2">Tabs #2</h2>
          <p>Data driven tabs</p>

          <TabsCore :itemCount="4" :style-class-passthrough="['class-modifier']">
            <template v-for="(item, key) in navLinks4" v-slot:[`tab-${key}-trigger`]>
              {{ key }} - {{ item.name }}
            </template>
            <template v-slot:[`tab-0-content`]>
              <p class="p-24">This is content slot 0</p>
            </template>
            <template v-slot:[`tab-1-content`]>
              <p class="p-24">This is content slot 1</p>
            </template>
            <template v-slot:[`tab-2-content`]>
              <p class="p-24">This is content slot 2</p>
            </template>
            <template v-slot:[`tab-3-content`]>
              <p class="p-24">This is content slot 3</p>
            </template>
          </TabsCore>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbs-32']">
          <h2 class="page-heading-2">Tabs #3</h2>
          <p>Data driven accordian navigation with custom content</p>

          <TabsCore :itemCount="6" :style-class-passthrough="['class-modifier']">
            <template v-for="(item, key) in navLinks6" v-slot:[`tab-${key}-trigger`]>
              {{ key }} - {{ item.name }}
            </template>
            <template v-slot:[`tab-0-content`]>
              <p class="p-24">This is content slot 0</p>
            </template>
            <template v-slot:[`tab-1-content`]>
              <p class="p-24">This is content slot 1</p>
            </template>
            <template v-slot:[`tab-2-content`]>
              <p class="p-24">This is content slot 2</p>
            </template>
            <template v-slot:[`tab-3-content`]>
              <p class="p-24">This is content slot 3</p>
            </template>
            <template v-slot:[`tab-4-content`]>
              <p class="p-24">This is content slot 4</p>
            </template>
            <template v-slot:[`tab-5-content`]>
              <p class="p-24">This is content slot 5</p>
            </template>
          </TabsCore>
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
  title: "UI Tabs",
  meta: [{ name: "description", content: "Examples of UI Component Tabs" }],
  bodyAttrs: {
    class: "home",
  },
})

interface ITabNav {
  action?: string
  name: string
  path?: string
}

const navLinks3: ITabNav[] = [
  { name: "Home", path: "/" },
  { name: "Layout Row", path: "/ui/layout-row" },
  { name: "Dialogs", path: "/ui/dialog" },
]

const navLinks4: ITabNav[] = [
  { name: "Home", path: "/" },
  { name: "Layout Row", path: "/ui/layout-row" },
  { name: "Dialogs", path: "/ui/dialog" },
  { name: "Tabs", path: "/ui/tabs" },
]

const navLinks6: ITabNav[] = [
  { name: "Home", path: "/" },
  { name: "Layout Row", path: "/ui/layout-row" },
  { name: "Dialogs", path: "/ui/dialog" },
  { name: "Tabs", path: "/ui/tabs" },
  { name: "Something Else", path: "/ui/something" },
  { name: "Home Again", path: "/" },
]
</script>

<style lang="css">
.class-modifier {
  &.tabs-core {
    .tabs-list {
      /* custom css */

      .nav__hovered {
        /* custom css */
      }

      .nav__active {
        /* custom css */
      }

      .nav__active-indicator {
        /* custom css */
      }

      .tabs-list-item {
        /* custom css */

        &:hover {
          /* custom css */
        }

        &[aria-selected="true"] {
          /* custom css */
        }
      }

      .nav__hovered {
        /* custom css */
      }

      .nav__active {
        /* custom css */
      }

      .nav__active-indicator {
        /* custom css */
      }

      .tabs-list-item {
        /* custom css */

        &:hover {
          /* custom css */
        }

        &[aria-selected="true"] {
          /* custom css */
        }

        &.transitioning {
          /* custom css */
        }
      }
    }

    .tab-content-wrapper {
      /* custom css */

      .tab-content {
        /* custom css */
      }
    }
  }
}
</style>
