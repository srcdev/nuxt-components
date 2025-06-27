<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Container Glow Effect</h2>
          <p>Glow will track mouse position</p>

          <ContainerGlowCore :data :style-class-passthrough="['pbe-20']">
            <template v-for="(item, key) in data" v-slot:[`container-glow-${key}`]>
              <div class="example-card p-12">
                <h3 class="heading-3">{{ item.title }}</h3>
                <p class="pbs-24">{{ item.content }}</p>
              </div>
            </template>
          </ContainerGlowCore>
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
  title: 'Container Glow Effect',
  meta: [{ name: 'description', content: 'Container Glow Effect' }],
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

<style lang="css">
.example-card {
  background-color: light-dark(white, hsl(246 44% 7%));
}
</style>
