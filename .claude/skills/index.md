# Skills

Step-by-step guides for repeatable development tasks in this project.

## For consuming apps

Copy skills into your project with:

```bash
cp -r node_modules/srcdev-nuxt-components/.claude/skills .claude/skills/srcdev-nuxt-components
```

Skills land in `.claude/skills/srcdev-nuxt-components/` — safe to re-run without overwriting your own skills.

## Structure

Each skill is a single markdown file named `<area>-<task>.md`.

```text
.claude/skills/
├── index.md                    — this file
├── performance-review.md       — spawn a subagent to inspect recently written code for Vue/Nuxt performance issues before dev handoff
├── performance-lcp-image-priority.md — fetchpriority=high + eager/lazy loading pattern for LCP images in list-rendered components
├── security-review.md          — spawn a subagent to inspect recently written code for security vulnerabilities (XSS, injection, data exposure, etc.) before dev handoff
├── storybook-add-story.md      — create a Storybook story for a component
├── storybook-add-font.md       — add a new font to Storybook
├── testing-add-unit-test.md    — create a Vitest unit test with snapshots
├── testing-add-playwright.md   — create a Playwright visual regression test
├── setup-postinstall.md             — automate nuxt prepare + Claude skills copy via postinstall so neither is forgotten after npm install
├── theming-colour-ramps.md          — parametric oklch ramp system: formula, named palettes, semantic slots, generator, consumer setup
├── theming-override-default.md      — replace the entire default theme with a custom palette (set --theme-hue/--theme-chroma)
├── theming-partial-override.md      — override a specific token category (palette, buttons, inputs) without a full theme replacement
├── colour-scheme-disable.md         — disable light/dark scheme support in a consumer app
├── component-dynamic-slots.md        — named dynamic slots ($slots iteration) vs indexed dynamic slots (itemCount pattern)
├── component-local-style-override.md — styleClassPassthrough + scoped style block for per-usage visual customisation
├── component-prop-driven-container-layout.md — vary CSS grid layout inside @container queries using data-* attribute selectors
├── css-nesting-conventions.md                — native CSS nesting rules: why &__child Sass BEM concatenation silently breaks, correct patterns
├── css-grid-max-width-gutters.md             — cap a centre grid column width by growing gutters, with start/center alignment variants
├── css-animation-utilities.md                — scroll-driven animation utility classes: scroller-x (carousel), entry-zoom-reveal, entry-slide-in, entry-exit-blur, auto-rotate
├── component-aria-landmark.md        — useAriaLabelledById composable: aria-labelledby for section/main/article/aside tags
├── component-export-types.md         — move inline component types to app/types/components/ barrel for consumer imports
├── component-inline-action-button.md — InputButtonCore variant="inline" pattern for buttons embedded in custom input wrappers
├── vue-video-autoplay.md             — autoplay on client-side navigation: use <source> child (not :src on <video>), :key, and explicit v.load()
├── icon-sets.md                      — icon set packages required by layer components, FOUC prevention, component→package map
├── vercel-node-version.md            — .nvmrc pinned to Node 24 is required; without it Vercel uses npm 10 which crashes on versionless optional stubs
├── robots-env-aware.md               — @nuxtjs/robots: allow crawling on prod domain only, block on preview/staging via env var
├── new-app-scaffold.md               — scaffold a new Nuxt consumer app extending this layer (package.json, nuxt.config, app structure, CLAUDE.md)
├── qa-panel.md                       — collapsible dev-only panel for toggling component props live on a page (demo pages and consuming apps)
├── release-notes.md                  — produce release notes as a fenced markdown block from git log
├── pull-request-description.md       — produce a PR description as a fenced markdown block from git diff vs main
├── composable-canonical-url.md       — useCanonicalUrl: set <link rel="canonical"> from runtimeConfig.public.canonicalHost; layout setup, node types
├── composable-whatsapp.md            — useWhatsApp: open pre-filled wa.me link from form payload; runtime config, security, usage
├── composable-zod-validation.md      — useZodValidation: schema-driven form validation, error binding, submit flow, API error push
├── composable-colour-scheme.md       — useColourScheme: reactive light/dark/auto switching, localStorage persistence, runtime config
├── composable-dialog-controls.md     — useDialogControls: single-call setup with config object, openDialog/closeDialog API, confirm/cancel callbacks
├── composable-anchor-scroll.md       — useAnchorScroll: smooth anchor scrolling with reduced-motion support, dynamic offset, and TabNavigation integration
├── composable-tooltips-guide.md      — useTooltipsGuide: sequential popover guide with auto-start, dismiss-to-advance, manual controls
└── components/
    ├── accordian-core.md       — AccordianCore indexed dynamic slots (accordian-{n}-summary/icon/content), exclusive-open grouping
    ├── eyebrow-text.md         — EyebrowText props, usage patterns, styling
    ├── hero-text.md            — HeroText props, usage patterns, styling
    ├── layout-grid-by-cols.md  — LayoutGridByCols dynamic slots (item-{n}), props, column/gap/breakpoint decisions
    ├── page-row.md             — PageRow layout primitive: CSS grid named lines, nesting pattern, align prop, aria-labelledby, CSS token API
    ├── link-text.md            — LinkText props, slots, usage patterns, styling
    ├── page-hero-highlights.md — PageHeroHighlights template: hero + highlights strip grid, CSS custom property theming
    ├── services-card.md        — ServicesCard props (incl. eyebrowConfig/heroConfig), actions slot, CSS tokens, page boilerplate
    ├── services-card-grid.md        — ServicesCardGrid props, config pass-through, CSS tokens, full page boilerplate
    ├── services-section-grid.md     — ServicesSectionGrid props, useAlternateReverse zigzag layout, page boilerplate
    ├── services-section.md          — ServicesSection props, summary-link/cta slots, summary vs full mode
    ├── contact-section.md      — ContactSection props (stepperIndicatorSize pass-through), 3-item info+form layout, slot API
    ├── stepper-list.md         — StepperList dynamic slots (item-{n}/indicator-{n}), props, connector behaviour
    ├── expanding-panel.md      — ExpandingPanel v-model, forceOpened, slots (summary/icon/content), ARIA wiring
    ├── glass-panel.md          — GlassPanel props, slots, CSS token API (--glass-panel-bg/border-color/shadow/highlight), theming override
    ├── navigation-horizontal.md — NavigationHorizontal props, NavItemData type, CSS token API, import path gotcha
    ├── input-copy-core.md      — InputCopyCore: readonly copy-to-clipboard input; props, emits, slots, CSS classes, usage
    ├── banner-video.md         — BannerVideo: full-width hero video banner, depth tier system, objectFit/objectPosition, reduced-motion fallback, CSS tokens
    ├── grid-stack.md           — GridStack: CSS Grid z-axis stacking, slot API, z-order rules, sizing, video+overlay and image+text patterns
    ├── scroll-reveal-frame.md  — ScrollRevealFrame: generic parallax clipping frame, slot API, image grid pattern, CSS tokens, browser support
    ├── scroll-reveal-image.md  — ScrollRevealImage: single-image parallax reveal, focalX, imgWidth/imgHeight, responsive frame height
    ├── site-navigation.md      — SiteNavigation: responsive nav with auto-collapse, burger menu, decorator indicators, CSS token API
    ├── tab-navigation.md       — TabNavigation: horizontal tab nav with CSS anchor-positioning indicators, anchor scroll, burger collapse, full CSS token API
    ├── social-icons-list.md    — SocialIconsList: data-driven social icon links, ISocialIcon type, logos: icon names, CSS tokens
    ├── display-qr-code.md      — DisplayQrCode: QR code SVG from a string value, colour/size/variant/radius props, currentColor default
    ├── capture-qr-code.md      — CaptureQrCode: live camera scanner, error state, visibility/route/KeepAlive lifecycle, media stream cleanup
    ├── decode-qr-code.md       — DecodeQrCode: file picker + drag-and-drop image decoder, shared results list, CSS override points
    ├── auto-grid.md            — AutoGrid: auto-fit responsive grid, $slots iteration, --auto-grid-min-col-size/gap tokens, semantic tag + aria
    ├── display-avatar.md       — DisplayAvatar: circular avatar with image/initials fallback, size variants, chip badge, icon slot, styleClassPassthrough
    ├── card-core.md            — CardCore: generic card container, dynamic named slots as rows, 4 variants, blurred backdrop layer, full CSS token API
    ├── action-menu.md          — ActionMenu + ActionMenuItemCore: ellipsis trigger + anchored popover menu, indexed item-{n} slots, link/button items, full CSS token API
    ├── display-dialog.md       — DisplayDialog: native <dialog> overlay, 5 variants (dialog/modal/confirm/alert/fullscreen), useDialogControls integration, CSS token API
    ├── display-chip.md         — DisplayChip: status indicator chip overlay, CSS trig positioning, circle/square shapes, status colours, icon/label content
    ├── display-pill.md         — DisplayPill: pill/badge label with icon slot, 6 variants, 3 sizes, reversible order, full CSS token API for border/outline/colour
    ├── carousel-flip.md        — CarouselFlip: FLIP-animated carousel, carouselDataIds slot API, buttonLayout variants (sides/controls-flanking/controls-grouped-right/overlay), CSS tokens
    ├── samaritan-prompt-mixed.md — SamaritanPromptMixed: animated text prompt, typewriter/word-pulse effects, MessageConfig API, aria-live accessibility, CSS tokens
    ├── display-toast.md          — DisplayToast (standalone v-model) + DisplayToastProvider + useToastQueue (app-wide queue): stacking, FLIP dismiss, maxVisible, SemanticTheme × 4
    └── display-prompt.md         — DisplayPrompt: inline notification banner, SemanticTheme × 4, local vs parent-controlled dismiss, outlined modifier, CSS token override
```

## Skill file template

```md
# <Title>

## Overview

Brief description of what this skill does and why it exists.

## Prerequisites

What needs to be in place before starting (optional section).

## Steps

### 1. <Step name>

...

### 2. <Step name>

...

## Notes

Edge cases, gotchas, or links to related files (optional section).
```
