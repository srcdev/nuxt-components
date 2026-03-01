<template>
  <div class="expanding-panel" :class="[elementClasses]">
    <details class="expanding-panel-details" :name :open>
      <summary
        :id="`id-${name}-trigger`"
        class="expanding-panel-summary"
        :aria-controls="`id-${name}-content`"
        @click.prevent.stop="handleToggle"
        @keydown.enter.prevent="handleToggle"
        @keydown.space.prevent="handleToggle"
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
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  animationDuration: 400,
  forceOpened: false,
  styleClassPassthrough: () => [],
});

const name = props.name || useId();
const isPanelOpen = defineModel<boolean>({ default: false });
const animationDurationStr = computed(() => `${props.animationDuration}ms`);
const open = computed(() => props.forceOpened || isPanelOpen.value);

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const handleToggle = (event: Event) => {
  if (props.forceOpened) {
    event.preventDefault();
  }
  isPanelOpen.value = !isPanelOpen.value;
};
</script>

<style lang="css">
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
      gap: 1rem;
      list-style: none;

      padding-block: 0.5rem;

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
          font-size: 1.2rem;
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
}
</style>
