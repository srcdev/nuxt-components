<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h1 class="heading-2">Container Glow Effect</h1>
          <p>Glow will track mouse position</p>

          <ContainerGlowCore
            :item-count="data.length"
            tag="div"
            :style-class-passthrough="['class-scope', 'pbe-20']"
            :config="{
              proximity: 40,
              spread: 80,
              blur: 20,
              gap: 32,
              vertical: false,
              opacity: 0.15,
            }"
          >
            <template v-for="(item, key) in data" :key="key" v-slot:[`container-glow-${key}`]>
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

const data = [
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
];
</script>

<style lang="css">
.class-scope {
  &.container-glow-wrapper {
    .container-glow-core {
      --gradient: conic-gradient(from 180deg at 50% 70%, hsla(0, 0%, 98%, 1) 0deg, #54ff0b 144.0000021457672deg, hsla(0, 0%, 98%, 1) 1turn);

      height: 100%;
      background: light-dark(white, hsl(246 44% 7%));
      padding: 2rem;
      aspect-ratio: 330 / 400;
      border-radius: 12px;
      min-width: 280px;
      max-width: 280px;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      &::before {
        /* Custom styles */
      }

      &::after {
        /* Custom styles */
      }

      .glows {
        /* Custom styles */

        &::after,
        &::before {
          /* Custom styles */
        }
      }
    }
  }
}
</style>
