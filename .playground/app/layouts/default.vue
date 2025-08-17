<template>
  <div class="page-layout">
    <LayoutRow tag="div" variant="full" :style-class-passthrough="['header', 'mbe-40']">
      <template #default>
        <header class="responsive-header">
          <nav class="home-navigation" aria-label="Home Navigation">
            <SkipLinks>
              <template #homeLink>
                <NuxtLink to="/" class="home-link">Logo</NuxtLink>
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
import type { ResponsiveHeaderProp } from '../types/responsiveHeader';

const responsiveNavLinks = {
  firstNav: [
    {
      name: 'Components',
      iconName: 'material-symbols:widgets',
      childLinksTitle: 'UI Components',
      childLinks: [
        { name: 'Banner', path: '/ui/display-banner' },
        { name: 'Animated SVG Text', path: '/ui/animated-svg-text' },
        { name: 'Carousel (Basic)', path: '/ui/carousel-basic' },
        { name: 'Carousel (Infinite)', path: '/ui/carousel-infinite' },
        { name: 'Carousel (Flip)', path: '/ui/carousel-flip' },
        { name: 'Slider Gallery', path: '/ui/slider-gallery' },
        { name: 'Container Glow', path: '/ui/container-glow' },
        { name: 'Accordian', path: '/ui/accordian' },
        { name: 'Display Details', path: '/ui/display-details' },
        { name: 'Expanding Panel', path: '/ui/expanding-panel' },
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
      iconName: 'material-symbols:responsive-layout',
      childLinksTitle: 'UI Layouts',
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
  ],
  secondNav: [
    { name: 'Some other link', iconName: 'material-symbols:widgets', path: '#link-description' },
    {
      name: 'Help',
      childLinksTitle: 'Find Help',
      childLinks: [
        { name: 'FAQs', path: '#' },
        { name: 'Contact Us', path: '#' },
        { name: 'Logout', path: '#' },
      ],
    },
    {
      name: 'Account',
      childLinksTitle: 'Manage Your Account',
      childLinks: [
        { name: 'Your Profile', path: '#' },
        { name: 'Settings', path: '#' },
        { name: 'Logout', path: '#' },
      ],
    },
  ],
} as ResponsiveHeaderProp;
</script>
<style lang="css">
.header {
  width: 100%;

  .responsive-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;
    align-items: center;
    padding-block: 12px;
    padding-inline: 24px;
    background-color: #000;

    position: relative;
    z-index: 999999;

    width: 100%;

    .home-link {
      display: flex;
      align-items: center;
      text-wrap-mode: nowrap;
    }
  }
}

/* Modifiers for ResposiveHeader  */
.navigation.your-scope-class {
  margin: 1.2rem;
  border-radius: 0.8rem;
  background-color: #efefef05;
  border: 1px solid #efefef75;
  padding-block: 1rem;
  padding-inline: 1.2rem;

  /* max-block-size: 4.2rem; */

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
            border: 1px solid #efefef75;
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
        --_border-width: 1px;
        --_outline-width: 1px;
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
        border: 1px solid #ffffff90;
        border-radius: 8px;
        padding: 12px;
        margin: 0;
        gap: 8px;

        /* Override for NavigationItems START */

        .overflow-navigation-wrapper {
          gap: 12px;

          .overflow-navigation-list {
            &.visible {
              flex-direction: column;
              gap: 12px;
            }

            .overflow-navigation-item {
              .overflow-navigation-link {
                text-decoration: none;
                color: inherit;
              }

              .overflow-navigation-details {
                --_overflow-navigation-sub-nav-list-margin-block-start: 0;

                &[open] {
                  --_overflow-navigation-sub-nav-list-margin-block-start: 12px;
                }

                &.display-details {
                  .display-details-summary {
                    .label {
                      .overflow-navigation-text {
                        text-wrap: nowrap;
                      }
                    }

                    /* .icon {} */
                  }

                  .display-details-content {
                    .overflow-navigation-sub-nav-inner {
                      .overflow-navigation-sub-nav-list {
                        gap: 12px;

                        .overflow-navigation-sub-nav-item {
                          .overflow-navigation-sub-nav-link {
                            text-decoration: none;
                            color: inherit;

                            .overflow-navigation-sub-nav-text {
                              color: green;
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
