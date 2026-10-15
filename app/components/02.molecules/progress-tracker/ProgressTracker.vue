<template>
  <div class="progress-tracker" :class="[elementClasses, { 'is-complete': isComplete }]">
    <div v-if="total" class="progress-tracker-header">
      <p ref="labelEl" class="progress-tracker-label" aria-live="polite" tabindex="-1">{{ headerLabel }}</p>
      <div
        class="progress-tracker-bar"
        role="progressbar"
        aria-valuemin="0"
        :aria-valuemax="total"
        :aria-valuenow="current"
        :aria-valuetext="headerLabel"
        :style="{ '--_progress-tracker-progress': String(current / total) }"
      >
        <span class="progress-tracker-bar-fill"></span>
      </div>
    </div>

    <StepperList
      v-if="total"
      tag="ol"
      :item-count="total"
      indicator-alignment="top"
      :connected="true"
      class="progress-tracker-list"
    >
      <template v-for="(_, index) in steps" :key="`indicator-${index}`" #[`indicator-${index}`]>
        <span class="progress-tracker-indicator" :class="`is-${stepState(index)}`" aria-hidden="true">
          <Icon v-if="stepState(index) === 'done'" :name="doneIcon" class="progress-tracker-indicator-icon" />
          <template v-else>{{ index + 1 }}</template>
        </span>
      </template>

      <template v-for="(step, index) in steps" :key="`item-${index}`" #[`item-${index}`]>
        <div class="progress-tracker-step" :class="`is-${stepState(index)}`">
          <component
            :is="headingTag"
            :id="headingId(index)"
            class="progress-tracker-title"
            tabindex="-1"
            :aria-current="stepState(index) === 'current' ? 'step' : undefined"
          >
            {{ step.title }}<span v-if="stepState(index) === 'done'" class="sr-only">, {{ doneLabel }}</span>
          </component>
          <p v-if="step.body" class="progress-tracker-body">{{ step.body }}</p>
          <div v-if="stepState(index) === 'current' && $slots[`step-${index}`]" class="progress-tracker-slot">
            <slot :name="`step-${index}`" :step="step" :index="index" :heading-id="headingId(index)"></slot>
          </div>
        </div>
      </template>
    </StepperList>
  </div>
</template>

<script setup lang="ts">
import type { ProgressTrackerStep, ProgressTrackerStepState } from "~/types/components";

interface Props {
  steps: ProgressTrackerStep[];
  headingTag?: "h2" | "h3" | "h4" | "h5" | "h6";
  stepLabel?: string;
  completeLabel?: string;
  doneLabel?: string;
  doneIcon?: string;
  focusOnChange?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  headingTag: "h3",
  stepLabel: "Step {current} of {total}",
  completeLabel: "All steps complete",
  doneLabel: "Completed",
  doneIcon: "lucide:check",
  focusOnChange: true,
  styleClassPassthrough: () => [],
});

const model = defineModel<number>({ required: true });

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const baseId = useId();
const labelEl = ref<HTMLElement | null>(null);

const total = computed(() => props.steps.length);
const current = computed(() => Math.min(total.value, Math.max(0, Math.floor(Number(model.value)) || 0)));
const isComplete = computed(() => total.value > 0 && current.value === total.value);

const headerLabel = computed(() =>
  isComplete.value
    ? props.completeLabel
    : props.stepLabel.replaceAll("{current}", String(current.value + 1)).replaceAll("{total}", String(total.value))
);

const headingId = (index: number) => `${baseId}-step-${index}`;

const stepState = (index: number): ProgressTrackerStepState =>
  index < current.value ? "done" : index === current.value ? "current" : "upcoming";

watch(current, async () => {
  if (!props.focusOnChange || !total.value) return;
  await nextTick();
  const target = isComplete.value ? labelEl.value : document.getElementById(headingId(current.value));
  target?.focus();
});
</script>

