<template>
  <label
    :for="id"
    class="input-label"
    :class="elementClasses"
    :data-input-variant="inputVariant"
    :data-invalid="fieldHasError ? '' : undefined"
  >
    <slot name="htmlLabel"></slot>
    <slot name="textLabel"></slot>
    <span
      v-if="marker"
      class="input-label-indicator"
      :data-indicator="marker.type"
      :aria-hidden="marker.type === 'required' ? 'true' : undefined"
    >
      <template v-if="marker.icon">
        <Icon :name="marker.icon" class="input-label-indicator-icon" aria-hidden="true" />
        <span v-if="marker.type === 'optional'" class="sr-only">{{ marker.text }}</span>
      </template>
      <template v-else>{{ marker.text }}</template>
    </span>
  </label>
</template>

<script setup lang="ts">
import type { InputUiVariant, InputLabelIndicator } from "~/types/forms/types.forms";

interface Props {
  id: string;
  required?: boolean;
  indicator?: InputLabelIndicator;
  requiredText?: string;
  optionalText?: string;
  requiredIcon?: string;
  optionalIcon?: string;
  fieldHasError?: boolean;
  inputVariant?: InputUiVariant;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  indicator: undefined,
  requiredText: undefined,
  optionalText: undefined,
  requiredIcon: undefined,
  optionalIcon: undefined,
  fieldHasError: false,
  inputVariant: "normal",
  styleClassPassthrough: () => [],
});

const appConfig = useAppConfig();

const marker = computed(() => {
  const config = appConfig.srcdev?.inputLabel;
  const indicator = props.indicator ?? config?.indicator ?? "none";

  if (indicator === "required" && props.required) {
    return {
      type: "required",
      text: props.requiredText ?? config?.requiredText ?? "*",
      icon: props.requiredIcon ?? config?.requiredIcon,
    } as const;
  }
  if (indicator === "optional" && !props.required) {
    return {
      type: "optional",
      text: props.optionalText ?? config?.optionalText ?? "(optional)",
      icon: props.optionalIcon ?? config?.optionalIcon,
    } as const;
  }
  return null;
});

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
  .input-label {
    display: block;
    touch-action: manipulation;
    color: var(--input-label-color, inherit);
    font-size: var(--input-label-font-size, var(--step-5));
    font-weight: var(--input-label-font-weight, normal);
    line-height: var(--input-label-line-height, 1.5);
    margin-block: var(--input-label-margin-block, 0.8rem);
    margin-inline: var(--input-label-margin-inline, 0);

    .input-label-indicator {
      --_indicator-color: var(--input-label-indicator-color, inherit);
      --_indicator-font-size: var(--input-label-indicator-font-size, inherit);

      display: inline-flex;
      align-items: center;
      vertical-align: baseline;
      margin-inline-start: var(--input-label-indicator-gap, 0.4rem);
      color: var(--_indicator-color);
      font-size: var(--_indicator-font-size);
      font-weight: var(--input-label-indicator-font-weight, inherit);

      &[data-indicator="required"] {
        color: var(--input-label-indicator-color-required, var(--_indicator-color));
        font-size: var(--input-label-indicator-font-size-required, var(--_indicator-font-size));
      }

      &[data-indicator="optional"] {
        color: var(--input-label-indicator-color-optional, var(--_indicator-color));
        font-size: var(--input-label-indicator-font-size-optional, var(--_indicator-font-size));
      }
    }

    .input-label-indicator-icon {
      font-size: var(--input-label-indicator-icon-size, 1em);
    }
  }
}
</style>
