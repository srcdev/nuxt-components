<template>
  <div class="display-accordian" :class="[elementClasses]" ref="accordianRef">
    <details v-for="(item, key) in data" :key="key" class="accordion-panel" name="navigation-group">
      <summary class="accordion-trigger" :id="`accordian-${key}-trigger`" :aria-controls="`accordian-${key}-content`" ref="triggerRefs">
        <span class="label">
          <slot :name="`accordian-${key}-trigger`"></slot>
        </span>
        <Icon name="bi:caret-down-fill" class="icon mi-12" />
      </summary>
      <div class="accordion-content" :aria-labelledby="`accordian-${key}-trigger`" :id="`accordian-${key}-content`" role="region" ref="contentRefs">
        <div class="accordion-content-inner">
          <slot :name="`accordian-${key}-content`"></slot>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
interface IAccordianData {
  title: string;
  content: string;
}

const props = defineProps({
  data: {
    type: Array as PropType<IAccordianData[]>,
    default: () => [],
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.display-accordian {
  max-width: 600px;
  margin: 0 auto;
}

.accordion-panel {
  @property --_grid-template-rows {
    syntax: '<length-percentage> | auto | min-content | max-content | minmax( <length-percentage> , <length-percentage> ) | fit-content( <length-percentage> ) | <flex>';
    inherits: true;
    initial-value: 0fr;
  }

  --_grid-template-rows: 0fr;
  --_icon-transform: scaleY(1);

  border: var(--accordian-panel-border);
  border-radius: var(--accordian-panel-border-radius);
  margin-block-end: var(--accordian-panel-mbe);

  &[open] {
    --_grid-template-rows: 1fr;
    --_icon-transform: scaleY(-1);
  }

  summary::-webkit-details-marker,
  summary::marker {
    display: none;
  }

  .accordion-trigger {
    display: flex !important;
    align-items: center;
    gap: 12px;
    list-style: none;
    padding: 1rem;

    .label {
      display: block;
      flex-grow: 1;
    }

    .icon {
      display: block;
      font-size: 1.2rem;

      transform: var(--_icon-transform);
      transition: transform 200ms;
    }
  }

  .accordion-content {
    display: grid;
    grid-template-rows: var(--_grid-template-rows);
    transition: all 2000ms;

    .accordion-content-inner {
      overflow: hidden;
    }
  }
}
</style>
