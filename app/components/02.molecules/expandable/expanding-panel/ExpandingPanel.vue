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
            <Icon name="bi:caret-down-fill" class="icon mi-12" />
          </slot>
        </div>
      </summary>
    </details>
    <div
      :id="`id-${name}-content`"
      class="expanding-panel-content"
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

// contentIsOnTop panels behave like a dropdown/overlay (e.g. ContentDocs' mobile nav) rather
// than an inline accordion — clicking outside is the expected way to dismiss those, matching
// native <select>/menu behaviour. Not wanted for ordinary accordions (forceOpened is always
// false here too — a forceOpened panel isn't meant to be dismissible by any interaction).
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
  // forceOpened drives the native `open` attribute directly, which fires its own
  // 'toggle' event — ignore it here or it leaks into isPanelOpen and gets stuck
  // once forceOpened later reverts to false.
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
        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;

          aspect-ratio: 1;
          overflow: hidden;

          /* Space is always reserved (not v-if'd away) so a forceOpened panel's summary
             row stays the same height as a toggleable sibling's — only the glyph hides. */
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
        + .expanding-panel-content {
          grid-template-rows: 1fr;
        }
      }
    }

    .expanding-panel-content {
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

      .expanding-panel-content {
        position: absolute;
        top: calc(100% + var(--expanding-panel-content-gap, 0px));
        inset-inline: 0;
        z-index: var(--expanding-panel-content-z-index, 10);
      }
    }
  }
}
</style>
