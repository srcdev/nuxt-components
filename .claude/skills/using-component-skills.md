# Using Component Skills

## Overview

Component skills are reference documentation files for every reusable component in `srcdev-nuxt-components`. They land in your consumer app after running `npm run setup:claude` and serve two purposes:

1. **As human-readable reference** — browse component skills to understand props, slots, CSS tokens, and usage patterns
2. **As discovery tool** — before building custom components, check if a suitable pattern already exists in the layer

---

## Setup

### 1. Copy skills from the layer

After scaffolding a new Nuxt app that extends `srcdev-nuxt-components`, run:

```bash
npm run setup:claude
```

This copies all skills (including component skills) into `.claude/skills/srcdev-nuxt-components/`.

### 2. After upgrading the layer

When you upgrade `srcdev-nuxt-components` to a new version (which may include new components), re-run the command to refresh:

```bash
npm run setup:claude
```

---

## File structure

Component skills land in `.claude/skills/srcdev-nuxt-components/components/`:

```
.claude/
├── skills/
│   └── srcdev-nuxt-components/
│       ├── index.md                    — overview of all skills
│       ├── new-app-scaffold.md         — scaffolding a new app
│       ├── theming-colour-ramps.md     — theme customization
│       ├── composable-*.md             — utility composables
│       └── components/
│           ├── pricing-card.md         — SaaS pricing plan card
│           ├── input-copy.md           — copy-to-clipboard input
│           ├── expanding-panel.md      — single expand/collapse panel
│           ├── accordian-core.md       — native accordion (grouped panels)
│           ├── display-avatar.md       — circular avatar component
│           ├── card-core.md            — generic card container
│           ├── auto-grid.md            — responsive auto-fit grid
│           ├── display-dialog.md       — native dialog overlay
│           ├── display-toast.md        — toast notifications
│           └── ... (40+ more components)
```

---

## Discovering components

### Via your file explorer

Browse `.claude/skills/srcdev-nuxt-components/components/` to see all available components with one-line descriptions.

### Via grep

Search for components by pattern:

```bash
# Find all form-related components
grep -l "input\|form\|button" .claude/skills/srcdev-nuxt-components/components/*.md

# Find components with slot patterns
grep -l "slot" .claude/skills/srcdev-nuxt-components/components/*.md

# Find components with CSS token customization
grep -l "CSS token" .claude/skills/srcdev-nuxt-components/components/*.md
```

### Via Claude Code

If your `.claude/settings.json` includes the layer's skills in `additionalDirectories`, Claude can reference them:

```json
{
  "permissions": {
    "additionalDirectories": [
      "path/to/srcdev-nuxt-components/.claude/skills/components"
    ]
  }
}
```

Then ask Claude: *"What button components are available in the layer?"* or *"Show me the expanding-panel skill."*

---

## Understanding a component skill

Each component skill documents:

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `:prop-name` | type | default | What this prop does |

### Slots

Explains what content goes inside each slot and provides scoped variables if applicable.

### Events / Emits

When the component emits events and what data they carry.

### CSS Tokens

All `--component-*` tokens available for customization via global/page/instance scope.

### Usage Examples

Practical examples showing:
- Basic usage (simplest case)
- Common customizations
- Advanced patterns (slots, tokens, events)

### Accessibility

ARIA attributes, keyboard support, screen reader behavior.

### Notes

Edge cases, browser support, performance considerations, common gotchas.

---

## Workflow: Build a feature

### 1. Understand the requirement

*"I need a contact form with error handling and field validation."*

### 2. Search skills for similar patterns

```bash
grep -l "form\|input\|validation" .claude/skills/srcdev-nuxt-components/components/*.md
```

### 3. Read relevant skills

Open 2–3 matching skills to see:
- What components already handle form inputs?
- What slots and CSS tokens do they expose?
- What validation patterns are documented?

### 4. Decide: build vs. compose

**Compose existing components** if the layer has:
- Input components with validation props
- Card/container components for layout
- Button variants for form actions

**Build custom component** if you need something specific the layer doesn't provide.

---

## Examples

### Pricing page

*Task: Build a pricing plan comparison with 3 tiers.*

1. Search skills: `grep -l "price\|plan\|tier" components/*.md`
2. Read `pricing-card.md` — describes PricingCard component, props, #cta slot, CSS tokens
3. Use PricingCard in a grid layout, customize buttons via slot, override token colors via page-scoped CSS

### FAQ section

*Task: Add expandable FAQ items.*

1. Search skills: `grep -l "expand\|accordion\|collaps" components/*.md`
2. Read `expanding-panel.md` — describes single panel behavior, v-model, slots
3. Use ExpandingPanel in a v-for loop for FAQ items (no need to build custom accordion)

### License key display

*Task: Show a copyable license key on success page.*

1. Search skills: `grep -l "copy\|clipboard\|readonly" components/*.md`
2. Read `input-copy.md` — describes readonly input, copy button, events, CSS tokens
3. Use InputCopy component, listen to @copied event, show toast via consumer's toast library

---

## Updating skills

When the layer releases a new component or updates an existing one:

1. **Upgrade the package**: `npm install srcdev-nuxt-components@latest`
2. **Refresh skills**: `npm run setup:claude`
3. **Read the new skill** to understand the new component's API

The skills always stay in sync with the layer's released version.

---

## Tips

- **Skim the index.md** in `.claude/skills/srcdev-nuxt-components/` to get an overview of all available skills
- **Reference skills when asking Claude** — "Here's the InputCopy skill: [paste content]. How do I customize the button color?"
- **CSS tokens are your friend** — most components expose tokens for customization without component changes
- **Slots > props for complexity** — if you need custom button behavior, use a #cta slot instead of adding button props to the component
- **Check accessibility notes** — ARIA labels, keyboard support, and screen reader behavior are documented per component
