<template>
  <component :is="tag" class="deep-expanding-menu" :class="[elementClasses]">
    <div class="inner">
      <template v-for="(link, key) in navLinks" :key="key">
        <NuxtLink v-if="link.path" :to="link.path" class="navigation-link">{{ link.name }}</NuxtLink>

        <div v-else class="navigation-group" :style="`--_anchor-name: --anchor-nav-1-${key};`" ref="detailsRef">
          <button :popovertarget="`popovertarget-nav-1-${key}`" class="navigation-group-toggle">
            <span>{{ link.name }}</span>
            <Icon name="bi:caret-down-fill" class="icon" />
          </button>

          <div class="navigation-group-panel" popover role="menu" :id="`popovertarget-nav-1-${key}`">
            <h4 class="heading-4 mb-6">{{ link.childLinksTitle }}</h4>
            <ul class="navigation-group-list">
              <li class="navigation-group-item" v-for="childLink in link.childLinks" :key="childLink.name">
                <NuxtLink :to="childLink.path" class="navigation-group-link">{{ childLink.name }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </component>
</template>

<script lang="ts">
const TAGS_ALLOWED = <string[]>['div', 'section', 'nav', 'ul', 'ol'];

interface INavLink {
  name: string;
  path?: string;
  isExternal?: boolean;
  childLinks?: INavLink[];
  childLinksTitle?: string;
}
</script>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: 'nav',
    validator(value: string) {
      return TAGS_ALLOWED.includes(value);
    },
  },
  navLinks: {
    type: Array as PropType<INavLink[]>,
    default: () => [],
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
// const detailsRef = useTemplateRef('detailsRef');

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>
