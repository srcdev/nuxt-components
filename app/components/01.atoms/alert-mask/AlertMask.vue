<template>
  <div class="alert-mask" :class="elementClasses">
    <svg
      class="alert-mask-decorator"
      :style="{ '--_height': svgHeight + 'px' }"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask :id="maskId" maskUnits="userSpaceOnUse">
          <path :d="outerPath" fill="white" />
          <path :d="innerPath" fill="black" />
        </mask>
      </defs>

      <path
        class="alert-mask-border"
        :d="outerPath"
        :style="cfg.borderColour ? { fill: cfg.borderColour } : undefined"
        :mask="`url(#${maskId})`"
      />
      <path
        class="alert-mask-background"
        :d="innerPath"
        :style="cfg.backgroundColour ? { fill: cfg.backgroundColour } : undefined"
      />
    </svg>

    <div
      class="alert-mask-content"
      :style="{
        '--_inset-left': cfg.borderLeft + 'px',
        '--_inset-right': cfg.borderRight + 'px',
        '--_inset-top': cfg.borderTop + 'px',
        '--_inset-bottom': cfg.borderBottom + 'px',
      }"
    >
      <div ref="alertContentRef" class="alert-mask-content-slot">
        <slot name="default"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlertMaskConfig } from "~/types/components";

interface Props {
  config?: AlertMaskConfig;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({}),
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const maskId = `alert-mask-${useId()}`;
const alertContentRef = useTemplateRef<HTMLElement | null>("alertContentRef");
const contentWidth = ref(0);
const contentHeight = ref(0);
const measured = ref(false);
let resizeObserver: ResizeObserver | null = null;

const toSize = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallback;

const cfg = computed(() => ({
  backgroundColour: props.config?.backgroundColour,
  borderColour: props.config?.borderColour,
  radiusLeft: toSize(props.config?.radiusLeft, 12),
  radiusRight: toSize(props.config?.radiusRight, 12),
  borderLeft: toSize(props.config?.borderLeft, 8),
  borderTop: toSize(props.config?.borderTop, 8),
  borderRight: toSize(props.config?.borderRight, 8),
  borderBottom: toSize(props.config?.borderBottom, 8),
}));

const svgWidth = computed(() =>
  measured.value ? contentWidth.value + cfg.value.borderLeft + cfg.value.borderRight : 0
);
const svgHeight = computed(() =>
  measured.value ? contentHeight.value + cfg.value.borderTop + cfg.value.borderBottom : 0
);

const updateDimensions = () => {
  const contentEl = alertContentRef.value;
  if (!contentEl) return;
  const rect = contentEl.getBoundingClientRect();
  contentWidth.value = rect.width;
  contentHeight.value = rect.height;
  measured.value = true;
};

onMounted(() => {
  nextTick(updateDimensions);
  if (alertContentRef.value) {
    resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(alertContentRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

const outerPath = computed(() => {
  const width = svgWidth.value;
  const height = svgHeight.value;
  if (!width || !height) return "";

  const rl = Math.min(cfg.value.radiusLeft, width / 2, height / 2);
  const rr = Math.min(cfg.value.radiusRight, width / 2, height / 2);

  return `
    M ${rl} 0
    L ${width - rr} 0
    Q ${width} 0 ${width} ${rr}
    L ${width} ${height - rr}
    Q ${width} ${height} ${width - rr} ${height}
    L ${rl} ${height}
    Q 0 ${height} 0 ${height - rl}
    L 0 ${rl}
    Q 0 0 ${rl} 0 Z
  `;
});

const innerPath = computed(() => {
  const width = svgWidth.value;
  const height = svgHeight.value;
  const { borderLeft: bl, borderTop: bt, borderRight: br, borderBottom: bb } = cfg.value;
  const innerWidth = width - bl - br;
  const innerHeight = height - bt - bb;
  if (!width || !height || innerWidth <= 0 || innerHeight <= 0) return "";

  const rl = Math.min(cfg.value.radiusLeft, innerWidth / 2, innerHeight / 2);
  const rr = Math.min(cfg.value.radiusRight, innerWidth / 2, innerHeight / 2);
  const right = width - br;
  const bottom = height - bb;

  return `
    M ${bl + rl} ${bt}
    L ${right - rr} ${bt}
    Q ${right} ${bt} ${right} ${bt + rr}
    L ${right} ${bottom - rr}
    Q ${right} ${bottom} ${right - rr} ${bottom}
    L ${bl + rl} ${bottom}
    Q ${bl} ${bottom} ${bl} ${bottom - rl}
    L ${bl} ${bt + rl}
    Q ${bl} ${bt} ${bl + rl} ${bt} Z
  `;
});
</script>

<style lang="css">
@layer components {
  .alert-mask {
    display: grid;
    grid-template-areas: "mask";
    min-inline-size: 0;

    .alert-mask-decorator {
      grid-area: mask;
      width: 100%;
      height: var(--_height);

      .alert-mask-border {
        fill: var(--alert-mask-border-colour, var(--theme-accent));
      }

      .alert-mask-background {
        fill: var(--alert-mask-background-colour, color-mix(in oklab, var(--theme-surface-subtle) 80%, transparent));
      }
    }

    .alert-mask-content {
      grid-area: mask;
      min-inline-size: 0;
      margin: var(--_inset-top) var(--_inset-right) var(--_inset-bottom) var(--_inset-left);
    }
  }
}
</style>
