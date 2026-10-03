---
name: GoogleReviews
description: GoogleReviews + GoogleReviewCard — Google Places reviews in a single scrolling row; server route, env vars, useGoogleReviews composable, props, slots, tokens, Google terms
type: reference
---

# GoogleReviews

## Overview

`GoogleReviews` (`03.organisms/google-reviews`) shows a place's Google reviews as a single
horizontally scrolling row of cards, with an overall rating summary, prev/next buttons and the
Google Maps attribution. It retrieves nothing itself: the layer's server route fetches the data
with a server-only API key, `useGoogleReviews()` reads that route, and the component displays
what it's given.

Google returns **at most 5 reviews** per place. Showing more needs the Business Profile API with
the owner signed in, which this doesn't support.

## Setup (consumer app)

1. In Google Cloud, enable **Places API (New)**, create an API key and restrict it to that API.
   The `reviews` field is billed at the Place Details Enterprise + Atmosphere rate; the route
   caches responses to limit calls.
2. Set env vars (server-only, never sent to the browser):

| Env var | Purpose |
|---|---|
| `NUXT_GOOGLE_REVIEWS_API_KEY` | Places API key (required) |
| `NUXT_GOOGLE_REVIEWS_PLACE_ID` | The business's place ID (required; find it with Google's Place ID Finder) |
| `NUXT_GOOGLE_REVIEWS_LANGUAGE_CODE` | Optional, e.g. `en-GB` |
| `NUXT_GOOGLE_REVIEWS_CACHE_MAX_AGE` | Seconds to cache the response, default `3600` |

3. Use it:

```vue
<script setup lang="ts">
const { data } = await useGoogleReviews();
</script>

<template>
  <GoogleReviews :data="data" />
</template>
```

The place ID is read only from server config, never from the request, so the route can't be used
to look up other places on your key. The layer adds `lh3.googleusercontent.com` (reviewer photos)
to `image.domains`.

## Server route and composable

- `GET /api/google-reviews` (`server/api/google-reviews.get.ts`) returns `GoogleReviewsData`,
  cached with Nitro's `defineCachedEventHandler` for `cacheMaxAge` seconds (stale-while-revalidate).
- Missing key or place ID: `500` whose message names the missing env var. Google request fails:
  `502`.
- `useGoogleReviews()` is `useFetch<GoogleReviewsData>("/api/google-reviews")`, so it returns
  `{ data, status, error, refresh }`. Use `status`/`error` for your own fallback; the component
  renders nothing without data.

