<template>
  <div class="price-list" :class="elementClasses">
    <div v-for="(column, colIndex) in priceListData" :key="colIndex" class="price-list__column">
      <HeroText
        :tag="'h2'"
        font-size="subheading"
        :text-content="[{ text: column.headingtext }]"
        :icon="column.headingIcon ? column.headingIcon : undefined"
        :style-class-passthrough="['price-list__heading']"
      />

      <dl class="price-list__list">
        <div v-for="(item, index) in column.items" :key="index" class="price-list__row">
          <dt class="price-list__description">{{ item.description }}</dt>
          <dd class="price-list__price">
            <span v-if="item.from" class="price-list__from">from</span>
            <HeroText :tag="'h2'" font-size="label" :text-content="[{ text: item.price }]" />
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface PriceItem {
  description: string;
  price: string;
  from?: boolean;
}

export interface PriceListData {
  headingtext: string;
  headingIcon?: string;
  items: PriceItem[];
}

interface Props {
  priceListData: PriceListData[];
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .price-list {
    --_price-list-gap: 2rem;
    --_price-list-heading-margin-block-end: 1.8rem;
    --_price-list-row-gap: 0.75rem;
    --_price-list-divider-color: var(--price-list-divider-color, currentColor);
    --_price-list-divider-opacity: var(--price-list-divider-opacity, 0.15);
    --_price-list-heading-font-size: var(--price-list-heading-font-size, 1.8rem);
    --_price-list-description-font-size: var(--price-list-description-font-size, 1.4rem);
    --_price-list-price-font-size: var(--price-list-price-font-size, 1.4rem);

    display: grid;
    grid-template-columns: 1fr;
    gap: 2.4rem;

    @media (min-width: 48em) {
      grid-template-columns: 1fr 1fr;
    }

    .price-list__heading {
      font-weight: 600;
      margin: 0 0 var(--_price-list-heading-margin-block-end);

      &.hero-text {
        .hero-text__icon {
          margin-inline-end: 1rem;
        }
      }
    }

    .price-list__list {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0rem;

      .price-list__row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1.2rem;
        padding-block: 1.4rem;
        border-block-end: 1px solid
          color-mix(
            in srgb,
            var(--_price-list-divider-color) calc(var(--_price-list-divider-opacity) * 100%),
            transparent
          );

        &:last-child {
          border-block-end: none;
          padding-block-end: 0;
        }
        .price-list__description {
          font-size: var(--_price-list-description-font-size);
        }

        .price-list__price {
          font-size: var(--_price-list-price-font-size);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          margin: 0;
        }
      }
    }
  }
}
</style>
