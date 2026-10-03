# GoogleReviews — Consumer Styling Guide

`GoogleReviews` shows a place's Google reviews as a single horizontally scrolling row of
`GoogleReviewCard`s, with a summary above and prev/next buttons plus the Google Maps attribution
below. Both components read the same `--google-reviews-*` tokens, so setting them on an ancestor
styles a standalone `GoogleReviewCard` too.

## Public token API

### Row (`GoogleReviews`)

| Token | Default | Controls |
|---|---|---|
| `--google-reviews-gap` | `1.6rem` | Space between header, row and footer, and between cards |
| `--google-reviews-card-width` | `min(32rem, 85%)` | Width of each card in the row |
| `--google-reviews-scroll-padding` | `0` | Snap inset, e.g. to line cards up with a page gutter |
| `--google-reviews-scrollbar-width` | `thin` | Row scrollbar: `auto`, `thin` or `none` (`none` hides it; the buttons and touch/keyboard scrolling still work) |
| `--google-reviews-scrollbar-thumb-colour` | `var(--slate-04)` | Scrollbar thumb |
| `--google-reviews-scrollbar-track-colour` | `transparent` | Scrollbar track |
| `--google-reviews-summary-rating-font-size` | `2.4rem` | Overall rating number |
| `--google-reviews-focus-outline-width` | `2px` | Focus ring on the scrollable row |
| `--google-reviews-focus-outline-colour` | `var(--theme-border-focus)` | Focus ring colour |

### Card (`GoogleReviewCard`)

| Token | Default | Controls |
|---|---|---|
| `--google-reviews-card-gap` | `1.2rem` | Space between author, stars, text and link |
| `--google-reviews-card-padding` | `2rem` | Card padding |
| `--google-reviews-card-border-width` | `1px` | Card border width |
| `--google-reviews-card-border-colour` | `transparent` | Card border colour |
| `--google-reviews-card-border-radius` | `0.8rem` | Card corner radius |
| `--google-reviews-card-surface` | `var(--theme-surface-subtle)` | Card background |
| `--google-reviews-card-text-colour` | `var(--theme-text)` | Card text colour |
| `--google-reviews-avatar-surface` | `var(--theme-surface)` | Initials avatar background (shown when a reviewer has no photo) |
| `--google-reviews-avatar-text-colour` | `var(--theme-on-surface)` | Initials colour |
| `--google-reviews-author-font-weight` | `600` | Reviewer name weight |
| `--google-reviews-author-line-clamp` | `2` | Lines of reviewer name before it's cut off with an ellipsis (`1` for single-line ellipsis, `none` to show it all) |
| `--google-reviews-text-line-height` | `1.5` | Review text line height |
| `--google-reviews-text-line-clamp` | `5` | Lines of review text before it's cut off with an ellipsis (`none` to show it all) |
| `--google-reviews-link-colour` | `inherit` | "Read on Google" link colour |

### Shared

| Token | Default | Controls |
|---|---|---|
| `--google-reviews-star-size` | `1.6rem` | Star font size (summary and cards) |
| `--google-reviews-star-colour` | `var(--amber-05)` | Filled star colour |
| `--google-reviews-star-empty-colour` | `var(--slate-03)` | Unfilled star colour |
| `--google-reviews-meta-font-size` | `1.4rem` | Date, link, filter notice and attribution |
| `--google-reviews-meta-text-colour` | `inherit` | Colour of the same |

Private tokens (not public API): `--_rating` (set inline from the review's rating) and `--_fill`
(the star fill percentage derived from it).

## State hooks

- No `data-*` state. The prev/next buttons are `InputButton`s with `readonly`/`aria-disabled` at
  either end of the row, styled by `InputButton`'s own tokens.
- Inner classes: `.google-reviews-header`, `.google-reviews-summary`,
  `.google-reviews-summary-rating`, `.google-reviews-stars`, `.google-reviews-summary-link`,
  `.google-reviews-filter-notice`, `.google-reviews-list`, `.google-reviews-item`,
  `.google-reviews-footer`, `.google-reviews-controls`, `.google-reviews-prev`,
  `.google-reviews-next`, `.google-reviews-attribution`.
- Card classes: `.google-review-card`, `.google-review-card-author`,
  `.google-review-card-author-name`,
  `.google-review-card-time`, `.google-review-card-rating`, `.google-review-card-stars`,
  `.google-review-card-text`, `.google-review-card-link`.

## Row alignment

Inside `GoogleReviews`, every card spans the list's five shared rows (name, date, rating, text,
link) through `grid-template-rows: subgrid`, so each section lines up across the whole row
however tall its neighbours are: a one-line name's date sits level with a two-line name's. The
author block is itself a subgrid over the name and date rows, with the avatar spanning both.
Sections sit in fixed rows, so a card with no date, text or link leaves the gap rather than
shifting up. Spacing between sections is a top margin (`--google-reviews-card-gap`), not a grid
gap, so the name and date stay close together. A standalone `GoogleReviewCard` uses
`auto auto auto 1fr auto` instead (link pinned to the bottom). Content from the `card` slot
spans all five rows as one block. Browsers
without subgrid fall back to equal-height cards that aren't aligned section by section.

## Stars

Stars are the text `★★★★★` filled with a hard-stop gradient clipped to the text, so fractional
ratings (4.6) show a partly filled star. They're `aria-hidden`; the rating is read out from
visually hidden text (`ratingLabel`).

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** the card re-declares `--display-avatar-background` and `--display-avatar-text-colour` on its
avatar, so setting those `DisplayAvatar` tokens on an ancestor has no effect here. Use
`--google-reviews-avatar-surface` and `--google-reviews-avatar-text-colour` instead.

## Class passthrough

`style-class-passthrough` adds classes to the root (`.google-reviews` or `.google-review-card`).
`GoogleReviews` doesn't forward it to the cards it renders; set tokens on the root instead, or
use the `card` slot to render `GoogleReviewCard` yourself with its own passthrough.

## Notes

Google's terms require the attribution text to stay visible and readable. Restyle it, but don't
hide it, and keep the words "Google Maps" in `attributionText` when translating.
