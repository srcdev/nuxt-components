import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ServicesSection from "../ServicesSection.vue";
import type { Service } from "~/types/types.services";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockService: Service = {
  slug: "test-service",
  title: "Test Service",
  subtitle: "A subtitle",
  price: "£50",
  duration: "60 mins",
  image: "/images/test.jpg",
  shortDescription: "Short description",
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

describe("ServicesSection", () => {
  // ─── Mount ─────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ───────────────────────────────────────────────────────

  it("has services-section class on root", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService },
    });
    expect(wrapper.classes()).toContain("services-section");
  });

  it("renders as a div by default", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService },
    });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the tag prop as the root element", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, tag: "section" },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  // ─── Icons ──────────────────────────────────────────────────────────────

  it("renders the default duration icon name in the template", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService },
    });
    expect(wrapper.html()).toContain("mdi:clock-time-four-outline");
  });

  it("renders the default price icon name in the template", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService },
    });
    expect(wrapper.html()).toContain("mdi:currency-gbp");
  });

  it("overrides the duration icon via durationIcon prop", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, durationIcon: "mdi:timer-outline" },
    });
    expect(wrapper.html()).toContain("mdi:timer-outline");
    expect(wrapper.html()).not.toContain("mdi:clock-time-four-outline");
  });

  it("overrides the price icon via priceIcon prop", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, priceIcon: "mdi:currency-usd" },
    });
    expect(wrapper.html()).toContain("mdi:currency-usd");
    expect(wrapper.html()).not.toContain("mdi:currency-gbp");
  });

  it("both icons can be overridden together", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: {
        serviceData: mockService,
        durationIcon: "mdi:timer-outline",
        priceIcon: "mdi:currency-eur",
      },
    });
    expect(wrapper.html()).toContain("mdi:timer-outline");
    expect(wrapper.html()).toContain("mdi:currency-eur");
  });

  // ─── Service data ───────────────────────────────────────────────────────

  it("renders service duration text", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService },
    });
    expect(wrapper.text()).toContain(mockService.duration);
  });

  it("renders service price text", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService },
    });
    expect(wrapper.text()).toContain(mockService.price);
  });

  // ─── Summary mode ───────────────────────────────────────────────────────

  it("renders summary-link slot in summary mode", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, isSummary: true },
      slots: {
        "summary-link": '<a class="test-link" href="/services/test">View service</a>',
      },
    });
    expect(wrapper.find(".test-link").exists()).toBe(true);
  });

  it("does not render summary-link slot in full mode", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, isSummary: false },
      slots: {
        "summary-link": '<a class="test-link" href="/services/test">View service</a>',
      },
    });
    expect(wrapper.find(".test-link").exists()).toBe(false);
  });

  it("renders cta slot in full mode", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, isSummary: false },
      slots: {
        cta: '<button class="test-cta">Book now</button>',
      },
    });
    expect(wrapper.find(".test-cta").exists()).toBe(true);
  });

  it("does not render cta slot in summary mode", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, isSummary: true },
      slots: {
        cta: '<button class="test-cta">Book now</button>',
      },
    });
    expect(wrapper.find(".test-cta").exists()).toBe(false);
  });

  // ─── Reverse ────────────────────────────────────────────────────────────

  it("applies reverse class when reverse prop is true", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, reverse: true },
    });
    expect(wrapper.find(".services-section__grid").classes()).toContain("services-section__grid--reverse");
  });

  it("does not apply reverse class by default", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService },
    });
    expect(wrapper.find(".services-section__grid").classes()).not.toContain("services-section__grid--reverse");
  });

  // ─── styleClassPassthrough ──────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(ServicesSection, {
      props: { serviceData: mockService, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
