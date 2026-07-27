<template>
  <component :is="tag" ref="rootEl" class="content-docs" :class="[elementClasses]">
    <div class="inner">
      <div v-if="hasDocsNav" class="docs-nav">
        <ExpandingPanel
          :name="docsNavPanelName"
          :animation-duration="200"
          :force-opened="docsNavForceOpen"
          :content-is-on-top="docsNavOnTop"
        >
          <template #summary>
            <h3 class="docs-nav-heading">{{ docsNavLabel }}</h3>
          </template>
          <template #content>
            <nav class="docs-nav-list" aria-label="Docs navigation">
              <ul>
                <li v-for="item in docsNavItems" :key="item.to">
                  <component
                    :is="NuxtLink"
                    :to="item.to"
                    class="docs-nav-link"
                    :class="{ 'is-active': item.to === activeNavItem }"
                    :aria-current="item.to === activeNavItem ? 'page' : undefined"
                    @click="activeNavItem = item.to"
                  >
                    <Icon v-if="item.icon" :name="item.icon" class="docs-nav-link-icon" aria-hidden="true" />
                    <span class="docs-nav-link-label">{{ item.label }}</span>
                  </component>
                </li>
              </ul>
            </nav>
          </template>
        </ExpandingPanel>
      </div>
      <div v-if="hasDocsContent" class="docs-content">
        <slot name="docsContent"></slot>
      </div>
      <div v-if="hasDocsPageNav" class="docs-page-nav">
        <ExpandingPanel
          :name="docsPageNavPanelName"
          :animation-duration="200"
          :force-opened="docsPageNavForceOpen"
          :content-is-on-top="docsPageNavOnTop"
        >
          <template #summary>
            <h3 class="docs-page-nav-heading">{{ docsPageNavLabel }}</h3>
          </template>
          <template #content>
            <nav class="docs-page-nav-list" aria-label="On this page">
              <ul>
                <li v-for="item in docsPageNavItems" :key="item.to">
                  <component
                    :is="NuxtLink"
                    :to="item.to"
                    class="docs-page-nav-link"
                    :class="{ 'is-active': item.to === activePageNavItem }"
                    :aria-current="item.to === activePageNavItem ? 'page' : undefined"
                    @click="activePageNavItem = item.to"
                  >
                    <Icon v-if="item.icon" :name="item.icon" class="docs-page-nav-link-icon" aria-hidden="true" />
                    <span class="docs-page-nav-link-label">{{ item.label }}</span>
                  </component>
                </li>
              </ul>
            </nav>
          </template>
        </ExpandingPanel>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { DocsNavItem } from "~/types/components";

interface Props {
  tag?: "div" | "section" | "article" | "main";
  docsNavItems?: DocsNavItem[];
  docsPageNavItems?: DocsNavItem[];
  docsNavLabel?: string;
  docsPageNavLabel?: string;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  docsNavItems: () => [],
  docsPageNavItems: () => [],
  docsNavLabel: "Navigation",
  docsPageNavLabel: "On this page",
  styleClassPassthrough: () => [],
});

const activeNavItem = defineModel<string | undefined>("activeNavItem");
const activePageNavItem = defineModel<string | undefined>("activePageNavItem");

const NuxtLink = resolveComponent("NuxtLink");

const slots = useSlots();
const hasDocsNav = computed(() => props.docsNavItems.length > 0);
const hasDocsContent = computed(() => !!slots.docsContent);
const hasDocsPageNav = computed(() => props.docsPageNavItems.length > 0);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

// Breakpoints match this component's own @container queries below —
// keep both in sync if either changes.
const rootEl = ref<HTMLElement | null>(null);
const { greaterOrEqual, smaller } = useContainerBreakpoints({ tablet: 768, desktop: 1024 }, rootEl);
const isDesktop = greaterOrEqual("desktop");
const isMobile = smaller("tablet");

const docsNavForceOpen = computed(() => isDesktop.value);
const docsNavOnTop = computed(() => !isDesktop.value);
const docsPageNavForceOpen = computed(() => !isMobile.value);
const docsPageNavOnTop = computed(() => isMobile.value);

// Shared `name` groups the two <details> into a mutually-exclusive native accordion —
// wanted on mobile (neither is forceOpened), wrong on tablet/desktop where both are
// forceOpened simultaneously: a shared name would make the browser force-close one.
const docsNavPanelName = computed(() => (isMobile.value ? "docsPanelGroup" : "docsNav"));
const docsPageNavPanelName = computed(() => (isMobile.value ? "docsPanelGroup" : "docsPageNav"));
</script>

