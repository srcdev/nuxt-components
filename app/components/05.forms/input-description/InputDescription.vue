<template>
  <div
    v-if="showDescription"
    :id="descriptionId || undefined"
    class="input-description"
    :class="elementClasses"
    :data-input-variant="inputVariant"
    :data-invalid="fieldHasError ? '' : undefined"
  >
    <div v-if="slots.descriptionHtml" class="input-description-html">
      <slot name="descriptionHtml"></slot>
    </div>
    <p v-if="slots.descriptionText" class="input-description-text">
      <slot name="descriptionText"></slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  descriptionId?: string;
  fieldHasError?: boolean;
  inputVariant?: InputUiVariant;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  descriptionId: "",
  fieldHasError: false,
  inputVariant: "normal",
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const showDescription = computed(() => Boolean(slots.descriptionHtml || slots.descriptionText));

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .input-description {
    color: var(--input-description-color, inherit);
    background-color: var(--input-description-background-color, transparent);
    margin-block: var(--input-description-margin-block, 0);
    margin-inline: var(--input-description-margin-inline, 0);
    padding-block: var(--input-description-padding-block, 0);
    padding-inline: var(--input-description-padding-inline, 0);
    border: var(--input-description-border, 0);
    border-radius: var(--input-description-border-radius, 0);
    outline: var(--input-description-outline, 0);
    outline-offset: var(--input-description-outline-offset, 0);

    .input-description-html,
    .input-description-text {
      margin-block: var(--input-description-slot-margin-block-start, 0.4rem)
        var(--input-description-slot-margin-block-end, 0.8rem);
      margin-inline: var(--input-description-slot-margin-inline, 0);
    }

    .input-description-text {
      font-size: var(--input-description-font-size, var(--step-4));
      line-height: var(--input-description-line-height, var(--step-4));
    }
  }
}
</style>
