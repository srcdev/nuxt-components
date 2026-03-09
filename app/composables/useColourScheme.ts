import { COLOUR_SCHEME_KEY, type ColourScheme, getValidScheme, applyColourScheme } from "~/utils/colour-scheme-init";

export const useColourScheme = () => {
  const config = useRuntimeConfig();
  const enabled = (config.public.colourScheme as { enabled?: boolean } | undefined)?.enabled ?? true;

  const currentColourScheme = ref<ColourScheme>("auto");

  if (!enabled) return { currentColourScheme };

  onMounted(() => {
    // DOM already has correct scheme applied by the head script,
    // this just syncs the reactive state to match
    currentColourScheme.value = getValidScheme(localStorage.getItem(COLOUR_SCHEME_KEY));
  });

  watch(currentColourScheme, (newVal) => {
    localStorage.setItem(COLOUR_SCHEME_KEY, newVal);
    applyColourScheme(newVal);
  });

  return { currentColourScheme };
};
