<template>
  <component :is="tag" class="contact-section" :class="[elementClasses]">
    <div class="contact-section-inner">
      <div class="contact-section-info">
        <StepperList tag="ul" :connected="false" indicator-alignment="top" :item-count="3">
          <template #indicator-0>
            <slot name="indicator-0"></slot>
          </template>
          <template #item-0>
            <slot name="item-0">
              <p class="page-body-normal">Default slot content for item 1</p>
            </slot>
          </template>

          <template #indicator-1>
            <slot name="indicator-1"></slot>
          </template>
          <template #item-1>
            <slot name="item-1">
              <p class="page-body-normal">Default slot content for item 2</p>
            </slot>
          </template>

          <template #indicator-2>
            <slot name="indicator-2"></slot>
          </template>
          <template #item-2>
            <slot name="item-2">
              <p class="page-body-normal">Default slot content for item 3</p>
            </slot>
          </template>
        </StepperList>
      </div>
      <div class="contact-section-form">
        <slot name="form"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "main";
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
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
.contact-section {
  .contact-section-inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: start;

    @media (width >= 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    .contact-section-info {
    }

    .contact-section-form {
      /* outline: 1px solid green; */

      form {
        /* outline: 1px solid red; */
      }
    }
  }
}
}
</style>
