export function createPausableTimeout(callback: () => void, ms: number) {
  let remaining = ms;
  let startedAt = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const resume = () => {
    if (timeoutId !== null || remaining <= 0) return;
    startedAt = Date.now();
    timeoutId = setTimeout(() => {
      timeoutId = null;
      remaining = 0;
      callback();
    }, remaining);
  };

  const pause = () => {
    if (timeoutId === null) return;
    clearTimeout(timeoutId);
    timeoutId = null;
    remaining -= Date.now() - startedAt;
  };

  const clear = () => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = null;
    remaining = 0;
  };

  resume();
  return { pause, resume, clear };
}

// Programmatic focus on the toast itself only pauses for keyboard users; focus on anything inside always does.
export function focusPausesAutoDismiss(root: HTMLElement, target: EventTarget | null): boolean {
  if (target !== root) return true;
  try {
    return root.matches(":focus-visible");
  } catch {
    return false;
  }
}
