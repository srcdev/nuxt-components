# MarqueeScroller — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--marquee-scroller-fade-width` | `10%` | Width of the transparent fade at each edge of the track (`mask-image`) |
| `--marquee-scroller-focus-outline-width` | `2px` | Outline width on the root region and the control button when keyboard-focused (colour is `--theme-ring`) |
| `--marquee-scroller-focus-outline-offset` | `2px` | Outline offset on the same two focus states |
| `--marquee-scroller-group-hover-filter` | `grayscale(1)` | Filter applied to every item when the pointer hovers anywhere over the scroller |
| `--marquee-scroller-item-hover-filter` | `grayscale(0)` | Filter applied to a single item when it is individually hovered (overrides the group filter for that item) |
| `--marquee-scroller-item-transition-duration` | `0.5s` | Transition duration for the item hover filter change |
| `--marquee-scroller-item-border-width` | `1px` | Item border width |
| `--marquee-scroller-item-border-colour` | `light-dark(var(--slate-10), var(--slate-00))` | Item border colour |
| `--marquee-scroller-item-border-radius` | `4px` | Item border radius |
| `--marquee-scroller-control-offset` | `8px` | Distance of the pause/play button from the top and end edges |
| `--marquee-scroller-control-background-colour` | `rgba(0, 0, 0, 0.7)` | Pause/play button background |
| `--marquee-scroller-control-background-colour-hover` | `rgba(0, 0, 0, 0.9)` | Pause/play button background on hover |
| `--marquee-scroller-control-text-colour` | `white` | Pause/play button icon colour |
| `--marquee-scroller-control-border-radius` | `4px` | Pause/play button border radius |
| `--marquee-scroller-control-padding` | `8px` | Pause/play button padding |
| `--marquee-scroller-control-font-size` | `14px` | Pause/play button icon font size |
| `--marquee-scroller-control-transition-duration` | `0.2s` | Pause/play button background-colour transition duration |
| `--marquee-scroller-control-border-width` | `1px` | Pause/play button border width in forced-colors/high-contrast mode (`prefers-contrast: high`). The border colour itself stays the system `ButtonText` keyword — see note below. |

```css
.my-page {
  --marquee-scroller-item-border-colour: #b5651d;
  --marquee-scroller-control-background-colour: #1a1a1a;
  --marquee-scroller-fade-width: 20%;
}
```

## High-contrast mode colours are not tokenised

Under `prefers-contrast: high`, the control button switches to the system colour keywords
`ButtonFace`/`ButtonText` rather than the component's own background/text tokens. These aren't
exposed as overridable tokens on purpose — they're meant to track the user's OS-level high-contrast
theme, which a component-level override would defeat. Only the border *width* in that mode is a
token (`--marquee-scroller-control-border-width`), since it's a plain dimension with no such
constraint.

## Item size and spacing are prop-driven, not tokens

Item `width`/`height`/`gap` and the animation duration are set via the `itemConfig` and
`animationRuntime` props (not CSS custom properties), since they also drive the component's own
layout math (`aspect-ratio`, track width). Override those through props:

```vue
<MarqueeScroller
  :item-config="{ width: '80px', height: '80px', gap: '24px' }"
  animation-runtime="60s"
/>
```

## Item content via slots

Each entry in `marqueeData` (`{ id, content }`) renders a slot named after its `id`. Provide the
markup for each item via that dynamically-named slot:

```vue
<MarqueeScroller :marquee-data="[{ id: 1, content: 'logo-a' }, { id: 2, content: 'logo-b' }]">
  <template #1>
    <img src="/logos/a.svg" alt="Logo A" />
  </template>
  <template #2>
    <img src="/logos/b.svg" alt="Logo B" />
  </template>
</MarqueeScroller>
```

## Control button icon and copy

The pause/play button's icon and its `aria-label` copy are all overridable — see `playIcon`/
`pauseIcon`/`playLabel`/`pauseLabel` props, or the `toggle-icon` slot for a fully custom icon
(scoped with `isPaused`):

```vue
<MarqueeScroller
  show-controls
  play-icon="mdi:play-circle"
  pause-icon="mdi:pause-circle"
  play-label="Reproduire"
  pause-label="Suspendre"
/>
```

```vue
<MarqueeScroller show-controls>
  <template #toggle-icon="{ isPaused }">
    <Icon :name="isPaused ? 'lucide:play' : 'lucide:pause'" />
  </template>
</MarqueeScroller>
```
