import type { MaybeRefOrGetter, Ref } from "vue";

interface AnchoredPopoverOptions {
  rootRef: Readonly<Ref<HTMLElement | null>>;
  triggerRef: Readonly<Ref<HTMLElement | null>>;
  popoverRef: Readonly<Ref<HTMLElement | null>>;
  side?: MaybeRefOrGetter<AnchoredPopoverSide>;
  onOpen?: () => void;
}

export type AnchoredPopoverSide = "top" | "right" | "bottom" | "left";

type PopoverToggleEvent = Event & { newState?: string };

const OPPOSITE_SIDE: Record<AnchoredPopoverSide, AnchoredPopoverSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

// Native popover + anchor positioning where supported; JS positioning without anchor positioning
// (Safari 17-18); JS open/close, outside click and Escape without the Popover API (Safari 16).
export function useAnchoredPopover({ rootRef, triggerRef, popoverRef, side = "bottom", onOpen }: AnchoredPopoverOptions) {
  const isOpen = ref(false);
  const usesFallbackPopover = ref(false);
  const needsPositioning = ref(false);
  const placement = ref<AnchoredPopoverSide>(toValue(side));
  const anchor = ref({ top: 0, bottom: 0, left: 0, right: 0, viewportWidth: 0, viewportHeight: 0 });

  // `--_anchor-{edge}` mirrors anchor({edge}) for top/left; `-inverse` is the same edge measured
  // from the viewport's bottom/right, for bottom/right.
  const positionStyle = computed(() => {
    if (!needsPositioning.value) return undefined;
    const { top, bottom, left, right, viewportWidth, viewportHeight } = anchor.value;
    return {
      "--_anchor-top": `${top}px`,
      "--_anchor-bottom": `${bottom}px`,
      "--_anchor-left": `${left}px`,
      "--_anchor-right": `${right}px`,
      "--_anchor-top-inverse": `${viewportHeight - top}px`,
      "--_anchor-bottom-inverse": `${viewportHeight - bottom}px`,
      "--_anchor-left-inverse": `${viewportWidth - left}px`,
      "--_anchor-right-inverse": `${viewportWidth - right}px`,
    };
  });

  const popoverPlacement = computed(() => (needsPositioning.value ? placement.value : undefined));

  const updatePosition = () => {
    const trigger = triggerRef.value;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const width = popoverRef.value?.offsetWidth ?? 0;
    const height = popoverRef.value?.offsetHeight ?? 0;

    const fits: Record<AnchoredPopoverSide, boolean> = {
      bottom: rect.bottom + height <= viewportHeight,
      top: rect.top - height >= 0,
      right: rect.right + width <= viewportWidth,
      left: rect.left - width >= 0,
    };

    anchor.value = { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, viewportWidth, viewportHeight };
    const preferred = toValue(side);
    placement.value = fits[preferred] || !fits[OPPOSITE_SIDE[preferred]] ? preferred : OPPOSITE_SIDE[preferred];
  };

  let frame = 0;
  const schedulePositionUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      updatePosition();
    });
  };

  const handleDocumentPointerdown = (event: PointerEvent) => {
    if (!rootRef.value?.contains(event.target as Node)) hide();
  };

  const handleDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    hide();
    triggerRef.value?.focus();
  };

  const addListeners = () => {
    if (needsPositioning.value) {
      window.addEventListener("scroll", schedulePositionUpdate, { capture: true, passive: true });
      window.addEventListener("resize", schedulePositionUpdate, { passive: true });
    }
    if (usesFallbackPopover.value) {
      document.addEventListener("pointerdown", handleDocumentPointerdown);
      document.addEventListener("keydown", handleDocumentKeydown);
    }
  };

  const removeListeners = () => {
    window.removeEventListener("scroll", schedulePositionUpdate, { capture: true });
    window.removeEventListener("resize", schedulePositionUpdate);
    document.removeEventListener("pointerdown", handleDocumentPointerdown);
    document.removeEventListener("keydown", handleDocumentKeydown);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const afterOpen = () => {
    if (needsPositioning.value) updatePosition();
    addListeners();
  };

  const show = () => {
    if (!usesFallbackPopover.value) {
      popoverRef.value?.showPopover();
      return;
    }
    if (isOpen.value) return;
    if (needsPositioning.value) updatePosition();
    isOpen.value = true;
    nextTick(() => {
      afterOpen();
      onOpen?.();
    });
  };

  const hide = () => {
    if (!usesFallbackPopover.value) {
      popoverRef.value?.hidePopover();
      return;
    }
    if (!isOpen.value) return;
    // Matches native popovers, which return focus to the invoker when focus was inside.
    if (popoverRef.value?.contains(document.activeElement)) triggerRef.value?.focus();
    isOpen.value = false;
    removeListeners();
  };

  /** Bound to the trigger's click. A no-op where `popovertarget` already toggles natively. */
  const handleTriggerClick = () => {
    if (!usesFallbackPopover.value) return;
    if (isOpen.value) hide();
    else show();
  };

  /** Bound to the popover's `beforetoggle`, so the first open frame is already in place. */
  const handleBeforeToggle = (event: Event) => {
    if (needsPositioning.value && (event as PopoverToggleEvent).newState === "open") updatePosition();
  };

  /** Bound to the popover's `toggle`. */
  const handleToggle = (event: Event) => {
    isOpen.value = (event as PopoverToggleEvent).newState === "open";
    if (isOpen.value) {
      afterOpen();
      onOpen?.();
    } else {
      removeListeners();
    }
  };

  onMounted(() => {
    usesFallbackPopover.value = typeof HTMLElement.prototype.showPopover !== "function";
    needsPositioning.value = typeof CSS !== "undefined" && typeof CSS.supports === "function" && !CSS.supports("anchor-name: --a");
  });

  onBeforeUnmount(removeListeners);

  return {
    isOpen,
    usesFallbackPopover,
    needsPositioning,
    positionStyle,
    popoverPlacement,
    show,
    hide,
    handleTriggerClick,
    handleBeforeToggle,
    handleToggle,
  };
}
