<template>
  <ClientOnly>
    <SegmentedControl
      v-model="colorModeVal"
      v-model:field-data="sampleFieldData"
      :aria-label="ariaLabel"
      :style-class-passthrough="[`colour-scheme-select`, elementClasses]"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import type { IFormMultipleOptions } from "~/types/forms/types.forms";
interface Props {
  styleClassPassthrough?: string | string[];
  ariaLabel?: string;
  systemLabel?: string;
  lightLabel?: string;
  darkLabel?: string;
  systemIcon?: string;
  lightIcon?: string;
  darkIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
  ariaLabel: "Colour scheme",
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
     system/light/dark marker gradients) was a byte-for-byte duplicate of SegmentedControl's
     own defaults for the exact same selectors — a no-op at best, and for the ones that bypassed
     SegmentedControl's public --segmented-control-* tokens with a hardcoded literal
     (background-color, border, focus outline, marker border, option border/hover/focus, icon
     colour) an active bug: a consumer setting e.g. --segmented-control-surface globally would
     have been silently overridden back to the hardcoded default by this block's higher
     specificity. Removed 2026-09-20 — SegmentedControl already owns all of that. Only the
     genuine "small" sizing variant remains, now driving SegmentedControl's own public
     sizing tokens instead of reaching into its private --_form-* and --_scheme-icon-font-size
     locals directly (see SegmentedControl's CONSUMER-STYLING.md). */
  &.segmented-control {
    --segmented-control-gap: 0.4rem;
    --segmented-control-padding: 0.4rem;
    --segmented-control-option-padding: 0.4rem;
    --segmented-control-icon-size: 2rem;

    &.small {
      --segmented-control-gap: 0.2rem;
      --segmented-control-padding: 0.2rem;
      --segmented-control-option-padding: 0.2rem;
      --segmented-control-icon-size: 1.6rem;
    }
  }
}
}
</style>
