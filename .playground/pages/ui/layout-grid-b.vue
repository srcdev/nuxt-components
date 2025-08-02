<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="full-width" :styleClassPassthrough="['mbe-20']">
          <h1 class="heading-2">Layout Grid 'B'</h1>
          <CanvasSwitcher v-model:canvasName="canvasName" />
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <LayoutGridB :topRowSlot1ItemCount="6" :bottomRowItemCount="4" :styleClassPassthrough="[canvasName]">
            <template v-slot:[`top-row-slot1-1-content`]>
              <p class="p-24">This is content slot 1</p>
            </template>
            <template v-slot:[`top-row-slot1-2-content`]>
              <p class="p-24">This is content slot 2</p>
            </template>
            <template v-slot:[`top-row-slot1-3-content`]>
              <p class="p-24">This is content slot 3</p>
            </template>
            <template v-slot:[`top-row-slot1-4-content`]>
              <p class="p-24">This is content slot 4</p>
            </template>
            <template v-slot:[`top-row-slot1-5-content`]>
              <p class="p-24">This is content slot 5</p>
            </template>
            <template v-slot:[`top-row-slot1-6-content`]>
              <p class="p-24">This is content slot 6</p>
            </template>

            <template #top-row-slot-2>
              <h2 class="heading-3">Top row slot 2</h2>
              <p>
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora.
                Platea accumsan interdum ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in
                penatibus torquent tortor. Platea gravida nam; egestas enim nostra ultricies.
              </p>
              <p>
                Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi
                ullamcorper praesent. Arcu luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur class suscipit quisque convallis eget? Dignissim
                mattis luctus enim habitant porta pretium litora. Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus nisi a montes.
              </p>
            </template>

            <template #top-row-slot-3>
              <h2 class="heading-3">Top row slot 3</h2>
              <p>
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora.
                Platea accumsan interdum ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in
                penatibus torquent tortor. Platea gravida nam; egestas enim nostra ultricies.
              </p>
              <p>
                Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi
                ullamcorper praesent. Arcu luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur class suscipit quisque convallis eget? Dignissim
                mattis luctus enim habitant porta pretium litora. Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus nisi a montes.
              </p>
            </template>

            <template v-slot:[`bottom-row-1-content`]>
              <h2 class="heading-3">This is content slot 1</h2>
              <p class="body-normal">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora.
                Platea accumsan interdum ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in
                penatibus torquent tortor. Platea gravida nam; egestas enim nostra ultricies.
              </p>
            </template>
            <template v-slot:[`bottom-row-2-content`]>
              <h2 class="heading-3">This is content slot 2</h2>
              <p class="body-normal">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora.
                Platea accumsan interdum ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in
                penatibus torquent tortor. Platea gravida nam; egestas enim nostra ultricies.
              </p>
            </template>
            <template v-slot:[`bottom-row-3-content`]>
              <h2 class="heading-3">This is content slot 3</h2>
              <p class="body-normal">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora.
                Platea accumsan interdum ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in
                penatibus torquent tortor. Platea gravida nam; egestas enim nostra ultricies.
              </p>
            </template>
            <template v-slot:[`bottom-row-4-content`]>
              <h2 class="heading-3">This is content slot 4</h2>
              <p class="body-normal">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora.
                Platea accumsan interdum ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in
                penatibus torquent tortor. Platea gravida nam; egestas enim nostra ultricies.
              </p>
            </template>
          </LayoutGridB>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { MediaCanvas } from '@/types/types.canvasName';

definePageMeta({
  layout: false,
});

useHead({
  title: 'UI Layout Row',
  meta: [{ name: 'description', content: 'Examples of UI Component Layout Row' }],
  bodyAttrs: {
    class: 'home',
  },
});

const canvasName = ref<MediaCanvas>('desktopCanvas');

interface IAccordianData {
  title: string;
  content: string;
}

const data = ref<IAccordianData[]>([
  {
    title: 'Item 1',
    content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!. Lorem ipsum dolor sit, adipisicing elit. Iusto, amet!',
  },
  {
    title: 'Item 2',
    content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!',
  },
  {
    title: 'Item 3',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!, Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!',
  },
  {
    title: 'Item 4',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!, Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!',
  },
  {
    title: 'Item 5',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!, Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!',
  },
  {
    title: 'Item 6',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!, Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!',
  },
]);
</script>
