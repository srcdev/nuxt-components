---
name: PaginationNav
description: PaginationNav page window with v-model:page buttons or page-href links, sliding background or underline marker, auto compact layout, CSS token API
type: reference
---

# PaginationNav Component

## Overview

`PaginationNav` (`02.molecules/navigation/pagination-nav`) is page navigation for a paged list: Previous
and Next arrows, a window of page numbers with ellipses, optional First and Last, and an optional marker
that slides between pages. It works as buttons that update `v-model:page` (app-style lists), or as real
links via `page-href` (crawlable listing pages such as a blog or news index). It only reports the page;
fetching the data is the consumer's job.

## Props

> Hyphenate props in templates (`:show-edges`, `:page-href`, `:hide-when-single-page`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `v-model:page` | `number` | `1` | Current page. Display clamps it to `1..total`; the model itself is never rewritten |
| `total` | `number` | **required** | Page count, floored. Below 1 renders nothing |
| `siblings` | `number` | `1` | Pages either side of the current one |
| `boundaries` | `number` | `1` | Pages always shown at each end |
| `showEdges` | `boolean` | `false` | Adds First and Last controls |
| `pageHref` | `(page: number) => string` | — | Link mode: every item links to `pageHref(n)` (`NuxtLink` for a leading `/`, `<a>` otherwise) |
| `hideWhenSinglePage` | `boolean` | `false` | Renders nothing when `total` is 1 |
| `marker` | `"none" \| "background" \| "underline"` | `"none"` | `none` fills the current page in place; `background` slides that fill; `underline` slides a bar |
| `layout` | `"auto" \| "full" \| "compact"` | `"auto"` | `auto` shows compact (arrows plus summary) only when the full row doesn't fit |
| `ariaLabel` | `string` | `"Pagination"` | Name of the `nav` landmark |
| `previousLabel` / `nextLabel` | `string` | `"Previous page"` / `"Next page"` | Accessible names of the arrows |
| `firstLabel` / `lastLabel` | `string` | `"First page"` / `"Last page"` | Accessible names of First and Last |
| `pageLabel` | `string` | `"Page {page}"` | Accessible name of each number |
| `summaryLabel` | `string` | `"Page {page} of {total}"` | Visible text in the compact layout |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Classes on the root `nav`. Reactive after mount |

Blank label strings fall back to the English defaults, so no control is ever left unnamed.
`PaginationNavItem`, `PaginationNavMarker` and `PaginationNavLayout` are exported from
`~/types/components/pagination-nav` (and `~/types/components`).

## Slots

| Slot | Default |
|---|---|
| `#previous-icon` / `#next-icon` | `lucide:chevron-left` / `lucide:chevron-right` |
| `#first-icon` / `#last-icon` | `lucide:chevrons-left` / `lucide:chevrons-right` |
| `#ellipsis` | `…` |

The default arrows mirror in right-to-left text; a slotted icon is the consumer's to flip.

## Events

`update:page` (via `v-model:page`), in both modes. In link mode it fires as the link is followed, so a
persistent instance updates (and its marker slides) before the route does. Modified clicks
(Ctrl, Cmd, Shift, Alt, middle button) don't update it.

## Usage

```vue
<!-- Button mode -->
<PaginationNav v-model:page="page" :total="totalPages" />

<!-- Link mode: the route is the source of truth -->
<PaginationNav
  v-model:page="routePage"
  :total="totalPages"
  :page-href="(n) => `/blog?page=${n}`"
  marker="background"
/>
```

```ts
// Reads the route; ignores writes, because following the link changes the route.
const routePage = computed({ get: () => Number(route.query.page) || 1, set: () => {} });
```

In link mode, bind `v-model:page` (as above) rather than a bare `:page`. With `:page` alone, a click
updates the component's own copy of the page, and if the navigation is then cancelled (a route guard),
the control keeps showing the clicked page while the route stays where it was.

`getPaginationRange(page, total, siblings, boundaries)` (auto-imported from `app/utils/pagination-range.ts`)
returns the same window as `PaginationNavItem[]`, for a consumer building custom markup.

## Behaviour

- The window shows `boundaries` pages at each end and `siblings` either side of the current page, with an
  ellipsis for each hidden run of two or more pages; a run of one shows the page instead.
- Once `total` exceeds the window, it always has `2 × boundaries + 2 × siblings + 3` slots. With
  `boundaries` of at least 1 the last page (the widest number) is always shown, so the control keeps its
  width and the arrows don't move under the pointer. With `boundaries` 0 the slots widen as the numbers
  gain digits.
- Numbers never wrap inside their buttons: a row that doesn't fit compacts instead (in `auto` layout).
- Links never get `aria-current` from the router: only the current page carries it, even when a
  query-only `page-href` makes vue-router treat every page link as exact-active.
- Clicking a page, Previous, Next, First or Last updates `v-model:page`; clicking the current page does
  nothing.
- With `page-href`, every item is a link and Previous and Next point at the neighbouring pages.
- At page 1, Previous and First are disabled (`aria-disabled="true"`, still focusable, no href); at the
  last page, Next and Last are.
- The current page has `aria-current="page"`.
- Every control has an accessible name from the label props; ellipses are hidden from assistive
  technology; the list has `role="list"`.
- After a page number is chosen, focus moves to the new current page. An arrow keeps focus, and if its
  element was replaced (Next turning from a link into a disabled button), focus returns to its
  replacement. Focus only moves when it was already inside the control.
- `show-edges` adds First and Last; `hide-when-single-page` renders nothing for one page; a total below 1
  always renders nothing.
- `marker` slides a fill or an underline to the current page's slot, CSS only, with no measuring. It
  doesn't slide under `prefers-reduced-motion`.
- The `auto` layout switches to arrows plus the summary text when the full row doesn't fit the nav's
  content box, and back when it does again. The nav always takes the full width it's given
  (`inline-size: 100%`), so it measures correctly inside a flex row or a centring parent.
- In compact layout the summary is a polite live region, so a screen reader announces "Page 4 of 20"
  after Previous or Next.
- Modifier clicks (Ctrl, Cmd, Shift, Alt, middle button) on a link leave the model alone so the link can
  open elsewhere; in button mode they work like any other click.
- Worst-case data (huge or fractional totals, out-of-range pages, blank or very long labels) neither
  breaks the layout nor leaves a control unnamed.

## Styling

Tokens are `--pagination-nav-*`; items are `InputButton variant="inline"` and take all their colours from
these tokens. Full reference: `app/components/02.molecules/navigation/pagination-nav/CONSUMER-STYLING.md`.

## Notes

- Added 2026-10-27. Reviewed the same day: arrows no longer pick up vue-router's `aria-current`,
  icon-only arrows lost InputButton's icon margin (they were about 6rem square), the font-size and
  current-weight tokens now reach the numbers (which also means non-current numbers now inherit the
  page's weight instead of InputButton's 600), numbers don't wrap before compacting, the nav fills its
  width, padding is excluded from the fit check, RTL arrows flip in Safari 16.0 to 16.3, and the
  compact summary is announced.
- The range helper's number guard is `toPaginationWholeNumber`, named so it can't collide with a
  consumer app's own auto-imported utils.
- The slide only animates when the instance survives a page change. A `PaginationNav` inside a page
  component that remounts on each route renders its marker in place.
- `auto` layout starts as the full row on the server, so a narrow viewport may see it switch to compact
  after hydration. Use `layout="compact"` where the space is known to be small.
