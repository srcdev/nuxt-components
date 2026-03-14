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
├── storybook-add-story.md      — create a Storybook story for a component
├── storybook-add-font.md       — add a new font to Storybook
├── testing-add-unit-test.md    — create a Vitest unit test with snapshots
├── testing-add-playwright.md   — create a Playwright visual regression test
├── theming-override-default.md      — override the default theme with a custom colour scale
├── colour-scheme-disable.md         — disable light/dark scheme support in a consumer app
├── component-dynamic-slots.md        — named dynamic slots ($slots iteration) vs indexed dynamic slots (itemCount pattern)
├── component-local-style-override.md — styleClassPassthrough + scoped style block for per-usage visual customisation
├── component-prop-driven-container-layout.md — vary CSS grid layout inside @container queries using data-* attribute selectors
├── css-grid-max-width-gutters.md             — cap a centre grid column width by growing gutters, with start/center alignment variants
├── component-aria-landmark.md        — useAriaLabelledById composable: aria-labelledby for section/main/article/aside tags
├── component-export-types.md         — move inline component types to app/types/components/ barrel for consumer imports
└── components/
    ├── accordian-core.md       — AccordianCore indexed dynamic slots (accordian-{n}-summary/icon/content), exclusive-open grouping
    ├── eyebrow-text.md         — EyebrowText props, usage patterns, styling
    ├── hero-text.md            — HeroText props, usage patterns, styling
    ├── layout-grid-by-cols.md  — LayoutGridByCols dynamic slots (item-{n}), props, column/gap/breakpoint decisions
    ├── layout-row.md           — LayoutRow variant guide, width/margin decisions, usage patterns
    ├── link-text.md            — LinkText props, slots, usage patterns, styling
    ├── page-hero-highlights.md — PageHeroHighlights template: hero + highlights strip grid, CSS custom property theming
    ├── services-card.md        — ServicesCard props, actions slot, usage patterns
    ├── services-section.md     — ServicesSection props, summary-link/cta slots, summary vs full mode
    ├── contact-section.md      — ContactSection props (stepperIndicatorSize pass-through), 3-item info+form layout, slot API
    ├── stepper-list.md         — StepperList dynamic slots (item-{n}/indicator-{n}), props, connector behaviour
    └── expanding-panel.md      — ExpandingPanel v-model, forceOpened, slots (summary/icon/content), ARIA wiring
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
