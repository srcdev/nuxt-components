<template>
  <div>
    <LayoutRow tag="header" variant="full" :styleClassPassthrough="['header']">
      <template #default>
        <LayoutRow tag="div" variant="popout">
          <template #default>
            <h1 class="heading-1">Nuxt Component Library</h1>
            <nav role="tablist" aria-labelledby="channel-name" ref="navContainerRef" @mouseleave="resetHoverToActivePosition()">
              <ul>
                <li v-for="(link, index) in navLinks" :key="link.name">
                  <NuxtLink @click.prevent="navItemClicked($event)" @mouseover="navItemHovered($event)" :to="link.path" :data-tab-index="index" data-nav-item role="tab" :aria-selected="false">{{
                    link.name
                  }}</NuxtLink>
                </li>
              </ul>
            </nav>
          </template>
        </LayoutRow>
      </template>
    </LayoutRow>
    <LayoutRow tag="div" variant="full">
      <template #default>
        <slot name="content"></slot>
      </template>
    </LayoutRow>
  </div>
</template>

<!-- <script type="module" lang="ts">
import polyfill from '@oddbird/css-anchor-positioning/fn';
if (import.meta.client && !('anchorName' in document.documentElement.style)) {
  polyfill({
    elements: undefined,
    excludeInlineStyles: false,
    useAnimationFrame: false,
  });
}
</script> -->

<script setup lang="ts">
interface INavLink {
  name: string;
  path: string;
}

const navLinks = <INavLink[]>[
  { name: 'Home', path: '/' },
  { name: 'Layout Row', path: '/ui/layout-row' },
  { name: 'Dialogs', path: '/ui/dialog' },
  { name: 'Tabs', path: '/ui/tabs' },
];
const previousLinkIndex = useState('previousLinkIndex', () => 0);

const navContainerRef = ref<HTMLElement | null>(null);
const { initNavDecorators, navItemClicked, navItemHovered, resetHoverToActivePosition } = useNavDecoration(navContainerRef, 200, previousLinkIndex);
onMounted(() => {
  initNavDecorators();
});
</script>
<style lang="css">
.header {
  ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      margin: 0;
      padding: 0;
    }
  }
}

[role='tablist'] {
  position: relative;
  display: flex;
  width: fit-content;
  border-bottom: 1px solid hsl(0 0% 30%);
  margin-block: 3rem;
  z-index: 1;
}

[role='tablist'] .nav__hovered {
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
  background: green;
  z-index: 1;
}

[role='tablist'] .nav__active {
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
  background: lightseagreen;
  z-index: 2;
}

[role='tablist'] .nav__active-indicator {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  scale: var(--_width-active, 0.125) 1;
  translate: var(--_left-active, 0) 0;
  transform-origin: left;
  transition: scale var(--_transition-duration), translate var(--_transition-duration);
  background: white;
  z-index: 3;
}

[role='tab'] {
  color: #fff;
  background: lightblue;
  background: transparent;
  padding: 1em 2em;
  border: 0;
  font: inherit;
  text-transform: uppercase;
  font-weight: 500;
  opacity: 0.7;
  cursor: pointer;
  position: relative;
  z-index: 4;
}

[role='tab']:hover {
  opacity: 1;
}

[role='tab'][aria-selected='true'] {
  opacity: 1;
}
</style>
