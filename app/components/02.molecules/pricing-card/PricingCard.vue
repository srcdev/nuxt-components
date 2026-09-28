<template>
  <component :is="tag" class="pricing-card" :class="[elementClasses, { 'is-highlighted': isHighlighted }]">
    <div v-if="isHighlighted" class="pricing-card__badge">{{ badgeText }}</div>

    <div v-if="ribbonText" class="pricing-card__ribbon-clip">
      <span class="pricing-card__ribbon">{{ ribbonText }}</span>
    </div>

    <h3 class="pricing-card__name">{{ planName }}</h3>

    <div class="pricing-card__price">
      <span class="pricing-card__amount">{{ currencySymbol }}{{ price }}</span>
      <span v-if="billingPeriod" class="pricing-card__period">{{ billingPeriod }}</span>
    </div>

    <p v-if="description" class="pricing-card__description">{{ description }}</p>

    <ul class="pricing-card__features">
      <slot name="features">
        <li v-for="(feature, index) in features" :key="index" class="pricing-card__feature">
          {{ feature }}
        </li>
      </slot>
    </ul>

    <div class="pricing-card__cta">
      <slot name="cta" :cta-text="ctaText" :is-disabled="ctaDisabled" :plan-name="planName" :on-select="handleSelect">
        <InputButton :button-text="ctaText" :readonly="ctaDisabled" @click="handleSelect" />
      </slot>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article";
  planName: string;
  price: number;
  currencySymbol?: string;
  billingPeriod?: string;
  description?: string;
  features?: string[];
  isHighlighted?: boolean;
  badgeText?: string;
  ctaText?: string;
  ctaDisabled?: boolean;
  ribbonText?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "article",
  currencySymbol: "$",
  billingPeriod: "one-time",
  description: undefined,
  features: () => [],
  isHighlighted: false,
  badgeText: "Most Popular",
  ctaText: "Get started",
  ctaDisabled: false,
  ribbonText: undefined,
  styleClassPassthrough: () => [],
});

const emit = defineEmits<{
  select: [planName: string];
}>();

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const handleSelect = () => {
  emit("select", props.planName);
};

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .pricing-card {
    --_ribbon-size: var(--pricing-card-ribbon-size, 20rem);

    --_cta-bg-hover: var(
      --pricing-card-cta-bg-hover,
      var(--input-button-primary-surface-hover, var(--theme-surface-hover))
    );

    display: flex;
    flex-direction: column;
    gap: var(--pricing-card-gap, 1.2rem);
    position: relative;

    padding: var(--pricing-card-padding, 2rem);
    background-color: var(--pricing-card-background, var(--slate-00));
    border: var(--pricing-card-border, 1px solid var(--slate-03));
    border-radius: var(--pricing-card-border-radius, 0.8rem);
    box-shadow: var(--pricing-card-shadow, 0 2px 8px oklch(from var(--slate-08) l c h / 0.12));

    transition: all 0.3s ease;

    &.is-highlighted {
      border: var(--pricing-card-highlight-border, 2px solid var(--teal-06));
      box-shadow: var(--pricing-card-highlight-shadow, 0 8px 24px oklch(from var(--teal-06) l c h / 0.2));
      transform: scale(var(--pricing-card-highlight-scale, 1.05));
    }

    .pricing-card__badge {
      position: absolute;
      top: -0.6rem;
      left: 50%;
      transform: translateX(-50%);
      /* Above .pricing-card__ribbon-clip (z-index: 1) — without this the badge has no stacking
         context of its own and the ribbon, which does, paints over it regardless of DOM order. */
      z-index: 2;

      display: inline-block;
      padding: 0.4rem 1rem;
      background-color: var(--pricing-card-badge-bg, var(--teal-06));
      color: var(--pricing-card-badge-text, var(--teal-00));
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .pricing-card__ribbon-clip {
      position: absolute;
      top: 0;
      right: 0;
      width: var(--_ribbon-size);
      height: var(--_ribbon-size);
      overflow: hidden;
      pointer-events: none;
      /* Sits above card content but stays clear of the top-centred "Most Popular" badge. */
      z-index: 1;

      .pricing-card__ribbon {
        position: absolute;
        top: 1.6rem;
        right: -1.4rem;
        width: calc(var(--_ribbon-size) + 2rem);
        transform: rotate(23deg);
        transform-origin: center;

        display: block;
        padding: 0.6rem 1.4rem 0.6rem 0;
        background-color: var(--pricing-card-ribbon-bg, var(--red-06));
        color: var(--pricing-card-ribbon-text, var(--red-00, white));
        text-align: right;
        font-size: 1.2rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }
    }

    .pricing-card__name {
      margin: 0;
      font-size: var(--pricing-card-name-font-size, 1.8rem);
      font-weight: 600;
      color: var(--pricing-card-name-color, #1a1a1a);
    }

    .pricing-card__price {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
    }

    .pricing-card__amount {
      font-size: var(--pricing-card-amount-font-size, 3.2rem);
      font-weight: 700;
      color: var(--pricing-card-amount-color, #1a1a1a);
    }

    .pricing-card__period {
      font-size: var(--pricing-card-period-font-size, 0.9rem);
      color: var(--pricing-card-period-color, #666);
    }

    .pricing-card__description {
      margin: 0;
      color: var(--pricing-card-description-color, #555);
      line-height: 1.5;
    }

    .pricing-card__features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;

      flex-grow: 1;
    }

    .pricing-card__feature {
      color: var(--pricing-card-feature-color, #333);
      padding-left: 1.6rem;
      position: relative;

      &::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--teal-06);
        font-weight: bold;
      }
    }

    .pricing-card__cta {
      align-self: var(--pricing-card-cta-align, flex-start);

      :deep(.input-button) {
        padding: var(--pricing-card-cta-padding, 1rem 1.6rem);
        background-color: var(--pricing-card-cta-bg, var(--input-button-primary-surface, var(--theme-surface)));
        color: var(--pricing-card-cta-text, var(--input-button-primary-text, var(--theme-on-surface)));
        border-radius: var(--pricing-card-cta-border-radius, 0.4rem);
        font-weight: 600;

        &:hover:not([aria-disabled="true"]) {
          background-color: var(--_cta-bg-hover);
        }
      }
    }
  }
}
</style>
