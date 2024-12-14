<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Accordian</h2>
          <AccordianCore :data />
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
  title: 'Display Accordian',
  meta: [{ name: 'description', content: 'Display Accordian' }],
  bodyAttrs: {
    class: '',
  },
});

interface IAccordianData {
  title: string;
  content: string;
}

const data = ref<IAccordianData[]>([
  {
    title: 'Trigger Item 1',
    content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!. Lorem ipsum dolor sit, adipisicing elit. Iusto, amet!',
  },
  {
    title: 'Trigger Item 2',
    content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!',
  },
  {
    title: 'Trigger Item 3',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!, Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!',
  },
]);
</script>
