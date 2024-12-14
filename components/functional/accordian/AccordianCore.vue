<template>
  <div class="display-accordian" :class="[elementClasses]">
    <template v-for="(item, key) in data" :key="key">
      <div class="accordion-panel">
        <button class="accordion-trigger" :id="`accordian-${key}-trigger`" aria-expanded="false" :aria-controls="`accordian-${key}-content`" ref="triggerRefs" @click.stop.prevent="handleSummary(key)">
          <slot :name="`accordian-${key}-trigger`"></slot>
        </button>

        <div class="accordion-content" :aria-labelledby="`accordian-${key}-trigger`" :id="`accordian-${key}-content`" role="region" aria-hidden="true" ref="contentRefs">
          <div>
            <slot :name="`accordian-${key}-content`"></slot>
          </div>
        </div>
      </div>
    </template>
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

const triggerRefs = ref<HTMLElement[]>([]);
const contentRefs = ref<HTMLElement[]>([]);

onMounted(() => {
  triggerRefs.value = Array.from(document.querySelectorAll('.accordion-trigger'));
  contentRefs.value = Array.from(document.querySelectorAll('.accordion-content'));
});

const handleSummary = (clickedIndex: number) => {
  triggerRefs.value.forEach((element, index) => {
    if (clickedIndex === index) {
      const currentState = element.getAttribute('aria-expanded');
      const newState = currentState !== 'true';
      triggerRefs.value[index].setAttribute('aria-expanded', String(newState));
      contentRefs.value[index].setAttribute('aria-hidden', String(currentState));
    } else {
      triggerRefs.value[index].setAttribute('aria-expanded', 'false');
      contentRefs.value[index].setAttribute('aria-hidden', 'true');
    }
  });
};
</script>

<style lang="css">
.display-accordian {
  max-width: 600px;
  margin: 0 auto;
}

.accordion-panel {
  border: var(--accordian-panel-border);
  border-radius: var(--accordian-panel-border-radius);
  margin-block-end: var(--accordian-panel-mbe);
}

.accordion-trigger {
  display: block;
  width: 100%;
  padding: 1rem;
  background: var(--accordion-trigger-bg);
  border: none;
  text-align: left;
  cursor: pointer;
}

.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows ease-in-out 500ms;

  > div {
    overflow: hidden;
    /* transform: translateY(-1rem);
      transition: all ease-in-out 500ms;

      > p {
        padding-block: 0;
        transition: all ease-in-out 500ms;
      } */
  }
}

.accordion-content[aria-hidden='false'] {
  grid-template-rows: 1fr;

  /* > div {
      transform: translateY(0);
      > p {
        padding-block: 32px;
      }
    } */
}
</style>
