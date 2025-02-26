<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="full-width" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Layout Grid 'B'</h2>
          <CanvasSwitcher v-model:canvasName="canvasName" />
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <LayoutGridB :slot1ItemCount="6" :styleClassPassthrough="[canvasName]">
            <template v-slot:[`slot1-1-content`]>
              <p class="p-24">This is content slot 1</p>
            </template>
            <template v-slot:[`slot1-2-content`]>
              <p class="p-24">This is content slot 2</p>
            </template>
            <template v-slot:[`slot1-3-content`]>
              <p class="p-24">This is content slot 3</p>
            </template>
            <template v-slot:[`slot1-4-content`]>
              <p class="p-24">This is content slot 4</p>
            </template>
            <template v-slot:[`slot1-5-content`]>
              <p class="p-24">This is content slot 5</p>
            </template>
            <template v-slot:[`slot1-6-content`]>
              <p class="p-24">This is content slot 6</p>
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
