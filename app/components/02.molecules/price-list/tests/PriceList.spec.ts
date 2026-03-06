import { describe, it, expect, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PriceList from "../PriceList.vue";
import type { PriceListData } from "../PriceList.vue";

const defaultPriceListData = [
  {
    headingtext: "Cutting & Treatment",
    items: [
      { description: "Cut & Blow Dry", price: "£45" },
      { description: "Restyle", price: "£65" },
    ],
  },
  {
    headingtext: "Hair Colouring",
    items: [
      { description: "Full Head Colour", price: "£75" },
      { description: "Balayage", price: "£95" },
    ],
  },
];

const createWrapper = async (
  priceListData: PriceListData[] = defaultPriceListData,
  extraProps: { styleClassPassthrough?: string | string[] } = {}
) => {
  return mountSuspended(PriceList, {
    props: { priceListData, ...extraProps },
  });
};

describe("PriceList", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>> | undefined;

  afterEach(() => {
    wrapper?.unmount();
  });

  // -------------------------
  // Snapshots
  // -------------------------
  describe("Snapshots", () => {
    it("default", async () => {
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("custom headings", async () => {
      wrapper = await createWrapper([
        { headingtext: "Cuts", items: [] },
        { headingtext: "Colour", items: [] },
      ]);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  // -------------------------
  // Rendering
  // -------------------------
  describe("Rendering", () => {
    it("mounts without error", async () => {
      wrapper = await createWrapper();
      expect(wrapper.vm).toBeTruthy();
    });

    it("renders the root element", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".price-list").exists()).toBe(true);
    });

    it("renders two columns", async () => {
      wrapper = await createWrapper();
      expect(wrapper.findAll(".price-list__column").length).toBe(2);
    });

    it("renders a dl list in each column", async () => {
      wrapper = await createWrapper();
      expect(wrapper.findAll(".price-list__list").length).toBe(2);
    });

    it("renders correct number of rows in column 1", async () => {
      wrapper = await createWrapper();
      const column1 = wrapper.findAll(".price-list__column")[0]!;
      expect(column1.findAll(".price-list__row").length).toBe(2);
    });

    it("renders correct number of rows in column 2", async () => {
      wrapper = await createWrapper();
      const column2 = wrapper.findAll(".price-list__column")[1]!;
      expect(column2.findAll(".price-list__row").length).toBe(2);
    });

    it("renders description and price in each row", async () => {
      wrapper = await createWrapper();
      const firstRow = wrapper.find(".price-list__row");
      expect(firstRow.find(".price-list__description").text()).toBe("Cut & Blow Dry");
      expect(firstRow.find(".price-list__price").text()).toBe("£45");
    });

    it("renders empty columns when items are empty arrays", async () => {
      wrapper = await createWrapper([
        { headingtext: "Cutting & Treatment", items: [] },
        { headingtext: "Hair Colouring", items: [] },
      ]);
      expect(wrapper.findAll(".price-list__row").length).toBe(0);
    });
  });

  // -------------------------
  // Props
  // -------------------------
  describe("Props", () => {
    it("renders column 1 heading", async () => {
      wrapper = await createWrapper();
      expect(wrapper.findAll(".price-list__heading")[0]!.text()).toBe("Cutting & Treatment");
    });

    it("renders column 2 heading", async () => {
      wrapper = await createWrapper();
      expect(wrapper.findAll(".price-list__heading")[1]!.text()).toBe("Hair Colouring");
    });

    it("renders custom headings from priceListData", async () => {
      wrapper = await createWrapper([
        { headingtext: "Cuts", items: [] },
        { headingtext: "Colour", items: [] },
      ]);
      expect(wrapper.findAll(".price-list__heading")[0]!.text()).toBe("Cuts");
      expect(wrapper.findAll(".price-list__heading")[1]!.text()).toBe("Colour");
    });

    it("renders a single column when priceListData has one entry", async () => {
      wrapper = await createWrapper([{ headingtext: "Cutting & Treatment", items: [] }]);
      expect(wrapper.findAll(".price-list__column").length).toBe(1);
    });

    it("applies styleClassPassthrough classes", async () => {
      wrapper = await createWrapper(defaultPriceListData, { styleClassPassthrough: ["extra-class"] });
      expect(wrapper.find(".price-list").classes()).toContain("extra-class");
    });

    it("renders a heading icon when headingIcon is provided", async () => {
      wrapper = await createWrapper([{ headingtext: "Cutting & Treatment", headingIcon: "mdi:scissors", items: [] }]);
      expect(wrapper.find(".price-list__heading .hero-text__icon").exists()).toBe(true);
    });

    it("does not render a heading icon when headingIcon is omitted", async () => {
      wrapper = await createWrapper([{ headingtext: "Cutting & Treatment", items: [] }]);
      expect(wrapper.find(".price-list__heading .hero-text__icon").exists()).toBe(false);
    });

    it("renders a 'from' label when item.from is true", async () => {
      wrapper = await createWrapper([
        {
          headingtext: "Cutting & Treatment",
          items: [{ description: "Cut & Blow Dry", price: "£45", from: true }],
        },
      ]);
      expect(wrapper.find(".price-list__from").exists()).toBe(true);
      expect(wrapper.find(".price-list__from").text()).toBe("from");
    });

    it("does not render a 'from' label when item.from is omitted", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".price-list__from").exists()).toBe(false);
    });
  });

  // -------------------------
  // Accessibility
  // -------------------------
  describe("Accessibility", () => {
    it("uses dl elements for lists", async () => {
      wrapper = await createWrapper();
      expect(wrapper.findAll("dl").length).toBe(2);
    });

    it("uses dt for descriptions", async () => {
      wrapper = await createWrapper();
      const dts = wrapper.findAll("dt");
      expect(dts.length).toBe(4);
      expect(dts[0]!.text()).toBe("Cut & Blow Dry");
    });

    it("uses dd for prices", async () => {
      wrapper = await createWrapper();
      const dds = wrapper.findAll("dd");
      expect(dds.length).toBe(4);
      expect(dds[0]!.text()).toBe("£45");
    });
  });
});
