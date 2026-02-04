<template>
  <div class="toggle-switch-core" :class="elementClasses" :data-size="size" :data-theme="formTheme">
    <div @click="toggleSwitchValue" class="toggle-switch-input" :class="[{ round }]" :for="inputId">
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
      />
      <div class="symbol-wrapper" :class="[{ round }]">
        <div class="symbol" :class="[{ round }]">
          <div v-if="slots.iconOn" class="symbol-icon icon-on">
            <slot name="iconOn"></slot>
          </div>

          <div v-if="slots.iconOff" class="symbol-icon icon-off">
            <slot name="iconOff"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize } from "~/types/forms/types.forms";

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
    type: String as PropType<FormTheme>,
    default: "primary",
  },
  round: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<FormSize>,
    default: "default",
  },
  ariaDescribedby: {
    type: String,
    default: null,
  },
});

const slots = useSlots();

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const modelValue = defineModel();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const inputId = computed(() => `toggle-sitch-${props.id}`);

const toggleSwitchValue = () => {
  modelValue.value = modelValue.value === props.trueValue ? props.falseValue : props.trueValue;
};
</script>

<style lang="css">
.toggle-switch-core {
  --_transition-duration: 0.4s;

  .toggle-switch-label {
    display: block;
  }

  .toggle-switch-input {
    position: relative;
    display: inline-block;
    height: calc(
      var(--form-toggle-symbol-size) + calc(var(--form-element-border-width) * 2) +
        calc(var(--form-element-outline-width) * 2)
    );
    width: calc(
      var(--form-toggle-symbol-size) * 2 - calc(var(--form-element-border-width) * 2) +
        calc(var(--form-element-outline-width) * 2) + var(--form-toggle-switch-width-adjustment)
    );

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    input:checked {
      --_icon-on-opacity: 1;
      --_icon-off-opacity: 0;
    }

    .symbol-wrapper {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: clip;

      .symbol {
        display: grid;
        grid-template-areas: "icon-stack";
        overflow: clip;
        position: absolute;

        .symbol-icon {
          grid-area: icon-stack;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}

/*
* ToggleSwitch configurable
**/
.toggle-switch-core {
  .toggle-switch-input {
    &.round {
      border-radius: calc(var(--form-toggle-symbol-size) + calc(var(--form-element-border-width) * 2));
    }

    .symbol-wrapper {
      border: var(--theme-form-toggle-border);
      background-color: var(--theme-form-toggle-bg-off);
      outline: var(--theme-form-toggle-outline);
      transition: 0.4s;

      &.round {
        border-radius: var(--form-toggle-symbol-size);
      }
      .symbol {
        height: calc(var(--form-toggle-symbol-size) - 0.6rem);
        width: calc(var(--form-toggle-symbol-size) - 0.6rem);
        left: 0.4rem;
        bottom: 0.4rem;
        background-color: var(--theme-form-toggle-symbol-off);
        transition: var(--_transition-duration);

        &.round {
          border-radius: 50%;
        }

        .symbol-icon {
          transition: var(--_transition-duration);

          &.icon-on {
            color: var(--theme-form-toggle-icon-stroke-colour-on);
            opacity: 0;
          }
          &.icon-off {
            color: var(--theme-form-toggle-icon-stroke-colour-off);
            opacity: 1;
          }

          .icon {
            --_icon-size: var(--form-icon-size);
            height: var(--_icon-size);
            width: var(--_icon-size);
          }
        }
      }
    }

    input:focus-visible + .symbol-wrapper {
      box-shadow: var(--box-shadow-on);
      outline: var(--form-element-outline-width) solid hsl(from var(--theme-form-input-outline-focus) h s 90%);
    }

    input:checked + .symbol-wrapper .symbol {
      --_on-position: calc(var(--form-toggle-symbol-size) * 0.8);
      background-color: var(--theme-form-toggle-symbol-on);
      transform: translateX(var(--_on-position));

      .symbol-icon {
        &.icon-on {
          opacity: 1;
        }
        &.icon-off {
          opacity: 0;
        }
      }
    }
  }
}
</style>
