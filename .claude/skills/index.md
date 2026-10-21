# Skills

Step-by-step guides for repeatable development tasks in this project.

## For consuming apps

Copy skills into your project with:

```bash
rm -rf .claude/skills/srcdev-nuxt-components && mkdir -p .claude/skills/srcdev-nuxt-components && cp -r node_modules/srcdev-nuxt-components/.claude/skills/. .claude/skills/srcdev-nuxt-components
```

Skills land in `.claude/skills/srcdev-nuxt-components/` — safe to re-run: it replaces only that folder, so skills dropped or renamed upstream are removed and your own skills are never touched.

The layer also ships a curated set of Claude Code rules in `.claude/rules/consumer/`. `npm run setup:claude` (see `setup-postinstall.md`) copies skills and rules together; to copy the rules by hand:

```bash
rm -rf .claude/rules/srcdev-nuxt-components && mkdir -p .claude/rules/srcdev-nuxt-components && cp -r node_modules/srcdev-nuxt-components/.claude/rules/consumer/. .claude/rules/srcdev-nuxt-components
```

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
├── theming-typography-tokens.md     — --step-N fluid font-size scale, 62.5% root reset gotcha (1rem=10px, not 16px), page-heading-*/page-body-* utility classes
├── theming-override-default.md      — replace the entire default theme with a custom palette (set --theme-hue/--theme-chroma)
├── theming-partial-override.md      — override a specific colour token category (palette, buttons, inputs) without a full theme replacement
├── theming-form-geometry-tokens.md  — non-colour form/button/input tokens (padding, border-radius, gaps): full inventory, why partial override doesn't need duplicating the source files
├── theming-component-token-pattern.md — standard shape for overridable component colours: public token + inline fallback, no bare var()/no private-only indirection; the three tiers (theme slots / cross-component families / component-scoped); line-clamp tokens for overflowing text; image-overlay scrim tokens; rollout status
├── theming-status-tokens.md        — global --status-* colours (success/warning/danger/info/neutral: solid + surface + text), which components read them, how to override once for the whole library
├── theming-dark-mode.md            — add a dark scheme in a consumer app (layer is light-only): enable plumbing, full dark token set without light-dark(), light-dark() alternative, light-only pinning
├── colour-scheme-disable.md         — disable light/dark scheme support in a consumer app
├── component-dynamic-slots.md        — named dynamic slots ($slots iteration) vs indexed dynamic slots (itemCount pattern)
├── component-naming.md               — Control/Field naming convention (InputNumber + InputNumberField, no Core/Default/WithLabel suffixes), rename procedure, backlog with consumer usage
├── component-compliance-checklist.md — definition of done for every component (tier, props, tokens, CONSUMER-STYLING.md layout, tests, story, skill doc, snippet, a11y, i18n, naming, pitfalls); shared by /new-component and /migrate-component
├── component-local-style-override.md — overriding a component from a consumer app: public tokens on an ancestor, unscoped page blocks, per-instance class/passthrough, consumer `<style scoped>` + :deep() rules, never @layer overrides
├── component-prop-driven-container-layout.md — vary CSS grid layout inside @container queries using data-* attribute selectors
├── page-transitions.md               — pageTransition/layoutTransition setup; the self-wrapped <NuxtLayout> + layout:false anti-pattern that pulls the header/nav into the transition boundary; fade CSS
├── css-nesting-conventions.md                — native CSS nesting rules: why &__child Sass BEM concatenation silently breaks, correct patterns
├── css-grid-max-width-gutters.md             — cap a centre grid column width by growing gutters, with start/center alignment variants
├── css-animation-utilities.md                — scroll-driven animation utility classes: scroller-x (carousel), entry-zoom-reveal, entry-slide-in, entry-exit-blur, auto-rotate
├── css-dynamic-border-radius.md              — .dynamic-border-radius utility: rounded until the element fills its container-type ancestor, then square; --dynamic-border-radius token, opt-in -transition class, container/full-width caveats
├── component-aria-landmark.md        — useAriaLabelledById composable: aria-labelledby for section/article/aside tags (not main), consumer-bound vs self-bound pattern, built-in broken-reference console warning
├── component-export-types.md         — move inline component types to app/types/components/ barrel for consumer imports
├── component-inline-action-button.md — InputButton variant="inline" pattern for buttons embedded in custom input wrappers
├── vue-video-autoplay.md             — autoplay on client-side navigation: use <source> child (not :src on <video>), :key, and explicit v.load()
├── icon-sets.md                      — icon set packages required by layer components, FOUC prevention, component→package map
├── icon-sizing.md                    — @nuxt/icon CSS lives in an `icons` layer below components (2026-09-28), so width/height and font-size both size an <Icon>; keep `icons` in the @layer order
├── vercel-node-version.md            — .nvmrc pinned to Node 24 is required; without it Vercel uses npm 10 which crashes on versionless optional stubs
├── robots-env-aware.md               — @nuxtjs/robots: allow crawling on prod domain only, block on preview/staging via env var
├── new-app-scaffold.md               — scaffold a new Nuxt consumer app extending this layer (package.json, nuxt.config, app structure, CLAUDE.md)
├── consumer-styles-structure.md       — consumer app's app/assets/styles/setup/ tree mirroring the library's numbered folders, index.css import chain, unlayered + :where(html) rules, override-don't-copy, orphaned-import check
├── qa-panel.md                       — collapsible panel for toggling component props live on a page, for consuming apps' own pages (gate with isDev unless demo-only); this library's own demos live in Storybook
├── pull-request-description.md       — produce a PR description as a fenced markdown block from git diff vs main
├── using-component-skills.md         — discover and use component skills in consumer apps: where skills land, browsing patterns, workflow for deciding build vs. compose
├── composable-canonical-url.md       — useCanonicalUrl: set <link rel="canonical"> from runtimeConfig.public.canonicalHost; layout setup, node types
├── composable-whatsapp.md            — useWhatsApp: open pre-filled wa.me link from form payload; runtime config, security, usage
├── composable-zod-validation.md      — useZodValidation: schema-driven form validation, error binding, submit flow, API error push
├── composable-colour-scheme.md       — useColourScheme: reactive light/dark/auto switching, localStorage persistence, runtime config
├── composable-dialog-controls.md     — useDialogControls: single-call setup with config object, openDialog/closeDialog API, confirm/cancel callbacks
├── composable-anchor-scroll.md       — useAnchorScroll: smooth anchor scrolling with reduced-motion support, dynamic offset, and ResponsiveHeader integration
├── composable-tooltips-guide.md      — useTooltipsGuide: sequential popover guide with auto-start, dismiss-to-advance, manual controls
├── composable-cookie-consent.md      — useCookieConsent: unset/granted/denied state, cookie persistence, wraps @nuxt/scripts' useScriptTriggerConsent
├── composable-analytics.md           — useAnalytics: provider-agnostic trackEvent/page-view tracking (google-analytics only implemented), consent-gated, single call site for setup + firing events
├── composable-anchored-popover.md    — useAnchoredPopover: popover + anchor positioning with JS fallbacks for Safari 16 (no Popover API) and 17–18 (no anchor positioning); used by ActionMenu/SelectMenu/DeepExpandingMenu/DisplayTooltip/PopOver
├── composable-sliding-indicator.md   — useSlidingIndicator: stretch-then-catch-up sliding indicator edges written as --_{name}-* vars, reduced-motion snap; used by useTabs/TabbedContent and SlidingToggle
└── components/
    ├── alert-content.md          — AlertContent + AlertContentInner: themed alert panel (icon/title/content/actions/dismiss) under DisplayToast, DisplayPrompt and AlertMaskedContent; showIcon, #actions row, --alert-content-* tokens, app.config icon map
    ├── alert-mask.md      — AlertMask (renamed from AlertMaskCore): SVG border/fill sized to slotted content via ResizeObserver; config-prop geometry, --alert-mask-* colour tokens
    ├── alert-masked-content.md — AlertMaskedContent: AlertContentInner inside AlertMask's SVG mask (accent cut-out border + translucent fill); masked variant for DisplayToast/DisplayPrompt; --alert-masked-content-* colour tokens
    ├── animated-svg-text.md    — AnimatedSvgText: inline SVG stroke-draw-then-fill animation, text slot, CSS token API
    ├── accordion-group.md      — AccordionGroup (renamed from AccordianCore): panels inferred from item-{n}-summary/content/icon slots, exclusive-open via shared name, unique per-panel ids, classic/modern variant, max-width token
    ├── accordion-chat.md       — AccordionChat: accordion as a chat (question bubbles right, rich answer bubbles left), avatar precedence item-{n}-avatar > #avatar > avatarLabel > none, built on ExpandingPanelClassic, full --accordion-chat-* token API (dark theme via tokens only)
    ├── eyebrow-text.md         — EyebrowText props, usage patterns, styling
    ├── hero-text.md            — HeroText props, usage patterns, styling
    ├── layout-grid-by-cols.md  — LayoutGridByCols dynamic slots (item-{n}), column/gap/collapse props that write public --layout-grid-by-cols-* tokens (CSS-settable), section label
    ├── page-row.md             — PageRow layout primitive: CSS grid named lines, nesting pattern, align prop, aria-labelledby, CSS token API
    ├── link-text.md            — LinkText props, slots, usage patterns, styling
    ├── header-block.md         — HeaderBlock: tagLevel/classLevel semantic-vs-visual heading decoupling, page-heading-N utility classes
    ├── text-block.md           — TextBlock: vertical-rhythm text wrapper, --text-block-padding-block-start/-end tokens, heading-id slot prop for section/article aria-labelledby
    ├── page-hero-highlights.md — PageHeroHighlights template: hero + straddling highlights strip grid (root is the `page-hero-highlights` container, grid in `.page-hero-highlights-grid`), widthConstrained caps the column, equal-width highlights wrap at --page-hero-highlights-item-min-width, light theme-token defaults, PageHeroHighlightsHeader companion
    ├── slider-gallery.md       — SliderGallery: full-screen image carousel, IGalleryData, pause-on-hover/reduced-motion auto-advance, prefixed classes, CSS tokens
    ├── services-card.md        — ServicesCard props (incl. eyebrowConfig/heroConfig), actions slot, CSS tokens, page boilerplate
    ├── google-reviews.md        — GoogleReviews + GoogleReviewCard: Google Places reviews in a scrolling row; env vars, server route, useGoogleReviews, props, slots, tokens, Google terms
    ├── services-card-grid.md        — ServicesCardGrid props, config pass-through, CSS tokens, full page boilerplate
    ├── service-summary-grid.md      — ServiceSummaryGrid props, useAlternateReverse zigzag layout, page boilerplate
    ├── service-summary.md           — ServiceSummary props, summary-link slot, DisplayPill duration/price (renamed/stripped from ServicesSection — full mode is now ServiceDetail)
    ├── service-detail.md            — ServiceDetail: full service detail page (hero banner, sticky sidebar booking card + related services, closing CTA), headerTag vs subheadingTag split, book-cta/sidebar-note/related-service/final-cta slots
    ├── breadcrumb.md                — Breadcrumb: items (BreadcrumbItem[]) trail, link vs current-page text, CSS token API
    ├── skip-links.md                — SkipLinks: focus-revealed accessibility skip-nav, links (SkipLink[]) data-driven, homeLink slot, empty entries dropped, index-safe keys, theme-token colours, viewport-capped wrapping panel, CSS token API
    ├── tabbed-content.md            — TabbedContent (was TabsCore): tablist + panels from indexed slots (itemCount), arrow-key nav, moving hover/active/underline indicators, CSS token API
    ├── contact-section.md      — ContactSection props (stepperIndicatorSize pass-through), 3-item info+form layout, slot API
    ├── stepper-list.md         — StepperList dynamic slots (item-{n}/indicator-{n}), props, measured connectors (gap, dashed image tokens), per-step state recipe
    ├── progress-tracker.md     — ProgressTracker: steps (ProgressTrackerStep[]) + v-model current index over StepperList, header label + progressbar, current-step #step-{n} slot for wizard forms, focus on change, CSS token API
    ├── expanding-panel.md      — ExpandingPanel v-model, forceOpened, contentIsOnTop overlay mode, slots (summary/icon/content), ARIA wiring, CSS token API
    ├── content-docs.md         — ContentDocs docs-page shell: prop-driven docsNav/docsPageNav (not slots), DocsNavItem icons, container-width breakpoint behaviour, shared/per-side CSS token API, content-docs-* classes, aria-current active state
    ├── glass-panel.md          — GlassPanel: frosted-glass container, light-only token defaults in-component (light-dark() block removed from _default.css, no built-in dark glass), highlight behind content, section/article labelled via headingId slot prop, CSS token API
    ├── pricing-card.md         — PricingCard: plan card with highlight badge, corner ribbon, feature list, #cta slot, heading-tag, line-clamp tokens
    ├── price-list.md           — PriceList: service/menu price columns (dl rows), PriceListData type, headingTag/fromLabel props, CSS token API
    ├── opening-hours.md        — OpeningHours: per-day data auto-grouped into ranges, split sessions, 24h/appointment, exceptions, Intl formatting, today highlight, JSON-LD, CSS token API
    ├── input-copy.md           — InputCopy: readonly copy-to-clipboard input with an inline InputButton, copied state + status announcement, translatable labels/icons, container-query icon-only button, --input-copy-* tokens
    ├── banner-video.md         — BannerVideo: full-width hero video banner, depth tier system, objectFit/objectPosition, playIcon/pauseIcon/toggle-icon slot, playLabel/pauseLabel, reduced-motion fallback, CSS tokens
    ├── grid-stack.md           — GridStack: CSS Grid z-axis stacking, slot API, z-order rules, sizing, video+overlay and image+text patterns
    ├── scroll-reveal-frame.md  — ScrollRevealFrame: generic parallax clipping frame, slot API, image grid pattern, public --scroll-reveal-frame-* tokens (props only write them when passed), browser support
    ├── scroll-reveal-image.md  — ScrollRevealImage: single-image parallax reveal, imgWidth/imgHeight, public focal-x/focal-y crop tokens, frame tokens settable from CSS
    ├── wipe-away-vertical.md   — WipeAwayVertical: scroll-driven vertical wipe-away effect, pure-CSS grid overlay (no JS), indexed dynamic slots, sticky-centering-via-calc gotcha, CSS tokens
    ├── marquee-scroller.md     — MarqueeScroller: infinite logo/badge scroller, per-item dynamic slots (marqueeData id), hover/focus/keyboard pause, reduced-motion, CSS tokens
    ├── rotating-carousel-image.md — RotatingCarouselImage: 3D rotating image carousel, scroll-parallax tilt, focus/keyboard/hover pause, reduced-motion, CSS tokens
    ├── social-icons-list.md    — SocialIconsList: data-driven social icon links, ISocialIcon type, logos: icon names (dark ones vanish on dark backgrounds; mono alternatives), showLabel + scoped icon/label slots, per-item brandColour (set brand-colour tokens on .social-icons-list-item), tile/circle/label tokens, four recipes (mono tiles, dark dock, pills, overlapping stack), unsafe hrefs skipped
    ├── display-qr-code.md      — DisplayQrCode: QR code SVG from a string value, colour/size/variant/radius props, currentColor default
    ├── capture-qr-code.md      — CaptureQrCode: live camera scanner, localisable errorMessages, error slot, restarts when the tab is shown again, own-root media stream cleanup, wrapping results
    ├── decode-qr-code.md       — DecodeQrCode: file picker + drag-and-drop image decoder, shared results list, no-result/read-error messages, data-dropping state hook, CSS override points
    ├── auto-grid.md            — AutoGrid: auto-fit responsive grid, $slots iteration, --auto-grid-gap/min-col-size-{small,default,large} tokens, is-responsive, semantic tag + aria
    ├── display-avatar.md       — DisplayAvatar (02.molecules): circular avatar with image/initials fallback (alt announced), broken-image fallback, data-size scale tokens, image-size, --display-avatar-* colours, chip badge, icon slot
    ├── profile-section.md      — ProfileSection (02.molecules): picture + numbered profile-info-N slots, eyebrow/hero header (above, or over the picture top/bottom on a scrim via header-placement), profileLinks, container-query two-column layout, .location/.services highlight tokens
    ├── display-theme-switch.md — DisplayThemeSwitch: system/light/dark picker wrapping SegmentedControl, wired to useSettingsStore, labels/icons props, small sizing variant
    ├── card-core.md            — CardCore: generic card container, dynamic named slots as rows, 4 variants, blurred backdrop layer, full CSS token API
    ├── action-menu.md          — ActionMenu + ActionMenuItem: ellipsis trigger + anchored popover menu, indexed item-{n} slots, link/button items, max-width cap with wrapping labels + label line-clamp token, inline flip near the left edge, full CSS token API
    ├── select-menu.md          — SelectMenu: v-model single-select listbox popover (ActionMenu's popover mechanics, InputSelect's selected-option semantics), icon/text/chevron trigger toggles, checkmark on selected option, options-array driven, full CSS token API
    ├── display-dialog.md       — DisplayDialog: native <dialog> overlay, 5 variants (dialog/modal/confirm/alert/fullscreen), useDialogControls integration, InputButton close button, viewport-capped panel with wrapping title/content/footer, aria-label fallthrough when untitled, CSS token API
    ├── display-chip.md         — DisplayChip: status indicator chip overlay, CSS trig positioning, circle/square shapes, status colours, icon/label content
    ├── display-pill.md         — DisplayPill: pill/badge label with icon slot, 6 variants, 3 sizes, reversible order, --display-pill-* tokens (variants fall back to base colour/border/ring tokens); data-size/data-variant/data-reversed hooks (2026-10-08, were bare classes), label line-clamp token, -02 ring and outlined-monochrome recipes, StressTest story
    ├── carousel-flip.md        — CarouselFlip: FLIP-animated carousel, carouselDataIds slot API, buttonLayout variants (sides/controls-flanking/controls-grouped-right/overlay/track-edges), button align/offset/edge-inset tokens, InputButton prev/next, prefixed classes + data-* state hooks, empty/single-item handling, CSS tokens
    ├── samaritan-prompt.md — SamaritanPrompt + SamaritanPromptMixed: animated text prompts, typewriter/word-pulse effects, MessageConfig API, grapheme-safe typing, instant typing under reduced motion, pause on hover, aria-live, theme-default colours, wrapping + line-clamp, CSS tokens
    ├── display-toast.md          — DisplayToast (standalone v-model) + DisplayToastProvider + useToastQueue (app-wide queue): stacking, FLIP dismiss, maxVisible, SemanticTheme × 4, masked SVG glass variant
    ├── display-prompt.md         — DisplayPrompt: inline notification banner, SemanticTheme × 4, local vs parent-controlled dismiss, outlined modifier, CSS token override
    ├── expanding-panel-classic.md — ExpandingPanelClassic: grid-template-rows animation (no Baseline-2025 dependency), same API as ExpandingPanel, cross-browser animation parity trade-off
    ├── site-header.md            — SiteHeader: PageRow + SkipLinks + ResponsiveHeader composition, #branding/#secondaryNavigation slots, dual styleClassPassthrough hooks, sticky on the outer row, capped branding column
    ├── responsive-header.md      — ResponsiveHeader: overflow-collapsing adaptive nav, measurement-pipeline gotchas (unsized icons, vw font-size drift), full CSS token API
    ├── navigation-items.md       — NavigationItems: internal overflow-panel renderer for ResponsiveHeader, complement-visibility logic, not used standalone
    ├── cookie-consent-banner.md  — CookieConsentBanner: fixed non-modal Accept/Reject banner built on AlertContent, driven by useCookieConsent; title/message slots, acceptLabel/rejectLabel/icon/showIcon/ariaLabel props, InputButton (inline) actions, position/button tokens (panel via --alert-content-*), teleported so tokens go on html/passthrough
    ├── display-banner.md         — DisplayBanner: canvas/content stacked overlay banner, conditional slot wrappers, CSS token API
    ├── deep-expanding-menu.md         — DeepExpandingMenu: anchor-positioned popover nav panels, browser support caveat, ariaLabel, prefixed classes, wrapping/flip/scroll stress handling, CSS token API
    ├── deep-expanding-menu-classic.md — DeepExpandingMenuClassic: <details>-based fallback nav, per-instance exclusive groups, outside-click/Escape/link-follow close, ariaLabel, prefixed classes, container-width panels, CSS token API
    ├── display-tooltip.md         — DisplayTooltip: anchor-positioned popover trigger, browser support caveat, triggerIcon prop, type="button" trigger, hideTrigger removes it from tab order (data-hidden), CSS token API
    ├── display-tooltip-rich.md    — DisplayTooltipRich (Material 3 rich tooltip, renamed from DisplayTooltipDefined 2026-10-18): structured title/body/action content with InputButton close button, per-field line-clamp tokens, composes DisplayTooltip
    ├── pop-over.md                — PopOver: generic anchor-positioned disclosure panel, consumer-supplied trigger/content slots, placement prop, CSS token API
    ├── input-text.md            — InputText (bare control), InputTextField, InputPasswordField, InputTextAsNumberField: renamed from Core/WithLabel, data-* state hooks, readonly/autocomplete props, leak-free digit filtering, wrapper attr-leak/empty-description/passthrough fixes, rounded+clamped stepping, min/max pass-through, CSS token API, stress stories
    ├── input-button.md           — InputButton (renamed from InputButtonCore 2026-09-28): button/NuxtLink/a; primary filled, secondary outlined, tertiary text-only, inline unstyled; data-* state hooks; shadow ring + border-colour hover; wrapping labels; icon slots; readonly (aria-disabled, activation blocked); tokens
    ├── input-range.md            — InputRange: native range-slider primitive, markers/datalist slots, dead --theme-form-range-accent-color token fixed, CSS token API; Variants section covers InputRangeField; renamed from InputRangeCore/InputRangeDefault 2026-10-16, clamped stepping, useId datalist id, data-* hooks
    ├── input-number.md           — InputNumber: native number-input primitive, left/right step-button slots, missing base class/placeholder/mismatched slot-selector bugs fixed, CSS token API; Variants section covers InputNumberField; clamped, rounded stepping, data-* state hooks, min/step-aware inputmode
    ├── input-otp.md              — InputOtp: one-time-code digit boxes (paste/autofill spreading, Backspace/arrow/Home/End nav, Enter submits, leading zeros kept, complete event, hidden input); Variants section covers InputOtpField
    ├── form-field.md             — FormField: layout wrapper for one form control (width cap, gutter, field spacing), data-width/data-has-gutter/data-invalid hooks, dead .underline rule removed, CSS token API
    ├── form-fieldset.md          — FormFieldset: shared fieldset+legend for checkbox/radio groups, groupRole prop (hardcoded radiogroup bug fixed), aria-required only on radiogroup, dead description slot removed, legend token API
    ├── input-error.md            — InputError: red error strip every *Field wrapper renders under its control, data-visible/data-detached/data-input-variant hooks, generic .inner/.message class names prefixed, dead compact prop and hidden-state border CSS removed, icon prop, CSS token API
    ├── input-description.md      — InputDescription: field help text (descriptionText/descriptionHtml slots), renders nothing without a slot, wrappers' unconditional slot forwarding/outlined double-render/missing aria id fixed, dead id/theme props removed, data-input-variant/data-invalid hooks, CSS token API
    ├── input-label.md            — InputLabel: the <label> every labelled *Field wrapper renders (textLabel/htmlLabel slots), id is the control's id rendered as for, required/optional indicator (app.config srcdev.inputLabel, text or icon), dead name/theme props and fallthrough :for removed, data-input-variant/data-invalid hooks, CSS token API
    ├── form-wrapper.md           — FormWrapper: width-capped outer container for a whole form, data-width hook, named inline-size container, not centred by default (--form-wrapper-margin-inline), CSS token API
    ├── pending-effect.md         — PendingEffect: animated dashed border InputButton draws while is-pending (has-pending-effect), tokens renamed to --pending-effect-* and read at point of use, animation moved off the host button, aria-hidden
    ├── input-textarea.md        — InputTextarea (bare control), InputTextareaField (labelled): renamed from Core/WithLabel, data-* state hooks, line breaks kept (all:unset pre-wrap fix), readonly/autocomplete props, min/max-height + slot-gap tokens, aria-invalid=false fix, Field passthrough on root only, CSS token API, stress stories
    ├── input-select.md          — InputSelect (bare control), InputSelectField (labelled): renamed from Core/WithLabel, data-input-variant/data-invalid/data-dirty/data-active hooks, data-driven options with icon decorator, placeholder-vs-0 fix, Field passthrough on root only, appearance:base-select browser-support note, CSS token API, stress stories
    ├── input-checkbox-radio.md   — InputCheckboxRadio (bare control), InputCheckboxRadioField (labelled), InputCheckboxRadioButton (button/pill option): renamed from Core/WithLabel, state classes → data-* hooks, type-switch v-model fix, no aria-checked, icon font-size sizing, button spacing tokens, long labels wrap (inline nowrap removed), optional useId button id
    ├── input-checkbox.md         — MultipleCheckboxes/SingleCheckbox: fieldset-wrapped checkbox group (data-driven, button or labelled) and single checkbox, per-box native-required/styleClassPassthrough/data-testid bugs fixed, spacing token API, wraps hostile content (fieldset min-inline-size, useId option ids)
    ├── input-radio.md            — MultipleRadiobuttons: fieldset radiogroup (data-driven, button or labelled), shared-name grouping bug fixed, dead label/placeholder/equalCols props removed, data-options-layout hook, spacing token API, useId button ids, wraps hostile content
    ├── toggle-switch.md         — ToggleSwitch (bare control), ToggleSwitchField (labelled, layout="stacked"|"inline", replaces ToggleSwitchWithLabelInline): renamed from Core/WithLabel, role="switch", prefixed inner classes + data-checked, single-toggle click handling, reduced motion, round prop + border-radius token, track width from geometry, CSS token API, stress stories
    ├── segmented-control.md    — SegmentedControl (renamed from TripleToggleSwitch): icon radio pill for any number of options with sliding marker, radiogroup + ariaLabel, system/light/dark marker-gradient tokens, reduced-motion, CSS token API
    ├── sliding-toggle.md       — SlidingToggle: single-choice segmented radiogroup with text labels of any width, measured sliding + hover indicators (useSlidingIndicator), roving tabindex/arrow keys, corner-shape token, CSS token API
    ├── entry-animation.md         — EntryAnimation: scroll-driven entry animation wrapper (slide-in/zoom-reveal/exit-blur utility classes), skipAnimation for above-the-fold loop items, reduced-motion handled at the CSS layer
    ├── column-flow-grid.md        — ColumnFlowGrid (renamed from MasonryGrid): CSS multi-column text-flow layout, named dynamic slots (no count/data prop), itemMinWidth/gap/unit sizing, CSS token API; not a true masonry, see "which one do I want?"
    ├── masonry-grid.md            — MasonryGrid: real measured-height masonry (greedy shortest-column packing, animated resize) absorbed from the now-retired MasonryGridOrdered; named dynamic slots, fixedWidth/justify, CSS token API
    ├── glowing-border.md          — GlowingBorder: animated conic-gradient glow border, 5 colour variants, tag prop, full CSS token API for width/radius/surface/duration/per-variant colour stops, reduced-motion guard
    ├── sparkle-effect.md          — SparkleEffect: slot wrapper sending sparkles along its rounded border (offset-path) plus a glow on hover/focus-visible, count prop (1 to 12, preset table), continuous prop (loop while hovered/focused), radius prop/token, blur token, disabled suppression, reduced-motion and old-Safari glow-only fallback, CSS token API
    ├── section-parallax.md        — SectionParallax: CSS fixed-background parallax section, iOS Safari limitation, when to use vs ScrollRevealImage, CSS token API, reduced-motion guard
    ├── container-glow.md          — ContainerGlow (renamed from ContainerGlowCore): pointer-proximity glow-border cards, named dynamic slots (one card per slot), config-prop-driven layout/interaction, full CSS token API for static visuals, reduced-motion guard
    ├── dashboard-quad-grid.md      — DashboardQuadGrid (renamed from LayoutGridA): fixed 4-slot dashboard grid, container-query breakpoints, CSS token API
    └── dashboard-stats-grid.md     — DashboardStatsGrid (renamed from LayoutGridB): top-row panel cluster + bottom-row panel strip dashboard grid, topRowSlot1ItemCount/bottomRowItemCount, CSS token API
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
