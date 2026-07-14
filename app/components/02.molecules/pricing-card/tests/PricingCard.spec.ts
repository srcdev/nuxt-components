import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PricingCard from "../PricingCard.vue";

describe("PricingCard", () => {
  it("renders plan name, price, and CTA", () => {
    const wrapper = mount(PricingCard, {
      props: {
        planName: "Single Site",
        price: 99,
        billingPeriod: "one-time",
        ctaText: "Get started",
      },
    });

    expect(wrapper.text()).toContain("Single Site");
    expect(wrapper.text()).toContain("$99");
    expect(wrapper.text()).toContain("one-time");
    expect(wrapper.text()).toContain("Get started");
  });

  it("renders features from props", () => {
    const features = ["Feature 1", "Feature 2", "Feature 3"];
    const wrapper = mount(PricingCard, {
      props: {
        planName: "Test Plan",
        price: 100,
        features,
      },
    });

    features.forEach((feature) => {
      expect(wrapper.text()).toContain(feature);
    });
  });

  it("renders description when provided", () => {
    const description = "This is a great plan";
    const wrapper = mount(PricingCard, {
      props: {
        planName: "Test Plan",
        price: 100,
        description,
      },
    });

    expect(wrapper.text()).toContain(description);
  });

  it("applies highlighted class when isHighlighted is true", () => {
    const wrapper = mount(PricingCard, {
      props: {
        planName: "Test Plan",
        price: 100,
        isHighlighted: true,
      },
    });

    expect(wrapper.classes()).toContain("is-highlighted");
  });

  it("displays badge when highlighted", () => {
    const wrapper = mount(PricingCard, {
      props: {
        planName: "Test Plan",
        price: 100,
        isHighlighted: true,
      },
    });

    expect(wrapper.text()).toContain("Most Popular");
  });

  it("emits select event with plan name on CTA click", async () => {
    const wrapper = mount(PricingCard, {
      props: {
        planName: "Test Plan",
        price: 100,
      },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")?.[0]).toEqual(["Test Plan"]);
  });

  it("disables CTA when ctaDisabled is true", () => {
    const wrapper = mount(PricingCard, {
      props: {
        planName: "Test Plan",
        price: 100,
        ctaDisabled: true,
      },
    });

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeDefined();
  });

  it("renders custom features via slot", () => {
    const wrapper = mount(PricingCard, {
      props: {
        planName: "Test Plan",
        price: 100,
      },
      slots: {
        features: '<li>Custom Feature 1</li><li>Custom Feature 2</li>',
      },
    });

    expect(wrapper.text()).toContain("Custom Feature 1");
    expect(wrapper.text()).toContain("Custom Feature 2");
  });

  it("uses semantic article tag by default", () => {
    const wrapper = mount(PricingCard, {
      props: {
        planName: "Test Plan",
        price: 100,
      },
    });

    expect(wrapper.element.tagName).toBe("ARTICLE");
  });

  it("allows custom tag via prop", () => {
    const wrapper = mount(PricingCard, {
      props: {
        planName: "Test Plan",
        price: 100,
        tag: "section",
      },
    });

    expect(wrapper.element.tagName).toBe("SECTION");
  });
});
