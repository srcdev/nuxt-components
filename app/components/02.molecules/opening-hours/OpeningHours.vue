<template>
  <div class="opening-hours" :class="elementClasses">
    <dl class="opening-hours__list">
      <div
        v-for="row in weeklyRows"
        :key="row.key"
        class="opening-hours__row"
        :data-status="row.status"
        :data-today="row.isToday || undefined"
        :aria-current="row.isToday ? 'date' : undefined"
      >
        <dt class="opening-hours__days">
          <span>{{ row.start }}</span>
          <template v-if="row.end">
            <span aria-hidden="true"> – </span>
            <span class="sr-only"> {{ toLabel }} </span>
            <span>{{ row.end }}</span>
          </template>
        </dt>
        <dd class="opening-hours__hours">
          <template v-if="row.status === 'open'">
            <span v-for="(session, index) in row.sessions" :key="index" class="opening-hours__session">
              <span v-if="session.label" class="opening-hours__session-label">{{ session.label }}</span>
              <time :datetime="session.opens">{{ formatTime(session.opens) }}</time>
              <span aria-hidden="true"> – </span>
              <span class="sr-only"> {{ toLabel }} </span>
              <time :datetime="session.closes">{{ formatTime(session.closes) }}</time>
            </span>
          </template>
          <span v-else class="opening-hours__status">{{ statusLabel(row.status) }}</span>
          <span v-if="row.note" class="opening-hours__note">{{ row.note }}</span>
        </dd>
      </div>
    </dl>

    <div v-if="exceptionRows.length" class="opening-hours__exceptions">
      <component :is="headingTag" v-if="exceptionsHeading" class="opening-hours__exceptions-heading">
        {{ exceptionsHeading }}
      </component>
      <dl class="opening-hours__list">
        <div
          v-for="row in exceptionRows"
          :key="row.key"
          class="opening-hours__row"
          :data-status="row.status"
          :data-today="row.isToday || undefined"
          :aria-current="row.isToday ? 'date' : undefined"
        >
          <dt class="opening-hours__days">
            <span v-if="row.label" class="opening-hours__exception-label">{{ row.label }}</span>
            <span class="opening-hours__date">
              <time :datetime="row.from">{{ row.start }}</time>
              <template v-if="row.end">
                <span aria-hidden="true"> – </span>
                <span class="sr-only"> {{ toLabel }} </span>
                <time :datetime="row.to ?? undefined">{{ row.end }}</time>
              </template>
            </span>
          </dt>
          <dd class="opening-hours__hours">
            <template v-if="row.status === 'open'">
              <span v-for="(session, index) in row.sessions" :key="index" class="opening-hours__session">
                <span v-if="session.label" class="opening-hours__session-label">{{ session.label }}</span>
                <time :datetime="session.opens">{{ formatTime(session.opens) }}</time>
                <span aria-hidden="true"> – </span>
                <span class="sr-only"> {{ toLabel }} </span>
                <time :datetime="session.closes">{{ formatTime(session.closes) }}</time>
              </span>
            </template>
            <span v-else class="opening-hours__status">{{ statusLabel(row.status) }}</span>
            <span v-if="row.note" class="opening-hours__note">{{ row.note }}</span>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  OpeningDay,
  OpeningException,
  OpeningHoursStructuredData,
  OpeningSession,
  OpeningStatus,
  OpeningWeekday,
} from "~/types/components/opening-hours";

