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
import type { ResponsiveHeaderProp } from "~/types/components";

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
        { name: "Masked Alert", path: "/ui/mask-element" },
        { name: "Expanding Panel", path: "/ui/expanding-panel" },
        { name: "Dialogs", path: "/ui/display-dialog" },
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
      name: "Forms",
      iconName: "material-symbols:custom-typography",
      childLinksTitle: "Forms & Inputs",
      childLinks: [
        { name: "Buttons", path: "/forms/examples/buttons" },
        { name: "Example Form", path: "/forms/examples/material/text-fields" },
        { name: "Example Form", path: "/forms/examples/material/text-fields" },
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
        { name: "Settings", path: "/ui/settings" },
        { name: "Logout", path: "#" },
      ],
    },
  ],
} as ResponsiveHeaderProp;

// *** COLOR SCHEME INITIALIZATION ***
onMounted(() => {
  const getSystemPreference = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyColorScheme = (scheme: string) => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove("system", "dark", "light");

    // If scheme is "system", use the actual system preference
    const actualScheme = scheme === "system" ? getSystemPreference() : scheme;
    htmlElement.classList.add(actualScheme);
  };

  // Listen for system preference changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = () => {
    const storedValue = localStorage.getItem("useSettingsStore");
    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      // Only update if user has "system" selected
      if (parsed.colourScheme === "system") {
        applyColorScheme("system");
      }
    }
  };

  mediaQuery.addEventListener("change", handleSystemChange);

  try {
    const storedValue = localStorage.getItem("useSettingsStore");

    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      applyColorScheme(parsed.colourScheme || "system");
    } else {
      // For new users, detect and apply system preference
      const systemPreference = getSystemPreference();
      applyColorScheme(systemPreference);
    }
  } catch {
    // Fallback to system preference
    const systemPreference = getSystemPreference();
    applyColorScheme(systemPreference);
  }
});
</script>
<style lang="css">
/* Modifiers for ResposiveHeader  */
.header {
  .debug-grid {
    display: none !important;
  }

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
    z-index: 9;

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

.navigation {
  margin: 1.2rem;
  border-radius: 0.8rem;
  background-color: #efefef05;
  border: 1px solid transparent;
  padding-block: 1rem;
  padding-inline: 1.2rem;
  inline-size: 100%;
  max-height: 6.4rem;

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
        width: initial;

        .main-navigation-link {
          position: relative;
          display: block;
          color: var(--gray-0);
          text-decoration: none;
          margin-inline-start: 0;

          padding: 8px 2px;
          border-bottom: 0.2rem solid #efefef25;

          &:before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 0.2rem;
            background-color: transparent;
            transition: all 0.3s;
          }

          &:hover {
            &:before {
              width: 100%;
              height: 0.2rem;
              background-color: var(--green-8);
            }
          }
        }

        .main-navigation-details {
          margin-inline-start: 0;

          .has-toggle-icon {
            gap: 6px;
          }

          .main-navigation-details-summary {
            position: relative;
            color: var(--gray-0);
            white-space: nowrap;
            border-bottom: 0.2rem solid #efefef25;

            &:before {
              content: "";
              position: absolute;
              bottom: 0;
              left: 0;
              width: 0%;
              height: 0.2rem;
              background-color: transparent;
              transition: all 0.3s;
            }
          }

          &[open] {
            .main-navigation-details-summary {
              &:before {
                width: 100%;
                height: 0.2rem;
                background-color: var(--green-8);
              }
            }
          }

          .main-navigation-sub-nav {
            padding: 8px;
            border: 1px solid #efefef75;
            border-radius: 8px;
            background-color: #000;
            translate: 0 12px;

            .main-navigation-sub-nav-list {
              display: grid;
              grid-template-columns: repeat(2, auto);
              gap: 12px;

              .main-navigation-sub-nav-item {
                display: block;
                margin-bottom: 0;

                &:last-child {
                  margin-bottom: 0;
                }

                .main-navigation-sub-nav-link {
                  position: relative;
                  display: block;
                  text-wrap-mode: nowrap;
                  text-decoration: none;
                  color: var(--gray-0);
                  padding: 8px 2px;
                  border-bottom: 0.2rem solid #efefef25;
                  min-width: 170px;

                  &:before {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0%;
                    height: 0.2rem;
                    background-color: transparent;
                    transition: all 0.3s;
                  }

                  &:hover {
                    &:before {
                      width: 100%;
                      height: 0.2rem;
                      background-color: var(--green-8);
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

  .secondary-navigation {
    gap: 12px;

    .secondary-navigation-list {
      .secondary-navigation-item {
        .secondary-navigation-link {
          font: inherit;
          color: var(--gray-0);

          .icon {
            height: 1.35em;
            width: 1.35em;
          }
        }
      }
    }

    .main-navigation-link {
      color: var(--gray-0);

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
        background-color: var(--gray-8);

        width: 3rem;
        height: 3rem;

        &:hover,
        &:focus-visible {
          --_icon-zoom: 1.2;
          outline: 2px solid var(--green-8);
          outline-offset: 0.3rem;

          .icon {
            scale: 0.9;
          }
        }

        .icon {
          color: var(--gray-0);
          width: 2.6rem;
          height: 2.6rem;
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
                color: var(--gray-0);
                border-bottom: 0.2rem solid #efefef75;

                &:hover {
                  background-color: var(--gray-7);
                  border-color: var(--green-8);
                }
              }

              .overflow-navigation-details {
                &.expanding-panel {
                  margin-block-end: 0;

                  .expanding-panel-details {
                    .expanding-panel-summary {
                      padding-block: var(--overflow-nav-items-padding-block);
                      padding-inline: var(--overflow-nav-padding-inline);
                      gap: 1rem;
                      color: var(--gray-0);
                      border-bottom: 0.2rem solid #efefef75;

                      &:hover {
                        background-color: var(--gray-7);
                        border-color: var(--green-8);
                      }

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
                        border-color: transparent;

                        &:hover {
                          background-color: var(--gray-7);
                          border-color: var(--green-8);
                        }
                      }
                      + .expanding-panel-content {
                        border-bottom: 0.2rem solid #efefef75;
                        .inner {
                          .overflow-navigation-sub-nav-inner {
                            margin-top: var(--overflow-nav-items-gap);
                          }
                        }
                      }
                    }
                  }

                  .expanding-panel-content {
                    border-bottom: 0.2rem solid transparent;

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
                            font-size: var(--step-4);
                            color: var(--gray-0);

                            &:hover {
                              background-color: var(--gray-7);
                              border-color: var(--green-8);
                            }
                            .overflow-navigation-sub-nav-link {
                              text-decoration: none;
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
      }
    }
  }
}
</style>
