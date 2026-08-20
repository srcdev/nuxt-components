<template>
  <div ref="rootEl" class="expanding-panel-legacy" :class="[elementClasses, { 'content-is-on-top': contentIsOnTop }]">
    <details class="expanding-panel-legacy-details" :name :open @toggle="onDetailsToggle">
      <summary
        :id="`id-${name}-trigger`"
        class="expanding-panel-legacy-summary"
        :aria-controls="`id-${name}-content`"
        :aria-expanded="open"
        @click.prevent.stop="handleToggle"
      >
        <div class="label-wrapper">
          <slot name="summary"></slot>
        </div>
        <div class="icon-wrapper" :class="{ 'icon-wrapper--hidden': forceOpened }">
          <slot name="icon">
            <Icon name="bi:caret-down-fill" class="icon mi-12" />
          </slot>
        </div>
      </summary>
    </details>
    <div
      :id="`id-${name}-content`"
      class="expanding-panel-legacy-content"
      :aria-labelledby="`id-${name}-trigger`"
      role="region"
    >
      <div class="inner">
        <slot name="content"></slot>
      </div>
    </div>
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
        `ExpandingPanelLegacy${props.name ? ` "${props.name}"` : ""}: contentIsOnTop is enabled. ` +
          "The content overlay is absolutely positioned and does not reserve space, so a sibling " +
          "element (e.g. another ExpandingPanelLegacy) placed directly after this one will be visually " +
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
  .expanding-panel-legacy {
    .expanding-panel-legacy-details {
      &:hover {
        cursor: pointer;
      }
      .expanding-panel-legacy-summary {
        display: grid;
        align-items: center;
        grid-template-columns: 1fr auto;
        gap: var(--expanding-panel-legacy-summary-gap, 1rem);
        list-style: none;
        user-select: none;

        padding-block: var(--expanding-panel-legacy-summary-padding-block, 0.5rem);

        &::-webkit-details-marker,
        &::marker {
          display: none;
        }

        overflow: hidden;

        .label-wrapper {
          display: inline-block;
        }
        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;

          aspect-ratio: 1;
          overflow: hidden;

          &.icon-wrapper--hidden {
            visibility: hidden;
          }

          .icon {
            display: block;
            transform: scaleY(1);
            transition: transform v-bind(animationDurationStr) ease-in-out;
            font-size: var(--expanding-panel-legacy-icon-size, 1.2rem);
            will-change: transform;
          }
        }
      }

      &[open] {
        .expanding-panel-legacy-summary {
          .icon-wrapper {
            .icon {
              transform: scaleY(-1);
            }
          }
        }
        + .expanding-panel-legacy-content {
          grid-template-rows: 1fr;
        }
      }
    }

    .expanding-panel-legacy-content {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows v-bind(animationDurationStr) ease-in-out;
      will-change: grid-template-rows;

      .inner {
        overflow: hidden;
        margin-top: 0;
      }
    }

    &.content-is-on-top {
      position: relative;

      .expanding-panel-legacy-content {
        position: absolute;
        top: calc(100% + var(--expanding-panel-legacy-content-gap, 0px));
        inset-inline: 0;
        z-index: var(--expanding-panel-legacy-content-z-index, 10);
      }
    }
  }
}
</style>
