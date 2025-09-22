<template>
  <div class="tabs-core" :class="`axis-${axis}`">
    <ul
      role="tablist"
      aria-labelledby="channel-name"
      ref="tabsNavRef"
      @mouseleave="resetHoverToActivePosition()"
      class="tabs-list"
      :class="[elementClasses]"
    >
      <li v-for="(index, key) in itemCount" :key="key">
        <button
          @click.prevent="navItemClicked($event)"
          @mouseover="navItemHovered($event)"
          :id="`tab-${key}-trigger`"
          :data-tab-index="key"
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
      <div
        v-for="(item, key) in itemCount"
        :key="key"
        class="tab-content"
        :aria-labelledby="`tab-${key}-trigger`"
        :id="`tab-${key}-content`"
        role="region"
        aria-hidden="true"
        ref="tabsContentRefs"
      >
        <slot :name="`tab-${key}-content`"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String as PropType<string>,
    default: "button",
  },
  axis: {
    type: String as PropType<"x" | "y">,
    default: "x",
  },
  transitionDuration: {
    type: Number as PropType<number>,
    default: 200,
  },
  itemCount: {
    type: Number as PropType<number>,
    default: 0,
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
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const tabsNavRef = ref<HTMLElement | null>(null)
const tabsContentRefs = ref<HTMLElement[] | null>(null)

const { initNavDecorators, navItemClicked, navItemHovered, resetHoverToActivePosition } = useTabs(
  props.axis,
  tabsNavRef,
  tabsContentRefs,
  props.transitionDuration
)

onMounted(() => {
  initNavDecorators()
})
</script>

<style lang="css">
.tabs-core {
  .tabs-list {
    position: relative;
    display: flex;
    width: fit-content;
    z-index: 1;

    list-style-type: none;
    margin: 0;
    padding: 0;

    .nav__hovered {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      scale: var(--_width-hovered, 0.125) 1;
      translate: var(--_x-hovered, 0) 0;
      transform-origin: left;
      transition: scale var(--_transition-duration), translate var(--_transition-duration);
      z-index: 1;
    }

    .nav__active {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      scale: var(--_width-active, 0.125) 1;
      translate: var(--_x-active, 0) 0;
      transform-origin: left;
      transition: scale var(--_transition-duration), translate var(--_transition-duration);
      z-index: 2;
    }

    .nav__active-indicator {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      scale: var(--_width-active, 0.125) 1;
      translate: var(--_x-active, 0) 0;
      transform-origin: left;
      transition: scale var(--_transition-duration), translate var(--_transition-duration);
      z-index: 3;
    }

    .tabs-list-item {
      opacity: 0.7;
      position: relative;
      transition: color 100ms;
      z-index: 4;

      &:hover {
        opacity: 1;
      }

      &[aria-selected="true"] {
        opacity: 1;
      }
    }

    border-bottom: var(--_tabs-border-bottom);

    .nav__hovered {
      background: light-dark(var(--gray-7), var(--gray-3));
      color: light-dark(var(--gray-0), var(--gray-12));
    }

    .nav__active {
      background: light-dark(var(--gray-12), var(--gray-0));
      color: light-dark(var(--gray-0), var(--gray-12));
    }

    .nav__active-indicator {
      background: light-dark(var(--gray-12), var(--gray-0));
      height: 0.4rem;
    }

    .tabs-list-item {
      background: transparent;
      border: 0;
      color: light-dark(var(--gray-12), var(--gray-0));
      cursor: pointer;
      font: inherit;
      text-transform: uppercase;
      font-weight: 500;
      margin: 0;
      padding: 1em 2em;

      &:hover {
        color: light-dark(var(--gray-0), var(--gray-12));
      }

      &[aria-selected="true"] {
        color: light-dark(var(--gray-0), var(--gray-12));
      }

      &.transitioning {
        color: light-dark(var(--gray-0), var(--gray-12));
      }
    }
  }

  .tab-content-wrapper {
    display: grid;
    grid-template-areas: "element-stack";

    background-color: light-dark(var(--gray-9), var(--gray-10));
    border: 0.1rem solid var(--gray-6);
    border-start-start-radius: 0;
    border-start-end-radius: 0;
    border-end-start-radius: 0;
    border-end-end-radius: 0;
    outline: 0.1rem solid var(--gray-6);

    .tab-content {
      grid-area: element-stack;
      display: none;
    }
  }
}

/*
* Deal with axis-y
**/

.tabs-core {
  &.axis-y {
    display: flex;
    flex-direction: row;
    gap: 2em;

    .tabs-list {
      flex-direction: column;

      border-bottom: initial;
      border-left: var(--_tabs-border-bottom);
      position: relative;

      .tabs-list-item {
        text-align: left;
        width: 100%;

        &:hover {
          /* color: light-dark(var(--gray-0), var(--gray-12)); */
        }

        &[aria-selected="true"] {
          /* color: var(--_tabs-active-text); */
        }

        &.transitioning {
          /* color: light-dark(var(--gray-0), var(--gray-12)); */
        }
      }

      .nav__hovered {
        left: 0;
        right: initial;
        bottom: initial;
        top: 0;
        height: var(--_y-height);
        translate: 0 var(--_y-hovered, 0);
        transform-origin: top;
        width: var(--_y-width);
      }

      .nav__active {
        left: 0;
        right: initial;
        bottom: initial;
        top: 0;
        height: var(--_y-height);
        translate: 0 var(--_y-active, 0);
        transform-origin: top;
        width: var(--_y-width);
      }

      .nav__active-indicator {
        left: 0;
        right: initial;
        bottom: initial;
        top: 0;
        height: var(--_y-height);
        scale: var(--_width-active, 0.125) 1;
        translate: 0 var(--_y-active, 0);
        transform-origin: top;
        width: 0.4em;
      }
    }
    .tab-content-wrapper {
      flex-grow: 1;
    }
  }
}
</style>
