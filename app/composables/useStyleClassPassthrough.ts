export const useStyleClassPassthrough = (styleClassPassthrough: string | string[]) => {
  // Normalize initial value to an array
  const normalize = (input: string | string[]): string[] =>
    Array.isArray(input) ? input : input.split(/\s+/).filter(Boolean)

  const styleClassPassthroughRef = ref<string[]>(normalize(styleClassPassthrough))

  const elementClasses = computed(() => styleClassPassthroughRef.value.join(" "))

  const updateElementClasses = (cssClass: string | string[]) => {
    const cssClasses = Array.isArray(cssClass) ? cssClass : [cssClass]

    cssClasses.forEach((cls) => {
      if (styleClassPassthroughRef.value.includes(cls)) {
        styleClassPassthroughRef.value = styleClassPassthroughRef.value.filter((c) => c !== cls)
      } else {
        styleClassPassthroughRef.value.push(cls)
      }
    })
  }

  const resetElementClasses = (propsClasses: string | string[]) => {
    styleClassPassthroughRef.value = normalize(propsClasses)
  }

  return {
    elementClasses,
    updateElementClasses,
    resetElementClasses,
    styleClassPassthroughRef,
  }
}
