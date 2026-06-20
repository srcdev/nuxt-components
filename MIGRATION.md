# Component Migration Tracker

Tracks progress toward a fully migrated component library. A component is considered **migrated** when it lives in a tiered folder (`01.atoms` – `05.forms`) and has both supporting documents complete.

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Exists |
| ☐ | Required — not yet created |
| — | N/A — internal/sub-component, not consumed directly |

**CS** = `CONSUMER-STYLING.md` in the component folder  
**SN** = VS Code snippet in `.vscode/srcdev-component-{name}.code-snippets`

---

## 01. Atoms

| Component | File | CS | SN |
|---|---|---|---|
| EntryAnimation | `animations/entry/EntryAnimation.vue` | ☐ | ☐ |
| ScrollRevealFrame | `animations/scroll-reveal-frame/ScrollRevealFrame.vue` | ☐ | ☐ |
| ScrollRevealImage | `animations/scroll-reveal-image/ScrollRevealImage.vue` | ☐ | ☐ |
| BannerVideo | `banner-video/BannerVideo.vue` | ☐ | ☐ |
| CardCore | `card/CardCore.vue` | ✅ | ☐ |
| ContentColumns2 | `content-wrappers/content-columns-2/ContentColumns2.vue` | ☐ | ☐ |
| ContentWidth | `content-wrappers/content-width/ContentWidth.vue` | ☐ | ☐ |
| LayoutGridByCols | `content-wrappers/layout-grid/layout-grid-by-cols/` | ☐ | ☐ |
| LayoutGridByWidth | `content-wrappers/layout-grid/layout-grid-by-width/` | ☐ | ☐ |
| DisplayAvatar | `display-avatar/DisplayAvatar.vue` | ☐ | ☐ |
| DisplayDialog | `display-dialog/DisplayDialog.vue` | ✅ | ✅ `dialog` |
| DisplayPill | `display-pill/DisplayPill.vue` | ☐ | ☐ |
| GlassPanel | `glass-panel/GlassPanel.vue` | ☐ | ☐ |
| AutoGrid | `grids/data-grid/AutoGrid.vue` | ☐ | ☐ |
| GridStack | `grids/grid-stack/GridStack.vue` | ☐ | ☐ |
| PageRow | `page-row/PageRow.vue` | ✅ | ☐ |
| DisplayPrompt | `prompt/DisplayPrompt.vue` | ☐ | ✅ `display-prompt` |
| DisplayQrCode | `qr-code/DisplayQrCode.vue` | ☐ | ☐ |
| TextBlock | `text-block/TextBlock.vue` | ☐ | ☐ |
| EyebrowText | `text-blocks/eyebrow-text/EyebrowText.vue` | ☐ | ☐ |
| HeroText | `text-blocks/hero-text/HeroText.vue` | ☐ | ☐ |
| LinkText | `text-blocks/link-text/LinkText.vue` | ☐ | ☐ |
| DisplayToast | `toast/DisplayToast.vue` | ☐ | ✅ `display-toast` |
| DisplayToastProvider | `toast/DisplayToastProvider.vue` | ☐ | ✅ `display-toast` |

---

## 02. Molecules

| Component | File | CS | SN |
|---|---|---|---|
| ActionMenu | `action-menu/ActionMenu.vue` | ✅ | ☐ |
| ActionMenuItemCore | `action-menu/ActionMenuItemCore.vue` | — | — |
| AlertContent | `alert-content/AlertContent.vue` | — | — |
| AlertContentInner | `alert-content/AlertContentInner.vue` | — | — |
| AlertMaskedContent | `alert-masked-content/AlertMaskedContent.vue` | — | — |
| ContactSection | `contact-section/ContactSection.vue` | ☐ | ☐ |
| DisplayChip | `display-chip/DisplayChip.vue` | ☐ | ☐ |
| AccordianCore | `expandable/accordian/AccordianCore.vue` | ☐ | ☐ |
| ExpandingPanel | `expandable/expanding-panel/ExpandingPanel.vue` | ☐ | ☐ |
| NavigationHorizontal | `navigation/navigation-horizontal/NavigationHorizontal.vue` | ☐ | ☐ |
| SiteNavigation | `navigation/site-navigation/SiteNavigation.vue` | ☐ | ☐ |
| TabNavigation | `navigation/tab-navigation/TabNavigation.vue` | ✅ | ☐ |
| PriceList | `price-list/PriceList.vue` | ☐ | ☐ |
| ProfileSection | `profile-section/ProfileSection.vue` | ☐ | ☐ |
| CaptureQrCode | `qr-code/CaptureQrCode.vue` | ☐ | ☐ |
| DecodeQrCode | `qr-code/DecodeQrCode.vue` | ☐ | ☐ |
| SamaritanPrompt | `samaritan-prompt/SamaritanPrompt.vue` | ☐ | ☐ |
| SamaritanPromptMixed | `samaritan-prompt/SamaritanPromptMixed.vue` | ☐ | ☐ |
| SocialIconsList | `social-icons-list/SocialIconsList.vue` | ☐ | ☐ |
| StepperList | `stepper-list/StepperList.vue` | ✅ | ☐ |

