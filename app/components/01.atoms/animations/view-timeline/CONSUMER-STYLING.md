# WipeAwayVertical — Consumer Styling

## Public tokens

| Token                                     | Default  | Applies to                                                                           |
| ----------------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `--wipe-away-vertical-height`             | `100vh`  | `.sticky-items-container` height — the visible height of the sticky panel stack      |
| `--wipe-away-vertical-border-radius`      | `0.5rem` | `.sticky-item` corner radius                                                         |
| `--wipe-away-vertical-animation-duration` | `1s`     | `wipe-out` scroll-linked animation, browsers supporting `animation-timeline: view()` |
| `--wipe-away-vertical-trailing-buffer`    | `20vh`   | `.trailing-buffer` height — release room after the last panel                        |

## Only itemCount - 1 scrollingItem slots

The last panel has nothing left to reveal, so it has no wipe animation and no `.scrolling-section`
of its own — only `scrollingItem-0` through `scrollingItem-{itemCount - 2}` are rendered.
Providing a `scrollingItem-{itemCount - 1}` slot is harmless (it's simply never rendered) but
unnecessary. Earlier versions of this component rendered a full extra `100vh` section for the
last item purely to hold it in view before release — that made the last panel appear roughly 2x
as deep on screen as the others, since it got the same reveal lead-in as every other panel _plus_
a whole dedicated section with no wipe to cut it short. `.trailing-buffer` (see token above)
replaces that with a much smaller, purpose-built release cushion instead.

## Pure CSS, no JS measurement

The whole pin/reveal effect is CSS-only (grid overlay + `animation-timeline: view()`); there's
no scroll listener or `getBoundingClientRect()` measurement involved. The root is a single-column
CSS grid: each `.scrolling-section` takes an explicit `grid-row` (after a `.leading-buffer` row—
see below), and `.sticky-items-container` spans `grid-row: 1 / -1` to overlay all of them without
adding its own row — so the root's height is simply the sum of the scrolling sections' own content
height plus the leading buffer, nothing extra to size manually.

## Leading buffer

`.leading-buffer` is a fixed `100vh` spacer rendered before the first scrolling section. Without
it, a section 0 positioned near the top of the page would already be partway through its `entry`
timeline range at initial page load (before any scrolling happens), so the first panel would
appear partially wiped on load. The buffer guarantees a full viewport of scroll run-up regardless
of how much real content precedes the component.

## No `animation-timeline: view()` support

Browsers without support (checked via `@supports not (animation-timeline: view())`) get the
sticky/grid-overlay/animation rules dropped entirely — `.sticky-item`s just render as normal
stacked panels in document flow, and `.scrolling-section`s are hidden. No JS fallback, no
opacity crossfade.

## Sticky vertical centering — no transform

`.sticky-items-container` centers itself with `top: calc((100vh - var(--wipe-away-vertical-height, 100vh)) / 2)` — a plain calc(), not a `transform: translateY()`. Do not
reintroduce a transform for this: `position: sticky`'s stick/release threshold is computed from
the element's untransformed layout position, so a transform-based visual shift makes the browser
release the sticky panel early (by the transformed amount), leaving a gap of empty space between
the last panel and whatever content follows the component.

```css
.wipe-away-vertical {
  --wipe-away-vertical-border-radius: 1rem;
  --wipe-away-vertical-animation-duration: 1.5s;
}
```

## Reduced motion

The wipe animation and fallback opacity transition are both disabled under
`prefers-reduced-motion: reduce` — content is shown fully opaque with no clip/fade.

## Class passthrough

`styleClassPassthrough` (string or string array) is applied to the root element via
`useStyleClassPassthrough`.
