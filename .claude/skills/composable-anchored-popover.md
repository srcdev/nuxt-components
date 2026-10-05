# useAnchoredPopover

`app/composables/useAnchoredPopover.ts`. Open/close state and positioning for a trigger + `popover`
element anchored with CSS anchor positioning, with fallbacks for browsers that lack either
feature. Used by `ActionMenu` (`align: "end"`) and `SelectMenu` (`align: "start"`). Use it for any
new anchored popover instead of calling `showPopover()`/`hidePopover()` directly.

## Why

- The Popover API arrived in Safari 17; CSS anchor positioning only in Safari 26.
- Safari 16 (e.g. first-generation iPad Pros, which can't update past iPadOS 16) has neither: the
  trigger renders but the menu never opens.
- Safari 17–18 has the Popover API but no anchor positioning: the menu opens in the wrong place.

## Modes (detected in `onMounted`, so SSR markup is the same everywhere)

| Support | Behaviour |
|---|---|
| Popover API + anchor positioning | Fully native. The composable only tracks `isOpen` from `toggle`. |
| Popover API, no anchor positioning | JS measures the trigger on `beforetoggle`/`toggle` and on scroll/resize, and writes `--_popover-top`/`-bottom`/`-left` (or `-right`) px values; flips to `data-placement="above"` when there's no room below. |
| No Popover API | Also opens/closes in JS: trigger `@click` toggles `isOpen`, document `pointerdown` outside the root and `Escape` (returning focus to the trigger) close it. The component shows the popover from a fallback class. |

## API

```ts
const {
  isOpen,              // Ref<boolean>, accurate in every mode; bind to aria-expanded
  usesFallbackPopover, // Ref<boolean>, true without the Popover API
  needsPositioning,    // Ref<boolean>, true without anchor positioning
  positionStyle,       // bind to the popover's :style (undefined when not needed)
  popoverPlacement,    // bind to the popover's :data-placement ("below" | "above" | undefined)
  show, hide,          // always use these, never showPopover()/hidePopover() directly
  handleTriggerClick,  // trigger @click (no-op where popovertarget works)
  handleBeforeToggle,  // popover @beforetoggle
  handleToggle,        // popover @toggle
} = useAnchoredPopover({ rootRef, triggerRef, popoverRef, align: "start", onOpen: focusFirstItem });
```

`rootRef` must contain both the trigger and the popover (outside-click detection). `onOpen` runs
after the popover is visible, so it can move focus into it.

## Component wiring

```vue
<div ref="rootRef" class="x-menu">
  <button ref="triggerRef" :popovertarget="id" :aria-expanded="isOpen" @click="handleTriggerClick">…</button>
  <div
    :id="id"
    ref="popoverRef"
    popover
    class="x-menu-popover"
    :class="{ 'x-menu-popover-open': usesFallbackPopover && isOpen }"
    :style="positionStyle"
    :data-placement="popoverPlacement"
    @beforetoggle="handleBeforeToggle"
    @toggle="handleToggle"
  >…</div>
</div>
```

```css
.x-menu-popover {
  &:popover-open { display: block; }
  /* Separate rule: a selector list containing :popover-open is dropped whole where unsupported. */
  &.x-menu-popover-open { display: block; }

  @supports not (anchor-name: --a) {
    position: fixed;
    top: calc(var(--_popover-top, 0px) + var(--x-menu-block-distance, 0.4rem));
    left: var(--_popover-left, 0px);
    z-index: var(--x-menu-popover-z-index, 999999);

    &[data-placement="above"] {
      top: auto;
      bottom: calc(var(--_popover-bottom, 0px) + var(--x-menu-block-distance, 0.4rem));
    }
  }
}
```

Drive any "open" visuals (e.g. a chevron) from `[aria-expanded="true"]` on the trigger, not
`:has(:popover-open)`.

## Caveats

- In the no-Popover-API mode the popover isn't in the top layer: give it a public z-index token
  (default `999999`, pitfall #17), and an ancestor with `transform`/`filter`/`contain` becomes its
  containing block and can misplace it.
- Tests: happy-dom has no Popover API and its `CSS.supports` can't be spied on. Define/undefine
  `HTMLElement.prototype.showPopover` and swap `globalThis.CSS` (restore it in `afterEach`); see
  `app/composables/tests/useAnchoredPopover.spec.ts`.
