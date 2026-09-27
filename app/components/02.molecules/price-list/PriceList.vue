<template>
  <div class="price-list" :class="elementClasses">
    <div v-for="(column, colIndex) in priceListData" :key="colIndex" class="price-list__column">
      <HeroText
        :tag="headingTag"
        font-size="subheading"
        :text-content="[{ text: column.headingtext }]"
        :icon="column.headingIcon ? column.headingIcon : undefined"
        :style-class-passthrough="['price-list__heading']"
      />

      <dl class="price-list__list">
        <div v-for="(item, index) in column.items" :key="index" class="price-list__row">
          <dt class="price-list__description">{{ item.description }}</dt>
          <dd class="price-list__price">
            <span v-if="item.from" class="price-list__from">{{ fromLabel }}</span>
            <span class="price-list__amount">{{ item.price }}</span>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PriceListData } from "~/types/components/price-list";

interface Props {
  priceListData: PriceListData[];
  headingTag?: "h2" | "h3" | "h4" | "h5" | "h6";
  fromLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  headingTag: "h2",
  fromLabel: "from",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .price-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--price-list-column-gap, 2.4rem);

    @media (min-width: 48em) {
      grid-template-columns: 1fr 1fr;
    }

    .price-list__heading.hero-text {
      font-size: var(--price-list-heading-font-size, var(--hero-text-subheading));
      font-weight: var(--price-list-heading-font-weight, 600);
      color: var(--price-list-heading-colour, inherit);
      margin: 0 0 var(--price-list-heading-margin-block-end, 1.8rem);

      .hero-text__icon {
        margin-inline-end: var(--price-list-heading-icon-gap, 1rem);
      }
    }

    .price-list__list {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;

      .price-list__row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--price-list-row-gap, 1.2rem);
        padding-block: var(--price-list-row-padding-block, 1.4rem);
        border-block-end: var(--price-list-divider-width, 1px) solid
          color-mix(
            in srgb,
            var(--price-list-divider-colour, currentColor) calc(var(--price-list-divider-opacity, 0.15) * 100%),
            transparent
          );

        &:last-child {
          border-block-end: none;
          padding-block-end: 0;
        }

        .price-list__description {
          font-size: var(--price-list-description-font-size, 1.4rem);
          color: var(--price-list-description-colour, inherit);
        }

        .price-list__price {
          display: flex;
          align-items: baseline;
          gap: var(--price-list-from-gap, 0.5ch);
          margin: 0;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .price-list__from {
          font-size: var(--price-list-from-font-size, 1.4rem);
          color: var(--price-list-from-colour, inherit);
        }

        .price-list__amount {
          font-family: var(--price-list-price-font-family, var(--hero-text-font-family, "Playfair Display"));
          font-size: var(--price-list-price-font-size, var(--hero-text-label));
          font-variation-settings:
            "wght" 400,
            "ital" 1;
          line-height: 1;
          color: var(--price-list-price-colour, inherit);
        }
      }
    }
  }
}
</style>
