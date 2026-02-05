<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Layout Grid 'B'</h1>
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </LayoutRow>

        <LayoutRow tag="div" variant="full" :style-class-passthrough="['mbe-20']">
          <LayoutGridB :top-row-slot1-item-count="6" :bottom-row-item-count="4" :style-class-passthrough="[canvasName]">
            <template #[`top-row-slot1-1-content`]>
              <p class="p-24">This is content slot 1</p>
            </template>
            <template #[`top-row-slot1-2-content`]>
              <p class="p-24">This is content slot 2</p>
            </template>
            <template #[`top-row-slot1-3-content`]>
              <p class="p-24">This is content slot 3</p>
            </template>
            <template #[`top-row-slot1-4-content`]>
              <p class="p-24">This is content slot 4</p>
            </template>
            <template #[`top-row-slot1-5-content`]>
              <p class="p-24">This is content slot 5</p>
            </template>
            <template #[`top-row-slot1-6-content`]>
              <p class="p-24">This is content slot 6</p>
            </template>

            <template #top-row-slot-2>
              <h2 class="page-heading-3">Top row slot 2</h2>
              <p>
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
                convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora. Platea accumsan interdum
                ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit
                nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in penatibus torquent tortor. Platea gravida nam;
                egestas enim nostra ultricies.
              </p>
              <p>
                Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia
                leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi ullamcorper praesent. Arcu
                luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur
                class suscipit quisque convallis eget? Dignissim mattis luctus enim habitant porta pretium litora.
                Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus
                nisi a montes.
              </p>
            </template>

            <template #top-row-slot-3>
              <h2 class="page-heading-3">Top row slot 3</h2>
              <p>
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
                convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora. Platea accumsan interdum
                ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit
                nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in penatibus torquent tortor. Platea gravida nam;
                egestas enim nostra ultricies.
              </p>
              <p>
                Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia
                leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi ullamcorper praesent. Arcu
                luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur
                class suscipit quisque convallis eget? Dignissim mattis luctus enim habitant porta pretium litora.
                Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus
                nisi a montes.
              </p>
            </template>

            <template #[`bottom-row-1-content`]>
              <h2 class="page-heading-3">This is content slot 1</h2>
              <p class="page-body-normal">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
                convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora. Platea accumsan interdum
                ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit
                nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in penatibus torquent tortor. Platea gravida nam;
                egestas enim nostra ultricies.
              </p>
            </template>
            <template #[`bottom-row-2-content`]>
              <h2 class="page-heading-3">This is content slot 2</h2>
              <p class="page-body-normal">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
                convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora. Platea accumsan interdum
                ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit
                nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in penatibus torquent tortor. Platea gravida nam;
                egestas enim nostra ultricies.
              </p>
            </template>
            <template #[`bottom-row-3-content`]>
              <h2 class="page-heading-3">This is content slot 3</h2>
              <p class="page-body-normal">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
                convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora. Platea accumsan interdum
                ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit
                nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in penatibus torquent tortor. Platea gravida nam;
                egestas enim nostra ultricies.
              </p>
            </template>
            <template #[`bottom-row-4-content`]>
              <h2 class="page-heading-3">This is content slot 4</h2>
              <p class="page-body-normal">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
                convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora. Platea accumsan interdum
                ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit
                nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in penatibus torquent tortor. Platea gravida nam;
                egestas enim nostra ultricies.
              </p>
            </template>
          </LayoutGridB>
        </LayoutRow>
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
  title: "UI Layout Row",
  meta: [{ name: "description", content: "Examples of UI Component Layout Row" }],
  bodyAttrs: {
    class: "home",
  },
});

const canvasName = ref<MediaCanvas>("desktopCanvas");
</script>
