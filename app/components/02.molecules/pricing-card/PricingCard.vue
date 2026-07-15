<template>
  <component :is="tag" class="pricing-card" :class="[elementClasses, { 'is-highlighted': isHighlighted }]">
    <div v-if="isHighlighted" class="pricing-card__badge">Most Popular</div>

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
      <slot
        name="cta"
        :cta-text="ctaText"
        :is-disabled="ctaDisabled"
        :plan-name="planName"
        :on-select="handleSelect"
      >
        <InputButtonCore
          :button-text="ctaText"
          :readonly="ctaDisabled"
          @click="handleSelect"
        />
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
  ctaText?: string;
  ctaDisabled?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "article",
  currencySymbol: "$",
  billingPeriod: "one-time",
  description: undefined,
  features: () => [],
  isHighlighted: false,
  ctaText: "Get started",
  ctaDisabled: false,
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
  },
);
</script>

<style lang="css">
@layer components {
  .pricing-card {
    --_card-border: var(--pricing-card-border, 1px solid var(--slate-03));
    --_card-border-radius: var(--pricing-card-border-radius, 0.8rem);
    --_card-padding: var(--pricing-card-padding, 2rem);
    --_card-background: var(--pricing-card-background, var(--slate-00));
    --_card-shadow: var(--pricing-card-shadow, 0 2px 8px oklch(from var(--slate-08) l c h / 0.12));
    --_card-gap: var(--pricing-card-gap, 1.2rem);

    --_highlight-border: var(--pricing-card-highlight-border, 2px solid var(--teal-06));
    --_highlight-shadow: var(--pricing-card-highlight-shadow, 0 8px 24px oklch(from var(--teal-06) l c h / 0.20));
    --_highlight-scale: var(--pricing-card-highlight-scale, 1.05);

    --_badge-bg: var(--pricing-card-badge-bg, var(--teal-06));
    --_badge-text: var(--pricing-card-badge-text, var(--teal-00));

    --_name-font-size: var(--pricing-card-name-font-size, 1.8rem);
    --_name-color: var(--pricing-card-name-color, #1a1a1a);

    --_amount-font-size: var(--pricing-card-amount-font-size, 3.2rem);
    --_amount-color: var(--pricing-card-amount-color, #1a1a1a);
    --_period-font-size: var(--pricing-card-period-font-size, 0.9rem);
    --_period-color: var(--pricing-card-period-color, #666);

    --_description-color: var(--pricing-card-description-color, #555);
    --_feature-color: var(--pricing-card-feature-color, #333);

    --_cta-align: var(--pricing-card-cta-align, flex-start);
    --_cta-bg: var(--pricing-card-cta-bg, var(--theme-button-primary-surface));
    --_cta-bg-hover: var(--pricing-card-cta-bg-hover, var(--theme-button-primary-surface-hover));
    --_cta-text: var(--pricing-card-cta-text, var(--theme-button-primary-text));
    --_cta-padding: var(--pricing-card-cta-padding, 1rem 1.6rem);
    --_cta-border-radius: var(--pricing-card-cta-border-radius, 0.4rem);

    display: flex;
    flex-direction: column;
    gap: var(--_card-gap);
    position: relative;

    padding: var(--_card-padding);
    background-color: var(--_card-background);
    border: var(--_card-border);
    border-radius: var(--_card-border-radius);
    box-shadow: var(--_card-shadow);

    transition: all 0.3s ease;

    &.is-highlighted {
      border: var(--_highlight-border);
      box-shadow: var(--_highlight-shadow);
      transform: scale(var(--_highlight-scale));
    }

    .pricing-card__badge {
      position: absolute;
      top: -0.6rem;
      left: 50%;
      transform: translateX(-50%);

      display: inline-block;
      padding: 0.4rem 1rem;
      background-color: var(--_badge-bg);
      color: var(--_badge-text);
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .pricing-card__name {
      margin: 0;
      font-size: var(--_name-font-size);
      font-weight: 600;
      color: var(--_name-color);
    }

    .pricing-card__price {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
    }

    .pricing-card__amount {
      font-size: var(--_amount-font-size);
      font-weight: 700;
      color: var(--_amount-color);
    }

    .pricing-card__period {
      font-size: var(--_period-font-size);
      color: var(--_period-color);
    }

    .pricing-card__description {
      margin: 0;
      color: var(--_description-color);
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
      color: var(--_feature-color);
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
      align-self: var(--_cta-align);

      :deep(.input-button-core) {
        padding: var(--_cta-padding);
        background-color: var(--_cta-bg);
        color: var(--_cta-text);
        border-radius: var(--_cta-border-radius);
        font-weight: 600;

        &:hover:not([aria-disabled="true"]) {
          background-color: var(--_cta-bg-hover);
        }
      }
    }
  }
}
</style>
