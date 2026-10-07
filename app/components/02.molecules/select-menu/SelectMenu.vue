<template>
  <div
    ref="rootRef"
    class="select-menu"
    :class="[inputVariant, elementClasses]"
    :style="`--_anchor-name: ${anchorName}`"
  >
    <button
      ref="triggerRef"
      :popovertarget="menuId"
      popovertargetaction="toggle"
      type="button"
      class="select-menu-trigger"
      :aria-label="triggerAriaLabel"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="handleTriggerClick"
    >
      <Icon v-if="leadingIcon" :name="leadingIcon" class="select-menu-trigger-icon" aria-hidden="true" />
      <span
        v-if="showLabel"
        class="select-menu-trigger-label"
        :class="{ 'select-menu-trigger-label-reserved': reservedLabels.length }"
      >
        <template v-if="reservedLabels.length">
          <span class="select-menu-trigger-label-text">{{ triggerLabelText }}</span>
          <span
            v-for="(text, index) in reservedLabels"
            :key="index"
            class="select-menu-trigger-label-sizer"
            aria-hidden="true"
            >{{ text }}</span
          >
        </template>
        <template v-else>{{ triggerLabelText }}</template>
      </span>
      <span
        v-if="indicator === 'count'"
        class="select-menu-trigger-count"
        :class="{ 'select-menu-trigger-indicator-empty': !selectedCount }"
        aria-hidden="true"
      >
        {{ selectedCount || "" }}
      </span>
      <span
        v-else-if="indicator === 'dot'"
        class="select-menu-trigger-dot"
        :class="{ 'select-menu-trigger-indicator-empty': !selectedCount }"
        :style="selectedOption?.dotColor ? { '--_dot-color': selectedOption.dotColor } : undefined"
        aria-hidden="true"
      ></span>
      <Icon v-if="showChevron" name="lucide:chevron-down" class="select-menu-trigger-chevron" aria-hidden="true" />
    </button>

    <div
      :id="menuId"
      ref="popoverRef"
      popover
      class="select-menu-popover"
      :class="{ 'select-menu-popover-open': usesFallbackPopover && isOpen }"
      :style="positionStyle"
      :data-placement="popoverPlacement"
      @beforetoggle="handleBeforeToggle"
      @toggle="handleToggle"
      @keydown="handleKeydown"
    >
      <ul class="select-menu-list" role="listbox" :aria-label="label" :aria-multiselectable="multiple || undefined">
        <li
          v-for="option in options"
          :key="option.value"
          class="select-menu-list-item"
          role="option"
          tabindex="-1"
          :aria-selected="isSelected(option)"
          :data-label="option.label"
          @click="selectOption(option)"
        >
          <span class="select-menu-item-check" aria-hidden="true">
            <Icon
              v-if="multiple"
              :name="isSelected(option) ? 'lucide:square-check' : 'lucide:square'"
              class="select-menu-item-check-icon"
            />
            <Icon v-else-if="isSelected(option)" name="lucide:check" class="select-menu-item-check-icon" />
          </span>
          <Icon v-if="option.icon" :name="option.icon" class="select-menu-item-icon" aria-hidden="true" />
          <span
            v-else-if="option.dotColor"
            class="select-menu-item-dot"
            :style="{ '--_dot-color': option.dotColor }"
            aria-hidden="true"
          ></span>
          <span class="select-menu-item-label">{{ option.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectMenuOption } from "~/types/components/select-menu";
import type { InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  /** The full list of selectable options. */
  options: SelectMenuOption[];
  /** Accessible name for the trigger button and the listbox. Also used as the trigger's fallback label when nothing is selected and no placeholder is given. */
  label: string;
  /** Text shown in the trigger when no option is selected. Falls back to `label`. */
  placeholder?: string;
  /** Show the leading icon in the trigger: the selected option's icon (single-select), otherwise `triggerIcon`. */
  showIcon?: boolean;
  /** Fixed leading icon for the trigger, e.g. a filter category icon. Shown in both modes; in single-select a selected option's own icon replaces it. */
  triggerIcon?: string;
  /** Selection indicator after the trigger text, shown only while something is selected: `count` (badge with the number selected) or `dot` (status dot). */
  indicator?: "none" | "count" | "dot";
  /** Appended to the trigger's accessible name while the indicator is showing. `{count}` is replaced with the number selected. */
  selectedCountLabel?: string;
  /** Show the selected option's label (or placeholder) text in the trigger. Set to false for an icon-only compact trigger. */
  showLabel?: boolean;
  /** Show the trailing chevron in the trigger. */
  showChevron?: boolean;
  /** Allow selecting more than one option. Each option gets a checkbox indicator, and v-model becomes an array. Selecting an option leaves the popover open so more can be toggled. */
  multiple?: boolean;
  /** In multiple mode, update the trigger text to a comma-separated list of the currently checked options instead of leaving it fixed on placeholder/label. No effect outside multiple mode. */
  showSelectionInTrigger?: boolean;
  /** Single-select only. Size the trigger text to the longest option label (or placeholder), so the trigger doesn't change width as the selection changes. */
  reserveLabelWidth?: boolean;
  /** Trigger border style, matching InputSelect: `normal` (bordered box) or `underlined` (bottom border only). */
  inputVariant?: InputUiVariant;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: undefined,
  showIcon: true,
  triggerIcon: undefined,
  indicator: "none",
  selectedCountLabel: "{count} selected",
  showLabel: true,
  showChevron: true,
  multiple: false,
  showSelectionInTrigger: false,
  reserveLabelWidth: false,
  inputVariant: "normal",
  styleClassPassthrough: () => [],
});

