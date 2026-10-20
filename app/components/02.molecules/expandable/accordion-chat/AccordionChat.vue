<template>
  <div class="accordion-chat" :class="elementClasses">
    <ExpandingPanelClassic
      v-for="index in panelIndexes()"
      :key="index"
      :name
      :animation-duration="animationDuration"
      :style-class-passthrough="['accordion-chat-item']"
    >
      <template #summary>
        <slot :name="`item-${index}-summary`"></slot>
      </template>
      <template #icon>
        <slot :name="`item-${index}-icon`">
          <span class="accordion-chat-icon" aria-hidden="true">
            <Icon name="lucide:plus" class="accordion-chat-icon-glyph" />
          </span>
        </slot>
      </template>
      <template #content>
        <div v-if="slots[`item-${index}-content`]" class="accordion-chat-answer">
          <span v-if="hasAvatar(index)" class="accordion-chat-avatar" aria-hidden="true">
            <slot :name="`item-${index}-avatar`">
              <slot name="avatar">{{ avatarInitials }}</slot>
            </slot>
          </span>
          <div class="accordion-chat-bubble">
            <slot :name="`item-${index}-content`"></slot>
          </div>
        </div>
      </template>
    </ExpandingPanelClassic>
  </div>
</template>

<script setup lang="ts">
import ExpandingPanelClassic from "../expanding-panel-classic/ExpandingPanelClassic.vue";

interface Props {
  name?: string;
  animationDuration?: number;
  avatarLabel?: string;
  showAvatar?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  animationDuration: 300,
  avatarLabel: "",
  showAvatar: true,
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const SUMMARY_SLOT = /^item-(\d+)-summary$/;

const panelIndexes = () =>
  Object.keys(slots)
    .map((slotName) => SUMMARY_SLOT.exec(slotName)?.[1])
    .filter((index): index is string => index !== undefined)
    .map(Number)
    .sort((a, b) => a - b);

const toGraphemes = (text: string) =>
  typeof Intl.Segmenter === "function"
    ? Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), ({ segment }) => segment)
    : Array.from(text);

const avatarInitials = computed(() => toGraphemes(props.avatarLabel.trim()).slice(0, 2).join(""));

