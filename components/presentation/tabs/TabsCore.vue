<template>
  <div class="tabs">
    <ul role="tablist" aria-labelledby="channel-name" ref="tabsNavRef" @mouseleave="resetHoverToActivePosition()" class="tabs-list" :class="[elementClasses]">
      <li v-for="(index, key) in navItems" :key="key">
        <button
          @click.prevent="navItemClicked($event)"
          @mouseover="navItemHovered($event)"
          :id="`tab-${key}-trigger`"
          :data-tab-index="index"
          data-nav-item
          role="tab"
          aria-selected="false"
          class="tabs-list-item"
        >
          <slot :name="`tab-${key}-trigger`"></slot>
        </button>
      </li>
    </ul>
    <div class="tab-content-wrapper">
      <div v-for="(item, key) in navItems" :key="key" class="tab-content" :aria-labelledby="`tab-${key}-trigger`" :id="`tab-${key}-content`" role="region" aria-hidden="true" ref="tabsContentRefs">
        <div>
          <slot :name="`tab-${key}-content`"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITabNav } from '@/types/types.tabs';

const props = defineProps({
  tag: {
    type: String as PropType<string>,
    default: 'button',
  },
  navItems: {
    type: Array as PropType<ITabNav[]>,
    required: true,
  },
  trackHover: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  trackActive: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  trackIndicator: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const tabsNavRef = ref<HTMLElement | null>(null);
const tabsContentRefs = ref<HTMLElement[] | null>(null);

const { initNavDecorators, navItemClicked, navItemHovered, resetHoverToActivePosition } = useTabs(tabsNavRef, tabsContentRefs);

onMounted(() => {
  initNavDecorators();
});
</script>

<style lang="css">
.tabs-list {
  /*
  * CSS var within /assets/styles/components/tabs.css
  */
  --_tabs-default-text: var(--tabs-default-text, light-dark(var(--gray-12), var(--gray-0)));
  --_tabs-active-bg: var(--tabs-active-bg, light-dark(var(--gray-12), var(--gray-0)));
  --_tabs-active-text: var(--tabs-active-text, light-dark(var(--gray-0), var(--gray-12)));
  --_tabs-active-indicator: var(--tabs-active-indicator, light-dark(var(--gray-12), var(--gray-0)));
  --_tabs-hovered-bg: var(--tabs-hovered-bg, light-dark(var(--gray-7), var(--gray-3)));
  --_tabs-hovered-text: var(--tabs-hovered-text, light-dark(var(--gray-0), var(--gray-12)));
  --_tabs-border-bottom: var(--tabs-border-bottom, light-dark(var(--gray-12), var(--gray-0)));

  position: relative;
  display: flex;
  width: fit-content;
  z-index: 1;

  list-style-type: none;
  margin: 0;
  padding: 0;

  .nav__hovered {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    scale: var(--_width-hovered, 0.125) 1;
    translate: var(--_left-hovered, 0) 0;
    transform-origin: left;
    transition: scale var(--_transition-duration), translate var(--_transition-duration);
    z-index: 1;
  }

  .nav__active {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    scale: var(--_width-active, 0.125) 1;
    translate: var(--_left-active, 0) 0;
    transform-origin: left;
    transition: scale var(--_transition-duration), translate var(--_transition-duration);
    z-index: 2;
  }

  .nav__active-indicator {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    scale: var(--_width-active, 0.125) 1;
    translate: var(--_left-active, 0) 0;
    transform-origin: left;
    transition: scale var(--_transition-duration), translate var(--_transition-duration);
    z-index: 3;
  }

  .tabs-list-item {
    opacity: 0.7;
    position: relative;
    transition: color 0.2s;
    z-index: 4;

    &:hover {
      opacity: 1;
    }

    &[aria-selected='true'] {
      opacity: 1;
    }
  }
  /*
* User configurable variables
*/
  border-bottom: 1px solid var(--_tabs-border-bottom);
  margin-block: 3rem;

  .nav__hovered {
    background: var(--_tabs-hovered-bg);
    color: var(--_tabs-hovered-text);
  }

  .nav__active {
    background: var(--_tabs-active-bg);
    color: var(--_tabs-active-text);
  }

  .nav__active-indicator {
    background: var(--_tabs-active-indicator);
    height: 4px;
  }

  .tabs-list-item {
    background: transparent;
    border: 0;
    color: var(--_tabs-default-text);
    cursor: pointer;
    font: inherit;
    text-transform: uppercase;
    font-weight: 500;
    margin: 0;
    padding: 1em 2em;

    &:hover {
      color: var(--_tabs-hovered-text);
    }

    &[aria-selected='true'] {
      color: var(--_tabs-active-text);
    }
  }
}

.tab-content-wrapper {
  display: grid;
  grid-template-areas: 'element-stack';

  .tab-content {
    grid-area: element-stack;
    display: none;
  }
}
</style>
