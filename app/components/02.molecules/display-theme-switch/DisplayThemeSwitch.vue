<template>
  <ClientOnly>
    <TripleToggleSwitchCore
      v-model="colorModeVal"
      v-model:field-data="sampleFieldData"
      :style-class-passthrough="[`colour-scheme-select`, elementClasses]"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import type { IFormMultipleOptions } from "~/types/forms/types.forms";
interface Props {
  styleClassPassthrough?: string | string[];
  systemLabel?: string;
  lightLabel?: string;
  darkLabel?: string;
  systemIcon?: string;
  lightIcon?: string;
  darkIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
  systemLabel: "System",
  lightLabel: "Light",
  darkLabel: "Dark",
  systemIcon: "material-symbols:night-sight-auto-sharp",
  lightIcon: "radix-icons:sun",
  darkIcon: "radix-icons:moon",
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const sampleFieldData = computed<IFormMultipleOptions>(() => ({
  data: [
    {
      id: "system",
      name: "colorModeVal",
      value: "system",
      label: props.systemLabel,
      icon: props.systemIcon,
    },
    {
      id: "light",
      name: "colorModeVal",
      value: "light",
      label: props.lightLabel,
      icon: props.lightIcon,
    },
    {
      id: "dark",
      name: "colorModeVal",
      value: "dark",
      label: props.darkLabel,
      icon: props.darkIcon,
    },
  ],
  total: 3,
  skip: 0,
  limit: 3,
}));

const { colourScheme, setColourScheme } = useSettingsStore();

const colorModeVal = ref(colourScheme);
watch(colorModeVal, (val) => {
  setColourScheme(val);
});
</script>

<style lang="css">
@layer components {
.colour-scheme-select {
  /* Everything DisplayThemeSwitch used to redeclare here beyond sizing (wrapper background/border/
     focus ring, marker border, option border/outline/focus/hover, option-icon colours, and the
     system/light/dark marker gradients) was a byte-for-byte duplicate of TripleToggleSwitchCore's
     own defaults for the exact same selectors — a no-op at best, and for the ones that bypassed
     TripleToggleSwitchCore's public --triple-toggle-switch-* tokens with a hardcoded literal
     (background-color, border, focus outline, marker border, option border/hover/focus, icon
     colour) an active bug: a consumer setting e.g. --triple-toggle-switch-surface globally would
     have been silently overridden back to the hardcoded default by this block's higher
     specificity. Removed 2026-09-20 — TripleToggleSwitchCore already owns all of that. Only the
     genuine "small" sizing variant remains, now driving TripleToggleSwitchCore's own public
     sizing tokens instead of reaching into its private --_form-* and --_scheme-icon-font-size
     locals directly (see TripleToggleSwitchCore's CONSUMER-STYLING.md). */
  &.triple-toggle-switch {
    --triple-toggle-switch-gap: 0.4rem;
    --triple-toggle-switch-padding: 0.4rem;
    --triple-toggle-switch-option-padding: 0.4rem;
    --triple-toggle-switch-icon-size: 2rem;

    &.small {
      --triple-toggle-switch-gap: 0.2rem;
      --triple-toggle-switch-padding: 0.2rem;
      --triple-toggle-switch-option-padding: 0.2rem;
      --triple-toggle-switch-icon-size: 1.6rem;
    }
  }
}
}
</style>
