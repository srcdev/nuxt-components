<template>
  <nav
    v-if="isRendered"
    ref="rootRef"
    class="pagination-nav"
    :class="elementClasses"
    :aria-label="text(ariaLabel, 'Pagination')"
    :data-marker="marker"
    :data-compact="isCompact ? '' : undefined"
  >
    <div ref="rowRef" class="pagination-nav-row">
      <InputButton
        v-if="showEdges"
        variant="inline"
        class="pagination-nav-control"
        data-control="first"
        :button-text="text(firstLabel, 'First page')"
        :href="hrefFor(1, hasPrevious)"
        :readonly="!hasPrevious"
        :aria-current="undefined"
        @click="onSelect('first', 1, $event)"
      >
        <template #iconOnly>
          <slot name="first-icon">
            <Icon name="lucide:chevrons-left" class="pagination-nav-icon" aria-hidden="true" />
          </slot>
        </template>
      </InputButton>

      <InputButton
        variant="inline"
        class="pagination-nav-control"
        data-control="previous"
        :button-text="text(previousLabel, 'Previous page')"
        :href="hrefFor(currentPage - 1, hasPrevious)"
        :readonly="!hasPrevious"
        :aria-current="undefined"
        @click="onSelect('previous', currentPage - 1, $event)"
      >
        <template #iconOnly>
          <slot name="previous-icon">
            <Icon name="lucide:chevron-left" class="pagination-nav-icon" aria-hidden="true" />
          </slot>
        </template>
      </InputButton>

      <div class="pagination-nav-pages" :style="{ '--_pagination-nav-count': items.length }">
        <div v-if="marker !== 'none'" class="pagination-nav-marker-layer" aria-hidden="true">
          <div class="pagination-nav-marker" :style="{ '--_pagination-nav-marker-index': markerIndex }"></div>
        </div>
        <ul class="pagination-nav-list" role="list">
          <li
            v-for="(item, index) in items"
            :key="index"
            class="pagination-nav-item"
            :aria-hidden="item.type === 'ellipsis' ? 'true' : undefined"
          >
            <InputButton
              v-if="item.type === 'page'"
              variant="inline"
              class="pagination-nav-page"
              data-control="page"
              :button-text="String(item.page)"
              :aria-label="fill(text(pageLabel, 'Page {page}'), { page: item.page })"
              :aria-current="item.page === currentPage ? 'page' : undefined"
              :href="pageHref ? pageHref(item.page) : undefined"
              @click="onSelect('page', item.page, $event)"
            />
            <span v-else class="pagination-nav-ellipsis">
              <slot name="ellipsis">…</slot>
            </span>
          </li>
        </ul>
      </div>

      <p class="pagination-nav-summary" aria-live="polite" aria-atomic="true">
        {{ fill(text(summaryLabel, "Page {page} of {total}"), { page: currentPage, total: totalPages }) }}
      </p>

      <InputButton
        variant="inline"
        class="pagination-nav-control"
        data-control="next"
        :button-text="text(nextLabel, 'Next page')"
        :href="hrefFor(currentPage + 1, hasNext)"
        :readonly="!hasNext"
        :aria-current="undefined"
        @click="onSelect('next', currentPage + 1, $event)"
      >
        <template #iconOnly>
          <slot name="next-icon">
            <Icon name="lucide:chevron-right" class="pagination-nav-icon" aria-hidden="true" />
          </slot>
        </template>
      </InputButton>

      <InputButton
        v-if="showEdges"
        variant="inline"
        class="pagination-nav-control"
        data-control="last"
        :button-text="text(lastLabel, 'Last page')"
        :href="hrefFor(totalPages, hasNext)"
        :readonly="!hasNext"
        :aria-current="undefined"
        @click="onSelect('last', totalPages, $event)"
      >
        <template #iconOnly>
          <slot name="last-icon">
            <Icon name="lucide:chevrons-right" class="pagination-nav-icon" aria-hidden="true" />
          </slot>
        </template>
      </InputButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useResizeObserver } from "@vueuse/core";
import type { PaginationNavLayout, PaginationNavMarker } from "~/types/components/pagination-nav";

interface Props {
  total: number;
  siblings?: number;
  boundaries?: number;
  showEdges?: boolean;
  pageHref?: (page: number) => string;
  hideWhenSinglePage?: boolean;
  marker?: PaginationNavMarker;
  layout?: PaginationNavLayout;
  ariaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  firstLabel?: string;
  lastLabel?: string;
  pageLabel?: string;
  summaryLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  siblings: 1,
  boundaries: 1,
  showEdges: false,
  pageHref: undefined,
  hideWhenSinglePage: false,
  marker: "none",
  layout: "auto",
  ariaLabel: "Pagination",
  previousLabel: "Previous page",
  nextLabel: "Next page",
  firstLabel: "First page",
  lastLabel: "Last page",
  pageLabel: "Page {page}",
  summaryLabel: "Page {page} of {total}",
  styleClassPassthrough: () => [],
});