const modelValue = defineModel<string | number | (string | number)[] | undefined>({ default: undefined });

const id = useId();
const menuId = `select-menu-${id}`;
const anchorName = `--select-menu-anchor-${id}`;

const rootRef = ref<HTMLDivElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);

const selectedValues = computed(() => (props.multiple && Array.isArray(modelValue.value) ? modelValue.value : []));
const selectedOption = computed(() =>
  props.multiple ? undefined : props.options.find((option) => option.value === modelValue.value)
);
const selectedOptions = computed(() => props.options.filter((option) => selectedValues.value.includes(option.value)));

/**
 * In multi-select mode the trigger shows `placeholder`/`label` as a static
 * category tag (e.g. "Services required") by default — it does not update
 * to reflect the current selection, since a comma-joined list of checked
 * options would grow unpredictably long and push on adjacent triggers. Set
 * `showSelectionInTrigger` to opt into the comma-joined list instead.
 */
const reservedLabels = computed(() => {
  if (!props.reserveLabelWidth || props.multiple) return [];
  return [props.placeholder ?? props.label, ...props.options.map((option) => option.label)];
});

const triggerLabelText = computed(() => {
  if (props.multiple) {
    if (props.showSelectionInTrigger && selectedOptions.value.length) {
      return selectedOptions.value.map((option) => option.label).join(", ");
    }
    return props.placeholder ?? props.label;
  }
  return selectedOption.value?.label ?? props.placeholder ?? props.label;
});

const selectedCount = computed(() => {
  if (props.multiple) return selectedOptions.value.length;
  return selectedOption.value ? 1 : 0;
});

const leadingIcon = computed(() => {
  if (!props.showIcon) return undefined;
  return (!props.multiple && selectedOption.value?.icon) || props.triggerIcon;
});

const triggerAriaLabel = computed(() => {
  if (props.indicator === "none" || !selectedCount.value) return props.label;
  return `${props.label}, ${props.selectedCountLabel.replace("{count}", String(selectedCount.value))}`;
});

const isSelected = (option: SelectMenuOption): boolean =>
  props.multiple ? selectedValues.value.includes(option.value) : option.value === modelValue.value;

/** Returns all options in DOM order. */
const getMenuItems = (): HTMLElement[] =>
  Array.from(popoverRef.value?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);

