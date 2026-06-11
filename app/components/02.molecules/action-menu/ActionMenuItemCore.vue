<template>
  <component
    :is="tag"
    :type="!isLink ? 'button' : undefined"
    :href="isLink ? href : undefined"
    class="action-menu-item-core"
    :class="[elementClasses]"
    role="menuitem"
    @click="emit('click', $event)"
  >
    <span v-if="slots.icon" class="action-menu-item-icon" aria-hidden="true">
      <slot name="icon"></slot>
    </span>
    <span class="action-menu-item-label">{{ label }}</span>
    <span class="action-menu-item-arrow" aria-hidden="true">
      <Icon name="lucide:arrow-right" class="action-menu-item-arrow-icon" />
    </span>
  </component>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  href?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  href: undefined,
  styleClassPassthrough: () => [],
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const NuxtLink = resolveComponent("NuxtLink");
const isLink = computed(() => Boolean(props.href));
const isInternalLink = computed(() => isLink.value && props.href?.startsWith("/"));
const tag = computed(() => {
  if (isInternalLink.value) return NuxtLink;
  if (isLink.value) return "a";
  return "button";
});

const slots = useSlots();
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
  .action-menu-item-core {
    --_surface-hover: var(--action-menu-item-surface-hover, light-dark(var(--slate-01), var(--slate-09)));
    --_text-color: var(--action-menu-item-text-color, light-dark(var(--slate-09), var(--slate-01)));
    --_icon-size: var(--action-menu-item-icon-size, 2rem);
    --_padding-inline: var(--action-menu-item-padding-inline, 1.6rem);
    --_padding-block: var(--action-menu-item-padding-block, 1.2rem);

    all: unset;
    box-sizing: border-box;
    cursor: pointer;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1.2rem;
    width: 100%;
    padding-inline: var(--_padding-inline);
    padding-block: var(--_padding-block);
    color: var(--_text-color);
    font-family: var(--font-family);
    font-size: var(--button-font-size, 1.4rem);
    font-weight: var(--button-font-weight, 500);
    line-height: var(--button-line-height, 1.2);
    transition: background-color var(--control-transition-duration, 200ms) var(--control-transition-ease, ease);
    text-decoration: none;

    &:hover,
    &:focus-visible {
      background-color: var(--_surface-hover);
    }

    &:focus-visible {
      outline: var(--button-outline-width, 0.2rem) solid var(--theme-ring, currentcolor);
      outline-offset: -0.2rem;
    }

    .action-menu-item-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--_icon-size);
      height: var(--_icon-size);
      flex-shrink: 0;
    }

    .action-menu-item-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .action-menu-item-arrow {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      opacity: 0.5;

      .action-menu-item-arrow-icon {
        display: block;
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }
}
</style>
