<template>
  <component :is="tag" class="content-columns-2" :class="[elementClasses]" :data-testid="dataTestid">
    <div class="inner">
      <div v-if="hasSlot1" class="col-1">
        <slot name="slot1"></slot>
      </div>
      <div v-if="hasSlot2" class="col-2">
        <slot name="slot2"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "main";
  dataTestid?: string;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  dataTestid: "content-columns-2",
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const hasSlot1 = computed(() => !!slots.slot1);
const hasSlot2 = computed(() => !!slots.slot2);

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .content-columns-2 {
    container-type: inline-size;
    container-name: contentColumns2;

    .inner {
      display: grid;
      grid-auto-flow: row;
      gap: 1.6rem;

      @container contentColumns2 (width >= 768px) {
        gap: 1.6rem;
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>
