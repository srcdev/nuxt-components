<template>
  <div class="mask-element-wrapper" ref="wrapperRef">
    <svg class="mask-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="borderMask" maskUnits="userSpaceOnUse">
          <path :d="outerPath" fill="white" />
          <path :d="innerPath" fill="black" />
        </mask>
      </defs>

      <path :d="outerPath" :fill="cfg.color" mask="url(#borderMask)" vector-effect="non-scaling-stroke" />
      <path :d="innerPath" fill="rgba(0,0,0,0.5)" />
    </svg>

    <div
      class="svg-content"
      :style="{
        '--insetInlineStart': (props.config?.borderLeft ?? 0) + 'px',
        '--insetInlineEnd': (props.config?.borderRight ?? 0) + 'px',
        '--insetBlockStart': (props.config?.borderTop ?? 0) + 'px',
        '--insetBlockEnd': (props.config?.borderBottom ?? 0) + 'px',
      }"
    >
      <div class="alert-content-slot" ref="contentRef">
        <slot name="default"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BorderConfig {
  color?: string
  radiusLeft?: number
  radiusRight?: number
  borderLeft?: number
  borderTop?: number
  borderRight?: number
  borderBottom?: number
}

const props = defineProps<{
  config?: BorderConfig
}>()

const wrapperRef = useTemplateRef<HTMLElement | null>("wrapperRef")
const contentRef = useTemplateRef<HTMLElement | null>("contentRef")
const svgWidth = ref(0)
const svgHeight = ref(0)

// Update dimensions based on content
onMounted(() => {
  const updateDimensions = () => {
    const contentEl = contentRef.value
    if (!contentEl) return

    const rect = contentEl.getBoundingClientRect()
    const { borderLeft, borderTop, borderRight, borderBottom } = cfg.value

    // Calculate total dimensions including borders
    svgWidth.value = rect.width + borderLeft + borderRight
    svgHeight.value = rect.height + borderTop + borderBottom
  }

  // Initial measurement
  nextTick(updateDimensions)

  // Observe content changes
  const contentEl = contentRef.value
  if (contentEl) {
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(contentEl)
  }
})

const cfg = computed(() => ({
  color: props.config?.color ?? "var(--orange-8)",
  radiusLeft: props.config?.radiusLeft ?? 12,
  radiusRight: props.config?.radiusRight ?? 12,
  borderLeft: props.config?.borderLeft ?? 8,
  borderTop: props.config?.borderTop ?? 8,
  borderRight: props.config?.borderRight ?? 8,
  borderBottom: props.config?.borderBottom ?? 8,
}))

// Outer border path (fixed radii)
const outerPath = computed(() => {
  const width = svgWidth.value
  const height = svgHeight.value
  const { radiusLeft, radiusRight } = cfg.value

  if (!width || !height) return ""

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
  `
})

// Inner cutout (based on fixed pixel border thickness)
const innerPath = computed(() => {
  const width = svgWidth.value
  const height = svgHeight.value
  const { radiusLeft, radiusRight, borderLeft, borderTop, borderRight, borderBottom: borderBottom } = cfg.value

  if (!width || !height) return ""

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
  `
})
</script>

<style lang="css">
.mask-element-wrapper {
  display: grid;
  grid-template-areas: "mask";
  width: 700px;

  .mask-svg {
    grid-area: mask;
    width: 100%;
    /* height: 100%; */
    /* display: block; */
  }

  .svg-content {
    grid-area: mask;
    overflow: hidden;
    /* position: absolute; */
    /* z-index: 10; */
    margin-block: var(--insetBlockStart) var(--insetBlockEnd);
    margin-inline: var(--insetInlineStart) var(--insetInlineEnd);

    .alert-content-slot {
      /* width: 100%; */
      /* height: 100%; */
      /* box-sizing: border-box; */
    }
  }
}
</style>
