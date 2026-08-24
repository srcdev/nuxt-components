import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ServiceSummary from "../ServiceSummary.vue";
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

describe("ServiceSummary", () => {
  // ─── Mount ─────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ───────────────────────────────────────────────────────

  it("has service-summary class on root", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    expect(wrapper.classes()).toContain("service-summary");
  });

  it("renders as a div by default", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the tag prop as the root element", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService, tag: "section" },
    });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  // ─── Aria ───────────────────────────────────────────────────────────────

  it("binds aria-labelledby to the title HeroText's own id when tag is section", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService, tag: "section" },
      attachTo: document.body,
    });
    const ariaLabelledby = wrapper.attributes("aria-labelledby");
    expect(ariaLabelledby).toBeTruthy();
    expect(document.getElementById(ariaLabelledby!)?.textContent).toContain(mockService.title);
  });

  // ─── Pills ──────────────────────────────────────────────────────────────

  it("renders duration and price as DisplayPill instances", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    const pills = wrapper.findAll(".display-pill");
    expect(pills).toHaveLength(2);
    expect(pills[0]?.text()).toContain(mockService.duration);
    expect(pills[1]?.text()).toContain(mockService.price);
  });

  // ─── Service data ───────────────────────────────────────────────────────

  it("renders service duration text", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    expect(wrapper.text()).toContain(mockService.duration);
  });

  it("renders service price text", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    expect(wrapper.text()).toContain(mockService.price);
  });

  it("renders the whatIsIt text", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    expect(wrapper.text()).toContain(mockService.whatIsIt);
  });

  it("does not render process, idealFor, maintenance, or FAQ content", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    expect(wrapper.text()).not.toContain(mockService.longDescription);
    expect(wrapper.text()).not.toContain(mockService.maintenance);
    expect(wrapper.text()).not.toContain(mockService.faqs[0]?.question);
  });

  // ─── summary-link slot ────────────────────────────────────────────────

  it("renders summary-link slot content", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
      slots: {
        "summary-link": '<a class="test-link" href="/services/test">View service</a>',
      },
    });
    expect(wrapper.find(".test-link").exists()).toBe(true);
  });

  it("passes serviceData to the summary-link slot", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
      slots: {
        "summary-link": `<template #summary-link="{ serviceData }"><a class="test-link">{{ serviceData.title }}</a></template>`,
      },
    });
    expect(wrapper.find(".test-link").text()).toBe(mockService.title);
  });

  // ─── Reverse ────────────────────────────────────────────────────────────

  it("applies reverse class when reverse prop is true", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService, reverse: true },
    });
    expect(wrapper.find(".service-summary__grid").classes()).toContain("service-summary__grid--reverse");
  });

  it("does not apply reverse class by default", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    expect(wrapper.find(".service-summary__grid").classes()).not.toContain("service-summary__grid--reverse");
  });

  // ─── Alignment ──────────────────────────────────────────────────────────

  it("defaults to center alignment", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService },
    });
    expect(wrapper.find(".service-summary__info-wrapper").classes()).toContain(
      "service-summary__info-wrapper--align-center"
    );
  });

  it("applies the alignment prop", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService, alignment: "start" },
    });
    expect(wrapper.find(".service-summary__info-wrapper").classes()).toContain(
      "service-summary__info-wrapper--align-start"
    );
  });

  // ─── styleClassPassthrough ──────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService, styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService, styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(ServiceSummary, {
      props: { serviceData: mockService, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
