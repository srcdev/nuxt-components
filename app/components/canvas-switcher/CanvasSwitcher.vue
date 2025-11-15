<template>
  <div class="canvas-switcher">
    <p>Canvas switcher</p>
    <ul class="canvas-switcher mbe-20">
      <li>
        <button type="button" @click.stop.prevent="updateCanvas('mobileCanvas')">
          <Icon name="ic:baseline-phone-iphone" class="icon" :class="[{ current: canvasName === 'mobileCanvas' }]" />
        </button>
      </li>
      <li>
        <button type="button" @click.stop.prevent="updateCanvas('tabletCanvas')">
          <Icon name="ic:baseline-tablet-mac" class="icon" :class="[{ current: canvasName === 'tabletCanvas' }]" />
        </button>
      </li>
      <li>
        <button type="button" @click.stop.prevent="updateCanvas('laptopCanvas')">
          <Icon name="ic:baseline-laptop-mac" class="icon" :class="[{ current: canvasName === 'laptopCanvas' }]" />
        </button>
      </li>
      <li>
        <button type="button" @click.stop.prevent="updateCanvas('desktopCanvas')">
          <Icon name="ic:outline-desktop-mac" class="icon" :class="[{ current: canvasName === 'desktopCanvas' }]" />
        </button>
      </li>
      <li>
        <button type="button" @click.stop.prevent="updateCanvas('fullWidthCanvas')">
          <Icon
            name="pixelarticons:viewport-wide"
            class="icon"
            :class="[{ current: canvasName === 'fullWidthCanvas' }]"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export type MediaCanvas = "mobileCanvas" | "tabletCanvas" | "laptopCanvas" | "desktopCanvas" | "fullWidthCanvas"
</script>

<script setup lang="ts">
// import type { MediaCanvas } from "@/types"

const canvasName = defineModel<MediaCanvas>("canvasName")

const updateCanvas = (setCanvas: MediaCanvas) => {
  canvasName.value = setCanvas
}
</script>

<style lang="css">
.canvas-switcher {
  display: flex;
  align-items: center;
  gap: 20px;

  ul {
    display: flex;
    gap: 10px;
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      button {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        border: 0px solid light-dark(var(--gray-10), var(--gray-2));
        border-radius: 4px;
        cursor: pointer;

        .icon {
          color: light-dark(var(--gray-10), var(--gray-2));

          width: 24px;
          height: 24px;

          &.current {
            color: light-dark(var(--green-10), var(--green-4));
          }
        }
      }
    }
  }
}

.mobileCanvas {
  max-width: 412px;
}
.tabletCanvas {
  max-width: 768px;
}
.laptopCanvas {
  max-width: 1060px;
}
.desktopCanvas {
  max-width: 1280px;
}
.fullWidthCanvas {
  max-width: unset;
}
</style>
