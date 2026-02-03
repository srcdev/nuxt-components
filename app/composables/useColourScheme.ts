export const useColourScheme = () => {
  const currentColourScheme = ref<'auto' | 'dark' | 'light' | null>(null);

  const returnSavedColourPreferenceFromLocalStorage = () => {
    if (import.meta.client) {
      return localStorage.getItem('colourScheme') as 'auto' | 'dark' | 'light' | null;
    }
  };

  onMounted(() => {
    currentColourScheme.value = returnSavedColourPreferenceFromLocalStorage() || 'auto';
  });

  watch(currentColourScheme, (newVal) => {
    if (import.meta.client && newVal !== null) {
      localStorage.setItem('colourScheme', newVal);
      document.documentElement.dataset.colorScheme = newVal;
      currentColourScheme.value = newVal;
    }
  });

  return {
    currentColourScheme,
  };
};
