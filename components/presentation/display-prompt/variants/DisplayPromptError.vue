<template>
  <DisplayPromptCore variant="error" :dismissible icon-color="white" :style-class-passthrough>
    <template #icon>
      <Icon name="akar-icons:circle-alert" class="icon" />
    </template>
    <template #title>
      <slot name="title"></slot>
    </template>
    <template v-if="hasContent" #content>
      <slot name="content"></slot>
    </template>
  </DisplayPromptCore>
</template>

<script setup lang="ts">
const props = defineProps({
  dismissible: {
    type: Boolean,
    default: false,
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const slots = useSlots();
const hasContent = ref(slots.content !== undefined);
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.display-prompt.error {
  --bg-color: var(--red-2);
  --text-color: var(--gray-00);
}

.display-prompt {
  &.error {
    background-color: var(--bg-color);
  }

  &-icon {
    .icon {
      color: var(--text-color);
    }
  }

  &-content {
    color: var(--text-color);
  }
}
</style>
