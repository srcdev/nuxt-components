import OpeningHours from "../OpeningHours.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { OpeningDay, OpeningException } from "~/types/components/opening-hours";

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

const meta: Meta<typeof OpeningHours> = {
  title: "Molecules/OpeningHours",
  component: OpeningHours,
  argTypes: {
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
  decorators: [() => ({ template: `<div style="max-width: 48rem;"><story /></div>` })],
};

export default meta;
type Story = StoryObj<typeof OpeningHours>;

const render: Story["render"] = (args) => ({
  components: { OpeningHours },
  setup() {
    return { args };
  },
  template: `<OpeningHours v-bind="args" />`,
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
