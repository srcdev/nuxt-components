<template>
  <div class="page-layout">
    <LayoutRow tag="div" variant="full" :style-class-passthrough="['header', 'mbe-40']">
      <template #default>
        <header class="responsive-header">
          <nav class="home-navigation" aria-label="Home Navigation">
            <SkipLinks>
              <template #homeLink>
                <NuxtLink to="/" class="home-link">
                  SRCDEV
                  <span>components</span>
                </NuxtLink>
              </template>
            </SkipLinks>
          </nav>
          <ResponsiveHeader
            :responsive-nav-links
            :gap-between-first-and-second-nav="12"
            :style-class-passthrough="['your-scope-class']"
            :overflow-details-summary-icons="{
              more: 'gravity-ui:ellipsis',
              burger: 'gravity-ui:bars',
            }"
            :collapse-at-main-nav-intersection="true"
            :allow-expand-on-gesture="false"
          >
            <template #secondaryNavigation>
              <ul class="secondary-navigation-list">
                <li class="secondary-navigation-item">
                  <NuxtLink class="secondary-navigation-link" to="/">
                    <Icon name="material-symbols:settings-outline-rounded" class="icon" aria-hidden="true" />
                    <span class="sr-only">Settings</span>
                  </NuxtLink>
                </li>
              </ul>
            </template>
          </ResponsiveHeader>
        </header>
      </template>
    </LayoutRow>
    <LayoutRow id="main-content" tag="main" variant="full" :is-landmark="true">
      <template #default>
        <slot name="layout-content">Page content goes here</slot>
      </template>
    </LayoutRow>
  </div>
</template>

<script setup lang="ts">
import type { ResponsiveHeaderProp } from "../types"