const focusInitialItem = () => {
  const items = getMenuItems();
  const selectedIndex = items.findIndex((el) => el.getAttribute("aria-selected") === "true");
  items[selectedIndex === -1 ? 0 : selectedIndex]?.focus();
};

const {
  isOpen,
  usesFallbackPopover,
  positionStyle,
  popoverPlacement,
  hide,
  handleTriggerClick,
  handleBeforeToggle,
  handleToggle,
} = useAnchoredPopover({ rootRef, triggerRef, popoverRef, onOpen: focusInitialItem });

const selectOption = (option: SelectMenuOption) => {
  if (props.multiple) {
    const next = selectedValues.value.includes(option.value)
      ? selectedValues.value.filter((value) => value !== option.value)
      : [...selectedValues.value, option.value];
    modelValue.value = next;
    return;
  }
  modelValue.value = option.value;
  hide();
  triggerRef.value?.focus();
};

/**
 * Keyboard navigation following the WAI-ARIA listbox pattern.
 *
 * ArrowDown / ArrowUp  — move between options (wraps around).
 * Home / End           — jump to first / last option.
 * Enter / Space        — select the focused option. Closes the menu in single-select mode;
 *                        toggles the checkbox and keeps the menu open in multi-select mode.
 * Tab                  — close the menu; let the browser Tab naturally.
 * Escape               — native light dismiss, or the fallback listener without the Popover API.
 */
