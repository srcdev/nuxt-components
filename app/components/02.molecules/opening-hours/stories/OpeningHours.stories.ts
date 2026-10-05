import { computed, ref } from "vue";
import OpeningHours from "../OpeningHours.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { MediaCanvas } from "~/types/components";
import type { OpeningDay, OpeningException } from "~/types/components/opening-hours";

type LineClamp = "none" | "1" | "2" | "3" | "4";
const lineClampOptions: LineClamp[] = ["none", "1", "2", "3", "4"];

// Story-only args: they drive CSS tokens, not OpeningHours props. See the argTypes entries.
type StoryArgs = InstanceType<typeof OpeningHours>["$props"] & {
  noteLineClamp: LineClamp;
  exceptionLabelLineClamp: LineClamp;
};

const shopDays: OpeningDay[] = [
  { day: 0, sessions: [{ opens: "09:00", closes: "17:30" }] },
  { day: 1, sessions: [{ opens: "09:00", closes: "17:30" }] },
  { day: 2, sessions: [{ opens: "09:00", closes: "17:30" }] },
  { day: 3, sessions: [{ opens: "09:00", closes: "20:00" }], note: "Late night opening" },
  { day: 4, sessions: [{ opens: "09:00", closes: "17:30" }] },
  { day: 5, sessions: [{ opens: "09:00", closes: "17:30" }] },
];

const lunchAndDinner = [
  { opens: "12:00", closes: "14:30", label: "Lunch" },
  { opens: "18:00", closes: "22:00", label: "Dinner" },
];

const restaurantDays: OpeningDay[] = [
  { day: 1, sessions: lunchAndDinner },
  { day: 2, sessions: lunchAndDinner },
  { day: 3, sessions: lunchAndDinner },
  { day: 4, sessions: [lunchAndDinner[0]!, { opens: "18:00", closes: "01:00", label: "Dinner" }], note: "Last orders 23:30" },
  { day: 5, sessions: [lunchAndDinner[0]!, { opens: "18:00", closes: "01:00", label: "Dinner" }], note: "Last orders 23:30" },
  { day: 6, sessions: [{ opens: "12:00", closes: "16:00", label: "Sunday lunch" }] },
];

// Relative to today so the demo never falls foul of hidePastExceptions
const isoInDays = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString("en-CA");
};

const exceptions: OpeningException[] = [
  { from: isoInDays(0), label: "Staff training", sessions: [{ opens: "12:00", closes: "17:30" }] },
  { from: isoInDays(14), to: isoInDays(16), label: "Refurbishment" },
  { from: isoInDays(30), label: "Bank holiday", sessions: [{ opens: "10:00", closes: "16:00" }] },
];

const meta: Meta<StoryArgs> = {
  title: "Molecules/OpeningHours",
  component: OpeningHours,
  argTypes: {
    noteLineClamp: {
      control: "select",
      options: lineClampOptions,
      description:
        "**Story control, not a prop.** Sets the `--opening-hours-note-line-clamp` CSS token on a wrapper so you can try it here. " +
        "To use it in an app, set the token in your own CSS, e.g. `.shop-hours { --opening-hours-note-line-clamp: 2; }`. " +
        "`1` is single-line ellipsis, `none` (the default) shows everything.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
    },
    exceptionLabelLineClamp: {
      control: "select",
      options: lineClampOptions,
      description:
        "**Story control, not a prop.** Sets the `--opening-hours-exception-label-line-clamp` CSS token on a wrapper. " +
        "To use it in an app, set the token in your own CSS, e.g. `.shop-hours { --opening-hours-exception-label-line-clamp: 1; }`.",
      table: { category: "CSS tokens (story only, set in your CSS)", defaultValue: { summary: "none" } },
    },
    days: { control: "object", description: "One entry per day (0 = Monday); missing days are closed", table: { category: "Content" } },
    exceptions: { control: "object", description: "Special dates that override the weekly pattern", table: { category: "Content" } },
    locale: { control: "text", description: "BCP 47 locale for day, date and time formatting", table: { category: "Formatting", defaultValue: { summary: "en-GB" } } },
    hour12: { control: "boolean", description: "12-hour am/pm times", table: { category: "Formatting", defaultValue: { summary: "false" } } },
    dayFormat: { control: "inline-radio", options: ["long", "short"], table: { category: "Formatting", defaultValue: { summary: "long" } } },
    groupDays: { control: "boolean", description: "Collapse consecutive identical days into a range", table: { category: "Formatting", defaultValue: { summary: "true" } } },
    weekStartsOn: { control: "inline-radio", options: ["monday", "sunday"], table: { category: "Formatting", defaultValue: { summary: "monday" } } },
    highlightToday: { control: "boolean", table: { category: "Behaviour", defaultValue: { summary: "true" } } },
    hidePastExceptions: { control: "boolean", table: { category: "Behaviour", defaultValue: { summary: "true" } } },
    timeZone: { control: "text", description: "IANA zone used to work out today, e.g. Europe/London", table: { category: "Behaviour" } },
    headingTag: { control: "select", options: ["h2", "h3", "h4", "h5", "h6"], table: { category: "Content", defaultValue: { summary: "h3" } } },
    exceptionsHeading: { control: "text", table: { category: "Labels", defaultValue: { summary: "Special opening times" } } },
    closedLabel: { control: "text", table: { category: "Labels", defaultValue: { summary: "Closed" } } },
    open24HoursLabel: { control: "text", table: { category: "Labels", defaultValue: { summary: "Open 24 hours" } } },
    byAppointmentLabel: { control: "text", table: { category: "Labels", defaultValue: { summary: "By appointment only" } } },
    toLabel: { control: "text", description: "Screen-reader text read in place of the dash", table: { category: "Labels", defaultValue: { summary: "to" } } },
    structuredData: { control: false, table: { category: "SEO" } },
    styleClassPassthrough: { control: "object", table: { category: "Styling" } },
  },
  args: {
    noteLineClamp: "none",
    exceptionLabelLineClamp: "none",
  },
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "fullWidthCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
          <div style="max-width: 48rem;"><story /></div>
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => {
    const { noteLineClamp: _noteLineClamp, exceptionLabelLineClamp: _exceptionLabelLineClamp, ...rest } = args;
    return rest;
  });
  const tokenStyles = computed(() => ({
    "--opening-hours-note-line-clamp": args.noteLineClamp,
    "--opening-hours-exception-label-line-clamp": args.exceptionLabelLineClamp,
  }));
  return { componentArgs, tokenStyles };
}

