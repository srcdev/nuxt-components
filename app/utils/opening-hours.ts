import type {
  OpeningDay,
  OpeningException,
  OpeningHoursSpecification,
  OpeningSession,
  OpeningStatus,
} from "~/types/components/opening-hours";

const SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const resolveOpeningStatus = (entry: { status?: OpeningStatus; sessions?: OpeningSession[] }): OpeningStatus =>
  entry.status ?? (entry.sessions?.length ? "open" : "closed");

const specsFor = (
  entry: { status?: OpeningStatus; sessions?: OpeningSession[] },
  extra: Partial<OpeningHoursSpecification>
): OpeningHoursSpecification[] => {
  switch (resolveOpeningStatus(entry)) {
    case "open":
      return (entry.sessions ?? []).map(({ opens, closes }) => ({
        "@type": "OpeningHoursSpecification",
        ...extra,
        opens,
        closes,
      }));
    case "24-hours":
      return [{ "@type": "OpeningHoursSpecification", ...extra, opens: "00:00", closes: "23:59" }];
    case "closed":
      // schema.org marks a closed special date with opens === closes
      return extra.validFrom ? [{ "@type": "OpeningHoursSpecification", ...extra, opens: "00:00", closes: "00:00" }] : [];
    default:
      return [];
  }
};

export const buildOpeningHoursSpecification = (
  days: OpeningDay[],
  exceptions: OpeningException[] = []
): OpeningHoursSpecification[] => [
  ...days.flatMap((day) => specsFor(day, { dayOfWeek: `https://schema.org/${SCHEMA_DAYS[day.day]}` })),
  ...exceptions.flatMap((exception) =>
    specsFor(exception, { validFrom: exception.from, validThrough: exception.to ?? exception.from })
  ),
];
