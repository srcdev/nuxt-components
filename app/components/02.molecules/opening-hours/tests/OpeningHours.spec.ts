import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import OpeningHours from "../OpeningHours.vue";
import type { OpeningDay, OpeningException } from "~/types/components/opening-hours";

const weekdays: OpeningDay[] = [0, 1, 2, 3, 4, 5].map((day) => ({
  day: day as OpeningDay["day"],
  sessions: [{ opens: "09:00", closes: "17:30" }],
}));

const createWrapper = async (props: Record<string, unknown> = {}) =>
  mountSuspended(OpeningHours, { props: { days: weekdays, ...props } });

const rowTexts = (wrapper: Awaited<ReturnType<typeof createWrapper>>, selector = ".opening-hours__list") =>
  wrapper
    .find(selector)
    .findAll(".opening-hours__row")
    .map((row) =>
      row
        .findAll("*")
        .filter((node) => node.element.children.length === 0)
        .map((node) => node.text())
        .filter(Boolean)
        .join(" ")
    );

describe("OpeningHours", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>> | undefined;

  afterEach(() => {
    wrapper?.unmount();
  });

  describe("Snapshots", () => {
    it("default", async () => {
      vi.setSystemTime(new Date("2026-09-28T12:00:00Z"));
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe("Rendering", () => {
    it("mounts without error", async () => {
      wrapper = await createWrapper();
      expect(wrapper.vm).toBeTruthy();
    });

    it("groups consecutive identical days and fills missing days as closed", async () => {
      wrapper = await createWrapper();
      expect(rowTexts(wrapper)).toEqual(["Monday – to Saturday 09:00 – to 17:30", "Sunday Closed"]);
    });

    it("lists every day separately when groupDays is false", async () => {
      wrapper = await createWrapper({ groupDays: false });
      expect(wrapper.findAll(".opening-hours__row").length).toBe(7);
    });

    it("starts the week on Sunday when weekStartsOn is sunday", async () => {
      wrapper = await createWrapper({ weekStartsOn: "sunday" });
      expect(rowTexts(wrapper)[0]).toBe("Sunday Closed");
    });

    it("does not group non-consecutive identical days", async () => {
      wrapper = await createWrapper({
        days: [
          { day: 0, sessions: [{ opens: "09:00", closes: "17:00" }] },
          { day: 2, sessions: [{ opens: "09:00", closes: "17:00" }] },
        ],
      });
      expect(rowTexts(wrapper).map((row) => row.split(" ")[0])).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday"]);
    });

    it("renders split sessions with labels", async () => {
      wrapper = await createWrapper({
        days: [
          {
            day: 0,
            sessions: [
              { opens: "12:00", closes: "14:30", label: "Lunch" },
              { opens: "18:00", closes: "22:00", label: "Dinner" },
            ],
          },
        ],
      });
      const sessions = wrapper.find(".opening-hours__row").findAll(".opening-hours__session");
      expect(sessions.length).toBe(2);
      expect(sessions[0]!.find(".opening-hours__session-label").text()).toBe("Lunch");
      expect(sessions[1]!.findAll("time").map((t) => t.attributes("datetime"))).toEqual(["18:00", "22:00"]);
    });

    it("renders overnight sessions as given", async () => {
      wrapper = await createWrapper({ days: [{ day: 4, sessions: [{ opens: "18:00", closes: "02:00" }] }] });
      expect(wrapper.find("[data-status='open'] .opening-hours__hours").text()).toContain("02:00");
    });

    it("renders 24-hour and by-appointment statuses", async () => {
      wrapper = await createWrapper({
        days: [
          { day: 0, status: "24-hours" },
          { day: 1, status: "by-appointment" },
        ],
      });
      const statuses = wrapper.findAll(".opening-hours__status").map((s) => s.text());
      expect(statuses).toEqual(["Open 24 hours", "By appointment only", "Closed"]);
    });

    it("renders a note", async () => {
      wrapper = await createWrapper({
        days: [{ day: 0, sessions: [{ opens: "12:00", closes: "22:00" }], note: "Last orders 21:30" }],
      });
      expect(wrapper.find(".opening-hours__note").text()).toBe("Last orders 21:30");
    });
  });

  describe("Formatting", () => {
    it("formats times in 12-hour form when hour12 is true", async () => {
      wrapper = await createWrapper({ hour12: true, locale: "en-US" });
      expect(wrapper.find(".opening-hours__session").text()).toMatch(/9:00\sAM.*5:30\sPM/);
    });

    it("uses short day names when dayFormat is short", async () => {
      wrapper = await createWrapper({ dayFormat: "short" });
      expect(wrapper.find(".opening-hours__days").text()).toContain("Mon");
      expect(wrapper.find(".opening-hours__days").text()).not.toContain("Monday");
    });

    it("localises day names", async () => {
      wrapper = await createWrapper({ locale: "fr-FR" });
      expect(wrapper.find(".opening-hours__days").text()).toContain("lundi");
    });
  });

  describe("Labels", () => {
    it("uses custom labels", async () => {
      wrapper = await createWrapper({ closedLabel: "Fermé", toLabel: "à" });
      expect(wrapper.text()).toContain("Fermé");
      expect(wrapper.find(".opening-hours__session .sr-only").text()).toBe("à");
    });
  });

  describe("Today highlight", () => {
    it("marks the row containing today after mount", async () => {
      vi.setSystemTime(new Date("2026-09-27T12:00:00Z")); // Sunday
      wrapper = await createWrapper();
      await nextTick();
      const today = wrapper.find("[data-today]");
      expect(today.text()).toContain("Sunday");
      expect(today.attributes("aria-current")).toBe("date");
    });

    it("highlights a grouped row when today falls inside it", async () => {
      vi.setSystemTime(new Date("2026-09-29T12:00:00Z")); // Tuesday
      wrapper = await createWrapper();
      await nextTick();
      expect(wrapper.find("[data-today]").text()).toContain("Monday");
    });

    it("does not highlight when highlightToday is false", async () => {
      wrapper = await createWrapper({ highlightToday: false });
      await nextTick();
      expect(wrapper.find("[data-today]").exists()).toBe(false);
    });
  });

  describe("Exceptions", () => {
    const exceptions: OpeningException[] = [
      { from: "2026-12-25", to: "2026-12-26", label: "Christmas" },
      { from: "2026-12-31", label: "New Year's Eve", sessions: [{ opens: "10:00", closes: "14:00" }] },
      { from: "2026-01-01", label: "Past" },
    ];

    it("renders upcoming exceptions with a heading and hides past ones", async () => {
      vi.setSystemTime(new Date("2026-09-27T12:00:00Z"));
      wrapper = await createWrapper({ exceptions });
      await nextTick();
      expect(wrapper.find(".opening-hours__exceptions-heading").element.tagName).toBe("H3");
      const rows = rowTexts(wrapper, ".opening-hours__exceptions");
      expect(rows).toEqual([
        "Christmas 25 December – to 26 December Closed",
        "New Year's Eve 31 December 10:00 – to 14:00",
      ]);
    });

    it("keeps past exceptions when hidePastExceptions is false", async () => {
      vi.setSystemTime(new Date("2026-09-27T12:00:00Z"));
      wrapper = await createWrapper({ exceptions, hidePastExceptions: false });
      await nextTick();
      expect(wrapper.find(".opening-hours__exceptions").findAll(".opening-hours__row").length).toBe(3);
    });

    it("uses headingTag and omits the heading when exceptionsHeading is empty", async () => {
      wrapper = await createWrapper({ exceptions, headingTag: "h4" });
      expect(wrapper.find("h4.opening-hours__exceptions-heading").exists()).toBe(true);
      await wrapper.setProps({ exceptionsHeading: "" });
      expect(wrapper.find(".opening-hours__exceptions-heading").exists()).toBe(false);
    });

    it("does not render the exceptions block without exceptions", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".opening-hours__exceptions").exists()).toBe(false);
    });
  });

  describe("Accessibility", () => {
    it("uses dl/dt/dd and time elements", async () => {
      wrapper = await createWrapper();
      expect(wrapper.findAll("dt").length).toBe(2);
      expect(wrapper.findAll("dd").length).toBe(2);
      expect(wrapper.find("time").attributes("datetime")).toBe("09:00");
    });

    it("hides the visual dash from assistive tech", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find(".opening-hours__session [aria-hidden='true']").text()).toBe("–");
    });
  });

  describe("Props", () => {
    it("updates classes when styleClassPassthrough changes", async () => {
      wrapper = await createWrapper({ styleClassPassthrough: ["first-class"] });
      await wrapper.setProps({ styleClassPassthrough: ["second-class"] });
      const classes = wrapper.find(".opening-hours").classes();
      expect(classes).toContain("second-class");
      expect(classes).not.toContain("first-class");
    });
  });
});
