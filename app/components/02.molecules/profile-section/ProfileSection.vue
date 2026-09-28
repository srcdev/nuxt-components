<template>
  <component :is="tag" class="profile-section" :class="[elementClasses]" :aria-labelledby="ariaLabelledby">
    <header class="profile-section-header">
      <slot v-if="hasEyebrowTextSlot()" name="eyebrowText"></slot>
      <slot v-if="hasHeroTextSlot()" name="heroText" :heading-id="headingId"></slot>
    </header>

    <div class="profile-section-inner">
      <div class="profile-section-picture">
        <NuxtImg
          :src="profilePicture.src"
          :alt="profilePicture.alt"
          :width="profilePicture.width ?? 828"
          :height="profilePicture.height ?? 1104"
          class="profile-section-image"
        />
      </div>
      <div class="profile-section-info">
        <div class="profile-section-info-content">
          <div v-for="slotName in profileInfoSlots()" :key="slotName" class="profile-section-info-block">
            <slot :name="slotName"></slot>
          </div>
        </div>

        <div v-if="hasProfileLinksSlot()" class="profile-section-links">
          <slot name="profileLinks"></slot>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { ProfilePicture } from "~/types/components";

interface Props {
  tag?: "div" | "section" | "article" | "main";
  profilePicture: ProfilePicture;
  profileInfoCount?: number;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  profileInfoCount: 3,
  styleClassPassthrough: () => [],
});

const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);

const slots = useSlots();
const hasEyebrowTextSlot = () => Boolean(slots.eyebrowText);
const hasHeroTextSlot = () => Boolean(slots.heroText);
const hasProfileLinksSlot = () => Boolean(slots.profileLinks);

const profileInfoSlots = () => {
  const provided = Object.keys(slots)
    .filter((key) => /^profile-info-\d+$/.test(key))
    .sort((a, b) => parseInt(a.split("-")[2] ?? "0") - parseInt(b.split("-")[2] ?? "0"));
  return provided.length > 0
    ? provided
    : Array.from({ length: props.profileInfoCount }, (_, i) => `profile-info-${i + 1}`);
};

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
  .profile-section {
    .profile-section-inner {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--profile-section-gap, 2rem);

      @media (min-width: 768px) {
        grid-template-columns: var(--profile-section-picture-width, 384px) 1fr;
        align-items: start;
        gap: var(--profile-section-gap-wide, 4rem);
      }

      .profile-section-picture {
        aspect-ratio: var(--profile-section-picture-aspect-ratio, 3 / 4);
        border-radius: var(--profile-section-picture-border-radius, 8px);
        overflow: hidden;

        .profile-section-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }

      .profile-section-info-block {
        margin-block-end: var(--profile-section-info-block-gap, 1.5rem);

        .location .highlight {
          color: var(--colour-text-accent);
          font-weight: 600;
          font-variation-settings: "wght" 600;
        }

        .services .highlight {
          color: var(--colour-link-default);
          font-weight: 600;
          font-variation-settings: "wght" 600;

          &:hover {
            color: var(--colour-link-hover);
          }
        }
      }

      .profile-section-links {
        display: flex;
        flex-grow: 1;
        gap: var(--profile-section-links-gap, 1rem);
        align-items: end;
        justify-content: flex-end;
      }
    }
  }
}
</style>
