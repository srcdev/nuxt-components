<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Marquee Scroller</h1>

          <MarqueeScroller
            animation-runtime="20s"
            :marquee-data
            :item-config="{ width: '100px', height: '100px', quantity: marqueeData.length }"
            :reverse="false"
          >
            <template v-for="item in marqueeData" :key="item.id" #[item.id]>
              <div class="item-inner">
                <h3>ID: {{ item.id }}</h3>
                <p>{{ item.content }}</p>
              </div>
            </template>
          </MarqueeScroller>
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
  title: "Typography",
  meta: [{ name: "description", content: "Typography" }],
  bodyAttrs: {
    class: "page-marquee-scroller",
  },
});

const marqueeData = [
  {
    id: 1,
    content: "Item 1",
  },
  {
    id: 2,
    content: "Item 2",
  },
  {
    id: 3,
    content: "Item 3",
  },
  {
    id: 4,
    content: "Item 4",
  },
  {
    id: 5,
    content: "Item 5",
  },
  {
    id: 6,
    content: "Item 6",
  },
  {
    id: 7,
    content: "Item 7",
  },
  {
    id: 8,
    content: "Item 8",
  },
  {
    id: 9,
    content: "Item 9",
  },
  {
    id: 10,
    content: "Item 10",
  },
  {
    id: 11,
    content: "Item 11",
  },
  {
    id: 12,
    content: "Item 12",
  },
  {
    id: 13,
    content: "Item 13",
  },
];
</script>

<style lang="css">
.page-marquee-scroller {
}
</style>
