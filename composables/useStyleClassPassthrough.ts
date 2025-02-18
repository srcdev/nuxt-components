export const useStyleClassPassthrough = (styleClassPassthrough: string[]) => {
  const styleClassPassthroughRef = ref(styleClassPassthrough);

  const elementClasses = computed(() => {
    return styleClassPassthroughRef.value.join(' ');
  });

  const updateElementClasses = (cssClass: string | string[]) => {
    let cssClasses = [] as string[];
    if (typeof cssClass === 'string') {
      cssClasses = [cssClass];
    } else if (Array.isArray(cssClass)) {
      cssClasses = cssClass;
    }

    cssClasses.forEach((cssClass) => {
      if (styleClassPassthroughRef.value.includes(cssClass)) {
        styleClassPassthroughRef.value = styleClassPassthroughRef.value.filter((className) => className !== cssClass);
      } else {
        styleClassPassthroughRef.value.push(cssClass);
      }
    });
  };

  const resetElementClasses = (propsClasses: string[]) => {
    styleClassPassthroughRef.value = propsClasses;
  };

  return {
    elementClasses,
    updateElementClasses,
    resetElementClasses,
    styleClassPassthroughRef,
  };
};
