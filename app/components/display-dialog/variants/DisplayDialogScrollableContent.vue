<template>
  <DisplayDialogCore variant="dialog" :styleClassPassthrough :lockViewport="true" :allowContentScroll :dataDialogId>
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
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  allowContentScroll: {
    type: Boolean,
    default: false,
  },
  dataDialogId: {
    type: String,
    required: true,
  },
})
</script>

<style lang="css">
.display-dialog-core {
  .inner {
    .header {
      /* background-color: aquamarine; */
    }
    .dialog-content {
      /* background-color: bisque; */
    }
    .footer {
      /* background-color: blueviolet; */
    }
  }
}
</style>