const page = defineModel<number>("page", { default: 1 });

const totalPages = computed(() => toPaginationWholeNumber(props.total, 0));
const currentPage = computed(() => Math.min(Math.max(1, toPaginationWholeNumber(page.value, 1)), Math.max(1, totalPages.value)));
const items = computed(() => getPaginationRange(currentPage.value, totalPages.value, props.siblings, props.boundaries));
const markerIndex = computed(() =>
  items.value.findIndex((item) => item.type === "page" && item.page === currentPage.value)
);
const isRendered = computed(() => totalPages.value > (props.hideWhenSinglePage ? 1 : 0));
const hasPrevious = computed(() => currentPage.value > 1);
const hasNext = computed(() => currentPage.value < totalPages.value);

// A blank label would leave a control with no accessible name.
const text = (value: string, fallback: string) => value?.trim() || fallback;
const fill = (template: string, values: Record<string, number>) =>
  Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template);

const hrefFor = (target: number, enabled: boolean) => (enabled && props.pageHref ? props.pageHref(target) : undefined);

const rootRef = ref<HTMLElement | null>(null);
const rowRef = ref<HTMLElement | null>(null);

const onSelect = (control: string, target: number, event: MouseEvent) => {
  const opensElsewhere = event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
  if (props.pageHref && opensElsewhere) return;
  if (target < 1 || target > totalPages.value || target === currentPage.value) return;

  const hadFocus = Boolean(rootRef.value?.contains(document.activeElement));
  page.value = target;
  if (!hadFocus) return;

  // A page click lands on the new current page; an arrow keeps focus unless its element was replaced.
  nextTick(() => {
    const root = rootRef.value;
    if (!root) return;
    const next =
      control === "page"
        ? root.querySelector<HTMLElement>('.pagination-nav-page[aria-current="page"]')
        : root.contains(document.activeElement)
          ? null
          : root.querySelector<HTMLElement>(`[data-control="${control}"]`);
    next?.focus();
  });
};

const overflowing = ref(false);
let fullWidth = 0;
const isCompact = computed(() => props.layout === "compact" || (props.layout === "auto" && overflowing.value));

// The full row's width is only measurable while it's shown, so compact mode compares against the last reading.
const measure = () => {
  const root = rootRef.value;
  const row = rowRef.value;
  if (props.layout !== "auto" || !root || !row) return;
  if (!overflowing.value) fullWidth = row.scrollWidth;
  const { paddingLeft, paddingRight } = getComputedStyle(root);
  const available = root.clientWidth - (parseFloat(paddingLeft) || 0) - (parseFloat(paddingRight) || 0);
  overflowing.value = fullWidth > available;
};

useResizeObserver([rootRef, rowRef], measure);

const fullRowShape = computed(() => {
  const widest = Math.max(0, ...items.value.map((item) => (item.type === "page" ? String(item.page).length : 0)));
  return [items.value.length, widest, props.showEdges, props.layout].join("|");
});