interface Props {
  days: OpeningDay[];
  exceptions?: OpeningException[];
  locale?: string;
  hour12?: boolean;
  dayFormat?: "long" | "short";
  groupDays?: boolean;
  weekStartsOn?: "monday" | "sunday";
  highlightToday?: boolean;
  hidePastExceptions?: boolean;
  timeZone?: string;
  headingTag?: "h2" | "h3" | "h4" | "h5" | "h6";
  exceptionsHeading?: string;
  closedLabel?: string;
  open24HoursLabel?: string;
  byAppointmentLabel?: string;
  toLabel?: string;
  structuredData?: OpeningHoursStructuredData;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  exceptions: () => [],
  locale: "en-GB",
  hour12: false,
  dayFormat: "long",
  groupDays: true,
  weekStartsOn: "monday",
  highlightToday: true,
  hidePastExceptions: true,
  timeZone: undefined,
  headingTag: "h3",
  exceptionsHeading: "Special opening times",
  closedLabel: "Closed",
  open24HoursLabel: "Open 24 hours",
  byAppointmentLabel: "By appointment only",
  toLabel: "to",
  structuredData: undefined,
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

// Client-only so cached/prerendered HTML never bakes in a stale "today"
const todayIso = ref<string | null>(null);

onMounted(() => {
  todayIso.value = new Intl.DateTimeFormat("en-CA", {
    timeZone: props.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
});

const parseIsoDate = (iso: string) => {
  const [y = 0, m = 1, d = 1] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

const todayWeekday = computed<OpeningWeekday | null>(() =>
  todayIso.value ? (((parseIsoDate(todayIso.value).getUTCDay() + 6) % 7) as OpeningWeekday) : null
);

const dayFormatter = computed(
  () => new Intl.DateTimeFormat(props.locale, { weekday: props.dayFormat, timeZone: "UTC" })
);
const timeFormatter = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      hour: props.hour12 ? "numeric" : "2-digit",
      minute: "2-digit",
      hour12: props.hour12,
      timeZone: "UTC",
    })
);
const dateFormatter = computed(
  () => new Intl.DateTimeFormat(props.locale, { day: "numeric", month: "long", timeZone: "UTC" })
);

// 1 Jan 2024 was a Monday
const dayName = (day: OpeningWeekday) => dayFormatter.value.format(new Date(Date.UTC(2024, 0, 1 + day)));

const formatTime = (time: string) => {
  const [h = 0, m = 0] = time.split(":").map(Number);
  return timeFormatter.value.format(new Date(Date.UTC(2024, 0, 1, h, m)));
};

const statusLabel = (status: OpeningStatus) => {
  if (status === "24-hours") return props.open24HoursLabel;
  if (status === "by-appointment") return props.byAppointmentLabel;
  return props.closedLabel;
};

interface ResolvedEntry {
  status: OpeningStatus;
  sessions: OpeningSession[];
  note?: string;
}

const resolve = (entry: { status?: OpeningStatus; sessions?: OpeningSession[]; note?: string }): ResolvedEntry => ({
  status: resolveOpeningStatus(entry),
  sessions: entry.sessions ?? [],
  note: entry.note,
});

const weeklyRows = computed(() => {
  const order: OpeningWeekday[] =
    props.weekStartsOn === "sunday" ? [6, 0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6];

  const groups: { days: OpeningWeekday[]; entry: ResolvedEntry; signature: string }[] = [];

  for (const day of order) {
    const entry = resolve(props.days.find((d) => d.day === day) ?? { status: "closed" });
    const signature = JSON.stringify(entry);
    const last = groups.at(-1);
    if (props.groupDays && last?.signature === signature) {
      last.days.push(day);
    } else {
      groups.push({ days: [day], entry, signature });
    }
  }

  return groups.map(({ days, entry }) => ({
    key: days.join("-"),
    start: dayName(days[0]!),
    end: days.length > 1 ? dayName(days.at(-1)!) : null,
    isToday: props.highlightToday && todayWeekday.value !== null && days.includes(todayWeekday.value),
    ...entry,
  }));
});

const exceptionRows = computed(() =>
  props.exceptions
    .filter((exception) => !(props.hidePastExceptions && todayIso.value && (exception.to ?? exception.from) < todayIso.value))
    .map((exception) => {
      const to = exception.to && exception.to !== exception.from ? exception.to : null;
      return {
        key: `${exception.from}-${to ?? ""}`,
        label: exception.label,
        from: exception.from,
        to,
        start: dateFormatter.value.format(parseIsoDate(exception.from)),
        end: to ? dateFormatter.value.format(parseIsoDate(to)) : null,
        isToday:
          props.highlightToday &&
          todayIso.value !== null &&
          exception.from <= todayIso.value &&
          todayIso.value <= (to ?? exception.from),
        ...resolve(exception),
      };
    })
);

if (props.structuredData) {
  const jsonLd = computed(() =>
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": props.structuredData?.type ?? "LocalBusiness",
      ...(props.structuredData?.id ? { "@id": props.structuredData.id } : {}),
      ...(props.structuredData?.name ? { name: props.structuredData.name } : {}),
      openingHoursSpecification: buildOpeningHoursSpecification(props.days, props.exceptions),
    }).replace(/</g, "\\u003c")
  );

  useHead({
    script: [{ key: "opening-hours-json-ld", type: "application/ld+json", innerHTML: jsonLd }],
  });
}
</script>

<style lang="css">
@layer components {
  .opening-hours {
    display: grid;
    gap: var(--opening-hours-section-gap, 3.2rem);

    .opening-hours__exceptions-heading {
      font-size: var(--opening-hours-exceptions-heading-font-size, 1.6rem);
      font-weight: var(--opening-hours-exceptions-heading-font-weight, 600);
      margin: 0 0 var(--opening-hours-exceptions-heading-margin-block-end, 1.2rem);
    }

    .opening-hours__list {
      margin: 0;
      padding: 0;

      .opening-hours__row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: var(--opening-hours-row-gap, 1.2rem);
        padding-block: var(--opening-hours-row-padding-block, 1.2rem);
        padding-inline: var(--opening-hours-row-padding-inline, 0);
        border-block-end: var(--opening-hours-divider-width, 1px) solid
          color-mix(
            in srgb,
            var(--opening-hours-divider-colour, currentColor) calc(var(--opening-hours-divider-opacity, 0.15) * 100%),
            transparent
          );

        &:last-child {
          border-block-end: none;
        }

        &[data-today] {
          font-weight: var(--opening-hours-today-font-weight, 600);
          color: var(--opening-hours-today-colour, inherit);
          background-color: var(--opening-hours-today-background-colour, transparent);
        }

        &[data-status="closed"] .opening-hours__hours {
          color: var(--opening-hours-closed-colour, inherit);
        }
      }

      .opening-hours__days {
        font-size: var(--opening-hours-day-font-size, 1.4rem);
        color: var(--opening-hours-day-colour, inherit);
      }

      .opening-hours__exception-label {
        display: block;
      }

      .opening-hours__date {
        display: block;
        font-size: var(--opening-hours-date-font-size, 1.2rem);
        color: var(--opening-hours-date-colour, inherit);
      }

      .opening-hours__hours {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: var(--opening-hours-session-gap, 0.4rem);
        margin: 0;
        text-align: end;
        font-size: var(--opening-hours-hours-font-size, 1.4rem);
        font-variant-numeric: tabular-nums;
      }

      .opening-hours__session {
        white-space: nowrap;
      }

      .opening-hours__session-label {
        margin-inline-end: var(--opening-hours-session-label-gap, 0.75ch);
        color: var(--opening-hours-session-label-colour, inherit);
      }

      .opening-hours__note {
        font-size: var(--opening-hours-note-font-size, 1.2rem);
        color: var(--opening-hours-note-colour, inherit);
      }
    }
  }
}
</style>