<style lang="css">
@layer components {
  .progress-tracker {
    overflow-wrap: anywhere;

    .progress-tracker-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1.2rem 2.4rem;
      margin-block-end: var(--progress-tracker-header-gap, 2.4rem);
    }

    .progress-tracker-label {
      margin: 0;
      min-inline-size: 0;
      font-family: var(--progress-tracker-label-font-family, inherit);
      font-size: var(--progress-tracker-label-font-size, var(--step-4));
      font-weight: var(--progress-tracker-label-font-weight, 600);
      letter-spacing: var(--progress-tracker-label-letter-spacing, 0.12em);
      text-transform: var(--progress-tracker-label-text-transform, uppercase);
      color: var(--progress-tracker-label-colour, color-mix(in oklch, var(--theme-text) 70%, transparent));
    }

    .progress-tracker-bar {
      flex: 0 1 var(--progress-tracker-bar-inline-size, 16rem);
      block-size: var(--progress-tracker-bar-height, 0.6rem);
      border-radius: var(--progress-tracker-bar-radius, 99rem);
      background: var(--progress-tracker-track, color-mix(in oklch, var(--theme-text) 15%, transparent));
      overflow: hidden;
    }

    .progress-tracker-bar-fill {
      display: block;
      block-size: 100%;
      inline-size: calc(var(--_progress-tracker-progress, 0) * 100%);
      border-radius: inherit;
      background: var(--progress-tracker-accent, var(--theme-accent));
    }

    .progress-tracker-list {
      --stepper-list-gap: var(--progress-tracker-gap, 4rem);
      --stepper-list-padding-block: var(--progress-tracker-step-padding-block, 1.2rem);
      --stepper-list-connector-width: var(--progress-tracker-connector-width, 0.2rem);
      --stepper-list-connector-color: var(
        --progress-tracker-track,
        color-mix(in oklch, var(--theme-text) 15%, transparent)
      );
      --stepper-list-connector-gap: 0;
      --stepper-list-connector-image: none;
      margin: 0;

      .stepper-list-item:has(.progress-tracker-indicator.is-done) {
        --stepper-list-connector-color: var(--progress-tracker-accent, var(--theme-accent));
      }
    }

    .progress-tracker-indicator {
      display: grid;
      place-items: center;
      box-sizing: border-box;
      inline-size: var(--progress-tracker-indicator-size, 4.4rem);
      block-size: var(--progress-tracker-indicator-size, 4.4rem);
      border: var(--progress-tracker-indicator-border-width, 0.2rem) solid
        var(--progress-tracker-track, color-mix(in oklch, var(--theme-text) 15%, transparent));
      border-radius: var(--progress-tracker-indicator-radius, 50%);
      font-size: var(--progress-tracker-indicator-font-size, var(--step-4));
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--progress-tracker-upcoming-text, color-mix(in oklch, var(--theme-text) 60%, transparent));

      &.is-done {
        border-color: var(--progress-tracker-accent, var(--theme-accent));
        background: var(--progress-tracker-accent, var(--theme-accent));
        color: var(--progress-tracker-on-accent, var(--theme-on-surface));
      }

      &.is-current {
        margin-block-start: var(--progress-tracker-card-padding-block, 1.6rem);
        border-color: var(--progress-tracker-accent, var(--theme-accent));
        color: var(--progress-tracker-accent, var(--theme-accent));
        box-shadow: 0 0 0 var(--progress-tracker-ring-width, 0.6rem)
          var(--progress-tracker-ring-colour, color-mix(in oklch, var(--theme-accent) 20%, transparent));
      }

      .progress-tracker-indicator-icon {
        inline-size: 55%;
        block-size: 55%;
      }
    }

    .progress-tracker-step {
      display: flex;
      flex-direction: column;
      gap: var(--progress-tracker-content-gap, 0.8rem);
      min-inline-size: 0;

      &.is-current {
        margin-inline-start: calc(-1 * var(--progress-tracker-card-padding-inline, 2rem));
        padding-block: var(--progress-tracker-card-padding-block, 1.6rem);
        padding-inline: var(--progress-tracker-card-padding-inline, 2rem);
        border-radius: var(--progress-tracker-card-radius, 1.6rem);
        background: var(--progress-tracker-card-surface, var(--theme-surface-subtle));
        box-shadow: var(
          --progress-tracker-card-shadow,
          0 0.2rem 0.4rem rgb(0 0 0 / 0.04),
          0 1.2rem 3.2rem -1.2rem rgb(0 0 0 / 0.18)
        );
      }

      &.is-upcoming {
        .progress-tracker-title,
        .progress-tracker-body {
          color: var(--progress-tracker-upcoming-text, color-mix(in oklch, var(--theme-text) 60%, transparent));
        }
      }
    }

    .progress-tracker-title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: var(--progress-tracker-title-line-clamp, none);
      line-clamp: var(--progress-tracker-title-line-clamp, none);
      overflow: hidden;
      margin: 0;
      margin-block-start: max(0px, calc((var(--progress-tracker-indicator-size, 4.4rem) - 1lh) / 2));
      font-size: var(--progress-tracker-title-font-size, var(--step-5));
      font-weight: var(--progress-tracker-title-font-weight, 600);
      line-height: 1.3;
      color: var(--progress-tracker-title-colour, var(--theme-text));
    }

    .progress-tracker-body {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: var(--progress-tracker-body-line-clamp, none);
      line-clamp: var(--progress-tracker-body-line-clamp, none);
      overflow: hidden;
      margin: 0;
      font-size: var(--progress-tracker-body-font-size, var(--step-4));
      line-height: 1.5;
      color: var(--progress-tracker-body-colour, color-mix(in oklch, var(--theme-text) 80%, transparent));
    }

    .progress-tracker-slot {
      margin-block-start: var(--progress-tracker-slot-gap, 0.8rem);
    }

    @media (prefers-reduced-motion: no-preference) {
      .progress-tracker-bar-fill {
        transition: inline-size var(--progress-tracker-transition-duration, 200ms) ease;
      }

      .progress-tracker-indicator,
      .progress-tracker-step {
        transition-property: background-color, border-color, box-shadow, color;
        transition-duration: var(--progress-tracker-transition-duration, 200ms);
      }
    }
  }
}
</style>
