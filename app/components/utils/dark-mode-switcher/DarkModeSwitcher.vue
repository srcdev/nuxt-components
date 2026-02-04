<template>
  <ToggleSwitchWithLabelInline
    v-model="colourMode"
    :name
    :label
    labelWeight="normal"
    :size
    trueValue="dark"
    falseValue="light"
    :style-class-passthrough
  >
    <template #iconOn>
      <LazyIcon name="radix-icons:moon" class="icon" />
    </template>
    <template #iconOff>
      <LazyIcon name="radix-icons:sun" class="icon" />
    </template>
  </ToggleSwitchWithLabelInline>
</template>

<script setup lang="ts">
import type { FormSize, LabelWeight } from "~/types/forms/types.forms";

defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  labelWeight: {
    type: String as PropType<LabelWeight>,
    default: "semi-bold",
  },
  size: {
    type: String as PropType<FormSize>,
    default: "small",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
});

// const displayMode = ref<'auto' | 'dark' | 'light'>('auto');

const colourMode = ref<"light" | "dark" | "auto">("dark");

// const { currentColourScheme, setColourScheme } = useSettingsStore()

watch(colourMode, (newVal) => {
  // console.log("Colour mode changed:", newVal)
  // setColourScheme(newVal)
});
</script>
