<template>
  <div class="expanding-panel" :class="[elementClasses, { 'content-is-on-top': contentIsOnTop }]">
    <details class="expanding-panel-details" :name :open @toggle="onDetailsToggle">
      <summary
        :id="`id-${name}-trigger`"
        class="expanding-panel-summary"
        :aria-controls="`id-${name}-content`"
        :aria-expanded="open"
        @click.prevent.stop="handleToggle"
      >
        <span class="label-wrapper">
          <slot name="summary"></slot>
        </span>
        <span v-if="!forceOpened" class="icon-wrapper">
          <slot name="icon">
            <Icon name="bi:caret-down-fill" class="icon mi-12" />
          </slot>
        </span>
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

const name = props.name || useId();
const isPanelOpen = defineModel<boolean>({ default: false });
const animationDurationStr = computed(() => `${props.animationDuration}ms`);
const open = computed(() => props.forceOpened || isPanelOpen.value);

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

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
          "page content — avoid stacking multiple contentIsOnTop panels as direct siblings.",
      );
    },
    { immediate: true },
  );
}

const handleToggle = (event: Event) => {
  if (props.forceOpened) {
    event.preventDefault();
  }
  isPanelOpen.value = !isPanelOpen.value;
};

const onDetailsToggle = (event: Event) => {
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        gap: var(--expanding-panel-summary-gap, 1rem);
        list-style: none;

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
