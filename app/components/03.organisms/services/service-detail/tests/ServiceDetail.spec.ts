import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ServiceDetail from "../ServiceDetail.vue";
import type { Service } from "~/types/types.services";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockService: Service = {
  slug: "balayage",
  category: "Colour",
  title: "Balayage",
  subtitle: "Freehand colour artistry",
  price: "£95",
  duration: "2.5 - 3.5 hours",
  image: "/images/balayage.jpg",
  shortDescription: "Freehand hand-painted colour",
  longDescription: "Balayage is a freehand hair colouring technique that creates a soft gradient.",
  heroHeading: [{ text: "What is Balayage?", styleClass: "normal" }],
  whatIsIt: "The word balayage comes from the French for 'to sweep'.",
  process: ["Consultation", "Sectioning", "Painting"],
  idealFor: ["First-time colour clients", "Low-maintenance colour"],
  maintenance: "Balayage is low maintenance since regrowth is soft and natural.",
  faqs: [{ question: "Will it damage my hair?", answer: "Balayage is gentler than full-head bleaching." }],
  seoTitle: "Balayage",
  seoDescription: "Balayage service",
};

const relatedService: Service = {
  ...mockService,
  slug: "highlights",
  title: "Highlights",
  price: "£85",
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ServiceDetail", () => {
  // ─── Mount ─────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ───────────────────────────────────────────────────────

  it("has service-detail class on root", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.classes()).toContain("service-detail");
  });

  it("renders as a div by default", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the tag prop as the root element", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService, tag: "section" } });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  // ─── Aria ───────────────────────────────────────────────────────────────

  it("binds aria-labelledby to the title HeroText's own id when tag is section", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: { serviceData: mockService, tag: "section" },
      attachTo: document.body,
    });
    const ariaLabelledby = wrapper.attributes("aria-labelledby");
    expect(ariaLabelledby).toBeTruthy();
    expect(document.getElementById(ariaLabelledby!)?.textContent).toContain(mockService.title);
  });

  // ─── Heading tags ───────────────────────────────────────────────────────

  it("renders the title as an h1 by default", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.find("h1").text()).toContain(mockService.title);
  });

  it("renders the title tag from the headerTag prop", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService, headerTag: "h2" } });
    expect(wrapper.find("h2").exists()).toBe(true);
  });

  it("renders section subheadings as h2 by default", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    const h2s = wrapper.findAll("h2");
    expect(h2s.some((h) => h.text() === "The Process")).toBe(true);
  });

  it("renders section subheadings from the subheadingTag prop", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService, subheadingTag: "h3" } });
    const h3s = wrapper.findAll("h3");
    expect(h3s.some((h) => h.text() === "The Process")).toBe(true);
  });

  // ─── Breadcrumb ─────────────────────────────────────────────────────────

  it("builds a default breadcrumb from the service's category and title", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.text()).toContain(mockService.category);
    expect(wrapper.findComponent({ name: "Breadcrumb" }).exists()).toBe(true);
  });

  it("uses breadcrumbItems prop over the default when provided", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: {
        serviceData: mockService,
        breadcrumbItems: [{ label: "Home", to: "/" }, { label: "Custom Crumb" }],
      },
    });
    expect(wrapper.text()).toContain("Custom Crumb");
    expect(wrapper.text()).not.toContain(mockService.category);
  });

  // ─── Service data ───────────────────────────────────────────────────────

  it("renders service price and duration in the hero pills", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.text()).toContain(mockService.duration);
    expect(wrapper.text()).toContain(mockService.price);
  });

  it("renders the process steps via StepperList, one li per step", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.find(".service-detail__process").findAll("li").length).toBe(mockService.process.length);
    expect(wrapper.text()).toContain("Consultation");
  });

  it("renders the ideal-for list", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.text()).toContain("First-time colour clients");
  });

  it("renders the faqs", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.text()).toContain("Will it damage my hair?");
    expect(wrapper.text()).toContain("Balayage is gentler than full-head bleaching.");
  });

  // ─── Sidebar ────────────────────────────────────────────────────────────

  it("renders default sidebar labels and service price/duration rows", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.text()).toContain("Book This Service");
    expect(wrapper.text()).toContain("Price");
    expect(wrapper.text()).toContain("Duration");
  });

  it("does not render a location row when location is not provided", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.text()).not.toContain("Location");
  });

  it("renders a location row when location is provided", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: { serviceData: mockService, location: "Mobile — across Bath" },
    });
    expect(wrapper.text()).toContain("Location");
    expect(wrapper.text()).toContain("Mobile — across Bath");
  });

  it("renders the book-cta slot scoped with serviceData", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: { serviceData: mockService },
      slots: {
        "book-cta": `<template #book-cta="{ serviceData }"><button class="test-book">{{ serviceData.title }}</button></template>`,
      },
    });
    expect(wrapper.find(".test-book").text()).toBe(mockService.title);
  });

  it("renders the sidebar-note slot", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: { serviceData: mockService },
      slots: { "sidebar-note": '<p class="test-note">A patch test is required.</p>' },
    });
    expect(wrapper.find(".test-note").exists()).toBe(true);
  });

  // ─── Related services ───────────────────────────────────────────────────

  it("does not render the related-services block when none are provided", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.find(".service-detail__related").exists()).toBe(false);
  });

  it("renders related services with default markup", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: { serviceData: mockService, relatedServices: [relatedService] },
    });
    expect(wrapper.find(".service-detail__related").exists()).toBe(true);
    expect(wrapper.text()).toContain("Highlights");
    expect(wrapper.text()).toContain("£85");
  });

  it("replaces a related service item via the related-service scoped slot", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: { serviceData: mockService, relatedServices: [relatedService] },
      slots: {
        "related-service": `<template #related-service="{ service }"><a class="test-related">{{ service.title }}</a></template>`,
      },
    });
    expect(wrapper.find(".test-related").exists()).toBe(true);
    expect(wrapper.find(".test-related").text()).toBe("Highlights");
  });

  // ─── Final CTA ──────────────────────────────────────────────────────────

  it("renders default final CTA heading and body", async () => {
    const wrapper = await mountSuspended(ServiceDetail, { props: { serviceData: mockService } });
    expect(wrapper.text()).toContain("Ready to book your appointment?");
    expect(wrapper.text()).toContain("Get in touch to book your appointment.");
  });

  it("overrides final CTA heading and body via props", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: {
        serviceData: mockService,
        finalCtaHeading: "Book your colour appointment",
        finalCtaBody: "Mobile service across Bath.",
      },
    });
    expect(wrapper.text()).toContain("Book your colour appointment");
    expect(wrapper.text()).toContain("Mobile service across Bath.");
  });

  it("renders the final-cta slot scoped with serviceData", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: { serviceData: mockService },
      slots: {
        "final-cta": `<template #final-cta="{ serviceData }"><button class="test-final-cta">{{ serviceData.title }}</button></template>`,
      },
    });
    expect(wrapper.find(".test-final-cta").text()).toBe(mockService.title);
  });

  // ─── styleClassPassthrough ──────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: { serviceData: mockService, styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: { serviceData: mockService, styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(ServiceDetail, {
      props: { serviceData: mockService, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
