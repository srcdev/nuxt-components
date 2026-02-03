<template>
  <div class="toggle-switch-core" :class="elementClasses" :data-size="size" :data-theme="formTheme">
    <div
      @click="toggleSwitchValue"
      class="toggle-switch-wrapper"
      :class="[{ round }, { 'use-default-icons': useDefaultIcons }]"
      :for="inputId"
    >
      <input
        type="checkbox"
        v-model="modelValue"
        :true-value
        :false-value
        :aria-invalid="fieldHasError"
        :id="inputId"
        :aria-describedby="`${id}-description`"
        :name
        :required
        :checked="isChecked"
      />
      <div class="symbol-wrapper" :class="[{ round }]">
        <div class="symbol" :class="[{ round }, { checked: isChecked }]">
          <div class="symbol-icon icon-on" :class="{ active: isChecked }">
            <slot name="iconOn">
              <Icon name="material-symbols:circle-outline" class="icon" />
            </slot>
          </div>

          <div class="symbol-icon icon-off" :class="{ active: !isChecked }">
            <slot name="iconOff">
              <Icon name="material-symbols:circle-outline" class="icon" />
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value)
    },
  },
  round: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<string>,
    default: "default",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  ariaDescribedby: {
    type: String,
    default: null,
  },
})

const slots = useSlots()
const useDefaultIcons = computed(() => !slots.iconOn && !slots.iconOff)

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme
})

const modelValue = defineModel()
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const inputId = computed(() => `toggle-sitch-${props.id}`)

const isChecked = computed(() => {
  return modelValue.value === props.trueValue
})

const toggleSwitchValue = () => {
  modelValue.value = modelValue.value === props.trueValue ? props.falseValue : props.trueValue
}
</script>

<style lang="css">
.toggle-switch-core {
  .toggle-switch-label {
    display: block;
  }

  .toggle-switch-wrapper {
    display: flex;
    flex-direction: column;

    input {
      height: 0;
      width: 0;
      visibility: hidden;
    }

    .symbol-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: start;
      position: relative;
      transition: background-color var(--theme-form-transition-duration);

      &:hover {
        cursor: pointer;
      }

      .symbol {
        display: inline-grid;
        grid-template-areas: "icon";
        place-content: center;
        position: absolute;
        overflow: hidden;
        left: var(--_switch-padding);

        aspect-ratio: 1/1;

        &.checked {
          left: calc(100% - var(--_symbol-size) - var(--_switch-padding) - (2 * var(--_toggle-symbol-border-width)));
        }

        .symbol-icon {
          display: grid;
          grid-area: icon;
          place-content: center;
          opacity: 0;

          &.active {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
