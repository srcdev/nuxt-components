<template>
  <component :is="tag" class="google-review-card" :class="elementClasses">
    <div class="google-review-card-author">
      <DisplayAvatar :src="review.authorPhotoUri" :text="initials" size="md" aria-hidden="true" />
      <a v-if="review.authorUri" :id="authorId" :href="review.authorUri" class="google-review-card-author-name">
        {{ review.authorName }}
      </a>
      <span v-else :id="authorId" class="google-review-card-author-name">{{ review.authorName }}</span>
      <time v-if="review.relativeTime" :datetime="review.publishTime || undefined" class="google-review-card-time">
        {{ review.relativeTime }}
      </time>
    </div>

    <div class="google-review-card-rating">
      <span class="google-review-card-stars" :style="{ '--_rating': review.rating }" aria-hidden="true">★★★★★</span>
      <span class="sr-only">{{ formattedRatingLabel }}</span>
    </div>

    <p v-if="review.text" class="google-review-card-text">{{ review.text }}</p>

    <a v-if="review.reviewUri" :href="review.reviewUri" :aria-describedby="authorId" class="google-review-card-link">
      {{ readMoreLabel }}
    </a>
  </component>
</template>

<script setup lang="ts">
import type { GoogleReview } from "~/types/components";

interface Props {
  review: GoogleReview;
  tag?: "article" | "div";
  ratingLabel?: string;
  readMoreLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "article",
  ratingLabel: "Rated {rating} out of 5",
  readMoreLabel: "Read on Google",
  styleClassPassthrough: () => [],
});

const authorId = useId();
const initials = computed(() =>
  props.review.authorName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0]!.toUpperCase())
    .join("")
);
const formattedRatingLabel = computed(() => props.ratingLabel.replace("{rating}", String(props.review.rating)));

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
  .google-review-card {
    display: grid;
    grid-template-rows: auto auto auto 1fr auto;
    align-items: start;
    block-size: 100%;
    padding: var(--google-reviews-card-padding, 2rem);
    border: var(--google-reviews-card-border-width, 1px) solid var(--google-reviews-card-border-colour, transparent);
    border-radius: var(--google-reviews-card-border-radius, 0.8rem);
    background-color: var(--google-reviews-card-surface, var(--theme-surface-subtle));
    color: var(--google-reviews-card-text-colour, var(--theme-text));

    /* Name and date take a row each so both line up across a GoogleReviews row */
    .google-review-card-author {
      grid-row: 1 / span 2;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      grid-template-rows: subgrid;
      align-items: start;
      column-gap: 1.2rem;
    }

    .google-review-card-author .display-avatar {
      --display-avatar-background: var(--google-reviews-avatar-surface, var(--theme-surface));
      --display-avatar-text-colour: var(--google-reviews-avatar-text-colour, var(--theme-on-surface));

      grid-column: 1;
      grid-row: 1 / -1;
    }

    .google-review-card-author-name {
      grid-column: 2;
      grid-row: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: var(--google-reviews-author-line-clamp, 2);
      line-clamp: var(--google-reviews-author-line-clamp, 2);
      font-weight: var(--google-reviews-author-font-weight, 600);
      color: inherit;
      overflow-wrap: anywhere;
    }

    .google-review-card-time {
      grid-column: 2;
      grid-row: 2;
      font-size: var(--google-reviews-meta-font-size, 1.4rem);
      color: var(--google-reviews-meta-text-colour, inherit);
    }

    .google-review-card-rating {
      grid-row: 3;
      margin-block-start: var(--google-reviews-card-gap, 1.2rem);
    }

    .google-review-card-stars {
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

    .google-review-card-text {
      grid-row: 4;
      margin-block-start: var(--google-reviews-card-gap, 1.2rem);
      margin-inline: 0;
      margin-block-end: 0;
      white-space: pre-line;
      overflow-wrap: anywhere;
      line-height: var(--google-reviews-text-line-height, 1.5);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: var(--google-reviews-text-line-clamp, 5);
      line-clamp: var(--google-reviews-text-line-clamp, 5);
    }

    .google-review-card-link {
      grid-row: 5;
      margin-block-start: var(--google-reviews-card-gap, 1.2rem);
      justify-self: start;
      color: var(--google-reviews-link-colour, inherit);
      font-size: var(--google-reviews-meta-font-size, 1.4rem);
    }
  }
}
</style>
