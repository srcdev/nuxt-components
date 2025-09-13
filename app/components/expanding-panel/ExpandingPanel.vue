<template>
  <div class="expanding-panel" :class="[elementClasses]">
    <details class="expanding-panel-details" :name :open>
      <summary @click="handleToggle" class="expanding-panel-summary" :id="triggerId" :aria-controls="contentId">
        <span class="label-wrapper">
          <slot name="summary"></slot>
        </span>
        <span class="icon-wrapper">
          <slot name="icon">
            <Icon name="bi:caret-down-fill" class="icon mi-12" />
          </slot>
        </span>
      </summary>
    </details>
    <div class="expanding-panel-content" :aria-labelledby="triggerId" :id="contentId" role="region">
      <div class="inner">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  iconSize: {
    type: String,
    default: "medium",
  },
  animationDuration: {
    type: Number,
    default: 400,
  },
  forceOpened: {
    type: Boolean,
    default: false,
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

const name = computed(() => props.name || useId())

const triggerId = computed(() => `id-${name.value}-trigger`)
const contentId = computed(() => `id-${name.value}-content`)
const animationDurationStr = computed(() => `${props.animationDuration}ms`)
const open = computed(() => props.forceOpened)

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const handleToggle = (event: Event) => {
  if (props.forceOpened) {
    event.preventDefault()
  }
}
</script>

<style lang="css">
.expanding-panel {
  .expanding-panel-details {
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
        .inner {
          transition: all v-bind(animationDurationStr) ease-in-out;
        }
      }
    }
  }

  .expanding-panel-content {
    display: grid;
    grid-template-rows: 0fr;
    transition: all v-bind(animationDurationStr) ease-in-out;

    .inner {
      overflow: hidden;
      margin-top: 0;
    }
  }
}
</style>
