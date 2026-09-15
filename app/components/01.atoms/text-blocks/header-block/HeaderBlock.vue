<template>
  <component :is="tag" :id :class="[classLevelClass, elementClasses]">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  /** Semantic heading level — controls which <h1>-<h6> tag is rendered. */
  tagLevel?: HeadingLevel | `${HeadingLevel}`;
  /** Visual size level — controls which `.page-heading-N` utility class is applied. Independent of tagLevel, so a component can be, e.g., a semantic h2 styled at the page-heading-1 size. */
  classLevel?: HeadingLevel | `${HeadingLevel}`;
  /** Bind to a wrapping section's aria-labelledby target (e.g. the heading-id slot prop from PageRow/useAriaLabelledById). */
  id?: string | null;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tagLevel: 1,
  classLevel: 1,
  id: null,
  styleClassPassthrough: () => [],
});

const validLevels = [1, 2, 3, 4, 5, 6];

const tagLevel = computed(() => {
  const n = Number(props.tagLevel);
  return validLevels.includes(n) ? n : 1;
});

const classLevel = computed(() => {
  const n = Number(props.classLevel);
  return validLevels.includes(n) ? n : 1;
});

const tag = computed(() => `h${tagLevel.value}`);
const classLevelClass = computed(() => `page-heading-${classLevel.value}`);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  (newVal) => {
    resetElementClasses(newVal ?? []);
  }
);
</script>
