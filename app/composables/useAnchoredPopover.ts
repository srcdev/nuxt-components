import type { Ref } from "vue";

interface AnchoredPopoverOptions {
  rootRef: Ref<HTMLElement | null>;
  triggerRef: Ref<HTMLElement | null>;
  popoverRef: Ref<HTMLElement | null>;
  align?: "start" | "end";
  onOpen?: () => void;
}

type PopoverToggleEvent = Event & { newState?: string };

// Native popover + anchor positioning where supported; JS positioning without anchor positioning
// (Safari 17-18); JS open/close, outside click and Escape without the Popover API (Safari 16).
export function useAnchoredPopover({ rootRef, triggerRef, popoverRef, align = "start", onOpen }: AnchoredPopoverOptions) {
  const isOpen = ref(false);
  const usesFallbackPopover = ref(false);
  const needsPositioning = ref(false);
  const placement = ref<"below" | "above">("below");
  const anchor = ref({ top: 0, bottom: 0, left: 0, right: 0 });

  const positionStyle = computed(() => {
    if (!needsPositioning.value) return undefined;
    return align === "end"
      ? { "--_popover-top": `${anchor.value.top}px`, "--_popover-bottom": `${anchor.value.bottom}px`, "--_popover-right": `${anchor.value.right}px` }
      : { "--_popover-top": `${anchor.value.top}px`, "--_popover-bottom": `${anchor.value.bottom}px`, "--_popover-left": `${anchor.value.left}px` };
  });

  const popoverPlacement = computed(() => (needsPositioning.value ? placement.value : undefined));

  const updatePosition = () => {
    const trigger = triggerRef.value;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const popoverHeight = popoverRef.value?.offsetHeight ?? 0;

    anchor.value = {
      top: rect.bottom,
      bottom: viewportHeight - rect.top,
      left: rect.left,
      right: viewportWidth - rect.right,
    };
    placement.value = rect.bottom + popoverHeight > viewportHeight && rect.top > popoverHeight ? "above" : "below";
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
