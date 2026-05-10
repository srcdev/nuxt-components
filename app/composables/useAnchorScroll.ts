interface UseAnchorScrollOptions {
  offset?: number | (() => number);
}

export const useAnchorScroll = (options: UseAnchorScrollOptions = {}) => {
  const { offset = 0 } = options;

  const prefersReducedMotion = (): boolean => {
    if (import.meta.server) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const resolveOffset = (): number => (typeof offset === "function" ? offset() : offset);

  const scrollToAnchor = (hash: string): void => {
    if (import.meta.server) return;
    const id = hash.startsWith("#") ? hash.slice(1) : hash;
    const el = document.getElementById(id);
    if (!el) return;

    const behavior: ScrollBehavior = prefersReducedMotion() ? "instant" : "smooth";
    const px = resolveOffset();

    if (px) {
      const top = el.getBoundingClientRect().top + window.scrollY - px;
      window.scrollTo({ top, behavior });
    } else {
      el.scrollIntoView({ behavior, block: "start" });
    }
  };

  // Intercepts anchor (#hash) clicks only. Routes and external links are left
  // to NuxtLink/router unchanged. When reduced motion is preferred, the default
  // browser/router anchor jump is preserved; otherwise we prevent that default
  // and smooth-scroll ourselves.
  const handleNavClick = (event: MouseEvent, href: string): void => {
    if (!href.startsWith("#")) return;
    if (prefersReducedMotion()) return;

    event.preventDefault();
    history.pushState(null, "", href);
    scrollToAnchor(href);
  };

  return { handleNavClick, scrollToAnchor };
};
