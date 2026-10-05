# OpeningHours Component

## Overview

`OpeningHours` (`app/components/02.molecules/opening-hours/`) renders a business's weekly opening
hours as a `<dl>`, plus an optional "special opening times" list for bank holidays, closures etc.
Data is authored **per day**; the component groups consecutive identical days into ranges
("Monday – Saturday") itself, so a single day change never leaves a hand-written range stale.

Covers: single sessions, split sessions (restaurant lunch/dinner), closed days, 24 hours,
by appointment, overnight sessions (closes after midnight), per-day notes, date/date-range
exceptions, today highlight, schema.org JSON-LD. Not included (yet): a live "open now" status.

---

## Props reference

> **Hyphenation rule**: write camelCase props hyphenated in templates (`:hour12`, `group-days`).

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `:days` | `OpeningDay[]` | (required) | One entry per day; missing days render as closed |
| `:exceptions` | `OpeningException[]` | `[]` | Special dates, listed under their own heading |
| `locale` | `string` | `"en-GB"` | Drives day names, dates and time format via `Intl` |
| `:hour12` | `boolean` | `false` | 12-hour am/pm times |
| `day-format` | `"long" \| "short"` | `"long"` | "Monday" vs "Mon" |
| `:group-days` | `boolean` | `true` | Collapse consecutive identical days; `false` lists all seven |
| `week-starts-on` | `"monday" \| "sunday"` | `"monday"` | Row order |
| `:highlight-today` | `boolean` | `true` | Marks today's row with `data-today` + `aria-current="date"` |
| `:hide-past-exceptions` | `boolean` | `true` | Drops exceptions whose end date has passed |
| `time-zone` | `string` | visitor's | IANA zone used to work out "today"; set to the business's zone |
| `heading-tag` | `"h2"`–`"h6"` | `"h3"` | Level of the exceptions heading |
| `exceptions-heading` | `string` | `"Special opening times"` | `""` omits the heading |
| `closed-label` | `string` | `"Closed"` | |
| `open24-hours-label` | `string` | `"Open 24 hours"` | |
| `by-appointment-label` | `string` | `"By appointment only"` | |
| `to-label` | `string` | `"to"` | Screen-reader word read in place of the visual dash |
| `:structured-data` | `OpeningHoursStructuredData` | `undefined` | When set, emits LocalBusiness JSON-LD via `useHead` (read once at setup) |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Classes on the root; reactive |

All visible text is a prop or comes from `Intl`, so passing `locale` plus translated labels fully
localises it.

### Data shape

Importable: `import type { OpeningDay, OpeningException, OpeningSession, OpeningStatus, OpeningHoursStructuredData } from "srcdev-nuxt-components"`
(source: `app/types/components/opening-hours.d.ts`).

```ts
type OpeningWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Monday, 6 = Sunday
type OpeningStatus = "open" | "closed" | "24-hours" | "by-appointment";

interface OpeningSession { opens: string; closes: string; label?: string } // 24h "HH:MM"
interface OpeningDay {
  day: OpeningWeekday;
  status?: OpeningStatus;     // default: "open" if sessions given, else "closed"
  sessions?: OpeningSession[];
  note?: string;
}
interface OpeningException {
  from: string;               // "YYYY-MM-DD"
  to?: string;                // inclusive, omit for one day
  label?: string;             // "Christmas"
  status?: OpeningStatus;     // same default rule; no sessions = closed
  sessions?: OpeningSession[];
  note?: string;
}
interface OpeningHoursStructuredData { type?: string; name?: string; id?: string }
```

Times are always authored as 24-hour strings; `hour12` only changes the display. A `closes`
earlier than `opens` means the session runs past midnight and is displayed as given.

---

## Behaviour notes

- Grouping compares status, sessions and note; only **consecutive** days (in `week-starts-on`
  order) group. No wrap-around from Sunday to Monday.
- Exceptions don't alter the weekly table; they are listed separately.
- **Bad data never throws** (since 2026-10-05): a time that isn't a valid `HH:MM` from `00:00` to
  `23:59` (e.g. `"abc"`, `"25:99"`, `"24:00"`) and an exception date that isn't a real
  `YYYY-MM-DD` are shown exactly as written. An invalid `locale` falls back to `en-GB`, and an
  invalid `timeZone` to the browser's own. An exception whose `to` is before its `from` is shown
  the right way round, and duplicate exception dates both render. The checks are the
  auto-imported `parseOpeningTime` and `parseOpeningDate` utils (`app/utils/opening-hours.ts`).
- A session that closes after midnight (`22:00`–`02:00`) displays as written; schema.org reads
  `closes` before `opens` as the next day.
- `status: "open"` with no sessions is treated as closed (since 2026-10-05): the row shows
  `closedLabel`, gets `data-status="closed"`, and structured data treats it as closed too.
- Long text wraps rather than overflowing; notes and exception labels have line-clamp tokens
  (`CONSUMER-STYLING.md`). The `StressTest` story covers the worst-case data.
- Today's highlight and past-exception hiding run in `onMounted`, never on the server, so cached
  HTML can't carry a stale day. Past exceptions are briefly visible before hydration.
- **Structured data**: emits `{ "@type": structuredData.type ?? "LocalBusiness", "@id", name,
  openingHoursSpecification }`. If the site already has a main business JSON-LD block, either pass
  the same `id` so search engines merge the two, or skip the prop and call the auto-imported
  `buildOpeningHoursSpecification(days, exceptions)` util (`app/utils/opening-hours.ts`) to add
  the hours to the existing block. Closed and by-appointment weekly days are omitted; closed
  exceptions use `opens = closes = "00:00"` per schema.org; 24 hours uses `00:00`–`23:59`.

---

## Usage

```vue
<OpeningHours :days="openingDays" :exceptions="specialDates" time-zone="Europe/London" />
```

Restaurant with split sessions, 12-hour display and JSON-LD:

```vue
<OpeningHours
  :days="restaurantDays"
  :hour12="true"
  time-zone="Europe/London"
  :structured-data="{ type: 'Restaurant', name: 'The Anchor', id: 'https://example.com/#business' }"
/>
```

```ts
const restaurantDays: OpeningDay[] = [
  { day: 1, sessions: [{ opens: "12:00", closes: "14:30", label: "Lunch" }, { opens: "18:00", closes: "22:00", label: "Dinner" }] },
  { day: 5, sessions: [{ opens: "18:00", closes: "01:00" }], note: "Last orders 23:30" },
];
```

Styling: `--opening-hours-*` tokens, see `CONSUMER-STYLING.md` next to the component.
