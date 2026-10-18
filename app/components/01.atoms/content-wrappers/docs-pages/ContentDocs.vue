<template>
  <component :is="tag" ref="rootEl" class="content-docs" :class="[elementClasses]">
    <div class="content-docs-inner">
      <div v-if="hasDocsContent()" class="content-docs-content">
        <slot name="docsContent"></slot>
      </div>
      <div v-if="hasDocsNav" class="content-docs-nav">
        <component
          :is="panelComponent"
          v-model="docsNavPanelOpen"
          :name="docsNavPanelName"
          :animation-duration="200"
          :force-opened="docsNavForceOpen"
          :content-is-on-top="docsNavOnTop"
        >
          <template #summary>
            <h3 class="content-docs-nav-heading">{{ docsNavLabel }}</h3>
          </template>
          <template #content>
            <nav class="content-docs-nav-list" :aria-label="docsNavAriaLabel">
              <ul role="list">
                <li v-for="(item, index) in docsNavItems" :key="`${index}-${item.to}`">
                  <component
                    :is="NuxtLink"
                    :to="item.to"
                    class="content-docs-nav-link"
                    :aria-current="item.to === activeNavItem ? 'page' : undefined"
                    @click="
                      activeNavItem = item.to;
                      docsNavPanelOpen = false;
                    "
                  >
                    <Icon v-if="item.icon" :name="item.icon" class="content-docs-nav-link-icon" aria-hidden="true" />
                    <span class="content-docs-nav-link-label">{{ item.label }}</span>
                  </component>
                </li>
              </ul>
            </nav>
          </template>
        </component>
      </div>
      <div v-if="hasDocsPageNav" class="content-docs-page-nav">
        <component
          :is="panelComponent"
          v-model="docsPageNavPanelOpen"
          :name="docsPageNavPanelName"
          :animation-duration="200"
          :force-opened="docsPageNavForceOpen"
          :content-is-on-top="docsPageNavOnTop"
        >
          <template #summary>
            <h3 class="content-docs-page-nav-heading">{{ docsPageNavLabel }}</h3>
          </template>
          <template #content>
            <nav class="content-docs-page-nav-list" :aria-label="docsPageNavAriaLabel">
              <ul role="list">
                <li v-for="(item, index) in docsPageNavItems" :key="`${index}-${item.to}`">
                  <component
                    :is="NuxtLink"
                    :to="item.to"
                    class="content-docs-page-nav-link"
                    :aria-current="item.to === activePageNavItem ? 'page' : undefined"
                    @click="
                      activePageNavItem = item.to;
                      docsPageNavPanelOpen = false;
                    "
                  >
                    <Icon v-if="item.icon" :name="item.icon" class="content-docs-page-nav-link-icon" aria-hidden="true" />
                    <span class="content-docs-page-nav-link-label">{{ item.label }}</span>
                  </component>
                </li>
              </ul>
            </nav>
          </template>
        </component>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { DocsNavItem } from "~/types/components";
import ExpandingPanel from "~/components/02.molecules/expandable/expanding-panel/ExpandingPanel.vue";
import ExpandingPanelClassic from "~/components/02.molecules/expandable/expanding-panel-classic/ExpandingPanelClassic.vue";

interface Props {
  tag?: "div" | "section" | "article" | "main";
  docsNavItems?: DocsNavItem[];
  docsPageNavItems?: DocsNavItem[];
  docsNavLabel?: string;
  docsPageNavLabel?: string;
  /** aria-label on the docs-nav <nav> landmark — override for localisation. */
  docsNavAriaLabel?: string;
  /** aria-label on the page-nav <nav> landmark — override for localisation. */
  docsPageNavAriaLabel?: string;
  panelVariant?: "modern" | "classic";
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  docsNavItems: () => [],
  docsPageNavItems: () => [],
  docsNavLabel: "Navigation",
  docsPageNavLabel: "On this page",
  docsNavAriaLabel: "Docs navigation",
  docsPageNavAriaLabel: "On this page",
  // Defaults to "classic" — the docs/admin nav toggle relies on contentIsOnTop on mobile, and
  // ExpandingPanel's ::details-content-based positioning silently fails on WebKit (Safari/iOS),
  // making the nav unreachable there. See AccordianCore's own variant prop and CLAUDE.md
  // pitfall #19 for the full mechanism. "modern" is opt-in.
  panelVariant: "classic",
  styleClassPassthrough: () => [],
});

