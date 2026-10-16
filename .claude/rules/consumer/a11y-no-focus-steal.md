---
paths:
  - "app/**/*.vue"
---

# Status messages never take focus

Never `.focus()` a toast, banner or other status message when it appears. Announce it with `role`
+ `aria-live`, keep it reachable with `tabindex="0"`, and listen for Escape on the document while
it's shown (skipping `event.defaultPrevented`).

Why: WCAG 4.1.3 says status messages are announced without receiving focus, and moving focus
interrupts typing. Chrome also counts script focus before any pointer input as `:focus-visible`,
so `:focus:not(:focus-visible)` can't hide the ring (`DisplayToast`, 2026-10-16).
