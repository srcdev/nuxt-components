<template>
  <DisplayDialogCore :styleClassPassthrough :lockViewport="true">
    <template #dialogTitle>
      <slot name="dialogTitle">
        <p class="text-normal wght-700">Confirm</p>
      </slot>
    </template>
    <template #dialogContent>
      <slot name="dialogContent"></slot>
    </template>
    <template #actionButtons>
      <slot name="actionButtonLeft"></slot>
      <slot name="actionButtonRight"></slot>
    </template>
  </DisplayDialogCore>
</template>

<script setup lang="ts">
const props = defineProps({
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});
</script>

<style lang="css">
.display-dialog {
  &.content-width {
    .inner {
      width: initial;

      .button-row {
        display: grid;
        gap: 1.2rem;
        grid-template-columns: 1fr 1fr;
      }
    }
  }
}
</style>
