<template>
  <div v-if="showDescription" :id="descriptionId" class="input-description" :class="[elementClasses]">
    <div v-if="hasDescriptionHtml" class="input-description-html">
      <slot name="descriptionHtml"></slot>
    </div>
    <p v-if="hasDescriptionText" class="input-description-text">
      <slot name="descriptionText"></slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  id: string;
  descriptionId?: string;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  descriptionId: "",
  fieldHasError: false,
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
});

const slots = useSlots();
const hasDescriptionHtml = computed(() => slots.descriptionHtml);
const hasDescriptionText = computed(() => slots.descriptionText);
const showDescription = computed(() => hasDescriptionHtml.value || hasDescriptionText.value);

// const descriptionId = `${props.id}-description`;

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>
<style lang="css">
.input-description {
  .input-description-html {
    margin-block: 0.4rem 0.8rem;
  }
  .input-description-text {
    color: var(--form-description-color);
    font-size: var(--step-4);
    margin-block: 0.4rem 0.8rem;
    line-height: var(--step-4);
  }
}
</style>
