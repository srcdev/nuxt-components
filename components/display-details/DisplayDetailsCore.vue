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
  --_display-details-icon-transform: scaleY(1);
  --_display-details-icon-size: 1.2rem;

  &.medium {
    --_display-details-icon-size: 1.8rem;
  }
  &.large {
    --_display-details-icon-size: 2.4rem;
  }

  &[open] {
    --_display-details-icon-transform: scaleY(-1);
  }

  .display-details-summary {
    list-style: none;

    &::-webkit-details-marker,
    &::marker {
      display: none;
    }

    display: flex !important;
    align-items: center;
    gap: 12px;

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
  }
}
</style>