const panelComponent = computed(() => (props.panelVariant === "modern" ? ExpandingPanel : ExpandingPanelClassic));

const activeNavItem = defineModel<string | undefined>("activeNavItem", { default: undefined });
const activePageNavItem = defineModel<string | undefined>("activePageNavItem", { default: undefined });

const NuxtLink = resolveComponent("NuxtLink");

const slots = useSlots();
const hasDocsNav = computed(() => props.docsNavItems.length > 0);
const hasDocsContent = () => !!slots.docsContent;
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

const docsNavPanelOpen = ref(false);
const docsPageNavPanelOpen = ref(false);

const panelGroupId = useId();
const docsNavPanelName = computed(() => (isMobile.value ? panelGroupId : `${panelGroupId}-docsNav`));
const docsPageNavPanelName = computed(() => (isMobile.value ? panelGroupId : `${panelGroupId}-docsPageNav`));
</script>

<style lang="css">
@layer components {
  .content-docs {
    --_heading-font-size: var(--content-docs-heading-font-size, 1.4rem);
    --_heading-font-weight: var(--content-docs-heading-font-weight, 700);
    --_heading-color: var(--content-docs-heading-color, var(--colour-text-default));
    --_heading-bg: var(--content-docs-heading-bg, transparent);
    --_heading-margin: var(--content-docs-heading-margin, 0);
    --_heading-padding-block: var(--content-docs-heading-padding-block, 0.4rem 0.8rem);
    --_heading-padding-inline: var(--content-docs-heading-padding-inline, 0);

    --_panel-bg: var(--content-docs-panel-bg, var(--page-bg));

    --_link-color: var(--content-docs-link-color, var(--colour-text-default));
    --_link-hover-bg: var(--content-docs-link-hover-bg, var(--theme-surface-subtle));
    --_link-hover-color: var(--content-docs-link-hover-color, var(--_link-color));
    --_link-active-bg: var(--content-docs-link-active-bg, var(--theme-surface));
    --_link-active-color: var(--content-docs-link-active-color, var(--theme-on-surface));
    --_link-focus-outline: var(--content-docs-link-focus-outline-width, 0.2rem) solid
      var(--content-docs-link-focus-outline-color, var(--theme-border-focus));

    container-type: inline-size;
    container-name: contentDocs;

    .content-docs-inner {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
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
        grid-template-columns: minmax(0, 1fr) var(--content-docs-page-nav-column-width-tablet, 20rem);
        grid-template-rows: auto 1fr;
      }

      @container contentDocs (width >= 1024px) {
        grid-template-areas: "docsNav docsContent docsPageNav";
        grid-template-columns:
          var(--content-docs-nav-column-width, 23rem) minmax(0, 1fr)
          var(--content-docs-page-nav-column-width, 22rem);
      }

      .content-docs-nav {
        grid-area: docsNav;
        min-inline-size: 0;

        @container contentDocs (width >= 1024px) {
          .expanding-panel-summary,
          .expanding-panel-classic-summary {
            cursor: default;
          }
        }
      }

      .content-docs-content {
        grid-area: docsContent;
        min-inline-size: 0;
        overflow-wrap: break-word;
      }

      .content-docs-page-nav {
        grid-area: docsPageNav;
        min-inline-size: 0;

        @container contentDocs (width >= 768px) {
          .expanding-panel-summary,
          .expanding-panel-classic-summary {
            cursor: default;
          }
        }
      }
    }

    .content-docs-nav-heading,
    .content-docs-page-nav-heading {
      min-inline-size: 0;
      overflow-wrap: anywhere;
    }

    .content-docs-nav-heading {
      font-size: var(--content-docs-nav-heading-font-size, var(--_heading-font-size));
      font-weight: var(--content-docs-nav-heading-font-weight, var(--_heading-font-weight));
      color: var(--content-docs-nav-heading-color, var(--_heading-color));
      background-color: var(--content-docs-nav-heading-bg, var(--_heading-bg));
      margin: var(--content-docs-nav-heading-margin, var(--_heading-margin));
      padding-block: var(--content-docs-nav-heading-padding-block, var(--_heading-padding-block));
      padding-inline: var(--content-docs-nav-heading-padding-inline, var(--_heading-padding-inline));
    }

    .content-docs-page-nav-heading {
      font-size: var(--content-docs-page-nav-heading-font-size, var(--_heading-font-size));
      font-weight: var(--content-docs-page-nav-heading-font-weight, var(--_heading-font-weight));
      color: var(--content-docs-page-nav-heading-color, var(--_heading-color));
      background-color: var(--content-docs-page-nav-heading-bg, var(--_heading-bg));
      margin: var(--content-docs-page-nav-heading-margin, var(--_heading-margin));
      padding-block: var(--content-docs-page-nav-heading-padding-block, var(--_heading-padding-block));
      padding-inline: var(--content-docs-page-nav-heading-padding-inline, var(--_heading-padding-inline));
    }

    .content-docs-nav-list,
    .content-docs-page-nav-list {
      border-radius: var(--content-docs-panel-border-radius, 0.5rem);
      padding-block: var(--content-docs-panel-padding-block, 0.8rem);
      padding-inline: var(--content-docs-panel-padding-inline, 0.8rem);

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
    }

    .content-docs-nav-list {
      background-color: var(--content-docs-nav-panel-bg, var(--_panel-bg));
    }

    .content-docs-page-nav-list {
      background-color: var(--content-docs-page-nav-panel-bg, var(--_panel-bg));
    }

    .content-docs-nav-link,
    .content-docs-page-nav-link {
      display: grid;
      grid-template-columns: var(--content-docs-link-icon-size, 1.6rem) minmax(0, 1fr);
      align-items: center;
      gap: var(--content-docs-link-icon-gap, 0.6rem);
      border-radius: var(--content-docs-link-border-radius, 0.4rem);
      font-size: var(--content-docs-link-font-size, 1.4rem);
      padding-block: var(--content-docs-link-padding-block, 0.6rem);
      padding-inline: var(--content-docs-link-padding-inline, 0.8rem);
      margin-block: var(--content-docs-link-margin-block, 0);
      background-color: var(--content-docs-link-bg, transparent);
      text-decoration: none;
      transition:
        background-color var(--control-transition-duration, 200ms) var(--control-transition-ease, ease),
        color var(--control-transition-duration, 200ms) var(--control-transition-ease, ease);

      &:focus-visible {
        outline: var(--_link-focus-outline);
        outline-offset: -0.2rem;
      }
    }

    .content-docs-nav-link {
      direction: var(--content-docs-nav-link-icon-order, ltr);
      color: var(--content-docs-nav-link-color, var(--_link-color));

      &:hover {
        background-color: var(--content-docs-nav-link-hover-bg, var(--_link-hover-bg));
        color: var(--content-docs-nav-link-hover-color, var(--_link-hover-color));
      }

      &[aria-current="page"] {
        background-color: var(--content-docs-nav-link-active-bg, var(--_link-active-bg));
        color: var(--content-docs-nav-link-active-color, var(--_link-active-color));
        font-weight: 600;
      }
    }

    .content-docs-page-nav-link {
      direction: var(--content-docs-page-nav-link-icon-order, ltr);
      color: var(--content-docs-page-nav-link-color, var(--_link-color));

      &:hover {
        background-color: var(--content-docs-page-nav-link-hover-bg, var(--_link-hover-bg));
        color: var(--content-docs-page-nav-link-hover-color, var(--_link-hover-color));
      }

      &[aria-current="page"] {
        background-color: var(--content-docs-page-nav-link-active-bg, var(--_link-active-bg));
        color: var(--content-docs-page-nav-link-active-color, var(--_link-active-color));
        font-weight: 600;
      }
    }

    .content-docs-nav-link-icon,
    .content-docs-page-nav-link-icon {
      grid-column: 1;
      direction: ltr;
      font-size: var(--content-docs-link-icon-size, 1.6rem);
    }

    .content-docs-nav-link-label,
    .content-docs-page-nav-link-label {
      grid-column: 2;
      min-inline-size: 0;
      overflow-wrap: anywhere;
      unicode-bidi: plaintext;
      text-align: start;
    }
  }
}
</style>
