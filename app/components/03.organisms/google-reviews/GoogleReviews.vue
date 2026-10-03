<template>
  <component
    :is="tag"
    v-if="filteredReviews.length"
    class="google-reviews"
    :class="elementClasses"
    :aria-labelledby="hasHeading() ? headingId : undefined"
    :aria-label="hasHeading() ? undefined : ariaLabel"
  >
    <div v-if="hasHeading() || showSummary" class="google-reviews-header">
      <slot name="heading" :heading-id="headingId"></slot>
      <div v-if="showSummary && data" class="google-reviews-summary">
        <span class="google-reviews-summary-rating" aria-hidden="true">{{ data.rating.toFixed(1) }}</span>
        <span class="google-reviews-stars" :style="{ '--_rating': data.rating }" aria-hidden="true">★★★★★</span>
        <span class="sr-only">{{ formatLabel(ratingLabel, data.rating.toFixed(1)) }}</span>
        <a v-if="data.mapsUri" :href="data.mapsUri" class="google-reviews-summary-link">
          {{ formatLabel(totalLabel, data.totalReviews) }}
        </a>
        <span v-else class="google-reviews-summary-link">{{ formatLabel(totalLabel, data.totalReviews) }}</span>
      </div>
    </div>

    <p v-if="minRating > 0" class="google-reviews-filter-notice">{{ formatLabel(filterNotice, minRating) }}</p>

    <ul ref="listRef" class="google-reviews-list" tabindex="0" @scroll.passive="updateScrollState">
      <li v-for="(review, index) in filteredReviews" :key="review.reviewUri ?? index" class="google-reviews-item">
        <slot name="card" :review="review">
          <GoogleReviewCard :review="review" :rating-label="ratingLabel" :read-more-label="readMoreLabel" />
        </slot>
      </li>
    </ul>

    <div class="google-reviews-footer">
      <div v-if="isOverflowing" class="google-reviews-controls">
        <InputButton
          variant="secondary"
          :button-text="prevLabel"
          :readonly="atStart"
          class="google-reviews-prev"
          @click="scrollByCard(-1)"
        >
          <template #iconOnly>
            <Icon :name="prevIcon" class="icon" />
          </template>
        </InputButton>
        <InputButton
          variant="secondary"
          :button-text="nextLabel"
          :readonly="atEnd"
          class="google-reviews-next"
          @click="scrollByCard(1)"
        >
          <template #iconOnly>
            <Icon :name="nextIcon" class="icon" />
          </template>
        </InputButton>
      </div>
      <p class="google-reviews-attribution">{{ attributionText }}</p>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { GoogleReviewsData } from "~/types/components";

interface Props {
  data: GoogleReviewsData | null;
  minRating?: number;
  showSummary?: boolean;
  tag?: "section" | "div";
  ariaLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  prevIcon?: string;
  nextIcon?: string;
  ratingLabel?: string;
  totalLabel?: string;
  readMoreLabel?: string;
  filterNotice?: string;
  attributionText?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  minRating: 0,
  showSummary: true,
  tag: "section",
  ariaLabel: "Google reviews",
  prevLabel: "Previous reviews",
  nextLabel: "Next reviews",
  prevIcon: "ic:outline-keyboard-arrow-left",
  nextIcon: "ic:outline-keyboard-arrow-right",
  ratingLabel: "Rated {rating} out of 5",
  totalLabel: "{count} reviews on Google",
  readMoreLabel: "Read on Google",
  filterNotice: "Showing reviews rated {rating} stars and above, in Google's order.",
  attributionText: "Reviews from Google Maps",
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const headingId = useId();
const hasHeading = () => Boolean(slots.heading);

const formatLabel = (label: string, value: string | number) =>
  label.replace("{rating}", String(value)).replace("{count}", String(value));

const filteredReviews = computed(() => (props.data?.reviews ?? []).filter((review) => review.rating >= props.minRating));

const listRef = ref<HTMLUListElement | null>(null);
const atStart = ref(true);
const atEnd = ref(true);
const isOverflowing = ref(false);

const updateScrollState = () => {
  const list = listRef.value;
  if (!list) return;
  const offset = Math.abs(list.scrollLeft);
  isOverflowing.value = list.scrollWidth > list.clientWidth + 1;
  atStart.value = offset <= 1;
  atEnd.value = offset + list.clientWidth >= list.scrollWidth - 1;
};

const scrollByCard = (direction: 1 | -1) => {
  const list = listRef.value;
  const item = list?.querySelector<HTMLElement>(".google-reviews-item");
  if (!list || !item) return;
  const styles = getComputedStyle(list);
  const step = item.offsetWidth + (parseFloat(styles.columnGap) || 0);
  const sign = styles.direction === "rtl" ? -1 : 1;
  list.scrollBy({ left: direction * step * sign });
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateScrollState();
  resizeObserver = new ResizeObserver(updateScrollState);
  if (listRef.value) resizeObserver.observe(listRef.value);
});

