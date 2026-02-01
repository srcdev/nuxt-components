<template>
  <div class="colour-scheme-select" :data-size="size" :data-theme="theme">
    <form class="colour-scheme-select-form mbe-20" ref="colourSchemeWrapper">
      <div class="select-scheme-marker-wrapper">
        <div class="select-scheme-marker" :class="[{ show: showMarker }]"></div>
      </div>
      <div class="select-scheme-group-wrapper">
        <div class="select-scheme-group">
          <LazyIcon name="material-symbols:night-sight-auto-sharp" class="scheme-icon" />
          <input type="radio" id="auto" name="colour-scheme" class="scheme-input" v-model="colourMode" value="auto" />
          <label for="auto" class="sr-only">{{ labels.auto }}</label>
        </div>
        <div class="select-scheme-group">
          <LazyIcon name="radix-icons:sun" class="scheme-icon" />
          <input type="radio" id="light" name="colour-scheme" class="scheme-input" v-model="colourMode" value="light" />
          <label for="light" class="sr-only">{{ labels.light }}</label>
        </div>
        <div class="select-scheme-group">
          <LazyIcon name="radix-icons:moon" class="scheme-icon" />
          <input type="radio" id="dark" name="colour-scheme" class="scheme-input" v-model="colourMode" value="dark" />
          <label for="dark" class="sr-only">{{ labels.dark }}</label>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import propValidators from "../../forms/c12/prop-validators"

