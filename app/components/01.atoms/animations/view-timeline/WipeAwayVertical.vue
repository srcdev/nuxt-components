<template>
  <component
    :is="tag"
    class="wipe-away-vertical"
    :class="[elementClasses]"
    :style="{ 'timeline-scope': timelineScope }"
  >
    <div class="leading-buffer" aria-hidden="true"></div>

    <section
      v-for="(item, key) in itemCount - 1"
      :key="key"
      class="scrolling-section"
      :style="{
        'grid-row': key + 2,
        'view-timeline-name': `--section-${timelineId}-${key}`,
      }"
    >
      <slot :name="`scrollingItem-${key}`"></slot>
    </section>

    <div class="trailing-buffer" aria-hidden="true" :style="{ 'grid-row': itemCount + 1 }"></div>

    <div class="sticky-items-container">
      <div
        v-for="(item, key) in itemCount"
        :key="key"
        class="sticky-item"
        :style="{
          'animation-timeline': key === itemCount - 1 ? 'none' : `--section-${timelineId}-${key}`,
          'z-index': itemCount - key,
        }"
      >
        <slot :name="`stickyItem-${key}`"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "main" | "article" | "aside";
  itemCount: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const timelineId = useId();

const timelineScope = computed(() =>
  Array.from({ length: props.itemCount }, (_, i) => `--section-${timelineId}-${i}`).join(", ")
);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .wipe-away-vertical {
    display: grid;
    grid-template-columns: 1fr;

    .scrolling-section {
      grid-column: 1;
    }

    .leading-buffer {
      grid-column: 1;
      grid-row: 1;
    }

    .trailing-buffer {
      grid-column: 1;
    }

    .sticky-items-container {
      grid-column: 1;
      grid-row: 1 / -1;
    }
  }

  @supports (animation-timeline: view()) {
    .wipe-away-vertical {
      /* gives entry timelines a full viewport of run-up so section 0 isn't already
         mid-"entry" the moment the page loads, whatever content precedes this component */
      .leading-buffer {
        height: 100vh;
      }

      /* the last item has no wipe animation of its own (nothing left to reveal), so it
         only needs a little room to release cleanly rather than a whole extra section */
      .trailing-buffer {
        height: var(--wipe-away-vertical-trailing-buffer, 20vh);
      }

      .scrolling-section {
        view-timeline-axis: block;
        /* sticky panel is vertically centred via the same calc() as its own top offset below,
           so the entry/exit range needs to be inset by the same fixed amount above and below */
        view-timeline-inset: calc((100vh - var(--wipe-away-vertical-height, 100vh)) / 2);
      }

      .sticky-items-container {
        position: sticky;
        /* a transform here (e.g. translateY(-50%)) would visually centre the panel, but
           position: sticky's stick/release threshold is computed from the untransformed
           layout position, so it would release the panel early by the transformed amount —
           compute the centring offset directly instead so nothing needs transforming */
        top: calc((100vh - var(--wipe-away-vertical-height, 100vh)) / 2);
        height: var(--wipe-away-vertical-height, 100vh);
      }

      .sticky-item {
        position: absolute;
        inset: 0;
        border-radius: var(--wipe-away-vertical-border-radius, 0.5rem);
        width: 100%;
      }
    }

    @keyframes wipe-out {
      0% {
        clip-path: inset(0 0 0% 0);
      }
      100% {
        clip-path: inset(0 0 100% 0);
      }
    }

    .sticky-item {
      animation: wipe-out var(--wipe-away-vertical-animation-duration, 1s) linear both;
      animation-range: entry 0% entry 100%;
    }
  }

  @supports not (animation-timeline: view()) {
    .wipe-away-vertical {
      display: block;

      .leading-buffer {
        display: none;
      }

      .trailing-buffer {
        display: none;
      }

      .scrolling-section {
        display: none;
      }

      .sticky-items-container {
        display: contents;
      }

      .sticky-item {
        width: 100%;
        border-radius: var(--wipe-away-vertical-border-radius, 0.5rem);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sticky-item {
      animation: none !important;
      clip-path: none !important;
    }
  }
}
</style>