onBeforeUnmount(() => resizeObserver?.disconnect());

watch(filteredReviews, async () => {
  await nextTick();
  if (listRef.value) {
    resizeObserver?.disconnect();
    resizeObserver?.observe(listRef.value);
  }
  updateScrollState();
});

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
  .google-reviews {
    display: grid;
    gap: var(--google-reviews-gap, 1.6rem);
    min-inline-size: 0;

    .google-reviews-header {
      display: grid;
      gap: 0.8rem;
    }

    .google-reviews-summary {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.8rem;
    }

    .google-reviews-summary-rating {
      font-size: var(--google-reviews-summary-rating-font-size, 2.4rem);
      font-weight: 700;
    }

    .google-reviews-stars {
      --_fill: clamp(0%, var(--_rating, 0) / 5 * 100%, 100%);

      font-size: var(--google-reviews-star-size, 1.6rem);
      letter-spacing: 0.1em;
      background: linear-gradient(
        90deg,
        var(--google-reviews-star-colour, var(--amber-05)) var(--_fill),
        var(--google-reviews-star-empty-colour, var(--slate-03)) var(--_fill)
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .google-reviews-summary-link {
      color: inherit;
      overflow-wrap: anywhere;
    }

    .google-reviews-filter-notice,
    .google-reviews-attribution {
      margin: 0;
      overflow-wrap: anywhere;
      font-size: var(--google-reviews-meta-font-size, 1.4rem);
      color: var(--google-reviews-meta-text-colour, inherit);
    }

    .google-reviews-list {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: var(--google-reviews-card-width, min(32rem, 85%));
      grid-template-rows: repeat(5, auto);
      column-gap: var(--google-reviews-gap, 1.6rem);
      row-gap: 0;
      margin: 0;
      padding: 0 0 0.8rem;
      list-style: none;
      overflow-x: auto;
      overscroll-behavior-inline: contain;
      scrollbar-width: var(--google-reviews-scrollbar-width, thin);
      scrollbar-color: var(--google-reviews-scrollbar-thumb-colour, var(--slate-04))
        var(--google-reviews-scrollbar-track-colour, transparent);
      scroll-snap-type: inline mandatory;
      scroll-padding-inline: var(--google-reviews-scroll-padding, 0);
      scroll-behavior: smooth;

      &:focus-visible {
        outline: var(--google-reviews-focus-outline-width, 2px) solid var(--google-reviews-focus-outline-colour, var(--theme-border-focus));
        outline-offset: 2px;
      }

      @media (prefers-reduced-motion: reduce) {
        scroll-behavior: auto;
      }
    }

    /* Cards share the list's five rows (name, date, rating, text, link) so each section lines up across the row */
    .google-reviews-item {
      display: grid;
      grid-row: span 5;
      grid-template-rows: subgrid;
      scroll-snap-align: start;
      min-inline-size: 0;

      > * {
        grid-row: 1 / -1;
      }

      > .google-review-card {
        grid-template-rows: subgrid;
      }
    }

    .google-reviews-footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1.2rem;
    }

    .google-reviews-controls {
      display: flex;
      gap: 0.8rem;
    }
  }
}
</style>
