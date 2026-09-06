<template>
  <div class="canvas-switcher" :class="[elementClasses]">
    <ul class="canvas-switcher-list">
      <li v-for="option in canvasOptions" :key="option.value">
        <InputButtonCore
          type="button"
          variant="tertiary"
          class="canvas-switcher-button"
          :button-text="option.label"
          :aria-pressed="canvasName === option.value"
          @click="updateCanvas(option.value)"
        >
          <template #iconOnly>
            <Icon :name="option.icon" class="icon"></Icon>
          </template>
        </InputButtonCore>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { MediaCanvas } from "~/types/components";

interface CanvasOption {
  value: MediaCanvas;
  label: string;
  icon: string;
}

interface Props {
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
});

const canvasName = defineModel<MediaCanvas>("canvasName");

const canvasOptions: CanvasOption[] = [
  { value: "mobileCanvas", label: "Mobile", icon: "ic:baseline-phone-iphone" },
  { value: "tabletCanvas", label: "Tablet", icon: "ic:baseline-tablet-mac" },
  { value: "laptopCanvas", label: "Laptop", icon: "ic:baseline-laptop-mac" },
  { value: "desktopCanvas", label: "Desktop", icon: "ic:outline-desktop-mac" },
  { value: "fullWidthCanvas", label: "Full width", icon: "pixelarticons:viewport-wide" },
];

const updateCanvas = (setCanvas: MediaCanvas) => {
  canvasName.value = setCanvas;
};

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .canvas-switcher {
    display: flex;
    align-items: center;
    gap: var(--canvas-switcher-gap, 2rem);
  }

  .canvas-switcher-list {
    display: flex;
    align-items: center;
    gap: var(--canvas-switcher-item-gap, 1rem);
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .canvas-switcher-button.input-button-core {
    color: var(--canvas-switcher-icon-colour, light-dark(var(--slate-10), var(--slate-02)));

    &[aria-pressed="true"] {
      color: var(--canvas-switcher-icon-colour-current, light-dark(var(--green-10), var(--green-04)));
    }

    .icon {
      width: var(--canvas-switcher-icon-size, 2.4rem);
      height: var(--canvas-switcher-icon-size, 2.4rem);
    }
  }

  /* Canvas-size utility classes — applied by a consumer to a preview wrapper to constrain
     it to the width matching a MediaCanvas value. Not scoped to .canvas-switcher itself. */
  .mobileCanvas {
    max-width: 41.2rem;
  }
  .tabletCanvas {
    max-width: 76.8rem;
  }
  .laptopCanvas {
    max-width: 106.4rem;
  }
  .desktopCanvas {
    max-width: 128rem;
  }
  .fullWidthCanvas {
    max-width: unset;
  }
}
</style>
