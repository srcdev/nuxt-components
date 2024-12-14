<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Accordian</h2>

          <AccordianCore :data :style-class-passthrough="['class-modifier']">
            <template v-for="(item, key) in data" v-slot:[`accordian-${key}-trigger`]> {{ key }} - {{ item.title }} </template>
            <template v-for="(item, key) in data" v-slot:[`accordian-${key}-content`]>
              <p class="p-24">{{ item.content }}</p>
            </template>
          </AccordianCore>
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
