/** 0 = Monday ... 6 = Sunday */
export type OpeningWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type OpeningStatus = "open" | "closed" | "24-hours" | "by-appointment";

export interface OpeningSession {
  /** 24-hour "HH:MM" */
  opens: string;
  /** 24-hour "HH:MM"; earlier than `opens` means it closes after midnight */
  closes: string;
  label?: string;
}

export interface OpeningDay {
  day: OpeningWeekday;
  /** Defaults to "open" when sessions are given, otherwise "closed" */
  status?: OpeningStatus;
  sessions?: OpeningSession[];
  note?: string;
}

export interface OpeningException {
  /** "YYYY-MM-DD" */
  from: string;
  /** "YYYY-MM-DD", inclusive; omit for a single day */
  to?: string;
  label?: string;
  status?: OpeningStatus;
  sessions?: OpeningSession[];
  note?: string;
}

export interface OpeningHoursStructuredData {
  /** schema.org type, e.g. "HairSalon", "Restaurant" */
  type?: string;
  name?: string;
  /** Match the @id of the site's main business JSON-LD so search engines merge them */
  id?: string;
}

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek?: string | string[];
  opens: string;
  closes: string;
  validFrom?: string;
  validThrough?: string;
}