const hasAvatar = (index: number) =>
  props.showAvatar && Boolean(slots[`item-${index}-avatar`] || slots.avatar || avatarInitials.value);

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
  .accordion-chat {
    --_accordion-chat-radius: var(--accordion-chat-radius, 2rem);
    --_accordion-chat-tail-radius: var(--accordion-chat-tail-radius, 0.6rem);
    --_accordion-chat-bubble-max-width: var(--accordion-chat-bubble-max-width, 82%);
    --_accordion-chat-duration: var(--accordion-chat-transition-duration, 200ms);

    display: grid;
    gap: var(--accordion-chat-gap, 1.4rem);

    .accordion-chat-item.expanding-panel-classic {
      --expanding-panel-classic-icon-size: var(--accordion-chat-icon-size, 2.2rem);
      --expanding-panel-classic-summary-gap: var(--accordion-chat-question-icon-gap, 1.4rem);

      .expanding-panel-classic-summary {
        inline-size: fit-content;
        max-inline-size: var(--_accordion-chat-bubble-max-width);
        margin-inline-start: auto;
        padding-block: var(--accordion-chat-question-padding-block, 1.3rem);
        padding-inline: var(--accordion-chat-question-padding-inline, 2rem 1.8rem);
        border: var(--accordion-chat-question-border-width, 0.1rem) solid
          var(--accordion-chat-question-border, transparent);
        border-radius: var(--_accordion-chat-radius);
        border-end-end-radius: var(--_accordion-chat-tail-radius);
        background-color: var(--accordion-chat-question-surface, var(--theme-surface-subtle));
        color: var(--accordion-chat-question-colour, var(--theme-text));
        font-family: var(--accordion-chat-question-font-family, inherit);
        font-size: var(--accordion-chat-question-font-size, 1.6rem);
        font-weight: var(--accordion-chat-question-font-weight, 600);
        line-height: var(--accordion-chat-question-line-height, 1.3);
        transition:
          background-color var(--_accordion-chat-duration),
          color var(--_accordion-chat-duration),
          border-color var(--_accordion-chat-duration);

        &:focus-visible {
          outline: var(--accordion-chat-focus-ring-width, 0.2rem) solid
            var(--accordion-chat-focus-ring-colour, var(--theme-border-focus));
          outline-offset: 0.2rem;
        }

        .expanding-panel-classic-details[open] & {
          border-color: var(--accordion-chat-question-border-open, var(--accordion-chat-question-border, transparent));
          background-color: var(--accordion-chat-question-surface-open, var(--theme-surface-inverted));
          color: var(--accordion-chat-question-colour-open, var(--theme-text-inverted));
        }

        .accordion-chat-icon {
          display: grid;
          place-items: center;
          inline-size: 100%;
          aspect-ratio: 1;
          border-radius: 50%;
          background-color: var(--accordion-chat-icon-surface, rgb(0 0 0 / 0.07));

          .expanding-panel-classic-details[open] & {
            background-color: var(--accordion-chat-icon-surface-open, rgb(255 255 255 / 0.16));
            rotate: 45deg;
          }

          @media (prefers-reduced-motion: no-preference) {
            transition:
              background-color var(--_accordion-chat-duration),
              rotate calc(var(--_accordion-chat-duration) * 1.25);
          }

          .accordion-chat-icon-glyph {
            display: block;
            font-size: var(--accordion-chat-icon-glyph-size, 1.4rem);
          }
        }
      }
    }

    .accordion-chat-answer {
      display: flex;
      align-items: flex-end;
      gap: var(--accordion-chat-avatar-gap, 1rem);
      padding-block-start: var(--accordion-chat-answer-gap, 1rem);

      .accordion-chat-avatar {
        flex: none;
        display: grid;
        place-items: center;
        inline-size: var(--accordion-chat-avatar-size, 3rem);
        aspect-ratio: 1;
        overflow: hidden;
        border-radius: 50%;
        background-color: var(--accordion-chat-avatar-surface, var(--theme-surface-inverted));
        color: var(--accordion-chat-avatar-colour, var(--theme-text-inverted));
        font-family: var(--accordion-chat-avatar-font-family, inherit);
        font-size: var(--accordion-chat-avatar-font-size, 1.2rem);
        font-weight: var(--accordion-chat-avatar-font-weight, 600);
        line-height: 1;
        white-space: nowrap;

        & :where(img, svg) {
          inline-size: 100%;
          block-size: 100%;
          object-fit: cover;
        }
      }

      .accordion-chat-bubble {
        min-inline-size: 0;
        max-inline-size: var(--_accordion-chat-bubble-max-width);
        padding-block: var(--accordion-chat-answer-padding-block, 1.4rem);
        padding-inline: var(--accordion-chat-answer-padding-inline, 1.8rem);
        border: var(--accordion-chat-answer-border-width, 0.1rem) solid
          var(--accordion-chat-answer-border, var(--theme-surface-subtle));
        border-radius: var(--_accordion-chat-radius);
        border-end-start-radius: var(--_accordion-chat-tail-radius);
        background-color: var(--accordion-chat-answer-surface, var(--theme-text-inverted));
        color: var(--accordion-chat-answer-colour, var(--theme-text));
        font-family: var(--accordion-chat-answer-font-family, inherit);
        font-size: var(--accordion-chat-answer-font-size, 1.55rem);
        font-weight: var(--accordion-chat-answer-font-weight, 400);
        line-height: var(--accordion-chat-answer-line-height, 1.6);

        & :where(img, video) {
          max-inline-size: 100%;
          block-size: auto;
        }

        @media (prefers-reduced-motion: no-preference) {
          .expanding-panel-classic-details[open] + .expanding-panel-classic-content & {
            animation: accordion-chat-answer-in var(--accordion-chat-entrance-duration, 260ms) ease-out both;
          }
        }
      }
    }
  }

  @keyframes accordion-chat-answer-in {
    from {
      opacity: 0;
      translate: 0 0.6rem;
      scale: 0.98;
    }
  }
}
</style>