const responsiveNavLinks = {
  firstNav: [
    {
      name: "Components",
      iconName: "material-symbols:widgets",
      childLinksTitle: "UI Components",
      childLinks: [
        { name: "Wipe Away Vertical", path: "/ui/wipe-away-vertical" },
        { name: "Tooltips", path: "/ui/tooltips" },
        { name: "Marquee Scroller", path: "/ui/marquee-scroller" },
        { name: "Banner", path: "/ui/display-banner" },
        { name: "Section Parallax", path: "/ui/section-parallax" },
        { name: "Animated SVG Text", path: "/ui/animated-svg-text" },
        { name: "Carousel (Basic)", path: "/ui/carousel-basic" },
        { name: "Carousel (Infinite)", path: "/ui/carousel-infinite" },
        { name: "Carousel (Flip)", path: "/ui/carousel-flip" },
        { name: "Slider Gallery", path: "/ui/slider-gallery" },
        { name: "Container Glow", path: "/ui/container-glow" },
        { name: "Accordian", path: "/ui/accordian" },
        { name: "Display Details", path: "/ui/display-details" },
        { name: "Display Card", path: "/ui/display-card" },
        { name: "Glowing Border", path: "/ui/glowing-border" },
        { name: "Display Toast", path: "/ui/display-toast" },
        { name: "Expanding Panel", path: "/ui/expanding-panel" },
        { name: "Dialogs", path: "/ui/dialog" },
        { name: "Tabs X", path: "/ui/tabs" },
        { name: "Tabs Y", path: "/ui/tabs-y" },
        { name: "Prompts", path: "/ui/display-prompt" },
        { name: "Rotating Carousel", path: "/ui/rotating-carousel" },
        { name: "Clipped Panels", path: "/ui/clipped-panels" },
        { name: "Display Chip", path: "/ui/display-chip" },
        { name: "Display Avatar", path: "/ui/display-avatar" },
        { name: "Qr Codes", path: "/ui/qr-code/display" },
      ],
    },
    {
      name: "Layouts",
      iconName: "material-symbols:responsive-layout",
      childLinksTitle: "UI Layouts",
      childLinks: [
        { name: "Block Decorators", path: "/ui/block-decorators" },
        { name: "Magnetic Navigation", path: "/ui/magnetic-navigation" },
        { name: "Layout Row", path: "/ui/layout-row" },
        { name: "Layout Grid A", path: "/ui/layout-grid-a" },
        { name: "Layout Grid B", path: "/ui/layout-grid-b" },
        { name: "Simple Grid", path: "/ui/simple-grid" },
        { name: "Masonry Grid Simple", path: "/ui/masonry-grid" },
        { name: "Masonry Grid Sorted", path: "/ui/masonry-grid-sorted" },
        { name: "Masonry Grid Ordered", path: "/ui/masonry-grid-ordered" },
        { name: "Masonry Columns", path: "/ui/masonry-columns" },
      ],
    },
    {
      name: "Typography",
      iconName: "material-symbols:custom-typography",
      childLinksTitle: "Typography",
      childLinks: [
        { name: "Page Headings", path: "/typography/page-heading" },
        { name: "Page Body", path: "/typography/page-body" },
        { name: "Page Links", path: "/typography/page-link" },
      ],
    },
  ],
  secondNav: [
    { name: "Some other link", iconName: "material-symbols:widgets", path: "#link-description" },
    {
      name: "Help",
      childLinksTitle: "Find Help",
      childLinks: [
        { name: "FAQs", path: "#" },
        { name: "Contact Us", path: "#" },
        { name: "Logout", path: "#" },
      ],
    },
    {
      name: "Account",
      childLinksTitle: "Manage Your Account",
      childLinks: [
        { name: "Your Profile", path: "#" },
        { name: "Settings", path: "#" },
        { name: "Logout", path: "#" },
      ],
    },
  ],
} as ResponsiveHeaderProp
</script>
<style lang="css">
.header {
  width: 100%;

  .responsive-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;
    align-items: center;
    padding-block: 0;
    padding-inline: 24px;
    background-color: #000;

    position: relative;
    z-index: 99;

    width: 100%;

    .home-link {
      display: flex;
      flex-direction: column;
      text-wrap-mode: nowrap;
      font-size: var(--step-5);
      letter-spacing: 0.2em;
      color: var(--gray-0);
      text-decoration: none;

      span {
        font-size: var(--step-3);
        letter-spacing: initial;
      }

      &:hover {
        border-radius: 0.4rem;
        outline: 2px solid var(--green-8);
        outline-offset: 0.4rem;
      }
    }
  }
}

