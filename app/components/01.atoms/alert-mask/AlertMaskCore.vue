<template>
  <div class="alert-mask-core" :class="[elementClasses]">
    <svg class="alert-mask-decorator" :style="{ '--_height': svgHeight + 'px' }" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="borderMask" maskUnits="userSpaceOnUse">
          <path :d="outerPath" fill="white" />
          <path :d="innerPath" fill="black" />
        </mask>
      </defs>

      <path :d="outerPath" :fill="cfg.borderColour" mask="url(#borderMask)" vector-effect="non-scaling-stroke" />
      <path :d="innerPath" :fill="cfg.backgroundColour" />
    </svg>

    <div
      class="alert-mask-content"
      :style="{
        '--_inset-inline-start': (props.config?.borderLeft ?? 0) + 'px',
        '--_inset-inline-end': (props.config?.borderRight ?? 0) + 'px',
        '--_inset-block-start': (props.config?.borderTop ?? 0) + 'px',
        '--_inset-block-end': (props.config?.borderBottom ?? 0) + 'px',
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

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const alertContentRef = useTemplateRef<HTMLElement | null>("alertContentRef");
const svgWidth = ref(0);
const svgHeight = ref(0);

// Update dimensions based on content
onMounted(() => {
  const updateDimensions = () => {
    const contentEl = alertContentRef.value;
    if (!contentEl) return;

    const rect = contentEl.getBoundingClientRect();
    const { borderLeft, borderTop, borderRight, borderBottom } = cfg.value;

    // Calculate total dimensions including borders
    svgWidth.value = rect.width + borderLeft + borderRight;
    svgHeight.value = rect.height + borderTop + borderBottom;
  };

  // Initial measurement
  nextTick(updateDimensions);

  // Observe content changes
  const contentEl = alertContentRef.value;
  if (contentEl) {
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(contentEl);
  }
});

const cfg = computed(() => ({
  backgroundColour: props.config?.backgroundColour ?? "rgba(0,0,0,0.25)",
  borderColour: props.config?.borderColour ?? "var(--orange-08)",
  radiusLeft: props.config?.radiusLeft ?? 12,
  radiusRight: props.config?.radiusRight ?? 12,
  borderLeft: props.config?.borderLeft ?? 8,
  borderTop: props.config?.borderTop ?? 8,
  borderRight: props.config?.borderRight ?? 8,
  borderBottom: props.config?.borderBottom ?? 8,
}));

// Outer border path (fixed radii)
const outerPath = computed(() => {
  const width = svgWidth.value;
  const height = svgHeight.value;
  const { radiusLeft, radiusRight } = cfg.value;

  if (!width || !height) return "";

  return `
    M ${radiusLeft} 0
    L ${width - radiusRight} 0
    Q ${width} 0 ${width} ${radiusRight}
    L ${width} ${height - radiusRight}
    Q ${width} ${height} ${width - radiusRight} ${height}
    L ${radiusLeft} ${height}
    Q 0 ${height} 0 ${height - radiusLeft}
    L 0 ${radiusLeft}
    Q 0 0 ${radiusLeft} 0 Z
  `;
});

// Inner cutout (based on fixed pixel border thickness)
const innerPath = computed(() => {
  const width = svgWidth.value;
  const height = svgHeight.value;
  const { radiusLeft, radiusRight, borderLeft, borderTop, borderRight, borderBottom: borderBottom } = cfg.value;

  if (!width || !height) return "";

  return `
    M ${radiusLeft + borderLeft} ${borderTop}
    L ${width - radiusRight - borderRight} ${borderTop}
    Q ${width - borderRight} ${borderTop} ${width - borderRight} ${radiusRight + borderTop}
    L ${width - borderRight} ${height - radiusRight - borderBottom}
    Q ${width - borderRight} ${height - borderBottom} ${width - radiusRight - borderRight} ${height - borderBottom}
    L ${radiusLeft + borderLeft} ${height - borderBottom}
    Q ${borderLeft} ${height - borderBottom} ${borderLeft} ${height - radiusLeft - borderBottom}
    L ${borderLeft} ${radiusLeft + borderTop}
    Q ${borderLeft} ${borderTop} ${radiusLeft + borderLeft} ${borderTop} Z
  `;
});
</script>

<style lang="css">
@layer components {
.alert-mask-core {
  display: grid;
  grid-template-areas: "mask";

  .alert-mask-decorator {
    grid-area: mask;
    width: 100%;
    height: var(--_height);
  }

  .alert-mask-content {
    grid-area: mask;
    margin-block: var(--_inset-block-start) var(--_inset-block-end);
    margin-inline: var(--_inset-inline-start) var(--_inset-inline-end);
  }
}
}
</style>
