<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Layout Content Docs'</h1>

          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </PageRow>

        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <div ref="contentDocsContainer" :class="[canvasName]">
            <ContentDocs>
              <template #docsNav>
                <ExpandingPanel
                  :name="docsNavPanelName"
                  :animation-duration="200"
                  :force-opened="docsNavForceOpen"
                  :content-is-on-top="docsNavOnTop"
                >
                  <template #summary>
                    <h3 class="page-heading-3 mb-2">docsNav panel</h3>
                  </template>
                  <template #content>
                    <!-- Wrapper INSIDE the slot carries visual styling — never .inner itself,
                           see .claude/skills/components/expanding-panel.md for why -->
                    <div class="qa-preview-panel-body">
                      <p class="mt-0">Content driven by the controls above.</p>
                      <p class="mb-0">
                        Toggle "Content Is On Top" to see it overlay the text below instead of pushing it down.
                      </p>
                    </div>
                  </template>
                </ExpandingPanel>
              </template>
              <template #docsContent>
                <h3 class="page-heading-3">Docs Content</h3>
                <p>
                  Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis
                  conubia leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi ullamcorper
                  praesent. Arcu luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat
                  ultricies consectetur class suscipit quisque convallis eget? Dignissim mattis luctus enim habitant
                  porta pretium litora. Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend
                  parturient mattis tellus nisi a montes.
                </p>
              </template>
              <template #docsPageNav>
                <ExpandingPanel
                  :name="docsPageNavPanelName"
                  :animation-duration="200"
                  :force-opened="docsPageNavForceOpen"
                  :content-is-on-top="docsPageNavOnTop"
                >
                  <template #summary>
                    <h3 class="page-heading-3 mb-2">docsPageNav panel</h3>
                  </template>
                  <template #content>
                    <!-- Wrapper INSIDE the slot carries visual styling — never .inner itself,
                           see .claude/skills/components/expanding-panel.md for why -->
                    <div class="qa-preview-panel-body">
                      <p class="mt-0">Content driven by the controls above.</p>
                      <p class="mb-0">
                        Toggle "Content Is On Top" to see it overlay the text below instead of pushing it down.
                      </p>
                    </div>
                  </template>
                </ExpandingPanel>
              </template>
            </ContentDocs>
          </div>
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { MediaCanvas } from "~/types/components";
definePageMeta({
  layout: false,
});

useHead({
  title: "UI Layout Content Docs",
  meta: [{ name: "description", content: "Examples of UI Component Layout Content Docs" }],
  bodyAttrs: {
    class: "content-docs-demo-page",
  },
});

const canvasName = ref<MediaCanvas>("mobileCanvas");

// Matches the breakpoints ContentDocs.vue itself defines for its "contentDocs" container.
const contentDocsContainer = ref<HTMLElement | null>(null);
const { greaterOrEqual, smaller } = useContainerBreakpoints({ tablet: 768, desktop: 1024 }, contentDocsContainer);
const isDesktop = greaterOrEqual("desktop");
const isMobile = smaller("tablet");

const docsNavForceOpen = computed(() => isDesktop.value);
const docsNavOnTop = computed(() => !isDesktop.value);
const docsPageNavForceOpen = computed(() => !isMobile.value);
const docsPageNavOnTop = computed(() => isMobile.value);

// Shared `name` groups the two <details> into a mutually-exclusive native accordion —
// wanted on mobile (neither is forceOpened), wrong on tablet/desktop where both are
// forceOpened simultaneously: a shared name would make the browser force-close one.
const docsNavPanelName = computed(() => (isMobile.value ? "docsPanelGroup" : "docsNav"));
const docsPageNavPanelName = computed(() => (isMobile.value ? "docsPanelGroup" : "docsPageNav"));
</script>
