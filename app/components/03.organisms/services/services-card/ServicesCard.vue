<template>
  <component :is="tag" class="services-card" :class="[elementClasses]">
    <div class="image-wrapper">
      <NuxtImg :src="serviceData.image" :alt="serviceData.title" loading="lazy" class="image" />
    </div>
    <EyebrowText :font-size="eyebrowConfig.fontSize ?? 'large'" :tag="eyebrowConfig.tag ?? 'div'" :text-content="serviceData.subtitle" />
    <HeroText
      :tag="heroConfig.tag ?? 'h2'"
      :font-size="heroConfig.fontSize ?? 'heading'"
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
    <slot name="actions" :service-data="serviceData"></slot>
  </component>
</template>

<script setup lang="ts">
import type { Service } from "~/types/types.services";

interface EyebrowConfig {
  tag?: "p" | "div" | "span";
  fontSize?: "large" | "medium" | "small";
}

interface HeroConfig {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  fontSize?: "display" | "title" | "heading" | "subheading" | "label";
}

interface Props {
  tag?: "div" | "section" | "article";
  serviceData: Service;
  eyebrowConfig?: EyebrowConfig;
  heroConfig?: HeroConfig;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  eyebrowConfig: () => ({}),
  heroConfig: () => ({}),
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .services-card {
    /* Consumer definable css tokens */
    --_eyebrow-text-margin-block: 0.8rem 0;
    --_hero-text-margin-block: 2rem 1rem;
    --_description-text-colour: var(--colour-text-secondary);

    display: grid;
    grid-template-rows: auto auto auto 5lh auto;
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
      margin-block: var(--_eyebrow-text-margin-block);
    }

    .hero-text {
      margin-block: var(--_hero-text-margin-block);
    }

    .description {
      color: var(--_description-text-colour);

      /* display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    text-overflow: ellipsis; */
    }
  }
}
</style>