const props = defineProps({
  name: {
    type: String,
    defaul: "colour-scheme-select",
  },
  labels: {
    type: Object as PropType<{ [key: string]: string }>,
    default: () => ({
      auto: "Auto",
      light: "Light",
      dark: "Dark",
    }),
  },
  size: {
    type: String as PropType<string>,
    default: "medium",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value)
    },
  },
  stepAnimationDuration: {
    type: Number as PropType<number>,
    default: 100,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const duration = ref(props.stepAnimationDuration)

const colourMode = ref<"light" | "dark" | "auto">("dark")
const { setColourScheme } = useSettingsStore()

const colourSchemeWrapper = ref<HTMLFormElement | null>(null)
const colourSchemeGroupElements = ref<HTMLDivElement[]>([])
const colourSchemeInputElements = ref<HTMLInputElement[]>([])
const showMarker = ref(false)

const findIndexOfInputValueFromCurrentColourScheme = () => {
  if (colourMode.value === "auto") return 1
  if (colourMode.value === "light") return 2
  if (colourMode.value === "dark") return 3
  return undefined
}

const findIndexOfCheckedInput = () => {
  return colourSchemeInputElements.value.findIndex((input) => input.checked)
}

const currentActiveIndex = ref(findIndexOfCheckedInput())

const setColourSchemeAttr = async () => {
  const index = findIndexOfInputValueFromCurrentColourScheme() ?? 0

  await nextTick()
  currentActiveIndex.value = findIndexOfCheckedInput()

  const wrapperLeftPosition = colourSchemeWrapper.value?.getBoundingClientRect().left ?? 0
  const parentLeftPosition = colourSchemeWrapper.value?.parentElement?.getBoundingClientRect().left ?? 0
  const relativeLeftPosition = wrapperLeftPosition - parentLeftPosition

  colourSchemeWrapper.value?.style.setProperty(
    "--_select-scheme-marker-step-animation-duration",
    colourSchemeGroupElements.value?.length * duration.value + "ms"
  )

  colourSchemeWrapper.value?.style.setProperty(
    "--_select-scheme-marker-position",
    index !== undefined ? index.toString() : "0"
  )
  const leftOffset = (colourSchemeGroupElements.value?.[index - 1]?.offsetLeft ?? 0) - relativeLeftPosition
  colourSchemeWrapper.value?.style.setProperty("--_select-scheme-marker-left-offset", leftOffset + "px")
  colourSchemeWrapper.value?.style.setProperty(
    "--_select-scheme-marker-width",
    colourSchemeGroupElements.value?.[index - 1]?.getBoundingClientRect().width + "px"
  )
}

const handleInputActiveClass = () => {
  colourSchemeInputElements.value.forEach((element) => {
    element.classList.remove("active")
  })

  setTimeout(() => {
    const activeElement = colourSchemeInputElements.value?.[currentActiveIndex.value]
    if (activeElement) {
      activeElement.classList.add("active")
    }
  }, duration.value)
}

onMounted(() => {
  colourSchemeGroupElements.value = Array.from(
    colourSchemeWrapper.value?.querySelectorAll(".select-scheme-group") || []
  ) as HTMLInputElement[]
  colourSchemeInputElements.value = Array.from(
    colourSchemeWrapper.value?.querySelectorAll(".scheme-input") || []
  ) as HTMLInputElement[]

  if (colourSchemeWrapper.value !== null) {
    setColourSchemeAttr()
    setTimeout(() => {
      showMarker.value = true
      handleInputActiveClass()
    }, duration.value)
  }
})

watch(colourMode, (newVal) => {
  console.log("Colour mode changed:", newVal)
  setColourScheme(newVal)
})

watch(currentActiveIndex, () => {
  handleInputActiveClass()
})
</script>

<style lang="css">
.colour-scheme-select {
  --_form-background-color: var(--theme-form-checkbox-bg);
  --_form-border-width: 0.1rem;
  --_form-border-colour: var(--theme-form-radio-border);
  --_form-outline-width: 0.1rem;

  --_form-outline-colour: var(--theme-form-radio-outline);

  --_form-border-radius: calc(
    (var(--_scheme-icon-font-size) / 2) + var(--_form-border-width) + var(--_form-outline-width) + var(--_form-padding) +
      var(--_select-scheme-group-padding) + var(--_select-scheme-group-border-width) +
      var(--_select-scheme-group-outline-width)
  );

  --_form-items-gap: 1rem;
  --_form-padding: 0.6rem;

  --_select-scheme-group-background-color: var(--theme-form-checkbox-bg);
  --_select-scheme-group-padding: 0.5rem;
  --_select-scheme-group-border-width: 0.2rem;
  --_select-scheme-group-border-colour: transparent;
  --_select-scheme-group-outline-width: 0.2rem;
  --_select-scheme-group-outline-colour: transparent;
  --_select-scheme-group-width: calc(
    var(--_scheme-icon-font-size) + (var(--_select-scheme-group-padding) * 2) +
      (var(--_select-scheme-group-border-width) * 2) + (var(--_select-scheme-group-outline-width) * 2)
  );

  --_scheme-icon-font-size: 2rem;
  --_scheme-icon-colour: black;

  .colour-scheme-select-form {
    display: inline-grid;
    grid-template-areas: "select-stack";
    width: fit-content;

    background-color: var(--_form-background-color);
    border: var(--_form-border-width) solid var(--_form-border-colour);
    outline: var(--_form-outline-width) solid var(--_form-outline-colour);
    border-radius: var(--_form-border-radius);
    padding: var(--_form-padding);

    .select-scheme-marker-wrapper {
      grid-area: select-stack;
      z-index: 1;
      display: flex;
      align-items: center;
      position: relative;

      .select-scheme-marker {
        aspect-ratio: 1;
        width: var(--_select-scheme-group-width);
        transition: all var(--_select-scheme-marker-step-animation-duration) ease-in-out;
        background-color: var(--theme-form-radio-border);
        border-radius: 50%;

        position: absolute;
        left: calc(var(--_select-scheme-marker-left-offset) - var(--_select-scheme-group-border-width));

        opacity: 0;

        &.show {
          opacity: 1;
        }
      }
    }

    .select-scheme-group-wrapper {
      display: grid;
      grid-area: select-stack;
      grid-template-columns: repeat(3, 1fr);
      align-items: center;
      width: fit-content;
      z-index: 2;
      gap: var(--_form-items-gap);
      position: relative;

      .select-scheme-group {
        aspect-ratio: 1;
        display: grid;
        grid-template-areas: "icon-stack";
        place-content: center;
        background: var(--_select-scheme-group-background-color);
        border: var(--_select-scheme-group-border-width) solid var(--_select-scheme-group-border-colour);
        outline: var(--_select-scheme-group-outline-width) solid var(--_select-scheme-group-outline-colour);
        border-radius: 50%;
        padding: var(--_select-scheme-group-padding);

        transition: background calc(var(--_select-scheme-marker-step-animation-duration) / 3);

        .scheme-icon {
          grid-area: icon-stack;
          display: block;
          color: var(--_scheme-icon-colour);
          font-size: var(--_scheme-icon-font-size);

          &:hover {
            cursor: pointer;
          }
        }

        .scheme-input {
          grid-area: icon-stack;
          opacity: 0;

          &:hover {
            cursor: pointer;
          }
        }

        &:has(input[value="auto"]) {
          &:has(.active) {
            --_select-scheme-group-background-color: green;
            --_scheme-icon-colour: white;
          }
        }

        &:has(input[value="light"]) {
          &:has(.active) {
            /* background: rgb(180, 58, 91);
            background: linear-gradient(90deg, rgba(180, 58, 91, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%); */
            --_select-scheme-group-background-color: radial-gradient(
              circle,
              rgba(180, 58, 91, 1) 0%,
              rgba(253, 29, 29, 1) 27%,
              rgba(252, 176, 69, 1) 100%
            );
            /* --_select-scheme-group-background-color: radial-gradient(circle, rgba(63, 94, 251, 1) 70%, rgba(63, 94, 251, 0.5550814075630253) 90%, rgba(255, 255, 255, 0.42622986694677867) 100%); */

            --_scheme-icon-colour: white;
          }
        }

        &:has(input[value="dark"]) {
          &:has(.active) {
            --_select-scheme-group-background-color: black;
            --_scheme-icon-colour: white;
          }
        }
      }
    }
  }
}
</style>
