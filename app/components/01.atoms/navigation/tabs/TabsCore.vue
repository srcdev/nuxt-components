<template>
  <div class="tabs-core" :class="[`axis-${axis}`]">
    <ul
      ref="tabsNavRef"
      role="tablist"
      :aria-label="ariaLabel"
      class="tabs-list"
      :class="[elementClasses]"
      @mouseleave="resetHoverToActivePosition()"
    >
      <li v-for="(index, key) in itemCount" :key="key">
        <button
          :id="`tab-${key}-trigger`"
          :data-tab-index="key"
          data-nav-item
          type="button"
          role="tab"
          aria-selected="false"
          class="tabs-list-item"
          @click.prevent="navItemClicked($event)"
          @mouseenter="navItemHovered($event)"
          @keydown="navItemKeydown($event)"
        >
          <slot :name="`tab-${key}-trigger`"></slot>
        </button>
      </li>
    </ul>
    <div class="tab-content-wrapper">
      <div
        v-for="(item, key) in itemCount"
        :id="`tab-${key}-content`"
        :key="key"
        ref="tabsContentRefs"
        class="tab-content"
        :aria-labelledby="`tab-${key}-trigger`"
        role="tabpanel"
        tabindex="0"
        aria-hidden="true"
      >
        <slot :name="`tab-${key}-content`"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  axis?: "x" | "y";
  transitionDuration?: number;
  /** Number of tabs to render — drives both the trigger and content indexed slots. */
  itemCount: number;
  /** Shows a moving highlight behind the hovered tab. */
  trackHover?: boolean;
  /** Shows a moving highlight behind the active tab. */
  trackActive?: boolean;
  /** Shows a moving underline/sideline indicator beneath the active tab. */
  trackIndicator?: boolean;
  /** aria-label on the tablist — override for localisation. */
  ariaLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  axis: "x",
  transitionDuration: 200,
  trackHover: true,
  trackActive: true,
  trackIndicator: true,
  ariaLabel: "Tabs",
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const tabsNavRef = ref<HTMLElement | null>(null);
const tabsContentRefs = ref<HTMLElement[] | null>(null);

const { initNavDecorators, navItemClicked, navItemHovered, navItemKeydown, resetHoverToActivePosition } = useTabs(
  props.axis,
  tabsNavRef,
  tabsContentRefs,
  props.transitionDuration,
  { trackHover: props.trackHover, trackActive: props.trackActive, trackIndicator: props.trackIndicator }
);

onMounted(() => {
  initNavDecorators();
});
</script>

<style lang="css">
@layer components {
  .tabs-core {
    .tabs-list {
      position: relative;
      display: flex;
      width: fit-content;
      z-index: 1;

      list-style-type: none;
      margin: 0;
      padding: 0;

      border-bottom: var(--tabs-nav-border, 0.1rem solid var(--slate-06));

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
        transition:
          scale var(--_transition-duration),
          translate var(--_transition-duration);
        z-index: 1;
        background: var(--tabs-hover-indicator-colour, var(--slate-07));
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
        transition:
          scale var(--_transition-duration),
          translate var(--_transition-duration);
        z-index: 2;
        background: var(--tabs-active-indicator-colour, var(--slate-09));
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
        transition:
          scale var(--_transition-duration),
          translate var(--_transition-duration);
        z-index: 3;
        background: var(--tabs-underline-indicator-colour, var(--slate-10));
        height: var(--tabs-underline-indicator-height, 0.4rem);
      }

      .tabs-list-item {
        opacity: var(--tabs-list-item-opacity, 0.7);
        position: relative;
        transition: color var(--tabs-list-item-colour-transition-duration, 100ms);
        z-index: 4;
        background: transparent;
        border: 0;
        color: var(--tabs-list-item-colour, var(--slate-10));
        cursor: pointer;
        font: inherit;
        text-transform: var(--tabs-list-item-text-transform, uppercase);
        font-weight: var(--tabs-list-item-font-weight, 500);
        margin: 0;
        padding: var(--tabs-list-item-padding-block, 1em) var(--tabs-list-item-padding-inline, 2em);

        /* Text colour tracks the indicator actually behind it — hover and active can differ. */
        &:hover {
          opacity: 1;
          color: var(--tabs-hover-indicator-text-colour, var(--slate-00));
        }

        &[aria-selected="true"] {
          opacity: 1;
          color: var(
            --tabs-list-item-colour-selected,
            var(--tabs-active-indicator-text-colour, var(--slate-00))
          );
        }

        &:focus-visible {
          outline: var(--tabs-list-item-focus-outline-width, 2px) solid var(--theme-ring);
          outline-offset: var(--tabs-list-item-focus-outline-offset, -2px);
        }
      }
    }

    .tab-content-wrapper {
      display: grid;
      grid-template-areas: "element-stack";

      background-color: var(--tabs-content-background-colour, var(--slate-09));
      border: var(--tabs-content-border-width, 0.1rem) solid var(--tabs-content-border-colour, var(--slate-06));
      border-radius: var(--tabs-content-border-radius, 0);
      outline: var(--tabs-content-border-width, 0.1rem) solid var(--tabs-content-border-colour, var(--slate-06));

      .tab-content {
        grid-area: element-stack;
        display: none;

        &:focus-visible {
          outline: var(--tabs-list-item-focus-outline-width, 2px) solid var(--theme-ring);
          outline-offset: calc(-1 * var(--tabs-list-item-focus-outline-width, 2px));
        }
      }
    }

    /*
    * Deal with axis-y
    **/

    &.axis-y {
      display: flex;
      flex-direction: row;
      gap: var(--tabs-axis-y-gap, 2em);

      .tabs-list {
        flex-direction: column;

        border-bottom: initial;
        border-left: var(--tabs-nav-border, 0.1rem solid var(--slate-06));
        position: relative;

        .tabs-list-item {
          text-align: left;
          width: 100%;
        }

        .nav__hovered,
        .nav__active {
          left: 0;
          right: initial;
          bottom: initial;
          top: 0;
          height: var(--_y-height);
          transform-origin: top;
          width: var(--_y-width);
        }

        .nav__hovered {
          translate: 0 var(--_y-hovered, 0);
        }

        .nav__active {
          translate: 0 var(--_y-active, 0);
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
          width: var(--tabs-underline-indicator-height, 0.4em);
        }
      }

      .tab-content-wrapper {
        flex-grow: 1;
      }
    }
  }
}
</style>
