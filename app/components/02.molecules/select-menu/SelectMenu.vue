<template>
  <div class="select-menu" :class="[elementClasses]" :style="`--_anchor-name: ${anchorName}`">
    <button
      ref="triggerRef"
      :popovertarget="menuId"
      popovertargetaction="toggle"
      type="button"
      class="select-menu-trigger"
      :aria-label="label"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
    >
      <Icon
        v-if="showIcon && !multiple && selectedOption?.icon"
        :name="selectedOption.icon"
        class="select-menu-trigger-icon"
        aria-hidden="true"
      />
      <span v-if="showLabel" class="select-menu-trigger-label">{{ triggerLabelText }}</span>
      <Icon
        v-if="showChevron"
        name="lucide:chevron-down"
        class="select-menu-trigger-chevron"
        aria-hidden="true"
      />
    </button>

    <div
      :id="menuId"
      ref="popoverRef"
      popover
      class="select-menu-popover"
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
          <span class="select-menu-item-label">{{ option.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectMenuOption } from "~/types/components/select-menu";

interface Props {
  /** The full list of selectable options. */
  options: SelectMenuOption[];
  /** Accessible name for the trigger button and the listbox. Also used as the trigger's fallback label when nothing is selected and no placeholder is given. */
  label: string;
  /** Text shown in the trigger when no option is selected. Falls back to `label`. */
  placeholder?: string;
  /** Show the selected option's icon in the trigger. */
  showIcon?: boolean;
  /** Show the selected option's label (or placeholder) text in the trigger. Set to false for an icon-only compact trigger. */
  showLabel?: boolean;
  /** Show the trailing chevron in the trigger. */
  showChevron?: boolean;
  /** Allow selecting more than one option. Each option gets a checkbox indicator, and v-model becomes an array. Selecting an option leaves the popover open so more can be toggled. */
  multiple?: boolean;
  /** In multiple mode, update the trigger text to a comma-separated list of the currently checked options instead of leaving it fixed on placeholder/label. No effect outside multiple mode. */
  showSelectionInTrigger?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: undefined,
  showIcon: true,
  showLabel: true,
  showChevron: true,
  multiple: false,
  showSelectionInTrigger: false,
  styleClassPassthrough: () => [],
});

const modelValue = defineModel<string | number | (string | number)[] | undefined>({ default: undefined });

const id = useId();
const menuId = `select-menu-${id}`;
const anchorName = `--select-menu-anchor-${id}`;

const triggerRef = ref<HTMLButtonElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);
const isOpen = ref(false);

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
const triggerLabelText = computed(() => {
  if (props.multiple) {
    if (props.showSelectionInTrigger && selectedOptions.value.length) {
      return selectedOptions.value.map((option) => option.label).join(", ");
    }
    return props.placeholder ?? props.label;
  }
  return selectedOption.value?.label ?? props.placeholder ?? props.label;
});

const isSelected = (option: SelectMenuOption): boolean =>
  props.multiple ? selectedValues.value.includes(option.value) : option.value === modelValue.value;

/** Returns all options in DOM order. */
const getMenuItems = (): HTMLElement[] =>
  Array.from(popoverRef.value?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);

const selectOption = (option: SelectMenuOption) => {
  if (props.multiple) {
    const next = selectedValues.value.includes(option.value)
      ? selectedValues.value.filter((value) => value !== option.value)
      : [...selectedValues.value, option.value];
    modelValue.value = next;
    return;
  }
  modelValue.value = option.value;
  popoverRef.value?.hidePopover();
  triggerRef.value?.focus();
};

const handleToggle = (event: Event) => {
  const toggleEvent = event as ToggleEvent;
  isOpen.value = toggleEvent.newState === "open";
  if (isOpen.value) {
    const items = getMenuItems();
    const selectedIndex = items.findIndex((el) => el.getAttribute("aria-selected") === "true");
    items[selectedIndex === -1 ? 0 : selectedIndex]?.focus();
  }
};

/**
 * Keyboard navigation following the WAI-ARIA listbox pattern.
 *
 * ArrowDown / ArrowUp  — move between options (wraps around).
 * Home / End           — jump to first / last option.
 * Enter / Space        — select the focused option. Closes the menu in single-select mode;
 *                        toggles the checkbox and keeps the menu open in multi-select mode.
 * Tab                  — close the menu; let the browser Tab naturally.
 * Escape               — handled natively by the Popover API.
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
      popoverRef.value?.hidePopover();
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
      border: var(--select-menu-trigger-border-width, 0.1rem) solid var(--select-menu-trigger-border, var(--theme-border));
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
      }

      .select-menu-trigger-label {
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: start;
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

    &:has(.select-menu-popover:popover-open) .select-menu-trigger-chevron {
      transform: rotate(180deg);
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
          cursor: pointer;
          color: var(--select-menu-item-text-color, var(--theme-text));
          font-family: var(--font-family);
          font-size: var(--select-menu-item-font-size, 1.5rem);
          transition: background-color var(--select-menu-transition-duration, 200ms) ease;

          &:hover,
          &:focus-visible {
            background-color: var(--select-menu-item-surface-hover, var(--theme-input-surface-hover));
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

          .select-menu-item-label {
            grid-column: 3;
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
