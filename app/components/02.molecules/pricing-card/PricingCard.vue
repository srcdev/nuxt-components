<template>
  <component
    :is="tag"
    class="pricing-card"
    :class="[elementClasses, { 'is-highlighted': isHighlighted, 'has-ribbon': Boolean(ribbonText) }]"
    :aria-labelledby="headingId"
  >
    <div v-if="isHighlighted" class="pricing-card__badge">{{ badgeText }}</div>

    <div v-if="ribbonText" class="pricing-card__ribbon-clip">
      <span class="pricing-card__ribbon">{{ ribbonText }}</span>
    </div>

    <component :is="headingTag" :id="headingId" class="pricing-card__name">{{ planName }}</component>

    <div class="pricing-card__price">
      <span class="pricing-card__amount">{{ currencySymbol }}{{ displayPrice }}</span>
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
  headingTag?: "h2" | "h3" | "h4" | "h5" | "h6";
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
  headingTag: "h3",
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

const headingId = useId();

const displayPrice = computed(() => {
  if (!Number.isFinite(props.price)) return "";
  return Number.isInteger(props.price) ? String(props.price) : props.price.toFixed(2);
});

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

    display: flex;
    flex-direction: column;
    gap: var(--pricing-card-gap, 1.2rem);
    position: relative;
    min-inline-size: 0;

    padding: var(--pricing-card-padding, 2rem);
    background-color: var(--pricing-card-background, var(--theme-surface-subtle));
    border: var(--pricing-card-border, 1px solid var(--slate-03));
    border-radius: var(--pricing-card-border-radius, 0.8rem);
    box-shadow: var(--pricing-card-shadow, 0 2px 8px oklch(from var(--slate-08) l c h / 0.12));

    @media (prefers-reduced-motion: no-preference) {
      transition-property: transform, box-shadow, border-color;
      transition-duration: var(--pricing-card-transition-duration, 300ms);
      transition-timing-function: ease;
    }

    &.is-highlighted {
      border: var(--pricing-card-highlight-border, 2px solid var(--theme-border));
      box-shadow: var(--pricing-card-highlight-shadow, 0 8px 24px oklch(from var(--slate-08) l c h / 0.2));
      transform: scale(var(--pricing-card-highlight-scale, 1.05));
    }

    .pricing-card__badge {
      position: absolute;
      inset-block-start: 0;
      inset-inline: 0;
      translate: 0 -50%;
      inline-size: fit-content;
      max-inline-size: calc(100% - 2rem);
      margin-inline: auto;
      /* Above .pricing-card__ribbon-clip (z-index: 1), which otherwise paints over it. */
      z-index: 2;

      padding: 0.4rem 1rem;
      background-color: var(--pricing-card-badge-bg, var(--theme-surface));
      color: var(--pricing-card-badge-text, var(--theme-on-surface));
      border-radius: 2rem;
      font-size: var(--pricing-card-badge-font-size, 1.2rem);
      font-weight: 600;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      overflow-wrap: anywhere;
      text-wrap: balance;
    }

    .pricing-card__ribbon-clip {
      position: absolute;
      top: 0;
      right: 0;
      width: var(--_ribbon-size);
      height: var(--_ribbon-size);
      overflow: hidden;
      pointer-events: none;
      z-index: 1;

      .pricing-card__ribbon {
        position: absolute;
        top: 1.6rem;
        right: -1.4rem;
        width: calc(var(--_ribbon-size) + 2rem);
        transform: rotate(23deg);
        transform-origin: center;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: var(--pricing-card-ribbon-line-clamp, 2);
        line-clamp: var(--pricing-card-ribbon-line-clamp, 2);
        overflow-wrap: anywhere;
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

    &.has-ribbon .pricing-card__name {
      padding-right: var(--pricing-card-ribbon-clearance, 6rem);
    }

    .pricing-card__name {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: var(--pricing-card-name-line-clamp, none);
      line-clamp: var(--pricing-card-name-line-clamp, none);
      overflow-wrap: anywhere;
      margin: 0;
      font-size: var(--pricing-card-name-font-size, 1.8rem);
      font-weight: 600;
      color: var(--pricing-card-name-color, var(--theme-text));
    }

    .pricing-card__price {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.4rem;
      min-inline-size: 0;
    }

    .pricing-card__amount {
      min-inline-size: 0;
      overflow-wrap: anywhere;
      font-size: var(--pricing-card-amount-font-size, 3.2rem);
      font-weight: 700;
      color: var(--pricing-card-amount-color, var(--theme-text));
    }

    .pricing-card__period {
      min-inline-size: 0;
      overflow-wrap: anywhere;
      font-size: var(--pricing-card-period-font-size, 1.4rem);
      color: var(--pricing-card-period-color, var(--theme-text));
    }

    .pricing-card__description {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: var(--pricing-card-description-line-clamp, none);
      line-clamp: var(--pricing-card-description-line-clamp, none);
      overflow-wrap: anywhere;
      margin: 0;
      color: var(--pricing-card-description-color, var(--theme-text));
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
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: var(--pricing-card-feature-line-clamp, none);
      line-clamp: var(--pricing-card-feature-line-clamp, none);
      overflow-wrap: anywhere;
      color: var(--pricing-card-feature-color, var(--theme-text));
      padding-inline-start: 1.6rem;
      position: relative;

      &::before {
        content: "✓";
        content: "✓" / "";
        position: absolute;
        inset-inline-start: 0;
        color: var(--pricing-card-feature-icon-color, var(--theme-accent));
        font-weight: bold;
      }
    }

    .pricing-card__cta {
      align-self: var(--pricing-card-cta-align, flex-start);
      max-inline-size: 100%;
    }
  }
}
</style>
