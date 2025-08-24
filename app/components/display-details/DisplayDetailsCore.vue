<template>
  <details :name="name" class="display-details" :class="[elementClasses]" ref="detailsRef">
    <summary class="display-details-summary" :id="triggerId" :aria-controls="contentId" ref="summaryRef">
      <span class="label">
        <slot name="summary"></slot>
      </span>
      <slot name="summaryIcon">
        <Icon name="bi:caret-down-fill" class="icon mi-12" :class="iconSize" />
      </slot>
    </summary>
    <div class="display-details-content" :aria-labelledby="triggerId" :id="contentId" role="region" ref="contentRef">
      <div class="inner">
        <slot name="details-content"></slot>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  iconSize: {
    type: String,
    default: "small",
    validator(value: string) {
      return ["small", "medium", "large"].includes(value)
    },
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

const triggerId = computed(() => `${props.id}-trigger`)
const contentId = computed(() => `${props.id}-content`)

const { elementClasses, resetElementClasses, updateElementClasses } = useStyleClassPassthrough(
  props.styleClassPassthrough
)

updateElementClasses([props.iconSize])

const detailsRef = useTemplateRef<HTMLDetailsElement>("detailsRef")
const summaryRef = useTemplateRef<HTMLElement | null>("summaryRef")
const contentRef = useTemplateRef<HTMLDivElement | null>("contentRef")
</script>

<style lang="css">
.display-details {
  border: none;
  outline: none;
  box-shadow: none;
  border-radius: 0;

  &[open] {
    .display-details-summary {
      .icon {
        transform: scaleY(-1);
      }
    }
    .display-details-content {
      grid-template-rows: 1fr;
      overflow: hidden;
    }
  }

  .display-details-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    gap: 0;

    list-style: none;

    &::-webkit-details-marker,
    &::marker {
      display: none;
    }

    overflow: clip;

    .label {
      display: block;
      flex-grow: 1;
    }

    .icon {
      display: block;

      transform: scaleY(1);

      font-size: 1.2rem;
      &.medium {
        font-size: 1.8rem;
      }
      &.large {
        font-size: 2.4rem;
      }
    }
  }

  .display-details-content {
    display: grid;
    grid-template-rows: 0;

    .inner {
      overflow: hidden;
    }
  }
}
</style>
