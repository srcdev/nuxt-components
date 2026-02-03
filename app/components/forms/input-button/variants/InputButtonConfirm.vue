<template>
  <InputButtonCore
    type="button"
    :use-effect="useEffect"
    :is-pending="isPending"
    :readonly
    :effect
    :data-testid="dataTestid || undefined"
    :size
    :weight
    :button-text="buttonText"
    :style-class-passthrough="styleClassPassthrough"
    :theme
  >
    <template #left>
      <Icon name="material-symbols:check-circle-outline" class="icon" aria-hidden="true" focusable="false" />
    </template>
  </InputButtonCore>
</template>

<script setup lang="ts">
import type { BaseButtonProps } from "~/types/forms/types.forms"

defineProps<BaseButtonProps>()
</script>
