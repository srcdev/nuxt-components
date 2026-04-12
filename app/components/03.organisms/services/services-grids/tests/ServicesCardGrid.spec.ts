import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ServicesCardGrid from "../ServicesCardGrid.vue";
import type { Service } from "~/types/types.services";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeService = (slug: string, title: string): Service => ({
  slug,
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

describe("ServicesCardGrid", () => {
  // ─── Mount ─────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: mockServices },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: mockServices },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ───────────────────────────────────────────────────────

  it("has services-card-grid class on root", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: mockServices },
    });
    expect(wrapper.classes()).toContain("services-card-grid");
  });

  it("renders as a div by default", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: mockServices },
    });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the tag prop as the root element", async () => {
    for (const tag of ["section", "main"] as const) {
      const wrapper = await mountSuspended(ServicesCardGrid, {
        props: { servicesData: mockServices, tag },
      });
      expect(wrapper.element.tagName).toBe(tag.toUpperCase());
    }
  });

  // ─── Children ───────────────────────────────────────────────────────────

  it("renders the correct number of service cards", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: mockServices },
    });
    expect(wrapper.findAll(".services-card")).toHaveLength(mockServices.length);
  });

  it("renders no cards when servicesData is empty", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: [] },
    });
    expect(wrapper.findAll(".services-card")).toHaveLength(0);
  });

  it("renders a single card correctly", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: [mockServices[0]!] },
    });
    expect(wrapper.findAll(".services-card")).toHaveLength(1);
  });

  // ─── hrefBase ───────────────────────────────────────────────────────────

  it("builds card href from default hrefBase and service slug", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: [mockServices[0]!] },
    });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toContain(mockServices[0]!.slug);
  });

  it("uses a custom hrefBase in the card button href", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: [mockServices[0]!], hrefBase: "/services/" },
    });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe(`/services/${mockServices[0]!.slug}`);
  });

  // ─── buttonTextPrefix ───────────────────────────────────────────────────

  it("uses default buttonTextPrefix in card button text", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: [mockServices[0]!] },
    });
    expect(wrapper.text()).toContain(`Enquire about ${mockServices[0]!.title}`);
  });

  it("uses a custom buttonTextPrefix in card button text", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: [mockServices[0]!], buttonTextPrefix: "Learn more about" },
    });
    expect(wrapper.text()).toContain(`Learn more about ${mockServices[0]!.title}`);
  });

  // ─── eyebrowConfig / heroConfig ─────────────────────────────────────────

  it("passes eyebrowConfig fontSize to each card", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: mockServices, eyebrowConfig: { fontSize: "small" } },
    });
    wrapper.findAll(".eyebrow-text").forEach((el) => {
      expect(el.classes()).toContain("small");
    });
  });

  it("passes heroConfig tag to each card", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: mockServices, heroConfig: { tag: "h3" } },
    });
    wrapper.findAll(".hero-text").forEach((el) => {
      expect(el.element.tagName).toBe("H3");
    });
  });

  // ─── styleClassPassthrough ──────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: mockServices, styleClassPassthrough: "custom-grid" },
    });
    expect(wrapper.classes()).toContain("custom-grid");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: mockServices, styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(ServicesCardGrid, {
      props: { servicesData: mockServices, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
