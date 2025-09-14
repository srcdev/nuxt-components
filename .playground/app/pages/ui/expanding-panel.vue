<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section', 'mbe-20']">
          <h1 class="page-heading-2">Details element - Unlinked</h1>
          <p class="mbe-12">Following 2 details block behave independantly.</p>

          <ExpandingPanel :animation-duration="300" icon-size="medium" :style-class-passthrough="['custom-style-1']">
            <template #summary>
              <h3 class="page-heading-3 mb-2">Expander Panel 1 (Fast)</h3>
            </template>
            <template #icon>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template #content>
              <div>
                <p class="mt-0">Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
              </div>
            </template>
          </ExpandingPanel>

          <ExpandingPanel :animation-duration="2000" icon-size="medium" :style-class-passthrough="['custom-style-2']">
            <template #summary>
              <h3 class="page-heading-3 mb-2">Expander Panel 2 (Slow)</h3>
            </template>
            <template #icon>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template #content>
              <div>
                <p class="mt-0">Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
              </div>
            </template>
          </ExpandingPanel>
        </LayoutRow>

        <LayoutRow
          tag="div"
          variant="full-width"
          :style-class-passthrough="['expanding-panel-section', 'mbe-20', 'hidden']"
        >
          <h2 class="page-heading-2">Details element - Linked</h2>
          <p class="mbe-12">Details panels are linked, only 1 can be open at a time.</p>

          <ExpandingPanel
            :animation-duration="300"
            name="details-linked"
            icon-size="medium"
            :style-class-passthrough="['linked']"
          >
            <template #summary>
              <h3 class="page-heading-3 mb-2">Expander Panel 1 Linked</h3>
            </template>
            <template #icon>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template #content>
              <div>
                <p class="mt-0">Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
              </div>
            </template>
          </ExpandingPanel>

          <ExpandingPanel
            :animation-duration="300"
            name="details-linked"
            icon-size="medium"
            :style-class-passthrough="['linked']"
          >
            <template #summary>
              <h3 class="page-heading-3 mb-2">Expander Panel 2 Linked</h3>
            </template>
            <template #icon>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template #content>
              <div>
                <p class="mt-0">Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
              </div>
            </template>
          </ExpandingPanel>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section', 'mbe-20']">
          <h1 class="page-heading-2">Details element - forceOpened</h1>
          <p class="page-body-normal">Will be displayed as force opened via prop forceOpened</p>
          <p class="page-body-normal">Also contains a button and link within content which toggles to closed</p>
          <p class="mbe-12">
            <button class="btn btn-primary" @click="forceOpened = !forceOpened">
              Toggle forceOpened (currently: {{ forceOpened }})
            </button>
          </p>

          <ExpandingPanel v-model="isPanelOpen" :animation-duration="300" icon-size="medium" :force-opened>
            <template #summary>
              <h3 class="page-heading-3 mb-2">Expander Panel Force Opened</h3>
            </template>
            <template #icon>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template #content>
              <div>
                <p class="mt-0">Details content with test link and button</p>
                <p>
                  <button @click.prevent="closePanel()" @keydown.enter="closePanel()">
                    Close via reactive binding
                  </button>
                </p>
                <p>
                  <a href="#forceClose" @click="closePanel()" @keydown.enter="closePanel()" class="page-link-normal">
                    Close via ref
                  </a>
                </p>
                <p>Details content</p>
                <p>Details content</p>
                <p>Details content</p>
              </div>
            </template>
          </ExpandingPanel>
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
  title: "Browser title tag",
  meta: [
    {
      name: "description",
      content: "Meta description content",
    },
  ],
})

const forceOpened = ref(false)
const isPanelOpen = ref(false)

const closePanel = () => {
  isPanelOpen.value = false
}
</script>

<style lang="css">
.expanding-panel-section {
  .expanding-panel {
    + .expanding-panel {
      margin-block-start: 1rem;
    }
    &.custom-style-1 {
      .expanding-panel-summary {
        gap: 0;
        flex-direction: row-reverse;
      }
    }

    &.custom-style-2 {
      .expanding-panel-summary {
        gap: 0;
        flex-direction: row-reverse;
      }
    }
    &.linked {
      .expanding-panel-summary {
        gap: 0;
        flex-direction: row;
      }
    }
  }
}
</style>
