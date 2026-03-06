import { describe, it, expect, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PriceList from "../PriceList.vue";

const defaultProps = {
  column1: {
    headingtext: "Cutting & Treatment",
    items: [
      { description: "Cut & Blow Dry", price: "£45" },
      { description: "Restyle", price: "£65" },
    ],
  },
  column2: {
    headingtext: "Hair Colouring",
    items: [
      { description: "Full Head Colour", price: "£75" },
      { description: "Balayage", price: "£95" },
    ],
  },
};

const createWrapper = async (props: Record<string, unknown> = {}) => {
  return mountSuspended(PriceList, {
    props: { ...defaultProps, ...props },
  });
};

describe("PriceList", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

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
      wrapper = await createWrapper({
        column1Heading: "Cuts",
        column2Heading: "Colour",
      });
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
      const column1 = wrapper.findAll(".price-list__column")[0];
      expect(column1.findAll(".price-list__row").length).toBe(2);
    });

    it("renders correct number of rows in column 2", async () => {
      wrapper = await createWrapper();
      const column2 = wrapper.findAll(".price-list__column")[1];
      expect(column2.findAll(".price-list__row").length).toBe(2);
    });

    it("renders description and price in each row", async () => {
      wrapper = await createWrapper();
      const firstRow = wrapper.find(".price-list__row");
      expect(firstRow.find(".price-list__description").text()).toBe("Cut & Blow Dry");
      expect(firstRow.find(".price-list__price").text()).toBe("£45");
    });

    it("renders empty columns when items are empty arrays", async () => {
      wrapper = await createWrapper({
        column1: { headingtext: "Cutting & Treatment", items: [] },
        column2: { headingtext: "Hair Colouring", items: [] },
      });
      expect(wrapper.findAll(".price-list__row").length).toBe(0);
    });
  });

  // -------------------------
  // Props
  // -------------------------
  describe("Props", () => {
    it("renders default column 1 heading", async () => {
      wrapper = await createWrapper();
      const headings = wrapper.findAll(".price-list__heading");
      expect(headings[0].text()).toBe("Cutting & Treatment");
    });

    it("renders default column 2 heading", async () => {
      wrapper = await createWrapper();
      const headings = wrapper.findAll(".price-list__heading");
      expect(headings[1].text()).toBe("Hair Colouring");
    });

    it("renders custom column 1 heading", async () => {
      wrapper = await createWrapper({ column1: { headingtext: "Cuts", items: [] } });
      expect(wrapper.findAll(".price-list__heading")[0].text()).toBe("Cuts");
    });

    it("renders custom column 2 heading", async () => {
      wrapper = await createWrapper({ column2: { headingtext: "Colour", items: [] } });
      expect(wrapper.findAll(".price-list__heading")[1].text()).toBe("Colour");
    });

    it("applies styleClassPassthrough classes", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["extra-class"] });
      expect(wrapper.find(".price-list").classes()).toContain("extra-class");
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
      expect(dts[0].text()).toBe("Cut & Blow Dry");
    });

    it("uses dd for prices", async () => {
      wrapper = await createWrapper();
      const dds = wrapper.findAll("dd");
      expect(dds.length).toBe(4);
      expect(dds[0].text()).toBe("£45");
    });
  });
});