---

## 03. Organisms

| Component | File | CS | SN |
|---|---|---|---|
| ColourFinder | `colour-finder/ColourFinder.vue` | ☐ | ☐ |
| SliderGallery | `image-galleries/slider-gallery/SliderGallery.vue` | ☐ | ☐ |
| ServicesCard | `services/services-card/ServicesCard.vue` | ☐ | ☐ |
| ServicesCardGrid | `services/services-grids/ServicesCardGrid.vue` | ☐ | ☐ |
| ServicesSectionGrid | `services/services-grids/ServicesSectionGrid.vue` | ☐ | ☐ |
| ServicesSection | `services/services-section/ServicesSection.vue` | ☐ | ☐ |

---

## 04. Templates

| Component | File | CS | SN |
|---|---|---|---|
| PageHeroHighlights | `page-hero-highlights/PageHeroHighlights.vue` | ☐ | ☐ |
| PageHeroHighlightsHeader | `page-hero-highlights/PageHeroHighlightsHeader.vue` | — | — |

---

## 05. Forms

### Form Structure

| Component | File | CS | SN |
|---|---|---|---|
| FormWrapper | `form-wrapper/FormWrapper.vue` | ☐ | ☐ |
| FormFieldset | `form-fieldset/FormFieldset.vue` | ☐ | ☐ |
| FormField | `form-field/FormField.vue` | ☐ | ☐ |
| InputError | `form-errors/InputError.vue` | — | — |
| InputLabel | `input-label/InputLabel.vue` | — | — |
| InputDescription | `input-description/InputDescription.vue` | — | — |

### Button

| Component | File | CS | SN |
|---|---|---|---|
| InputButtonCore | `input-button/InputButtonCore.vue` | ☐ | ☐ |

### Text Inputs

| Component | File | CS | SN |
|---|---|---|---|
| InputTextCore | `input-text/InputTextCore.vue` | ☐ | ☐ |
| InputTextWithLabel | `input-text/variants/InputTextWithLabel.vue` | ☐ | ☐ |
| InputTextAsNumberWithLabel | `input-text/variants/InputTextAsNumberWithLabel.vue` | ☐ | ☐ |
| InputPasswordWithLabel | `input-text/variants/InputPasswordWithLabel.vue` | ☐ | ☐ |
| InputTextareaCore | `input-textarea/InputTextareaCore.vue` | ☐ | ☐ |
| InputTextareaWithLabel | `input-textarea/variants/InputTextareaWithLabel.vue` | ☐ | ☐ |
| InputCopyCore | `input-copy/InputCopyCore.vue` | ☐ | ☐ |

### Select & Number

| Component | File | CS | SN |
|---|---|---|---|
| InputSelectCore | `input-select/InputSelectCore.vue` | ☐ | ☐ |
| InputSelectWithLabel | `input-select/variants/InputSelectWithLabel.vue` | ☐ | ☐ |
| InputNumberCore | `input-number/InputNumberCore.vue` | ☐ | ☐ |
| InputNumberDefault | `input-number/variants/InputNumberDefault.vue` | ☐ | ☐ |

### Checkboxes & Radios

| Component | File | CS | SN |
|---|---|---|---|
| InputCheckboxRadioCore | `input-checkbox-radio/InputCheckboxRadioCore.vue` | — | — |
| InputCheckboxRadioButton | `input-checkbox-radio/InputCheckboxRadioButton.vue` | — | — |
| InputCheckboxRadioWithLabel | `input-checkbox-radio/InputCheckboxRadioWithLabel.vue` | — | — |
| SingleCheckbox | `input-checkbox/SingleCheckbox.vue` | ☐ | ☐ |
| MultipleCheckboxes | `input-checkbox/MultipleCheckboxes.vue` | ☐ | ☐ |
| MultipleRadiobuttons | `input-radio/MultipleRadiobuttons.vue` | ☐ | ☐ |