const handleKeydown = (event: KeyboardEvent) => {
  const items = getMenuItems();
  if (!items.length) return;

  const currentIndex = items.indexOf(document.activeElement as HTMLElement);

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      items[currentIndex === -1 ? 0 : (currentIndex + 1) % items.length]?.focus();
      break;
    case "ArrowUp":
      event.preventDefault();
      items[currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length]?.focus();
      break;
    case "Home":
      event.preventDefault();
      items[0]?.focus();
      break;
    case "End":
      event.preventDefault();
      items[items.length - 1]?.focus();
      break;
    case "Enter":
    case " ": {
      event.preventDefault();
      const option = props.options[currentIndex === -1 ? 0 : currentIndex];
      if (option) selectOption(option);
      break;
    }
    case "Tab":
      hide();
      break;
  }
};

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
  .select-menu {
    position: relative;
    display: inline-block;

    .select-menu-trigger {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--select-menu-trigger-gap, 0.8rem);
      min-height: var(--select-menu-trigger-min-height, 4.4rem);
      padding-block: var(--select-menu-trigger-padding-block, 0.8rem);
      padding-inline: var(--select-menu-trigger-padding-inline, 1.2rem);
      border: var(--select-menu-trigger-border-width, 0.1rem) solid
        var(--select-menu-trigger-border, var(--theme-border));
      border-radius: var(--select-menu-trigger-border-radius, 0.5rem);
      background-color: var(--select-menu-trigger-surface, var(--theme-input-surface));
      color: var(--select-menu-trigger-text-color, var(--theme-text));
      font-family: var(--font-family);
      font-size: var(--select-menu-trigger-font-size, 1.6rem);
      line-height: 1.2;
      anchor-name: var(--_anchor-name);
      transition: border-color var(--select-menu-transition-duration, 200ms) ease;

      &:hover,
      &:focus-visible {
        border-color: var(--select-menu-trigger-border-focus, var(--theme-border-focus));
      }

      &:focus-visible {
        outline: var(--select-menu-trigger-outline-width, 0.2rem) solid var(--theme-ring, currentcolor);
        outline-offset: 0.2rem;
      }

      .select-menu-trigger-icon {
        display: block;
        flex-shrink: 0;
        width: var(--select-menu-trigger-icon-size, 2rem);
        height: var(--select-menu-trigger-icon-size, 2rem);
        color: var(--select-menu-trigger-icon-color, currentcolor);
      }

      .select-menu-trigger-label {
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: start;
      }

      /* Hidden copies of every possible label share one grid cell, so the widest sets the width. */
      .select-menu-trigger-label-reserved {
        display: grid;

        .select-menu-trigger-label-text,
        .select-menu-trigger-label-sizer {
          grid-area: 1 / 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .select-menu-trigger-label-sizer {
          visibility: hidden;
          block-size: 0;
        }
      }

      .select-menu-trigger-count {
        flex-shrink: 0;
        min-width: var(--select-menu-trigger-count-min-width, 2.4rem);
        padding-block: var(--select-menu-trigger-count-padding-block, 0.2rem);
        padding-inline: var(--select-menu-trigger-count-padding-inline, 0.6rem);
        margin-inline: var(--select-menu-trigger-count-margin-inline, 1.2rem 0);
        border-radius: var(--select-menu-trigger-count-border-radius, 0.4rem);
        background-color: var(--select-menu-trigger-count-surface, var(--theme-surface-subtle));
        color: var(--select-menu-trigger-count-text-color, var(--theme-text));
        font-size: var(--select-menu-trigger-count-font-size, 1.4rem);
        font-weight: var(--select-menu-trigger-count-font-weight, 600);
        font-variant-numeric: tabular-nums;
        text-align: center;
      }

      .select-menu-trigger-dot {
        flex-shrink: 0;
        width: var(--select-menu-trigger-dot-size, 0.8rem);
        height: var(--select-menu-trigger-dot-size, 0.8rem);
        margin-inline: var(--select-menu-trigger-dot-margin-inline, 1.2rem 0);
        border-radius: 50%;
        background-color: var(--_dot-color, var(--select-menu-trigger-dot-color, var(--theme-accent)));
      }

      /* Kept in the layout while nothing is selected, so the trigger width doesn't jump. */
      .select-menu-trigger-indicator-empty {
        visibility: hidden;
      }

      .select-menu-trigger-chevron {
        display: block;
        flex-shrink: 0;
        width: var(--select-menu-trigger-chevron-size, 1.6rem);
        height: var(--select-menu-trigger-chevron-size, 1.6rem);
        opacity: 0.6;
        transition: transform var(--select-menu-transition-duration, 200ms) ease;
      }
    }

    &.underlined .select-menu-trigger {
      border-block-start-width: 0;
      border-inline-width: 0;
      border-block-end-width: var(
        --select-menu-trigger-border-width-underlined,
        var(--form-element-border-bottom-width-underlined, 0.3rem)
      );
      border-radius: 0;
    }

    .select-menu-trigger[aria-expanded="true"] .select-menu-trigger-chevron {
      transform: scaleY(-1);
    }

    .select-menu-popover {
      border: var(--select-menu-popover-border-width, 0.1rem) solid
        var(--select-menu-popover-border, var(--theme-border));
      margin: 0;
      padding: 0;
      inset: auto;
      background-color: var(--select-menu-popover-surface, var(--theme-input-surface));
      border-radius: var(--select-menu-popover-border-radius, 0.5rem);
      min-width: var(--select-menu-popover-min-width, 18rem);
      max-height: var(--select-menu-popover-max-height, 32rem);
      overflow: auto;
      box-shadow: var(--select-menu-popover-shadow, 0 0.4rem 1.6rem rgb(0 0 0 / 12%));

      position-anchor: var(--_anchor-name);
      top: calc(anchor(bottom) + var(--select-menu-block-distance, 0.4rem));
      left: anchor(left);
      right: auto;
      position-try-fallbacks: flip-block;

      opacity: 0;
      display: none;
      transition:
        opacity var(--select-menu-transition-duration, 200ms),
        display var(--select-menu-transition-duration, 200ms),
        overlay var(--select-menu-transition-duration, 200ms);
      transition-behavior: allow-discrete;

      &:popover-open {
        display: block;
        opacity: 1;

        @starting-style {
          display: block;
          opacity: 0;
        }
      }

      /* Kept apart from :popover-open, which would invalidate a shared selector list where unsupported. */
      &.select-menu-popover-open {
        display: block;
        opacity: 1;
      }

      @supports not (anchor-name: --a) {
        position: fixed;
        top: calc(var(--_anchor-bottom, 0px) + var(--select-menu-block-distance, 0.4rem));
        left: var(--_anchor-left, 0px);
        z-index: var(--select-menu-popover-z-index, 999999);

        &[data-placement="top"] {
          top: auto;
          bottom: calc(var(--_anchor-top-inverse, 0px) + var(--select-menu-block-distance, 0.4rem));
        }
      }

      .select-menu-list {
        display: grid;
        grid-template-columns: auto auto 1fr;
        list-style: none;
        padding: 0;
        margin: 0;

        .select-menu-list-item {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: subgrid;
          align-items: center;
          gap: var(--select-menu-item-gap, 0.8rem);
          padding-block: var(--select-menu-item-padding-block, 1rem);
          padding-inline: var(--select-menu-item-padding-inline, 1.2rem);
          --_text-color: var(--select-menu-item-text-color, var(--theme-text));
          --_border: var(--select-menu-item-border, transparent);

          cursor: pointer;
          color: var(--_text-color);
          font-family: var(--font-family);
          font-size: var(--select-menu-item-font-size, 1.5rem);
          /* No fallback: unset means invalid at computed time, so the weight inherits. */
          font-weight: var(--select-menu-item-font-weight);
          border-block: var(--select-menu-item-border-width, 0) solid var(--_border);
          transition:
            background-color var(--select-menu-transition-duration, 200ms) ease,
            border-color var(--select-menu-transition-duration, 200ms) ease,
            color var(--select-menu-transition-duration, 200ms) ease;

          /* Reserves the selected label width so a bolder selected weight doesn't resize the popover. */
          &::after {
            content: attr(data-label);
            grid-column: 3;
            grid-row: 1;
            block-size: 0;
            overflow: hidden;
            visibility: hidden;
            white-space: nowrap;
            font-weight: var(--select-menu-item-font-weight-selected, var(--select-menu-item-font-weight));
          }

          &[aria-selected="true"] {
            --_text-color: var(
              --select-menu-item-text-color-selected,
              var(--select-menu-item-text-color, var(--theme-text))
            );
            --_border: var(--select-menu-item-border-selected, var(--select-menu-item-border, transparent));

            background-color: var(--select-menu-item-surface-selected, var(--theme-surface-subtle));
            font-weight: var(--select-menu-item-font-weight-selected, var(--select-menu-item-font-weight));
          }

          /* Hover falls back to the row's current state, so an unset hover token keeps a selected row's colours. */
          &:hover,
          &:focus-visible {
            background-color: var(--select-menu-item-surface-hover, var(--theme-input-surface-hover));
            color: var(--select-menu-item-text-color-hover, var(--_text-color));
            border-color: var(--select-menu-item-border-hover, var(--_border));
          }

          &:focus-visible {
            outline: var(--select-menu-trigger-outline-width, 0.2rem) solid var(--theme-ring, currentcolor);
            outline-offset: -0.2rem;
          }

          .select-menu-item-check {
            grid-column: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: var(--select-menu-item-check-size, 1.6rem);
            height: var(--select-menu-item-check-size, 1.6rem);
            flex-shrink: 0;
            color: var(--select-menu-item-check-color, currentcolor);

            .select-menu-item-check-icon {
              display: block;
              width: 100%;
              height: 100%;
            }
          }

          .select-menu-item-icon {
            grid-column: 2;
            display: block;
            flex-shrink: 0;
            width: var(--select-menu-item-icon-size, 1.8rem);
            height: var(--select-menu-item-icon-size, 1.8rem);
          }

          .select-menu-item-dot {
            grid-column: 2;
            justify-self: center;
            width: var(--select-menu-item-dot-size, 0.8rem);
            height: var(--select-menu-item-dot-size, 0.8rem);
            border-radius: 50%;
            background-color: var(--_dot-color);
          }

          .select-menu-item-label {
            grid-column: 3;
            grid-row: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