<style lang="css">
@layer components {
  .content-docs {
    /* Shared defaults — theme both docsNav and docsPageNav at once */
    --_heading-font-size: var(--content-docs-heading-font-size, 1.4rem);
    --_heading-font-weight: var(--content-docs-heading-font-weight, 700);
    --_heading-color: var(--content-docs-heading-color, light-dark(var(--slate-10), var(--slate-01)));
    --_heading-bg: var(--content-docs-heading-bg, transparent);
    --_heading-margin: var(--content-docs-heading-margin, 0);
    --_heading-padding-block: var(--content-docs-heading-padding-block, 0.4rem 0.8rem);
    --_heading-padding-inline: var(--content-docs-heading-padding-inline, 0);

    --_panel-bg: var(--content-docs-panel-bg, light-dark(var(--slate-00), var(--slate-10)));
    --_panel-padding-block: var(--content-docs-panel-padding-block, 0.8rem);
    --_panel-padding-inline: var(--content-docs-panel-padding-inline, 0.8rem);
    --_panel-border-radius: var(--content-docs-panel-border-radius, 0.5rem);

    --_link-font-size: var(--content-docs-link-font-size, 1.4rem);
    --_link-padding-block: var(--content-docs-link-padding-block, 0.6rem);
    --_link-padding-inline: var(--content-docs-link-padding-inline, 0.8rem);
    --_link-margin-block: var(--content-docs-link-margin-block, 0);
    --_link-border-radius: var(--content-docs-link-border-radius, 0.4rem);
    --_link-color: var(--content-docs-link-color, light-dark(var(--slate-09), var(--slate-01)));
    --_link-bg: var(--content-docs-link-bg, transparent);
    --_link-hover-bg: var(--content-docs-link-hover-bg, light-dark(var(--slate-01), var(--slate-09)));
    --_link-hover-color: var(--content-docs-link-hover-color, var(--_link-color));
    --_link-active-bg: var(--content-docs-link-active-bg, light-dark(var(--green-01), var(--green-09)));
    --_link-active-color: var(--content-docs-link-active-color, light-dark(var(--green-10), var(--green-04)));

    /* Per-side overrides — each falls back to the shared token above */
    --_nav-heading-font-size: var(--content-docs-nav-heading-font-size, var(--_heading-font-size));
    --_nav-heading-font-weight: var(--content-docs-nav-heading-font-weight, var(--_heading-font-weight));
    --_nav-heading-color: var(--content-docs-nav-heading-color, var(--_heading-color));
    --_nav-heading-bg: var(--content-docs-nav-heading-bg, var(--_heading-bg));
    --_nav-heading-margin: var(--content-docs-nav-heading-margin, var(--_heading-margin));
    --_nav-heading-padding-block: var(--content-docs-nav-heading-padding-block, var(--_heading-padding-block));
    --_nav-heading-padding-inline: var(--content-docs-nav-heading-padding-inline, var(--_heading-padding-inline));

    --_page-nav-heading-font-size: var(--content-docs-page-nav-heading-font-size, var(--_heading-font-size));
    --_page-nav-heading-font-weight: var(--content-docs-page-nav-heading-font-weight, var(--_heading-font-weight));
    --_page-nav-heading-color: var(--content-docs-page-nav-heading-color, var(--_heading-color));
    --_page-nav-heading-bg: var(--content-docs-page-nav-heading-bg, var(--_heading-bg));
    --_page-nav-heading-margin: var(--content-docs-page-nav-heading-margin, var(--_heading-margin));
    --_page-nav-heading-padding-block: var(
      --content-docs-page-nav-heading-padding-block,
      var(--_heading-padding-block)
    );
    --_page-nav-heading-padding-inline: var(
      --content-docs-page-nav-heading-padding-inline,
      var(--_heading-padding-inline)
    );

    --_nav-panel-bg: var(--content-docs-nav-panel-bg, var(--_panel-bg));
    --_page-nav-panel-bg: var(--content-docs-page-nav-panel-bg, var(--_panel-bg));

    --_nav-link-color: var(--content-docs-nav-link-color, var(--_link-color));
    --_nav-link-hover-bg: var(--content-docs-nav-link-hover-bg, var(--_link-hover-bg));
    --_nav-link-hover-color: var(--content-docs-nav-link-hover-color, var(--_link-hover-color));
    --_nav-link-active-bg: var(--content-docs-nav-link-active-bg, var(--_link-active-bg));
    --_nav-link-active-color: var(--content-docs-nav-link-active-color, var(--_link-active-color));

    --_page-nav-link-color: var(--content-docs-page-nav-link-color, var(--_link-color));
    --_page-nav-link-hover-bg: var(--content-docs-page-nav-link-hover-bg, var(--_link-hover-bg));
    --_page-nav-link-hover-color: var(--content-docs-page-nav-link-hover-color, var(--_link-hover-color));
    --_page-nav-link-active-bg: var(--content-docs-page-nav-link-active-bg, var(--_link-active-bg));
    --_page-nav-link-active-color: var(--content-docs-page-nav-link-active-color, var(--_link-active-color));

    container-type: inline-size;
    container-name: contentDocs;

    .inner {
      display: grid;
      grid-template-areas:
        "docsNav"
        "docsPageNav"
        "docsContent";
      gap: 1.6rem;
      align-items: start;

      @container contentDocs (width >= 768px) {
        grid-template-areas:
          "docsNav docsPageNav"
          "docsContent docsPageNav";
        gap: 1.6rem;
        grid-template-columns: 1fr 200px;
        grid-template-rows: auto 1fr;
      }

      @container contentDocs (width >= 1024px) {
        grid-template-areas: "docsNav docsContent  docsPageNav";
        gap: 1.6rem;
        grid-template-columns: 23rem 1fr 22rem;
      }

      .docs-nav {
        grid-area: docsNav;
        align-items: start;
      }
      .docs-content {
        grid-area: docsContent;
        align-items: start;
      }
      .docs-page-nav {
        grid-area: docsPageNav;
        align-items: start;
      }
    }

    .docs-nav-heading {
      font-size: var(--_nav-heading-font-size);
      font-weight: var(--_nav-heading-font-weight);
      color: var(--_nav-heading-color);
      background-color: var(--_nav-heading-bg);
      margin: var(--_nav-heading-margin);
      padding-block: var(--_nav-heading-padding-block);
      padding-inline: var(--_nav-heading-padding-inline);
    }
    .docs-page-nav-heading {
      font-size: var(--_page-nav-heading-font-size);
      font-weight: var(--_page-nav-heading-font-weight);
      color: var(--_page-nav-heading-color);
      background-color: var(--_page-nav-heading-bg);
      margin: var(--_page-nav-heading-margin);
      padding-block: var(--_page-nav-heading-padding-block);
      padding-inline: var(--_page-nav-heading-padding-inline);
    }

    .docs-nav-list,
    .docs-page-nav-list {
      border-radius: var(--_panel-border-radius);
      padding-block: var(--_panel-padding-block);
      padding-inline: var(--_panel-padding-inline);

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
    }
    .docs-nav-list {
      background-color: var(--_nav-panel-bg);
    }
    .docs-page-nav-list {
      background-color: var(--_page-nav-panel-bg);
    }

    /* Grid (not flex) so the label column stays aligned at a fixed offset whether or
       not an item has an icon — an icon-less item's label still starts in column 2,
       instead of collapsing back to column 1 like it would with flex. */
    .docs-nav-link,
    .docs-page-nav-link {
      display: grid;
      grid-template-columns: var(--docs-nav-link-icon-size, 1.6rem) 1fr;
      align-items: center;
      gap: var(--docs-nav-link-icon-gap, 0.6rem);
      border-radius: var(--_link-border-radius);
      font-size: var(--_link-font-size);
      padding-block: var(--_link-padding-block);
      padding-inline: var(--_link-padding-inline);
      margin-block: var(--_link-margin-block);
      background-color: var(--_link-bg);
      text-decoration: none;
      transition:
        background-color var(--control-transition-duration, 200ms) var(--control-transition-ease, ease),
        color var(--control-transition-duration, 200ms) var(--control-transition-ease, ease);

      &:focus-visible {
        outline: 0.2rem solid var(--theme-ring, currentcolor);
        outline-offset: -0.2rem;
      }
    }

    /* Icon at the end: set --docs-nav-link-icon-order to rtl. This mirrors which
       physical side each grid column renders on without touching column sizing —
       swapping grid-column values directly would leave the label squeezed into the
       icon-sized track instead. The label/icon direction resets below undo the
       mirroring for their own content so text and icon glyphs don't visually flip. */
    .docs-nav-link {
      direction: var(--docs-nav-link-icon-order, ltr);
      color: var(--_nav-link-color);

      &:hover {
        background-color: var(--_nav-link-hover-bg);
        color: var(--_nav-link-hover-color);
      }

      &.is-active {
        background-color: var(--_nav-link-active-bg);
        color: var(--_nav-link-active-color);
        font-weight: 600;
      }
    }
    .docs-page-nav-link {
      direction: var(--docs-page-nav-link-icon-order, ltr);
      color: var(--_page-nav-link-color);

      &:hover {
        background-color: var(--_page-nav-link-hover-bg);
        color: var(--_page-nav-link-hover-color);
      }

      &.is-active {
        background-color: var(--_page-nav-link-active-bg);
        color: var(--_page-nav-link-active-color);
        font-weight: 600;
      }
    }

    .docs-nav-link-icon,
    .docs-page-nav-link-icon {
      grid-column: 1;
      direction: ltr;
      flex-shrink: 0;
      width: var(--docs-nav-link-icon-size, 1.6rem);
      height: var(--docs-nav-link-icon-size, 1.6rem);
    }

    .docs-nav-link-label,
    .docs-page-nav-link-label {
      grid-column: 2;
      direction: ltr;
    }
  }
}
</style>