const render = (args: StoryArgs) => ({
  components: { OpeningHours },
  setup() {
    return useStorySetup(args);
  },
  template: `<div :style="tokenStyles"><OpeningHours v-bind="componentArgs" /></div>`,
});

export const Default: Story = {
  args: { days: shopDays, hour12: false, groupDays: true },
  render,
};

export const EveryDaySeparately: Story = {
  name: "Every Day Separately",
  args: { days: shopDays, groupDays: false },
  render,
};

export const RestaurantSplitSessions: Story = {
  name: "Restaurant (Split Sessions, 12-hour)",
  args: { days: restaurantDays, hour12: true },
  render,
};

export const SpecialStatuses: Story = {
  name: "24 Hours and By Appointment",
  args: {
    days: [
      { day: 0, status: "24-hours" },
      { day: 1, status: "24-hours" },
      { day: 2, status: "24-hours" },
      { day: 3, status: "24-hours" },
      { day: 4, status: "24-hours" },
      { day: 5, status: "by-appointment" },
    ],
  },
  render,
};

export const WithExceptions: Story = {
  name: "With Special Dates",
  args: { days: shopDays, exceptions },
  render,
};

export const Localised: Story = {
  name: "Localised (French)",
  args: {
    days: shopDays,
    exceptions,
    locale: "fr-FR",
    closedLabel: "Fermé",
    toLabel: "à",
    exceptionsHeading: "Horaires exceptionnels",
  },
  render,
};

// ─── Stress test ──────────────────────────────────────────────────────────────

const stressDays: OpeningDay[] = [
  {
    day: 0,
    sessions: [
      { opens: "09:00", closes: "12:00", label: "Vormittagssprechstunde nur für Bestandskundinnen und Bestandskunden" },
      { opens: "13:00", closes: "17:30", label: "Nachmittagssprechstundeohneleerzeichenunddasziemlichlang" },
    ],
    note: "Bitte beachten Sie, dass wir an diesem Tag zusätzlich telefonisch erreichbar sind, Rückrufe aber erst ab dem nächsten Werktag erfolgen.",
  },
  { day: 1, sessions: [{ opens: "22:00", closes: "02:00", label: "Overnight" }], note: "Closes after midnight" },
  { day: 2, sessions: [{ opens: "abc", closes: "25:99" }], note: "Malformed times are shown as written" },
  {
    day: 3,
    sessions: Array.from({ length: 6 }, (_, i) => ({ opens: `${String(8 + i * 2).padStart(2, "0")}:00`, closes: `${String(9 + i * 2).padStart(2, "0")}:00` })),
  },
  { day: 4, status: "open", sessions: [], note: "Status open with no sessions, shown as closed" },
  { day: 5, status: "by-appointment", note: "💇‍♀️ <b>not bold</b> https://example.com/a/very/long/booking/link/that/never/breaks/segmentsegment" },
  { day: 6, status: "24-hours", note: "مفتوح طوال اليوم" },
];

const stressExceptions: OpeningException[] = [
  {
    from: isoInDays(1),
    label: "Betriebsversammlungundinventurwochenendeohneleerzeichen und danach noch eine sehr lange Beschreibung",
    sessions: [{ opens: "10:00", closes: "12:00" }],
  },
  { from: isoInDays(20), to: isoInDays(18), label: "Reversed range (to before from)" },
  { from: isoInDays(5), label: "Duplicate date" },
  { from: isoInDays(5), label: "Duplicate date" },
  { from: "not-a-date", label: "Invalid date" },
  { from: isoInDays(40), label: "" },
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    days: stressDays,
    exceptions: stressExceptions,
    hidePastExceptions: false,
    groupDays: true,
    locale: "not a locale!!",
    timeZone: "Mars/Base",
    exceptionsHeading: "Sonderöffnungszeiten an Feiertagen, Brückentagen und während betrieblicher Veranstaltungen",
    closedLabel: "Geschlossen",
    open24HoursLabel: "Rund um die Uhr geöffnet, auch an Sonn- und Feiertagen",
    byAppointmentLabel: "Ausschließlich nach vorheriger telefonischer Terminvereinbarung",
    toLabel: "bis",
  },
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Deliberately hostile data to find breakage: an invalid locale (falls back to en-GB) and time zone (falls back to the browser's), " +
          "malformed times like abc and 25:99 (shown as written, not reformatted), a session crossing midnight, six sessions in a day, " +
          "status open with no sessions (shown as closed), long German session labels, notes, status labels and exceptions heading, an unbroken exception label, " +
          "emoji, HTML-like text (must render as text), a long URL, right-to-left Arabic, a reversed date range (shown the right way round), " +
          "duplicate exception dates, an invalid date (shown as written) and an empty label. " +
          "Check at every canvas width: nothing overflows, each session's times stay on one line while its label wraps, and the hours " +
          "column never takes more than 60% of the row. Try the line-clamp controls too: they're CSS tokens set by the story, not props.",
      },
    },
  },
};
