<template>
  <component :is="tag" class="deep-expanding-menu" :class="[elementClasses]">
    <div class="inner">
      <template v-for="(link, key) in navLinks" :key="key">
        <NuxtLink v-if="link.path" :to="link.path" class="">{{ link.name }}</NuxtLink>
        <details v-else name="top-level-nav" :style="`--_position-anchor: --anchor-nav-1-${key};, --_anchor-name: --anchor-nav-1-${key};`" ref="detailsRef">
          <summary>{{ link.name }}</summary>
          <div popver>
            <NuxtLink v-for="childLink in link.childLinks" :key="childLink.name" :to="childLink.path" class="">{{ childLink.name }}</NuxtLink>
          </div>
        </details>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: 'nav',
    validator(value: string) {
      return TAGS_ALLOWED.includes(value);
    },
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const detailsRef = useTemplateRef('detailsRef');

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

onMounted(() => {
  console.log(detailsRef.value);
});
</script>

<script lang="ts">
const TAGS_ALLOWED = <string[]>['div', 'section', 'nav', 'ul', 'ol'];

interface INavLink {
  name: string;
  path?: string;
  isExternal?: boolean;
  childLinks?: INavLink[];
}

const navLinks = <INavLink[]>[
  { name: 'Home', path: '/' },
  {
    name: 'Components',
    childLinks: [
      { name: 'Container Glow', path: '/ui/container-glow' },
      { name: 'Accordian', path: '/ui/accordian' },
      { name: 'Dialogs', path: '/ui/dialog' },
      { name: 'Tabs X', path: '/ui/tabs' },
      { name: 'Tabs Y', path: '/ui/tabs-y' },
      { name: 'Prompts', path: '/ui/display-prompt' },
      { name: 'Rotating Carousel', path: '/ui/rotating-carousel' },
      { name: 'Clipped Panels', path: '/ui/clipped-panels' },
    ],
  },
  {
    name: 'Layouts',
    childLinks: [
      { name: 'Layout Row', path: '/ui/layout-row' },
      { name: 'Layout Grid A', path: '/ui/layout-grid-a' },
      { name: 'Layout Grid B', path: '/ui/layout-grid-b' },
      { name: 'Simple Grid', path: '/ui/simple-grid' },
      { name: 'Masonry Grid Simple', path: '/ui/masonry-grid' },
      { name: 'Masonry Grid Sorted', path: '/ui/masonry-grid-sorted' },
      { name: 'Masonry Grid Ordered', path: '/ui/masonry-grid-ordered' },
      { name: 'Masonry Columns', path: '/ui/masonry-columns' },
    ],
  },
  { name: 'About', path: '/' },
];
</script>

<style lang="css">
@layer popover-setup {
  @position-try --anchor-left {
    inset: auto;
    top: anchor(top);
    right: calc(anchor(left) + 10px);
  }

  @position-try-fallbacks --anchor-right {
    inset: auto;
    top: anchor(top);
    left: calc(anchor(right) + 10px);
  }

  .deep-expanding-menu {
    container-type: inline-size;
    display: grid;
    grid-template-areas: 'element-stack';
    align-items: center;
    gap: 12px;

    .inner {
      grid-area: element-stack;
      display: flex;
      gap: 12px;
      align-items: center;
      z-index: 1;

      a,
      summary {
        &:hover {
          cursor: pointer;
        }
      }

      a {
        all: unset;
        border: 1px solid red;
        padding: 6px 12px;

        &:focus-visible {
          outline: 2px solid red;
        }
      }

      details {
        all: unset;
        border: 1px solid red;
        padding: 6px 12px;
      }

      details {
        display: grid;
        grid-template-areas: 'details-stack';
        z-index: 1;

        summary {
          grid-area: details-stack;
          /* position: relative; */
          anchor-name: var(--_anchor-name);

          &:focus {
            outline: 2px solid green;
          }

          &:focus-visible {
            outline: 2px solid red;
          }
        }

        div {
          position-anchor: var(--_position-anchor);
          background-color: black;
          display: grid;
          grid-area: details-stack;
          z-index: 2;
          position: absolute;
          inset: auto;
          top: calc(anchor(bottom) + 20px);
          left: calc(anchor(left) + 0px);
          /* translate: 0 20px; */
          padding: 12px;
          gap: 12px;

          /* position-try: --anchor-left;
          position-try-fallbacks: --anchor-right; */
        }
      }
    }
  }
}
</style>
