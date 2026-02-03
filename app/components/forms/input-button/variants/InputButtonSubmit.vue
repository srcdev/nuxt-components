<template>
  <InputButtonCore
    type="submit"
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
  />
</template>

<script setup lang="ts">
import type { BaseButtonProps } from "~/types/forms/types.forms"

defineProps<BaseButtonProps>()
</script>
