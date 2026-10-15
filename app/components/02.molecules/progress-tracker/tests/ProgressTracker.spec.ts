import { describe, it, expect, vi, afterEach } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import ProgressTracker from "../ProgressTracker.vue";
import type { ProgressTrackerStep } from "~/types/components";

const steps: ProgressTrackerStep[] = [
  { title: "Create your account", body: "Enter your email and choose a password." },
  { title: "Verify your email", body: "Click the link we sent to your inbox." },
  { title: "Choose a plan" },
];

let wrapper: VueWrapper | undefined;

const mountTracker = async (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
  wrapper = await mountSuspended(ProgressTracker, {
    props: { steps, modelValue: 1, ...props },
    slots,
    attachTo: document.body,
  });
  return wrapper;
};

const stepClasses = (w: VueWrapper) => w.findAll(".progress-tracker-step").map((step) => step.classes());

describe("ProgressTracker", () => {
  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.restoreAllMocks();
  });

  it("mounts without error", async () => {
    await mountTracker();
    expect(wrapper!.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    await mountTracker();
    expect(wrapper!.html()).toMatchSnapshot();
  });

  // ─── Rows ────────────────────────────────────────────────────────────────

  it("renders one row per step with its title and body", async () => {
    await mountTracker();
    expect(wrapper!.findAll("li")).toHaveLength(3);
    expect(wrapper!.findAll(".progress-tracker-title")[0]!.text()).toContain("Create your account");
    expect(wrapper!.findAll(".progress-tracker-body")[1]!.text()).toBe("Click the link we sent to your inbox.");
  });

  it("omits the body paragraph when a step has no body", async () => {
    await mountTracker();
    expect(wrapper!.findAll(".progress-tracker-step")[2]!.find(".progress-tracker-body").exists()).toBe(false);
  });

  it("renders nothing but the root when there are no steps", async () => {
    await mountTracker({ steps: [], modelValue: 0 });
    expect(wrapper!.find(".progress-tracker-header").exists()).toBe(false);
    expect(wrapper!.find("ol").exists()).toBe(false);
  });

  it("renders the list as an ol", async () => {
    await mountTracker();
    expect(wrapper!.find(".progress-tracker-list").element.tagName).toBe("OL");
  });

  it("uses headingTag for step titles", async () => {
    await mountTracker({ headingTag: "h4" });
    expect(wrapper!.findAll("h4")).toHaveLength(3);
  });

  // ─── States ──────────────────────────────────────────────────────────────

  it("marks steps before the model done, the model's step current and later steps upcoming", async () => {
    await mountTracker();
    expect(stepClasses(wrapper!)[0]).toContain("is-done");
    expect(stepClasses(wrapper!)[1]).toContain("is-current");
    expect(stepClasses(wrapper!)[2]).toContain("is-upcoming");
  });

  it("shows the tick icon for done steps and the number otherwise", async () => {
    await mountTracker();
    const indicators = wrapper!.findAll(".progress-tracker-indicator");
    expect(indicators[0]!.find(".progress-tracker-indicator-icon").exists()).toBe(true);
    expect(indicators[1]!.text()).toBe("2");
    expect(indicators[2]!.text()).toBe("3");
  });

  it("hides indicators from assistive technology", async () => {
    await mountTracker();
    for (const indicator of wrapper!.findAll(".progress-tracker-indicator")) {
      expect(indicator.attributes("aria-hidden")).toBe("true");
    }
  });

  it("adds doneLabel as screen-reader text to done titles only", async () => {
    await mountTracker({ doneLabel: "Erledigt" });
    const titles = wrapper!.findAll(".progress-tracker-title");
    expect(titles[0]!.find(".sr-only").text()).toBe(", Erledigt");
    expect(titles[1]!.find(".sr-only").exists()).toBe(false);
  });

  it("sets aria-current='step' on the current title only", async () => {
    await mountTracker();
    const titles = wrapper!.findAll(".progress-tracker-title");
    expect(titles.map((title) => title.attributes("aria-current"))).toEqual([undefined, "step", undefined]);
  });

  it("marks every step done and the root complete when the model equals steps.length", async () => {
    await mountTracker({ modelValue: 3 });
    expect(stepClasses(wrapper!).every((classes) => classes.includes("is-done"))).toBe(true);
    expect(wrapper!.classes()).toContain("is-complete");
  });

  it("restyles steps when the model changes", async () => {
    await mountTracker({ focusOnChange: false });
    await wrapper!.setProps({ modelValue: 2 });
    expect(stepClasses(wrapper!)[1]).toContain("is-done");
    expect(stepClasses(wrapper!)[2]).toContain("is-current");
  });

  it("renders no interactive elements of its own", async () => {
    await mountTracker();
    expect(wrapper!.findAll("button, a, input")).toHaveLength(0);
  });

  // ─── Clamping ────────────────────────────────────────────────────────────

  it("clamps a negative model to the first step", async () => {
    await mountTracker({ modelValue: -1 });
    expect(stepClasses(wrapper!)[0]).toContain("is-current");
  });

  it("clamps a model above steps.length to complete", async () => {
    await mountTracker({ modelValue: 99 });
    expect(wrapper!.classes()).toContain("is-complete");
    expect(wrapper!.find(".progress-tracker-bar").attributes("aria-valuenow")).toBe("3");
  });

  it("floors a fractional model", async () => {
    await mountTracker({ modelValue: 1.7 });
    expect(stepClasses(wrapper!)[1]).toContain("is-current");
  });

  // ─── Header ──────────────────────────────────────────────────────────────

  it("fills stepLabel with the current step number and total", async () => {
    await mountTracker();
    expect(wrapper!.find(".progress-tracker-label").text()).toBe("Step 2 of 3");
  });

  it("uses a translated stepLabel", async () => {
    await mountTracker({ stepLabel: "Schritt {current} von {total}" });
    expect(wrapper!.find(".progress-tracker-label").text()).toBe("Schritt 2 von 3");
  });

  it("shows completeLabel when every step is done", async () => {
    await mountTracker({ modelValue: 3, completeLabel: "Alles erledigt" });
    expect(wrapper!.find(".progress-tracker-label").text()).toBe("Alles erledigt");
  });

  it("announces the header label politely", async () => {
    await mountTracker();
    expect(wrapper!.find(".progress-tracker-label").attributes("aria-live")).toBe("polite");
  });

  it("exposes the bar as a progressbar with min, max, done count and value text", async () => {
    await mountTracker();
    const bar = wrapper!.find(".progress-tracker-bar");
    expect(bar.attributes("role")).toBe("progressbar");
    expect(bar.attributes("aria-valuemin")).toBe("0");
    expect(bar.attributes("aria-valuemax")).toBe("3");
    expect(bar.attributes("aria-valuenow")).toBe("1");
    expect(bar.attributes("aria-valuetext")).toBe("Step 2 of 3");
  });

  it("sizes the bar fill from the done count", async () => {
    await mountTracker({ modelValue: 3 });
    const style = (wrapper!.find(".progress-tracker-bar").element as HTMLElement).style;
    expect(style.getPropertyValue("--_progress-tracker-progress")).toBe("1");
  });

  // ─── Step slot ───────────────────────────────────────────────────────────

  it("renders step-{n} only for the current step, with the heading id", async () => {
    await mountTracker(
      {},
      {
        "step-0": "<p class='slot-0'>Step one form</p>",
        "step-1": "<p class='slot-1' :aria-labelledby='params.headingId'>Step two form</p>",
      }
    );
    expect(wrapper!.find(".slot-0").exists()).toBe(false);
    const slot = wrapper!.find(".slot-1");
    expect(slot.exists()).toBe(true);
    expect(slot.attributes("aria-labelledby")).toBe(wrapper!.findAll(".progress-tracker-title")[1]!.attributes("id"));
  });

  it("passes the step and index to step-{n}", async () => {
    await mountTracker({}, { "step-1": "<p class='slot-1'>{{ params.index }}: {{ params.step.title }}</p>" });
    expect(wrapper!.find(".slot-1").text()).toBe("1: Verify your email");
  });

  it("renders no slot wrapper when the current step has no slot", async () => {
    await mountTracker();
    expect(wrapper!.find(".progress-tracker-slot").exists()).toBe(false);
  });

  // ─── Focus ───────────────────────────────────────────────────────────────

  it("moves focus to the new current title when the model changes", async () => {
    await mountTracker();
    await wrapper!.setProps({ modelValue: 2 });
    await nextTick();
    expect(document.activeElement).toBe(wrapper!.findAll(".progress-tracker-title")[2]!.element);
  });

  it("moves focus to the header label when every step is complete", async () => {
    await mountTracker();
    await wrapper!.setProps({ modelValue: 3 });
    await nextTick();
    expect(document.activeElement).toBe(wrapper!.find(".progress-tracker-label").element);
  });

  it("does not move focus on mount", async () => {
    await mountTracker();
    expect(document.activeElement).toBe(document.body);
  });

  it("does not move focus when focusOnChange is false", async () => {
    await mountTracker({ focusOnChange: false });
    await wrapper!.setProps({ modelValue: 2 });
    await nextTick();
    expect(document.activeElement).toBe(document.body);
  });

  // ─── Props ───────────────────────────────────────────────────────────────

  it("uses doneIcon for the tick", async () => {
    await mountTracker({ doneIcon: "mdi:check" });
    expect(wrapper!.find(".progress-tracker-indicator-icon").html()).toContain("mdi");
  });

  it("applies styleClassPassthrough and updates it after mount", async () => {
    await mountTracker({ styleClassPassthrough: ["onboarding"] });
    expect(wrapper!.classes()).toContain("onboarding");
    await wrapper!.setProps({ styleClassPassthrough: ["checkout"] });
    expect(wrapper!.classes()).toContain("checkout");
    expect(wrapper!.classes()).not.toContain("onboarding");
  });
});
