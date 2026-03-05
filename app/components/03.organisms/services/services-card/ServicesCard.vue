<template>
  <component :is="tag" class="services-card" :class="[elementClasses]">
    <div class="image-wrapper">
      <NuxtImg :src="serviceData.image" :alt="serviceData.title" class="image" />
    </div>
    <EyebrowText :text-content="serviceData.subtitle" />
    <HeroHeading
      tag="h2"
      font-size="small"
      :text-content="[
        {
          text: serviceData.title,
          styleClass: 'normal',
        },
      ]"
    />
    <div class="description">
      {{ serviceData.shortDescription }}
    </div>
    <InputButtonCore
      variant="secondary"
      button-text="Learn More"
      :href="`/ui/services/services-section/${serviceData.slug}`"
    >
      <template #right>
        <Icon name="mdi:arrow-right" class="icon" />
      </template>
    </InputButtonCore>
  </component>
</template>

<script setup lang="ts">
import type { Service } from "~/types/types.services";

interface Props {
  tag?: "div" | "section" | "article" | "main" | "header" | "footer";
  serviceData: Service;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

// const slots = useSlots();
// const hasDefaultSlot = computed(() => Boolean(slots.default));

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
.services-card {
  display: grid;
  grid-template-rows: auto 2ch auto 5lh 4.4rem;
  gap: 1rem;

  .image-wrapper {
    aspect-ratio: 3/4;
    border-radius: 8px;
    overflow: hidden;

    .image {
      display: block;
      object-fit: cover;
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .eyebrow-text {
    margin-block: 0.8rem;
  }

  .hero-heading {
    margin-block: 2rem 1rem;
  }

  .description {
    color: var(--colour-text-secondary);

    /* display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    text-overflow: ellipsis; */
  }
}
</style>
