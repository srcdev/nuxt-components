<template>
  <component
    :is="tag"
    class="profile-section"
    :class="[elementClasses]"
    :aria-labelledby="needsLabel ? headingId : undefined"
  >
    <header class="profile-section-header">
      <EyebrowText tag="p" text-content="About Natasha" :style-class-passthrough="['mb-0']" />
      <HeroText
        :id="headingId"
        tag="h2"
        axis="vertical"
        font-size="display"
        :text-content="[
          { text: 'Your', styleClass: 'normal' },
          { text: 'mobile hairdresser', styleClass: 'accent' },
          { text: 'in Bath', styleClass: 'normal' },
        ]"
        :style-class-passthrough="['mb-20']"
      />
    </header>

    <div class="profile-section-inner">
      <div class="picture">
        <NuxtImg :src="props.profilePicture.src" :alt="props.profilePicture.alt" class="profile-picture" />
      </div>
      <div class="profile-info">
        <div class="profile-info-content">
          <div v-for="index in props.profileInfoCount" :key="index" class="profile-info-block">
            <slot :name="'profile-info-' + index">
              <p>Profile info content {{ index }}</p>
            </slot>
          </div>
        </div>

        <div v-if="hasProfileLinksSlot" class="profile-links">
          <slot name="profileLinks">
            <p>Profile links content</p>
          </slot>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
interface ProfilePicture {
  src: string;
  alt: string;
}

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

const headingId = useId();
const needsLabel = computed(() => props.tag === "section" || props.tag === "article");

const slots = useSlots();
const hasProfileLinksSlot = computed(() => Boolean(slots.profileLinks));

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
  /* .profile-section-header {
  } */
  .profile-section-inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: 384px 1fr;
      align-items: start;
      gap: 4rem;
    }

    .picture {
      aspect-ratio: 3 / 4;
      border-radius: 8px;
      overflow: hidden;

      .profile-picture {
        object-fit: cover;
        width: 100%;
      }
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      height: stretch;

      .profile-info-content {
        .profile-info-block {
          margin-block-end: 1.5rem;

          /* .experience {
          } */

          .location {
            .highlight {
              color: var(--colour-text-accent);
              font-weight: 600;
              font-variation-settings: "wght" 600;
            }
          }

          .services {
            .highlight {
              color: var(--colour-link-default);
              font-weight: 600;
              font-variation-settings: "wght" 600;

              &:hover {
                color: var(--colour-link-hover);
              }
            }
          }
        }
      }

      .profile-links {
        display: flex;
        flex-grow: 1;
        gap: 1rem;
        align-items: end;
        justify-content: flex-end;
      }
    }
  }
}
}
</style>
