<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Layout Content Docs'</h1>

          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </PageRow>

        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <div :class="[canvasName]">
            <ContentDocs
              v-model:active-nav-item="activeNavItem"
              v-model:active-page-nav-item="activePageNavItem"
              :docs-nav-items="docsNavItems"
              :docs-page-nav-items="docsPageNavItems"
            >
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
            </ContentDocs>
          </div>
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { MediaCanvas, DocsNavItem } from "~/types/components";
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

const docsNavItems: DocsNavItem[] = [
  { label: "Getting started", to: "/ui/layout-content-docs", icon: "lucide:rocket" },
  { label: "Installation", to: "/ui/layout-content-docs#installation", icon: "lucide:download" },
  { label: "Configuration", to: "/ui/layout-content-docs#configuration" },
  { label: "Theming", to: "/ui/layout-content-docs#theming", icon: "lucide:palette" },
  { label: "Accessibility", to: "/ui/layout-content-docs#accessibility" },
  { label: "Troubleshooting", to: "/ui/layout-content-docs#troubleshooting", icon: "lucide:life-buoy" },
];

const docsPageNavItems: DocsNavItem[] = [
  { label: "Overview", to: "/ui/layout-content-docs#overview", icon: "lucide:eye" },
  { label: "Examples", to: "/ui/layout-content-docs#examples" },
  { label: "Props", to: "/ui/layout-content-docs#props", icon: "lucide:settings-2" },
  { label: "Slots", to: "/ui/layout-content-docs#slots" },
];

const activeNavItem = ref<string | undefined>(docsNavItems[0]?.to);
const activePageNavItem = ref<string | undefined>(undefined);
</script>
