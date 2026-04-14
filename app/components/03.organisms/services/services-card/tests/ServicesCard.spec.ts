import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ServicesCard from "../ServicesCard.vue";
import type { Service } from "~/types/types.services";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockService: Service = {
  slug: "test-service",
  category: "hair",
  title: "Test Service",
  subtitle: "A subtitle",
  price: "£50",
  duration: "60 mins",
  image: "/images/test.jpg",
  shortDescription: "A short description of the service.",
  longDescription: "Long description text",
  heroHeading: [{ text: "A great heading", styleClass: "normal" }],
  whatIsIt: "What this service is",
  process: ["Step one", "Step two"],
  idealFor: ["Person A", "Person B"],
  maintenance: "Maintenance advice",
  faqs: [{ question: "FAQ question?", answer: "FAQ answer." }],
  seoTitle: "SEO Title",
  seoDescription: "SEO description",
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ServicesCard", () => {
  // ─── Mount ─────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ───────────────────────────────────────────────────────

  it("has services-card class on root", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.classes()).toContain("services-card");
  });

  it("renders as a div by default", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the tag prop as the root element", async () => {
    for (const tag of ["section", "article"] as const) {
      const wrapper = await mountSuspended(ServicesCard, {
        props: { serviceData: mockService, tag },
      });
      expect(wrapper.element.tagName).toBe(tag.toUpperCase());
    }
  });

  // ─── Service data ───────────────────────────────────────────────────────

  it("renders the service title", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.text()).toContain(mockService.title);
  });

  it("renders the service subtitle via eyebrow", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.text()).toContain(mockService.subtitle);
  });

  it("renders the short description", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.find(".description").text()).toBe(mockService.shortDescription);
  });

  it("passes image src and alt to the image element", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    const img = wrapper.find(".image-wrapper img");
    expect(img.attributes("src")).toContain(mockService.image);
    expect(img.attributes("alt")).toBe(mockService.title);
  });

  it("loads the image lazily", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.find(".image-wrapper img").attributes("loading")).toBe("lazy");
  });

  // ─── Actions slot ───────────────────────────────────────────────────────

  it("renders the actions slot", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
      slots: {
        actions: '<button class="test-cta">Book now</button>',
      },
    });
    expect(wrapper.find(".test-cta").exists()).toBe(true);
    expect(wrapper.find(".test-cta").text()).toBe("Book now");
  });

  it("renders without error when no actions slot is provided", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── eyebrowConfig ──────────────────────────────────────────────────────

  it("uses default eyebrow fontSize of large", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.find(".eyebrow-text").classes()).toContain("large");
  });

  it("applies eyebrowConfig.fontSize override", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService, eyebrowConfig: { fontSize: "small" } },
    });
    expect(wrapper.find(".eyebrow-text").classes()).toContain("small");
  });

  it("applies eyebrowConfig.tag override", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService, eyebrowConfig: { tag: "p" } },
    });
    expect(wrapper.find(".eyebrow-text").element.tagName).toBe("P");
  });

  // ─── heroConfig ─────────────────────────────────────────────────────────

  it("uses default hero tag of h2", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService },
    });
    expect(wrapper.find(".hero-text").element.tagName).toBe("H2");
  });

  it("applies heroConfig.tag override", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService, heroConfig: { tag: "h3" } },
    });
    expect(wrapper.find(".hero-text").element.tagName).toBe("H3");
  });

  it("applies heroConfig.fontSize override", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService, heroConfig: { fontSize: "title" } },
    });
    expect(wrapper.find(".hero-text").classes()).toContain("title");
  });

  // ─── styleClassPassthrough ──────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService, styleClassPassthrough: "custom-card" },
    });
    expect(wrapper.classes()).toContain("custom-card");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService, styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(ServicesCard, {
      props: { serviceData: mockService, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