```ts
import type { GoogleReviewsData, GoogleReview } from "srcdev-nuxt-components";

interface GoogleReview {
  authorName: string;
  authorUri?: string;
  authorPhotoUri?: string;
  rating: number;
  text: string;
  relativeTime: string; // "2 weeks ago", in the configured language
  publishTime: string; // ISO timestamp
  reviewUri?: string;
}

interface GoogleReviewsData {
  placeName: string;
  rating: number;
  totalReviews: number;
  mapsUri: string;
  reviews: GoogleReview[];
}
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `GoogleReviewsData \| null` | required | Usually `data` from `useGoogleReviews()` |
| `minRating` | `number` (0–5) | `0` | Hides lower-rated reviews and shows `filterNotice` |
| `showSummary` | `boolean` | `true` | Overall rating, stars and total count linked to the Maps listing |
| `tag` | `"section" \| "div"` | `"section"` | Root element |
| `ariaLabel` | `string` | `"Google reviews"` | Root label when there's no `heading` slot |
| `prevLabel` / `nextLabel` | `string` | `"Previous reviews"` / `"Next reviews"` | Button accessible names |
| `prevIcon` / `nextIcon` | `string` | `ic:outline-keyboard-arrow-left/right` | Button icons |
| `ratingLabel` | `string` | `"Rated {rating} out of 5"` | Screen-reader rating text |
| `totalLabel` | `string` | `"{count} reviews on Google"` | Summary link text |
| `readMoreLabel` | `string` | `"Read on Google"` | Per-card link text |
| `filterNotice` | `string` | `"Showing reviews rated {rating} stars and above, in Google's order."` | Shown when `minRating > 0` |
| `attributionText` | `string` | `"Reviews from Google Maps"` | Keep "Google Maps" when translating |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Classes on the root |

All copy props are there for localisation; pass translated strings. `{rating}` and `{count}` are
replaced.

## Slots

| Slot | Props | Notes |
|---|---|---|
| `heading` | `{ headingId }` | Heading above the summary. Bind `headingId` to it: the root is then labelled by the heading instead of `ariaLabel` |
| `card` | `{ review }` | Replaces each card. The list, scrolling and attribution stay. Keep the author attribution (name, photo, profile link) if you replace it |

## Behaviour

- Renders nothing when `data` is null or no reviews are left after filtering.
- The summary shows the overall rating (one decimal), stars, and the total count linked to the
  Google Maps listing.
- Each card shows the reviewer's avatar (photo, or initials), name linked to their Google profile,
  star rating, relative date, and the review text clamped to 5 lines, with a "Read on Google" link
  to the full review.
- The Google Maps attribution is always shown.
- Cards sit in a single row that never wraps and scrolls horizontally with snapping, by touch,
  trackpad or keyboard (the row is focusable; arrow keys scroll it, and tabbing to a link scrolls
  its card into view).
- Prev/next scroll by one card, are disabled (`aria-disabled`, still focusable) at either end, and
  are hidden when every card fits. Direction follows `dir="rtl"`.
- Card sections line up across the row (name, date, stars, text and link each share a row, via
  subgrid), even when one reviewer's name or date wraps further than the others.
- Smooth scrolling is turned off under `prefers-reduced-motion`.
- The root is a labelled region; reviews are a `ul`/`li` list. Stars are hidden from screen
  readers and replaced by `ratingLabel` text; the avatar is hidden too, since the name is read out.
  Each "Read on Google" link is described by its author's name.
- `minRating` hides lower-rated reviews and shows the filter notice; no notice without a filter.
- Survives hostile data (see the `StressTest` story): long and unbroken text wraps inside its card,
  reviewer names are cut to 2 lines (`--google-reviews-author-line-clamp`),
  initials take whole characters (emoji-safe), star fill is clamped to 0–5, review text renders as
  plain text. A broken photo URL still shows the browser's broken-image icon, since
  `DisplayAvatar` has no image-error fallback.

## Variants

### GoogleReviewCard

One review, used by `GoogleReviews` and usable on its own (e.g. in a custom layout via the `card`
slot).

| Prop | Type | Default |
|---|---|---|
| `review` | `GoogleReview` | required |
| `tag` | `"article" \| "div"` | `"article"` |
| `ratingLabel` | `string` | `"Rated {rating} out of 5"` |
| `readMoreLabel` | `string` | `"Read on Google"` |
| `styleClassPassthrough` | `string \| string[]` | `[]` |

```vue
<GoogleReviews :data="data">
  <template #card="{ review }">
    <GoogleReviewCard :review="review" tag="div" :style-class-passthrough="['my-review']" />
  </template>
</GoogleReviews>
```

## CSS custom properties

All `--google-reviews-*`, shared by both components. Full list with defaults in
`app/components/03.organisms/google-reviews/CONSUMER-STYLING.md`. Most used:

```css
.reviews-section {
  --google-reviews-card-width: min(28rem, 80%);
  --google-reviews-card-surface: var(--slate-01);
  --google-reviews-card-border-radius: 1.6rem;
  --google-reviews-star-colour: var(--amber-06);
  --google-reviews-text-line-clamp: 4;
  --google-reviews-author-line-clamp: 1;
  --google-reviews-scroll-padding: 1.6rem;
}
```

## Google's terms

- Credit each review's author: the name, photo and profile link are rendered by default; keep them
  if you use the `card` slot.
- Keep the Google Maps attribution visible and readable.
- Any filtering needs a visible notice describing it (`filterNotice`, shown automatically with
  `minRating`).
- Don't store review content long-term. The route's cache is short-lived; check Google's current
  Places API policies before raising `NUXT_GOOGLE_REVIEWS_CACHE_MAX_AGE` a lot.

## Notes

- Out of scope: more than 5 reviews, multiple places per site, sorting other than Google's
  relevance order, auto-advance, review structured data (Google doesn't give review rich results
  for a business's own reviews).
- Storybook can't reach the server route; stories use mock `GoogleReviewsData`.
