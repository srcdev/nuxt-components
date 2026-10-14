import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PricingCard from "../PricingCard.vue";

const baseProps = { planName: "Test Plan", price: 100 };

describe("PricingCard", () => {
  it("renders plan name, price, and CTA", async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: { planName: "Single Site", price: 99, billingPeriod: "one-time", ctaText: "Get started" },
    });

    expect(wrapper.text()).toContain("Single Site");
    expect(wrapper.text()).toContain("$99");
    expect(wrapper.text()).toContain("one-time");
    expect(wrapper.text()).toContain("Get started");
  });

  it("uses custom currency symbol when provided", async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: { planName: "Single Site", price: 49, currencySymbol: "£" },
    });

    expect(wrapper.text()).toContain("£49");
    expect(wrapper.text()).not.toContain("$49");
  });

  describe("price display", () => {
    it("shows whole numbers without decimals", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: { ...baseProps, price: 1500 } });
      expect(wrapper.find(".pricing-card__amount").text()).toBe("$1500");
    });

    it("shows fractional prices to two decimal places", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: { ...baseProps, price: 9.5 } });
      expect(wrapper.find(".pricing-card__amount").text()).toBe("$9.50");
    });

    it("keeps zero and negative prices", async () => {
      const zero = await mountSuspended(PricingCard, { props: { ...baseProps, price: 0 } });
      expect(zero.find(".pricing-card__amount").text()).toBe("$0");

      const negative = await mountSuspended(PricingCard, { props: { ...baseProps, price: -20 } });
      expect(negative.find(".pricing-card__amount").text()).toBe("$-20");
    });

    it("shows only the currency symbol for a non-finite price", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: { ...baseProps, price: Number.NaN } });
      expect(wrapper.find(".pricing-card__amount").text()).toBe("$");
    });

    it("updates when the price prop changes", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: { ...baseProps, price: 10 } });
      await wrapper.setProps({ price: 12.25 });
      expect(wrapper.find(".pricing-card__amount").text()).toBe("$12.25");
    });
  });

  it("renders features from props", async () => {
    const features = ["Feature 1", "Feature 2", "Feature 3"];
    const wrapper = await mountSuspended(PricingCard, { props: { ...baseProps, features } });

    expect(wrapper.findAll(".pricing-card__feature")).toHaveLength(3);
    features.forEach((feature) => {
      expect(wrapper.text()).toContain(feature);
    });
  });

  it("renders HTML-like text as text", async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: { ...baseProps, planName: "<b>Bold</b>", features: ["<script>alert(1)</script>"] },
    });

    expect(wrapper.find(".pricing-card__name b").exists()).toBe(false);
    expect(wrapper.find(".pricing-card__name").text()).toBe("<b>Bold</b>");
    expect(wrapper.find("script").exists()).toBe(false);
  });

  it("renders description when provided and omits it otherwise", async () => {
    const withDescription = await mountSuspended(PricingCard, {
      props: { ...baseProps, description: "This is a great plan" },
    });
    expect(withDescription.find(".pricing-card__description").text()).toBe("This is a great plan");

    const without = await mountSuspended(PricingCard, { props: baseProps });
    expect(without.find(".pricing-card__description").exists()).toBe(false);
  });

  it("omits the billing period when empty", async () => {
    const wrapper = await mountSuspended(PricingCard, { props: { ...baseProps, billingPeriod: "" } });
    expect(wrapper.find(".pricing-card__period").exists()).toBe(false);
  });

  describe("highlight", () => {
    it("applies highlighted class and default badge", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: { ...baseProps, isHighlighted: true } });

      expect(wrapper.classes()).toContain("is-highlighted");
      expect(wrapper.find(".pricing-card__badge").text()).toBe("Most Popular");
    });

    it("renders custom badge text", async () => {
      const wrapper = await mountSuspended(PricingCard, {
        props: { ...baseProps, isHighlighted: true, badgeText: "Le plus populaire" },
      });

      expect(wrapper.find(".pricing-card__badge").text()).toBe("Le plus populaire");
    });

    it("has no badge when not highlighted", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: baseProps });
      expect(wrapper.find(".pricing-card__badge").exists()).toBe(false);
      expect(wrapper.classes()).not.toContain("is-highlighted");
    });
  });

  describe("CTA", () => {
    it("emits select event with plan name on click", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: baseProps });

      await wrapper.find("button").trigger("click");

      expect(wrapper.emitted("select")?.[0]).toEqual(["Test Plan"]);
    });

    it("disables CTA when ctaDisabled is true", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: { ...baseProps, ctaDisabled: true } });

      const button = wrapper.find("button");
      expect(button.attributes("readonly")).toBeDefined();
      expect(button.attributes("aria-disabled")).toBe("true");
    });

    it("passes scope to the cta slot", async () => {
      const wrapper = await mountSuspended(PricingCard, {
        props: { ...baseProps, ctaText: "Choose", ctaDisabled: true },
        slots: {
          cta: `<template #cta="{ ctaText, isDisabled, planName, onSelect }">
            <button class="custom-cta" :data-disabled="isDisabled" :data-plan="planName" @click="onSelect">{{ ctaText }}</button>
          </template>`,
        },
      });

      const button = wrapper.find(".custom-cta");
      expect(button.text()).toBe("Choose");
      expect(button.attributes("data-disabled")).toBe("true");
      expect(button.attributes("data-plan")).toBe("Test Plan");
      await button.trigger("click");
      expect(wrapper.emitted("select")?.[0]).toEqual(["Test Plan"]);
    });
  });

  it("renders custom features via slot", async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: baseProps,
      slots: { features: "<li>Custom Feature 1</li><li>Custom Feature 2</li>" },
    });

    expect(wrapper.text()).toContain("Custom Feature 1");
    expect(wrapper.text()).toContain("Custom Feature 2");
  });

  describe("semantics", () => {
    it("uses an article with an h3 by default", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: baseProps });

      expect(wrapper.element.tagName).toBe("ARTICLE");
      expect(wrapper.find(".pricing-card__name").element.tagName).toBe("H3");
    });

    it("allows custom tag and heading level", async () => {
      const wrapper = await mountSuspended(PricingCard, {
        props: { ...baseProps, tag: "section", headingTag: "h2" },
      });

      expect(wrapper.element.tagName).toBe("SECTION");
      expect(wrapper.find(".pricing-card__name").element.tagName).toBe("H2");
    });

    it("labels the root with the plan name heading", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: baseProps });

      const headingId = wrapper.find(".pricing-card__name").attributes("id");
      expect(headingId).toBeTruthy();
      expect(wrapper.attributes("aria-labelledby")).toBe(headingId);
    });
  });

  describe("ribbon", () => {
    it("does not render a ribbon when ribbonText is unset", async () => {
      const wrapper = await mountSuspended(PricingCard, { props: baseProps });

      expect(wrapper.find(".pricing-card__ribbon-clip").exists()).toBe(false);
      expect(wrapper.classes()).not.toContain("has-ribbon");
    });

    it("renders ribbon text and flags the root when ribbonText is provided", async () => {
      const wrapper = await mountSuspended(PricingCard, {
        props: { ...baseProps, ribbonText: "EARLYBIRD50 · 50% off" },
      });

      expect(wrapper.find(".pricing-card__ribbon").text()).toBe("EARLYBIRD50 · 50% off");
      expect(wrapper.classes()).toContain("has-ribbon");
    });
  });

  it("applies and updates styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: { ...baseProps, styleClassPassthrough: ["custom-a"] },
    });
    expect(wrapper.classes()).toContain("custom-a");

    await wrapper.setProps({ styleClassPassthrough: ["custom-b"] });
    expect(wrapper.classes()).toContain("custom-b");
    expect(wrapper.classes()).not.toContain("custom-a");
  });
});