watch(fullRowShape, async () => {
  overflowing.value = false;
  await nextTick();
  measure();
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .pagination-nav {
    --_pagination-nav-gap: var(--pagination-nav-gap, 0.4rem);
    --_pagination-nav-item-size: var(--pagination-nav-item-size, 4rem);
    --_pagination-nav-item-radius: var(--pagination-nav-item-radius, var(--button-border-radius));
    --_pagination-nav-item-colour: var(--pagination-nav-item-colour, var(--theme-text));
    --_pagination-nav-current-background: var(--pagination-nav-current-background, var(--theme-surface));
    --_pagination-nav-duration: var(--pagination-nav-marker-duration, 250ms);

    display: flex;
    justify-content: var(--pagination-nav-justify, center);
    box-sizing: border-box;
    inline-size: 100%;
    min-inline-size: 0;
    font-size: var(--pagination-nav-font-size, 1.6rem);
    font-variant-numeric: tabular-nums;

    .pagination-nav-row {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      gap: var(--_pagination-nav-gap);
      inline-size: max-content;

      .pagination-nav[data-compact] & {
        flex-shrink: 1;
        inline-size: auto;
        max-inline-size: 100%;
      }
    }

    .pagination-nav-pages {
      display: inline-grid;
      grid-template-areas: "pagination-nav-stack";

      .pagination-nav[data-compact] & {
        display: none;
      }
    }

    .pagination-nav-marker-layer,
    .pagination-nav-list {
      grid-area: pagination-nav-stack;
      display: grid;
      grid-template-columns: repeat(var(--_pagination-nav-count), minmax(var(--_pagination-nav-item-size), 1fr));
      gap: var(--_pagination-nav-gap);
    }

    .pagination-nav-list {
      position: relative;
      z-index: 1;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .pagination-nav-item {
      display: grid;
      min-inline-size: 0;
    }

    .pagination-nav-marker {
      grid-column: 1;
      position: relative;
      inset-inline-start: calc(var(--_pagination-nav-marker-index) * (100% + var(--_pagination-nav-gap)));
      border-radius: var(--_pagination-nav-item-radius);
      background-color: var(--pagination-nav-marker-background, var(--_pagination-nav-current-background));
      transition: inset-inline-start var(--_pagination-nav-duration) ease-in-out;

      .pagination-nav[data-marker="underline"] & {
        align-self: end;
        block-size: var(--pagination-nav-underline-thickness, 0.3rem);
        border-radius: var(--pagination-nav-underline-thickness, 0.3rem);
        background-color: var(--pagination-nav-underline-colour, var(--theme-surface));
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    .pagination-nav-control.input-button,
    .pagination-nav-page.input-button {
      box-sizing: border-box;
      min-inline-size: var(--_pagination-nav-item-size);
      min-block-size: var(--_pagination-nav-item-size);
      padding: 0 var(--pagination-nav-item-padding-inline, 0.8rem);
      border: var(--pagination-nav-item-border-width, 0.1rem) solid
        var(--pagination-nav-item-border-colour, transparent);
      border-radius: var(--_pagination-nav-item-radius);
      background-color: var(--pagination-nav-item-background, transparent);
      color: var(--_pagination-nav-item-colour);
      font: inherit;
      text-decoration: none;
      transition-property: background-color, border-color, color, opacity;

      &:not([aria-current]):hover {
        background-color: var(--pagination-nav-item-background-hover, var(--theme-surface-subtle));
        border-color: var(--pagination-nav-item-border-colour-hover, var(--pagination-nav-item-border-colour, transparent));
        color: var(--pagination-nav-item-colour-hover, var(--_pagination-nav-item-colour));
      }

      &:focus-visible {
        outline: var(--button-focus-ring-width) solid var(--pagination-nav-ring-focus, var(--theme-ring));
        outline-offset: var(--button-focus-ring-offset);
      }

      &[readonly] {
        opacity: var(--pagination-nav-disabled-opacity, 0.4);
      }

      .input-button-icon {
        margin: 0;
      }
    }

    .pagination-nav-page.input-button {
      inline-size: 100%;

      .input-button-text {
        font: inherit;
        white-space: nowrap;
      }

      .pagination-nav[data-marker="background"] & {
        transition:
          color calc(var(--_pagination-nav-duration) / 2) ease-in-out,
          background-color var(--control-transition-duration) var(--control-transition-ease),
          border-color var(--control-transition-duration) var(--control-transition-ease);

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }

      &[aria-current="page"] {
        font-weight: var(--pagination-nav-current-font-weight, 700);

        .pagination-nav[data-marker="none"] & {
          background-color: var(--_pagination-nav-current-background);
          border-color: var(--pagination-nav-current-border-colour, var(--_pagination-nav-current-background));
          color: var(--pagination-nav-current-colour, var(--theme-on-surface));
        }

        .pagination-nav[data-marker="background"] & {
          color: var(--pagination-nav-current-colour, var(--theme-on-surface));
          transition: color calc(var(--_pagination-nav-duration) / 2) ease-in-out
            calc(var(--_pagination-nav-duration) / 2);

          @media (prefers-reduced-motion: reduce) {
            transition: none;
          }
        }
      }
    }

    .pagination-nav-icon {
      display: block;
      font-size: var(--pagination-nav-icon-size, 2rem);
      width: 1em;
      height: 1em;

      &:dir(rtl) {
        transform: scaleX(-1);
      }

      [dir="rtl"] & {
        transform: scaleX(-1);
      }
    }

    .pagination-nav-ellipsis {
      display: grid;
      place-items: center;
      min-block-size: var(--_pagination-nav-item-size);
      color: var(--pagination-nav-ellipsis-colour, var(--_pagination-nav-item-colour));
    }

    .pagination-nav-summary {
      display: none;
      min-inline-size: 0;
      margin: 0;
      color: var(--pagination-nav-summary-colour, var(--_pagination-nav-item-colour));
      text-align: center;
      overflow-wrap: anywhere;

      .pagination-nav[data-compact] & {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: var(--pagination-nav-summary-line-clamp, none);
        line-clamp: var(--pagination-nav-summary-line-clamp, none);
      }
    }
  }
}
</style>
