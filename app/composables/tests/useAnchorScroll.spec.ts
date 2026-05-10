import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAnchorScroll } from "../useAnchorScroll";

const stubMatchMedia = (prefersReducedMotion: boolean) => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: prefersReducedMotion }));
};

const makeEvent = (): MouseEvent => {
  const e = new MouseEvent("click");
  vi.spyOn(e, "preventDefault");
  return e;
};

const appendEl = (id: string): HTMLElement => {
  const el = document.createElement("div");
  el.id = id;
  document.body.appendChild(el);
  return el;
};

describe("useAnchorScroll", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    stubMatchMedia(false);
    vi.stubGlobal("scrollTo", vi.fn());
    vi.spyOn(history, "pushState").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── handleNavClick ───────────────────────────────────────────────────────

  describe("handleNavClick", () => {
    describe("non-anchor hrefs", () => {
      it("does nothing for a route href", () => {
        const { handleNavClick } = useAnchorScroll();
        const e = makeEvent();
        handleNavClick(e, "/about");
        expect(e.preventDefault).not.toHaveBeenCalled();
        expect(history.pushState).not.toHaveBeenCalled();
      });

      it("does nothing for an external URL", () => {
        const { handleNavClick } = useAnchorScroll();
        const e = makeEvent();
        handleNavClick(e, "https://example.com");
        expect(e.preventDefault).not.toHaveBeenCalled();
      });

      it("does nothing for an empty string", () => {
        const { handleNavClick } = useAnchorScroll();
        const e = makeEvent();
        handleNavClick(e, "");
        expect(e.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe("prefers-reduced-motion active", () => {
      it("does not call preventDefault", () => {
        stubMatchMedia(true);
        appendEl("overview");
        const { handleNavClick } = useAnchorScroll();
        const e = makeEvent();
        handleNavClick(e, "#overview");
        expect(e.preventDefault).not.toHaveBeenCalled();
      });

      it("does not push state", () => {
        stubMatchMedia(true);
        appendEl("overview");
        const { handleNavClick } = useAnchorScroll();
        handleNavClick(makeEvent(), "#overview");
        expect(history.pushState).not.toHaveBeenCalled();
      });

      it("does not scroll", () => {
        stubMatchMedia(true);
        const el = appendEl("overview");
        el.scrollIntoView = vi.fn();
        const { handleNavClick } = useAnchorScroll();
        handleNavClick(makeEvent(), "#overview");
        expect(el.scrollIntoView).not.toHaveBeenCalled();
        expect(window.scrollTo).not.toHaveBeenCalled();
      });
    });

    describe("anchor href, no reduced-motion", () => {
      it("calls preventDefault", () => {
        appendEl("overview");
        const { handleNavClick } = useAnchorScroll();
        const e = makeEvent();
        handleNavClick(e, "#overview");
        expect(e.preventDefault).toHaveBeenCalled();
      });

      it("pushes the hash into history", () => {
        appendEl("overview");
        const { handleNavClick } = useAnchorScroll();
        handleNavClick(makeEvent(), "#overview");
        expect(history.pushState).toHaveBeenCalledWith(null, "", "#overview");
      });

      it("does nothing when target element does not exist", () => {
        const { handleNavClick } = useAnchorScroll();
        expect(() => handleNavClick(makeEvent(), "#nonexistent")).not.toThrow();
        expect(window.scrollTo).not.toHaveBeenCalled();
      });

      it("scrolls to the element", () => {
        const el = appendEl("overview");
        el.scrollIntoView = vi.fn();
        const { handleNavClick } = useAnchorScroll();
        handleNavClick(makeEvent(), "#overview");
        expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
      });
    });
  });

  // ─── scrollToAnchor ───────────────────────────────────────────────────────

  describe("scrollToAnchor", () => {
    describe("element lookup", () => {
      it("accepts a hash with leading #", () => {
        const el = appendEl("section");
        el.scrollIntoView = vi.fn();
        const { scrollToAnchor } = useAnchorScroll();
        scrollToAnchor("#section");
        expect(el.scrollIntoView).toHaveBeenCalled();
      });

      it("accepts a hash without leading #", () => {
        const el = appendEl("section");
        el.scrollIntoView = vi.fn();
        const { scrollToAnchor } = useAnchorScroll();
        scrollToAnchor("section");
        expect(el.scrollIntoView).toHaveBeenCalled();
      });

      it("does nothing when no element matches", () => {
        const { scrollToAnchor } = useAnchorScroll();
        expect(() => scrollToAnchor("#ghost")).not.toThrow();
        expect(window.scrollTo).not.toHaveBeenCalled();
      });
    });

    describe("no offset", () => {
      it("uses scrollIntoView with smooth behavior", () => {
        const el = appendEl("target");
        el.scrollIntoView = vi.fn();
        const { scrollToAnchor } = useAnchorScroll();
        scrollToAnchor("#target");
        expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
      });

      it("uses instant behavior when prefers-reduced-motion is active", () => {
        stubMatchMedia(true);
        const el = appendEl("target");
        el.scrollIntoView = vi.fn();
        const { scrollToAnchor } = useAnchorScroll();
        scrollToAnchor("#target");
        expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: "instant", block: "start" });
      });
    });

    describe("numeric offset", () => {
      it("uses window.scrollTo with the offset subtracted", () => {
        const el = appendEl("target");
        vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: 300 } as DOMRect);
        const { scrollToAnchor } = useAnchorScroll({ offset: 80 });
        scrollToAnchor("#target");
        // top: el.top + scrollY - offset = 300 + 0 - 80
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 220, behavior: "smooth" });
      });

      it("uses instant behavior when prefers-reduced-motion is active", () => {
        stubMatchMedia(true);
        const el = appendEl("target");
        vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: 300 } as DOMRect);
        const { scrollToAnchor } = useAnchorScroll({ offset: 80 });
        scrollToAnchor("#target");
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 220, behavior: "instant" });
      });
    });

    describe("getter offset", () => {
      it("calls the getter at scroll time, not at composable init", () => {
        const el = appendEl("target");
        vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: 0 } as DOMRect);

        let liveOffset = 0;
        const { scrollToAnchor } = useAnchorScroll({ offset: () => liveOffset });

        liveOffset = 60;
        scrollToAnchor("#target");
        expect(window.scrollTo).toHaveBeenCalledWith({ top: -60, behavior: "smooth" });
      });

      it("re-reads the getter on each call", () => {
        const el = appendEl("target");
        vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: 100 } as DOMRect);

        let liveOffset = 40;
        const { scrollToAnchor } = useAnchorScroll({ offset: () => liveOffset });

        scrollToAnchor("#target");
        expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 60, behavior: "smooth" });

        liveOffset = 70;
        scrollToAnchor("#target");
        expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 30, behavior: "smooth" });
      });
    });
  });
});
