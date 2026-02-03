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
import propValidators from "../../forms/c12/prop-validators"

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
    type: String as PropType<string>,
    default: "semi-bold",
    validator(value: string) {
      return propValidators.labelWeight.includes(value)
    },
  },
  size: {
    type: String as PropType<string>,
    default: "small",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

// const displayMode = ref<'auto' | 'dark' | 'light'>('auto');

const colourMode = ref<"light" | "dark" | "auto">("dark")

// const { currentColourScheme, setColourScheme } = useSettingsStore()

watch(colourMode, (newVal) => {
  // console.log("Colour mode changed:", newVal)
  // setColourScheme(newVal)
})
</script>