/* Modifiers for ResposiveHeader  */
.navigation.your-scope-class {
  margin: 1.2rem;
  border-radius: 0.8rem;
  background-color: #efefef05;
  border: 0.1rem solid transparent;
  padding-block: 0;
  padding-inline: 1.2rem;

  max-block-size: 4rem;

  .main-navigation {
    gap: 60px;

    .main-navigation-list {
      &:nth-of-type(1) {
        gap: 30px;
      }

      &:nth-of-type(2) {
        gap: 30px;
      }

      .main-navigation-item {
        .main-navigation-link {
          color: inherit;
          text-decoration: none;
          margin-inline-start: 0;
        }

        .main-navigation-details {
          margin-inline-start: 0;

          .has-toggle-icon {
            gap: 6px;

            .icon {
              /* color: red; */
            }
          }

          .main-navigation-details-summary {
          }

          .main-navigation-sub-nav {
            padding: 12px;
            border: 0.1rem solid #efefef75;
            border-radius: 8px;
            background-color: #000;
            translate: 0 12px;

            .main-navigation-sub-nav-list {
              display: grid;
              grid-template-columns: repeat(2, auto);
              gap: 12px;

              .main-navigation-sub-nav-item {
                margin-bottom: 8px;

                &:last-child {
                  margin-bottom: 0;
                }

                .main-navigation-sub-nav-link {
                  display: block;
                  text-wrap-mode: nowrap;
                  text-decoration: none;
                  color: inherit;
                }
              }
            }
          }
        }
      }
    }
  }

  .secondary-navigation {
    gap: 12px;

    .secondary-navigation-list {
      .secondary-navigation-item {
        .secondary-navigation-link {
          font: inherit;
          color: inherit;

          .icon {
            height: 1.35em;
            width: 1.35em;
          }
        }
      }
    }

    .main-navigation-link {
      .icon {
        height: 1.35em;
        width: 1.35em;
      }
    }

    .overflow-details {
      padding: 0;
      margin: 0;

      .overflow-details-summary {
        --_icon-zoom: 1;
        --_icon-size: 20px;
        --_border-width: 0.1rem;
        --_outline-width: 0.1rem;
        padding-inline: 5px;

        border-radius: 4px;
        border: var(--_border-width) solid #ffffff90;
        outline: var(--_outline-width) solid #ffffff10;
        background-color: Canvas;

        &:hover,
        &:focus-visible {
          --_icon-zoom: 1.2;
          outline: var(--_outline-width) solid #ffffff;
        }

        .icon {
          scale: var(--_icon-zoom);
        }
      }

      .overflow-details-nav {
        top: 135%;
        right: 0;
        background-color: #000;
        border: 0.1rem solid #ffffff90;
        border-radius: 8px;
        padding-block: 0;
        margin-block-end: -0.1rem;
        gap: 0.8rem;

        /* Override for NavigationItems START */

        .overflow-navigation-wrapper {
          --overflow-nav-padding-inline: 0.8rem;
          --overflow-nav-items-gap: 0px;
          --overflow-nav-items-padding-block: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: var(--overflow-nav-items-gap);

          .overflow-navigation-list {
            display: none;

            &.visible {
              display: flex;
              flex-direction: column;
              gap: var(--overflow-nav-items-gap);
              min-width: var(--_overflow-navigation-list-min-width, auto);
            }

            .overflow-navigation-item {
              display: none;

              &.visible {
                display: block;
              }

              .overflow-navigation-link {
                text-decoration: none;
                color: inherit;
                padding-block: var(--overflow-nav-items-padding-block);
                padding-inline: var(--overflow-nav-padding-inline);
                display: flex;
                /* background-color: red; */
                border-bottom: 0.1rem solid #efefef75;
              }

              .overflow-navigation-details {
                &.expanding-panel {
                  margin-block-end: 0;

                  .expanding-panel-details {
                    .expanding-panel-summary {
                      padding-block: var(--overflow-nav-items-padding-block);
                      padding-inline: var(--overflow-nav-padding-inline);
                      gap: 1rem;
                      /* background-color: red; */
                      border-bottom: 0.1rem solid #efefef75;

                      .label-wrapper {
                        .overflow-navigation-text {
                          text-wrap: nowrap;
                        }
                      }
                      .icon-wrapper {
                        padding: 0;
                      }
                    }

                    &[open] {
                      .expanding-panel-summary {
                        border-bottom: 0.1rem solid transparent;
                      }
                      + .expanding-panel-content {
                        border-bottom: 0.1rem solid #efefef75;
                        .inner {
                          .overflow-navigation-sub-nav-inner {
                            margin-top: var(--overflow-nav-items-gap);
                          }
                        }
                      }
                    }
                  }

                  .expanding-panel-content {
                    border-bottom: 0.1rem solid transparent;

                    .inner {
                      margin-top: 0;

                      .overflow-navigation-sub-nav-inner {
                        margin-top: 0;

                        .overflow-navigation-sub-nav-list {
                          display: flex;
                          flex-direction: column;
                          gap: 2px;

                          .overflow-navigation-sub-nav-item {
                            padding-block: var(--overflow-nav-items-padding-block);
                            padding-inline: var(--overflow-nav-padding-inline);

                            .overflow-navigation-sub-nav-link {
                              text-decoration: none;
                              color: inherit;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        /* Override for NavigationItems END */
      }
    }
  }
}
</style>
