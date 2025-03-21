<template>
  <details :name class="display-details" :class="[elementClasses]">
    <summary class="display-details-summary" :id="triggerId" :aria-controls="contentId">
      <span class="label">
        <slot name="summary"></slot>
      </span>
      <slot name="summaryIcon">
        <Icon name="bi:caret-down-fill" class="icon mi-12" :class="iconsSize" />
      </slot>
    </summary>
    <div class="display-details-content" :aria-labelledby="triggerId" :id="contentId" role="region">
      <slot name="content"></slot>
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
    default: 'small',
    validator(value: string) {
      return ['small', 'medium', 'large'].includes(value);
    },
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const triggerId = computed(() => `${props.id}-trigger`);
const contentId = computed(() => `${props.id}-content`);

const { elementClasses, resetElementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

updateElementClasses([props.iconSize]);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
.display-details {
  /* Component setup */
  --_display-details-icon-transform: scaleY(1);
  --_display-details-icon-size: 1.2rem;

  /* Configurable properties */
  --_display-details-border: none;
  --_display-details-outline: none;
  --_display-details-box-shadow: none;
  --_display-details-border-radius: 0;
  --_display-details-mbe: 1em;

  --_display-details-summary-gap: 12px;
  --_display-details-summary-flex-direction: row;

  --_display-details-content-padding: 0;

  &.medium {
    --_display-details-icon-size: 1.8rem;
  }
  &.large {
    --_display-details-icon-size: 2.4rem;
  }

  &[open] {
    --_display-details-icon-transform: scaleY(-1);
  }

  border: var(--_display-details-border);
  outline: var(--_display-details-outline);
  box-shadow: var(--_display-details-box-shadow);
  border-radius: var(--_display-details-border-radius);
  margin-block-end: var(--_display-details-mbe);

  .display-details-summary {
    list-style: none;

    &::-webkit-details-marker,
    &::marker {
      display: none;
    }

    display: flex !important;
    flex-direction: var(--_display-details-summary-flex-direction);
    align-items: center;
    gap: var(--_display-details-summary-gap);
    overflow: clip;

    .label {
      display: block;
      flex-grow: 1;
    }

    .icon {
      display: block;

      font-size: var(--_display-details-icon-size);
      transform: var(--_display-details-icon-transform);
      transition: transform 200ms;
    }
  }

  .display-details-content {
    padding: var(--_display-details-content-padding);
  }
}
</style>
