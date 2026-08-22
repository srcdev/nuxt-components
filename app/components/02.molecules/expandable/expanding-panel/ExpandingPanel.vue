<template>
  <div ref="rootEl" class="expanding-panel" :class="[elementClasses, { 'content-is-on-top': contentIsOnTop }]">
    <details class="expanding-panel-details" :name :open @toggle="onDetailsToggle">
      <summary
        :id="`id-${name}-trigger`"
        class="expanding-panel-summary"
        :aria-controls="`id-${name}-content`"
        :aria-expanded="open"
        @click.prevent.stop="handleToggle"
      >
        <div class="label-wrapper">
          <slot name="summary"></slot>
        </div>
        <div class="icon-wrapper" :class="{ 'icon-wrapper--hidden': forceOpened }">
          <slot name="icon">
            <Icon name="bi:caret-down-fill" class="icon" />
          </slot>
        </div>
      </summary>
      <div
        :id="`id-${name}-content`"
        class="expanding-panel-content"
        :aria-labelledby="`id-${name}-trigger`"
        role="region"
      >
        <slot name="content"></slot>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

interface Props {
  name?: string;
  animationDuration?: number;
  forceOpened?: boolean;
  contentIsOnTop?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  animationDuration: 400,
  forceOpened: false,
  contentIsOnTop: false,
  styleClassPassthrough: () => [],
});

const fallbackName = useId();
const name = computed(() => props.name || fallbackName);
const isPanelOpen = defineModel<boolean>({ default: false });
const animationDurationStr = computed(() => `${props.animationDuration}ms`);
const open = computed(() => props.forceOpened || isPanelOpen.value);

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const rootEl = ref<HTMLElement | null>(null);
onClickOutside(rootEl, () => {
  if (props.contentIsOnTop && !props.forceOpened && isPanelOpen.value) {
    isPanelOpen.value = false;
  }
});

if (import.meta.dev) {
  watch(
    () => props.contentIsOnTop,
    (value) => {
      if (!value) return;
      console.warn(
        `ExpandingPanel${props.name ? ` "${props.name}"` : ""}: contentIsOnTop is enabled. ` +
          "The content overlay is absolutely positioned and does not reserve space, so a sibling " +
          "element (e.g. another ExpandingPanel) placed directly after this one will be visually " +
          "covered when this panel opens. Intended for a single panel overlaying unrelated trailing " +
          "page content — avoid stacking multiple contentIsOnTop panels as direct siblings."
      );
    },
    { immediate: true }
  );
}

const handleToggle = (event: Event) => {
  if (props.forceOpened) {
    event.preventDefault();
  }
  isPanelOpen.value = !isPanelOpen.value;
};

const onDetailsToggle = (event: Event) => {
  if (props.forceOpened) return;
  isPanelOpen.value = (event.target as HTMLDetailsElement).open;
};
</script>

<style lang="css">
@layer components {
  .expanding-panel {
    .expanding-panel-details {
      &:hover {
        cursor: pointer;
      }
      .expanding-panel-summary {
        display: grid;
        align-items: center;
        grid-template-columns: 1fr auto;
        gap: var(--expanding-panel-summary-gap, 1rem);
        list-style: none;
        user-select: none;

        padding-block: var(--expanding-panel-summary-padding-block, 0.5rem);

        &::-webkit-details-marker,
        &::marker {
          display: none;
        }

        overflow: hidden;

        .label-wrapper {
          display: inline-block;
        }
        /* inline-size is reserved explicitly — the grid's align-items:center
           doesn't stretch this item to row height, so with only aspect-ratio:1
           and no content yet (icon SVG not loaded), the wrapper has nothing to
           size itself against and collapses to 0 until the icon arrives, then
           pops in and shifts the "auto" grid column's width. */
        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;

          inline-size: var(--expanding-panel-icon-size, 1.2rem);
          aspect-ratio: 1;
          overflow: hidden;

          &.icon-wrapper--hidden {
            visibility: hidden;
          }

          .icon {
            display: block;
            transform: scaleY(1);
            transition: transform v-bind(animationDurationStr) ease-in-out;
            font-size: var(--expanding-panel-icon-size, 1.2rem);
            will-change: transform;
          }
        }
      }

      &[open] {
        .expanding-panel-summary {
          .icon-wrapper {
            .icon {
              transform: scaleY(-1);
            }
          }
        }
      }

      &::details-content {
        overflow: clip;
        height: 0;
        transition:
          height v-bind(animationDurationStr) ease-in-out,
          content-visibility v-bind(animationDurationStr) ease-in-out allow-discrete;
      }

      @supports (interpolate-size: allow-keywords) {
        interpolate-size: allow-keywords;

        &[open]::details-content {
          height: auto;
        }
      }
    }

    &.content-is-on-top {
      .expanding-panel-details {
        position: relative;

        &::details-content {
          position: absolute;
          top: calc(100% + var(--expanding-panel-content-gap, 0px));
          inset-inline: 0;
          z-index: var(--expanding-panel-content-z-index, 10);
        }
      }
    }
  }
}
</style>
