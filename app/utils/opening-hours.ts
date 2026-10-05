import type {
  OpeningDay,
  OpeningException,
  OpeningHoursSpecification,
  OpeningSession,
  OpeningStatus,
} from "~/types/components/opening-hours";

const SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// "HH:MM" from 00:00 to 23:59, else null so the caller can show the raw value instead of throwing
export const parseOpeningTime = (time: string): { hours: number; minutes: number } | null => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours < 24 && minutes < 60 ? { hours, minutes } : null;
};

// A real calendar date in "YYYY-MM-DD" form, as a UTC midnight Date, else null
export const parseOpeningDate = (iso: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? date : null;
};

// "open" with no sessions has nothing to show, so it's treated as closed
export const resolveOpeningStatus = (entry: { status?: OpeningStatus; sessions?: OpeningSession[] }): OpeningStatus => {
  const status = entry.status ?? "open";
  return status === "open" && !entry.sessions?.length ? "closed" : status;
};

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
