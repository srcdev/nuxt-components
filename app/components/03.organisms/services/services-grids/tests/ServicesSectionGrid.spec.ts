import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ServicesSectionGrid from "../ServicesSectionGrid.vue";
import type { Service } from "~/types/types.services";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeService = (slug: string, title: string): Service => ({
  slug,
  category: "hair",
  title,
  subtitle: `Subtitle for ${title}`,
  price: "£50",
  duration: "60 mins",
  image: `/images/${slug}.jpg`,
  shortDescription: `Short description for ${title}.`,
  longDescription: "Long description.",
  heroHeading: [{ text: title, styleClass: "normal" }],
  whatIsIt: "What this service is.",
  process: ["Step one"],
  idealFor: ["Everyone"],
  maintenance: "Maintenance advice.",
  faqs: [{ question: "A question?", answer: "An answer." }],
  seoTitle: title,
  seoDescription: `SEO description for ${title}.`,
});

const mockServices: Service[] = [
  makeService("locs-installation", "Locs Installation"),
  makeService("locs-retwist", "Locs Retwist"),
  makeService("colour-treatment", "Colour Treatment"),
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ServicesSectionGrid", () => {
  // ─── Mount ─────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ───────────────────────────────────────────────────────

  it("has services-grid class on root", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices },
    });
    expect(wrapper.classes()).toContain("services-grid");
  });

  it("renders as a div by default", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices },
    });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the tag prop as the root element", async () => {
    for (const tag of ["section", "main"] as const) {
      const wrapper = await mountSuspended(ServicesSectionGrid, {
        props: { servicesData: mockServices, tag },
      });
      expect(wrapper.element.tagName).toBe(tag.toUpperCase());
    }
  });

  // ─── Children ───────────────────────────────────────────────────────────

  it("renders the correct number of service sections", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices },
    });
    expect(wrapper.findAll(".services-section")).toHaveLength(mockServices.length);
  });

  it("renders no sections when servicesData is empty", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: [] },
    });
    expect(wrapper.findAll(".services-section")).toHaveLength(0);
  });

  it("renders a single section correctly", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: [mockServices[0]!] },
    });
    expect(wrapper.findAll(".services-section")).toHaveLength(1);
  });

  // ─── useAlternateReverse ────────────────────────────────────────────────

  it("does not apply reverse to any section by default", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices },
    });
    wrapper.findAll(".services-section__grid").forEach((grid) => {
      expect(grid.classes()).not.toContain("services-section__grid--reverse");
    });
  });

  it("applies reverse to odd-indexed sections when useAlternateReverse is true", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices, useAlternateReverse: true },
    });
    const grids = wrapper.findAll(".services-section__grid");
    expect(grids[0]?.classes()).not.toContain("services-section__grid--reverse"); // index 0 — even
    expect(grids[1]?.classes()).toContain("services-section__grid--reverse"); // index 1 — odd
    expect(grids[2]?.classes()).not.toContain("services-section__grid--reverse"); // index 2 — even
  });

  // ─── Slots ─────────────────────────────────────────────────────────────

  it("renders summary-link slot content in each section", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices },
      slots: {
        "summary-link": '<a class="test-link" href="/services/test">View service</a>',
      },
    });
    expect(wrapper.findAll(".test-link")).toHaveLength(mockServices.length);
  });

  it("renders nothing in summary-link when slot is not provided", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: [mockServices[0]!] },
    });
    // isSummary=true, so summary-link slot is rendered — but empty since no content was provided
    expect(wrapper.find(".test-link").exists()).toBe(false);
  });

  // ─── styleClassPassthrough ──────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices, styleClassPassthrough: "custom-grid" },
    });
    expect(wrapper.classes()).toContain("custom-grid");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices, styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(ServicesSectionGrid, {
      props: { servicesData: mockServices, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