### Toggles & Range

| Component | File | CS | SN |
|---|---|---|---|
| ToggleSwitchCore | `toggle-switch/ToggleSwitchCore.vue` | ☐ | ☐ |
| ToggleSwitchWithLabel | `toggle-switch/variants/ToggleSwitchWithLabel.vue` | ☐ | ☐ |
| ToggleSwitchWithLabelInline | `toggle-switch/variants/ToggleSwitchWithLabelInline.vue` | ☐ | ☐ |
| TripleToggleSwitchCore | `triple-toggle-switch/TripleToggleSwitchCore.vue` | ☐ | ☐ |
| InputRangeCore | `input-range/InputRangeCore.vue` | ☐ | ☐ |
| InputRangeDefault | `input-range/variants/InputRangeDefault.vue` | ☐ | ☐ |
| InputRangeFancyCore | `input-range-fancy/InputRangeFancyCore.vue` | ☐ | ☐ |
| InputRangeFancyWithLabel | `input-range-fancy/InputRangeFancyWithLabel.vue` | ☐ | ☐ |

### Utility

| Component | File | CS | SN |
|---|---|---|---|
| PendingEffect | `pending-effect/PendingEffect.vue` | — | — |

---

## Not Yet Migrated

These components still live in the root `app/components/` folder and need to be assessed, tiered, and moved before CS and SN work can begin.

| Component | File | Notes |
|---|---|---|
| AlertMaskCore | `alert-mask/AlertMaskCore.vue` | SVG mask utility — may stay internal |
| AnimatedSvgText | `animated-svg-text/AnimatedSvgText.vue` | |
| CanvasSwitcher | `canvas-switcher/CanvasSwitcher.vue` | |
| CarouselBasic | `carousels/CarouselBasic.vue` | |
| CarouselFlip | `carousels/CarouselFlip.vue` | |
| CarouselInfinite | `carousels/CarouselInfinite.vue` | |
| ClipElement | `clip-element/ClipElement.vue` | |
| ClippedPanel | `clipped-panels/ClippedPanel.vue` | |
| ContainerGlowCore | `container-glow/ContainerGlowCore.vue` | |
| DeepExpandingMenu | `deep-expanding-menu/DeepExpandingMenu.vue` | |
| DeepExpandingMenuOld | `deep-expanding-menu/DeepExpandingMenuOld.vue` | Likely deprecated — review before migrating |
| DisplayBanner | `display-banner/DisplayBanner.vue` | |
| DisplayDetailsCore | `display-details/DisplayDetailsCore.vue` | |
| DisplayThemeSwitch | `display-theme-switch/DisplayThemeSwitch.vue` | |
| DisplayTooltip | `display-tooltip/DisplayTooltip.vue` | |
| DisplayTooltipDefined | `display-tooltip/DisplayTooltipDefined.vue` | |
| GlowingBorder | `glowing-border/GlowingBorder.vue` | |
| LayoutGridA | `layout-grids/LayoutGridA.vue` | |
| LayoutGridB | `layout-grids/LayoutGridB.vue` | |
| MagneticNavigation | `magnetic-navigation/MagneticNavigation.vue` | |
| MarqueeScroller | `marquee-scroller/MarqueeScroller.vue` | |
| MasonryGrid | `masonry-grid/MasonryGrid.vue` | |
| MasonryGridOrdered | `masonry-grid-ordered/MasonryGridOrdered.vue` | |
| MasonryGridOrderedGridExperiment | `masonry-grid-ordered/MasonryGridOrderedGridExperiment.vue` | Experimental — review before migrating |
| MasonryGridSorted | `masonry-grid-sorted/MasonryGridSorted.vue` | |
| SectionParallax | `parallax/SectionParallax.vue` | |
| PopOver | `pop-over/PopOver.vue` | |
| ResponsiveHeader | `responsive-header/ResponsiveHeader.vue` | |
| NavigationItems | `responsive-header/NavigationItems.vue` | Internal sub-component of ResponsiveHeader |
| RotatingCarouselImage | `rotating-carousel/RotatingCarouselImage.vue` | |
| SkipLinks | `skip-links/SkipLinks.vue` | |
| TabsCore | `tabs/TabsCore.vue` | |
| HeaderBlock | `typography/HeaderBlock.vue` | |
| UiBlockDecorated | `ui-block-decorated/UiBlockDecorated.vue` | |
| WipeAwayVertical | `view-timeline/WipeAwayVertical.vue` | |
