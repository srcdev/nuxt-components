<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="full" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Layout Grid 'A'</h1>

          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </PageRow>

        <PageRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <LayoutGridA :style-class-passthrough="[canvasName]">
            <template #slot1>
              <h3 class="page-heading-3">Slot 1</h3>
              <p>
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
                convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora. Platea accumsan interdum
                ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit
                nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in penatibus torquent tortor. Platea gravida nam;
                egestas enim nostra ultricies.
              </p>
            </template>
            <template #slot2>
              <h3 class="page-heading-3">Slot 2</h3>
              <p>
                Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia
                leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi ullamcorper praesent. Arcu
                luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur
                class suscipit quisque convallis eget? Dignissim mattis luctus enim habitant porta pretium litora.
                Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus
                nisi a montes.
              </p>
            </template>
            <template #slot3>
              <h3 class="page-heading-3">Slot 3</h3>
              <p>
                Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia
                leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi ullamcorper praesent. Arcu
                luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur
                class suscipit quisque convallis eget? Dignissim mattis luctus enim habitant porta pretium litora.
                Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus
                nisi a montes.
              </p>
            </template>
            <template #slot4>
              <h3 class="page-heading-3">Slot 4</h3>
              <p>
                Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia
                leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi ullamcorper praesent. Arcu
                luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur
                class suscipit quisque convallis eget? Dignissim mattis luctus enim habitant porta pretium litora.
                Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus
                nisi a montes.
              </p>
            </template>
          </LayoutGridA>
        </PageRow>

        <PageRow tag="div" variant="full" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Full Width</h2>
          <p>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
            convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora. Platea accumsan interdum
            ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit
            nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in penatibus torquent tortor. Platea gravida nam;
            egestas enim nostra ultricies.
          </p>
          <p>
            Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia leo
            lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi ullamcorper praesent. Arcu luctus
            tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur class
            suscipit quisque convallis eget? Dignissim mattis luctus enim habitant porta pretium litora. Parturient
            montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus nisi a montes.
          </p>
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
  title: "UI Layout Row",
  meta: [{ name: "description", content: "Examples of UI Component Layout Row" }],
  bodyAttrs: {
    class: "home",
  },
});

const canvasName = ref<MediaCanvas>("desktopCanvas");
</script>
