<template>
  <div
    class="input-otp"
    :class="[inputVariant, elementClasses]"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :role="groupLabel ? 'group' : undefined"
    :aria-label="groupLabel || undefined"
  >
    <template v-for="(digit, index) in digits" :key="index">
      <label class="sr-only" :for="boxId(index)">{{ boxLabel(index) }}</label>
      <input
        :id="boxId(index)"
        :ref="(el) => setInputRef(el, index)"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        :autocomplete="index === 0 ? 'one-time-code' : 'off'"
        class="input-otp-box"
        :required
        :value="digit"
        :aria-invalid="fieldHasError ? 'true' : undefined"
        :aria-describedby="ariaDescribedby || undefined"
        @input="onInput(index, $event)"
        @keydown="onKeydown(index, $event)"
        @paste="onPaste(index, $event)"
        @focus="onFocus"
      />
    </template>
    <input v-if="name" type="hidden" :name :value="modelValue" />
  </div>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name?: string;
  length?: number;
  autofocus?: boolean;
  required?: boolean;
  groupLabel?: string;
  digitLabel?: string;
  fieldHasError?: boolean;
  ariaDescribedby?: string;
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  name: "",
  length: 6,
  autofocus: false,
  required: false,
  groupLabel: "",
  digitLabel: "Digit {index} of {length}",
  fieldHasError: false,
  ariaDescribedby: "",
  theme: "default",
  inputVariant: "normal",
  styleClassPassthrough: () => [],
});

const emit = defineEmits<{ complete: [code: string] }>();

const modelValue = defineModel<string>({ required: true });

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const boxCount = computed(() => Math.min(12, Math.max(1, Math.floor(Number(props.length) || 1))));

const slotsFromModel = () =>
  (modelValue.value ?? "")
    .padEnd(boxCount.value, " ")
    .slice(0, boxCount.value)
    .split("")
    .map((char) => (/\d/.test(char) ? char : " "));

const digits = computed(() => slotsFromModel().map((char) => (char === " " ? "" : char)));

const boxId = (index: number) => `${props.id}-${index}`;
const boxLabel = (index: number) =>
  props.digitLabel.replace("{index}", String(index + 1)).replace("{length}", String(boxCount.value));

const inputRefs = ref<(HTMLInputElement | null)[]>([]);
const setInputRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  inputRefs.value[index] = el as HTMLInputElement | null;
};

const focusBox = (index: number) => {
  const clamped = Math.min(boxCount.value - 1, Math.max(0, index));
  inputRefs.value[clamped]?.focus();
};

onMounted(() => {
  if (props.autofocus) nextTick(() => focusBox(0));
});

watch(
  () => props.fieldHasError,
  (hasError) => {
    if (hasError) nextTick(() => focusBox(0));
  }
);

function commit(next: string[]) {
  const code = next.join("").trimEnd();
  modelValue.value = code;
  if (next.every((char) => char !== " ")) emit("complete", code);
}

function fillFrom(index: number, incoming: string) {
  const next = slotsFromModel();
  const chars = incoming.slice(0, boxCount.value - index).split("");
  chars.forEach((char, offset) => {
    next[index + offset] = char;
  });
  commit(next);
  return index + chars.length - 1;
}

function onInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement;
  const previous = digits.value[index];
  let entered = target.value.replace(/\D/g, "");

  if (previous && entered.length === 2) {
    if (entered.startsWith(previous)) entered = entered.slice(1);
    else if (entered.endsWith(previous)) entered = entered.slice(0, 1);
  }

  if (entered.length > 1) {
    const lastFilled = fillFrom(index, entered);
    target.value = digits.value[index] ?? "";
    focusBox(lastFilled);
    return;
  }

  target.value = entered;
  const next = slotsFromModel();
  next[index] = entered || " ";
  commit(next);

  if (entered && index < boxCount.value - 1) focusBox(index + 1);
}

function onKeydown(index: number, event: KeyboardEvent) {
  const target = event.target as HTMLInputElement;

  switch (event.key) {
    case "Enter":
      event.preventDefault();
      target.form?.requestSubmit();
      return;
    case "Backspace":
      if (!target.value && index > 0) {
        event.preventDefault();
        const next = slotsFromModel();
        next[index - 1] = " ";
        commit(next);
        focusBox(index - 1);
      }
      return;
    case "ArrowLeft":
      event.preventDefault();
      focusBox(index - 1);
      return;
    case "ArrowRight":
      event.preventDefault();
      focusBox(index + 1);
      return;
    case "Home":
      event.preventDefault();
      focusBox(0);
      return;
    case "End":
      event.preventDefault();
      focusBox(boxCount.value - 1);
      return;
  }
}

function onPaste(index: number, event: ClipboardEvent) {
  const pasted = (event.clipboardData?.getData("text") ?? "").replace(/\D/g, "");
  event.preventDefault();
  if (!pasted) return;

  const start = pasted.length >= boxCount.value ? 0 : index;
  focusBox(fillFrom(start, pasted));
}

function onFocus(event: FocusEvent) {
  (event.target as HTMLInputElement).select();
}
</script>

<style lang="css">
@layer components {
  .input-otp {
    --_border: var(--input-otp-border, var(--theme-border));
    --_border-focus: var(--input-otp-border-focus, var(--theme-border-focus));

    display: flex;
    gap: var(--input-otp-gap, 0.8rem);
    max-inline-size: 100%;

    .input-otp-box {
      all: unset;
      box-sizing: border-box;
      flex: 0 1 var(--input-otp-box-inline-size, 4.4rem);
      min-inline-size: 0;
      block-size: var(--input-otp-box-block-size, 5.2rem);
      text-align: center;
      font-family: var(--font-family);
      font-size: var(--input-otp-font-size, 2rem);
      color: var(--input-otp-text-color, var(--theme-input-text-color-normal));
      background-color: var(--input-otp-surface, var(--theme-input-surface));
      transition: outline-color var(--theme-form-transition-duration) ease-in-out;
    }

    &.normal .input-otp-box {
      border: var(--form-element-border-width) solid var(--_border);
      border-radius: var(--input-otp-border-radius, var(--form-input-border-radius));
      outline: var(--form-element-outline-width) solid transparent;

      &:hover {
        outline: var(--form-element-outline-width-focus) solid var(--input-otp-border-hover, var(--_border-focus));
        outline-offset: var(--form-element-outline-offset-focus);
      }

      &:focus-visible {
        outline: var(--form-element-outline-width-focus) solid var(--_border-focus);
        outline-offset: var(--form-element-outline-offset-focus);
      }
    }

    &.underlined .input-otp-box {
      border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--_border);

      &:focus-visible {
        border-bottom-color: var(--_border-focus);
      }
    }
  }
}
</style>
