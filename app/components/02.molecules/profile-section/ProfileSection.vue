<template>
  <component
    :is="tag"
    class="profile-section"
    :class="[elementClasses]"
    :aria-labelledby="ariaLabelledby"
    :data-header-placement="headerPlacement"
  >
    <header v-if="hasHeader() && !headerInPicture" class="profile-section-header">
      <slot v-if="hasEyebrowTextSlot()" name="eyebrowText"></slot>
      <slot v-if="hasHeroTextSlot()" name="heroText" :heading-id="headingId"></slot>
    </header>

    <div class="profile-section-inner">
      <div class="profile-section-picture">
        <header v-if="hasHeader() && headerInPicture" class="profile-section-header">
          <slot v-if="hasEyebrowTextSlot()" name="eyebrowText"></slot>
          <slot v-if="hasHeroTextSlot()" name="heroText" :heading-id="headingId"></slot>
        </header>
        <NuxtImg
          :src="profilePicture.src"
          :alt="profilePicture.alt"
          :width="imageWidth"
          :height="imageHeight"
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
  headerPlacement?: "above" | "picture-bottom" | "picture-top";
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  headerPlacement: "above",
  styleClassPassthrough: () => [],
});

const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);

const slots = useSlots();
const hasEyebrowTextSlot = () => Boolean(slots.eyebrowText);
const hasHeroTextSlot = () => Boolean(slots.heroText);
const hasHeader = () => hasEyebrowTextSlot() || hasHeroTextSlot();
const hasProfileLinksSlot = () => Boolean(slots.profileLinks);

const headerInPicture = computed(() => props.headerPlacement !== "above");

const profileInfoSlots = () =>
  Object.keys(slots)
    .filter((key) => /^profile-info-\d+$/.test(key))
    .sort((a, b) => parseInt(a.split("-")[2] ?? "0") - parseInt(b.split("-")[2] ?? "0"));

const positiveOr = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;

const imageWidth = computed(() => positiveOr(props.profilePicture.width, 828));
const imageHeight = computed(() => positiveOr(props.profilePicture.height, 1104));

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
    container: profile-section / inline-size;
    overflow-wrap: anywhere;

    .profile-section-inner {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--profile-section-gap, 2rem);

      @container profile-section (min-width: 768px) {
        grid-template-columns: minmax(0, var(--profile-section-picture-width, 38.4rem)) minmax(0, 1fr);
        align-items: start;
        gap: var(--profile-section-gap-wide, 4rem);
      }

      .profile-section-picture {
        position: relative;
        aspect-ratio: var(--profile-section-picture-aspect-ratio, 3 / 4);
        border-radius: var(--profile-section-picture-border-radius, 0.8rem);
        overflow: hidden;

        .profile-section-image {
          position: absolute;
          inset: 0;
          object-fit: cover;
          width: 100%;
          height: 100%;
          border-radius: inherit;
        }
      }

      .profile-section-info {
        color: var(--profile-section-info-text-colour, inherit);
      }

      .profile-section-info-block {
        margin-block-end: var(--profile-section-info-block-gap, 1.5rem);

        .location .highlight,
        .services .highlight {
          font-weight: var(--profile-section-highlight-font-weight, 600);
          font-variation-settings: "wght" var(--profile-section-highlight-font-weight, 600);
        }

        .location .highlight {
          color: var(--profile-section-highlight-colour, var(--colour-text-accent));
        }

        .services .highlight {
          color: var(--profile-section-link-colour, var(--colour-link-default));

          &:hover {
            color: var(--profile-section-link-colour-hover, var(--colour-link-hover));
          }
        }
      }

      .profile-section-links {
        display: flex;
        flex-wrap: wrap;
        flex-grow: 1;
        gap: var(--profile-section-links-gap, 1rem);
        align-items: end;
        justify-content: flex-end;
      }
    }

    &:is([data-header-placement="picture-bottom"], [data-header-placement="picture-top"]) .profile-section-picture {
      /* Visible overflow keeps aspect-ratio a minimum, so a long header grows the frame instead of being clipped. */
      --_scrim-colour: var(--profile-section-picture-header-scrim-colour, #000);
      --_scrim-direction: to top;
      --_scrim-start-colour: color-mix(
        in oklab,
        var(--_scrim-colour) var(--profile-section-picture-header-scrim-opacity, 75%),
        transparent
      );
      --_scrim-solid-stop: var(--profile-section-picture-header-scrim-solid-stop, 0%);
      --_scrim-target-colour: var(--profile-section-picture-header-scrim-target-colour, transparent);

      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      overflow: visible;

      .profile-section-header {
        position: relative;
        z-index: 1;
        display: grid;
        gap: var(--profile-section-picture-header-gap, 0.4rem);
        padding: var(--profile-section-picture-header-padding, 2.4rem);
        border-end-start-radius: inherit;
        border-end-end-radius: inherit;
        color: var(--profile-section-picture-header-text-colour, #fff);
        background: var(
          --profile-section-picture-header-scrim,
          linear-gradient(
            var(--_scrim-direction),
            rgb(0 0 0 / 0.75),
            rgb(0 0 0 / 0.75) var(--_scrim-solid-stop),
            var(--_scrim-target-colour)
          )
        );

        @supports (color: color-mix(in oklab, red, transparent)) {
          background: var(
            --profile-section-picture-header-scrim,
            linear-gradient(
              var(--_scrim-direction),
              var(--_scrim-start-colour),
              var(--_scrim-start-colour) var(--_scrim-solid-stop),
              var(--_scrim-target-colour)
            )
          );
        }

        @supports (color: contrast-color(red)) {
          color: var(--profile-section-picture-header-text-colour, contrast-color(var(--_scrim-colour)));
        }

        .eyebrow-text {
          --eyebrow-text-bg-img: none;
          color: var(--profile-section-picture-header-eyebrow-colour, inherit);
        }
      }
    }

    &[data-header-placement="picture-top"] .profile-section-picture {
      --_scrim-direction: to bottom;

      justify-content: flex-start;

      .profile-section-header {
        border-radius: 0;
        border-start-start-radius: inherit;
        border-start-end-radius: inherit;
      }
    }
  }
}
</style>
