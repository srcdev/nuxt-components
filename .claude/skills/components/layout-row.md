# LayoutRow Component

## Overview

`LayoutRow` is a CSS grid-based layout wrapper that controls how wide its content sits within the page. It uses a named-column grid system (full → popout → content → inset-content) so content can be precisely placed at different widths without custom CSS. It is the primary layout primitive for page sections.

---

## How to use this skill

When a developer asks to add a `LayoutRow`, follow the interactive flow below. Do not skip to writing code — work through the questions first to ensure the right variant is chosen. Developers unfamiliar with this system will not know what the options mean without guidance.

---

## Step 1 — Read the current context

Before asking anything, read the file the developer is working in and any parent components or pages to determine:

1. **Is this LayoutRow inside another LayoutRow?**
   - If yes, note the parent's `variant`. The inner grid resets relative to the parent's inner width, not the page. Warn the developer (see side effects below).
   - If no, this is page-level — the grid spans the full viewport.

2. **What is the effective current max width?**
   Report this before asking any questions. Examples:
   - "This row will sit at **page level** — the grid spans the full viewport width."
   - "This row is nested inside a `LayoutRow variant="content"` — its maximum available width is **1064px**, not the full viewport."
   - "This row is nested inside `variant="inset-content"` — maximum available width is **840px**."

3. **What content is already nearby?** Note any sibling LayoutRows, headings, or components to give context for alignment.

---

## Step 2 — Ask what the row will contain

Ask the developer what is going in this row. Do not assume. Examples to listen for:

| Content type | Suggested variant |
|---|---|
| Hero, banner, full-bleed image or video | `full` or `full-content` |
| Coloured background band containing constrained content | `full` wrapping inner `content` |
| Card grid, media grid, feature row | `popout` |
| Standard page section (text + components) | `content` |
| Long-form article, blog post, form | `inset-content` |
| Sidebar or aside | `inset-content` |

Give a suggestion based on their answer, but confirm before proceeding.

---

## Step 3 — Present the width and margin consequences

Once you have a candidate variant (or 2–3 options), show the developer exactly what they will get at common viewport widths. Use this reference table:

### Approximate rendered widths by variant

| Viewport | `inset-content` | `content` | `popout` | `full` |
|----------|----------------|-----------|----------|--------|
| 375px (mobile) | ~355px | ~355px | ~355px | 375px |
| 768px (tablet) | ~748px | ~748px | ~748px | 768px |
| 1080px | **840px** | ~1060px | ~1060px | 1080px |
| 1280px | **840px** | **1064px** | ~1260px | 1280px |
| 1440px | **840px** | **1064px** | **1400px** | 1440px |
| 1920px | **840px** | **1064px** | **1400px** | 1920px |

> Bold = the variant has reached its maximum and is now letterboxed. Below that threshold it fills the available width minus the minimum gutter (default `1rem` = 10px each side).

### Approximate margin (space each side at wider viewports)

| Variant | @ 1080px | @ 1280px | @ 1440px | @ 1920px |
|---------|---------|---------|---------|---------|
| `inset-content` | ~120px | ~220px | ~300px | ~540px |
| `content` | ~10px | ~108px | ~188px | ~428px |
| `popout` | ~10px | ~10px | ~20px | ~260px |
| `full` | 0 | 0 | 0 | 0 |

Phrase this conversationally. For example:
> "With `content`, your section will max out at **1064px** wide. On a 1440px screen that leaves about **188px of margin on each side**. On a 1280px screen it's tighter — around **108px** each side. Does that sound right for what you're building?"

If they want more breathing room → suggest `inset-content`.
If they want the content to feel wider → suggest `popout`.

---

## Step 4 — Flag side effects for the chosen variant

Before writing code, flag any relevant consequences:

**`full` or `full-width`** — Content is completely edge-to-edge with no gutter at any viewport width. If text is placed directly inside without a nested layout wrapper it will touch screen edges on mobile. Suggest `full-content` or a nested `content` LayoutRow for the text.

**`full-content`** — Adds `--minimum-content-padding` (default `1rem` = 10px) as inline padding. Still full-bleed visually at most viewport sizes. Good for coloured bands.

**`full-content-nopad`** — Truly zero padding. Only use if the child component manages its own edge spacing.

**`popout`** — At viewports below ~1400px the popout track shrinks. Between 1280–1440px the margin is very small (~10–20px each side). If the design needs consistent breathing room at 1280px, `content` may be a better choice.

**`inset-content` or `content` nested inside a `full` LayoutRow** — This is a common and valid pattern: `full` gives edge-to-edge background, the inner row constrains the text/content. Confirm this is intentional if you see it.

**Nested LayoutRow (any variant)** — The inner grid takes the parent's `.layout-row-inner` width as 100%. The `full` variant of the inner LayoutRow will only be as wide as the parent's inner column, not the viewport. Warn the developer if this is surprising.

**`-start` / `-end` variants** — These only set `grid-column-start` or `grid-column-end`, not both. Content will stretch to the opposite edge of the grid unless the other end is also constrained. Best for intentional asymmetric designs.

---

## Step 5 — Confirm the remaining props

Once the variant is agreed, ask about:

1. **`tag`** — what HTML element? Default is `div`. Common choices:
   - `section` — for a thematic page section (most common)
   - `article` — for self-contained content
   - `header` / `footer` — for page-level header/footer rows
   - `main` — for the primary content area (only once per page)
   - `nav` — for navigation rows

2. **`id`** — needed if this section is a scroll target, skip-link destination, or anchor in navigation. Ask if unsure.

3. **`isLandmark`** — default `false`. Only set `true` if the row is a navigable landmark that needs keyboard focus. Usually `tag="section"` is sufficient — `isLandmark` is rarely needed.

4. **`styleClassPassthrough`** — any extra classes for spacing, background colour, etc.?

---

## Props reference

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `variant` | see variant list | — | **yes** |
| `tag` | `"div" \| "section" \| "article" \| "aside" \| "header" \| "footer" \| "main" \| "nav" \| "ul" \| "ol"` | `"div"` | no |
| `id` | `string` | `null` | no |
| `isLandmark` | `boolean` | `false` | no |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |
| `dataTestid` | `string` | `"layout-row"` | no |

All valid `variant` values:
`full` · `full-start` · `full-end` · `popout` · `popout-start` · `popout-end` · `content` · `content-start` · `content-end` · `inset-content` · `inset-content-start` · `inset-content-end` · `full-width` · `full-content` · `full-content-nopad`

---

## Usage examples

### Standard section

```vue
<LayoutRow variant="content" tag="section">
  <p>Sits within the 1064px content track with ~188px margin at 1440px.</p>
</LayoutRow>
```

### Full-bleed hero, text constrained inside

```vue
<LayoutRow variant="full" tag="section">
  <!-- Background is edge-to-edge -->
  <LayoutRow variant="content">
    <HeroText tag="h1" :textContent="[{ text: 'Welcome' }]" />
  </LayoutRow>
</LayoutRow>
```

### Coloured band (full width + safe padding)

```vue
<LayoutRow variant="full-content" tag="section" :styleClassPassthrough="['bg-brand']">
  <p>Full-width background, content padded by --minimum-content-padding.</p>
</LayoutRow>
```

### Long-form article body

```vue
<LayoutRow variant="inset-content" tag="article">
  <p>Comfortable reading column at 840px max.</p>
</LayoutRow>
```

### Feature / card grid (popout)

```vue
<LayoutRow variant="popout" tag="section">
  <!-- Card grid, image gallery, etc. -->
</LayoutRow>
```

---

## CSS custom properties

Override in consuming app to adjust all track sizes globally:

| Property | Default | Effect |
|----------|---------|--------|
| `--popout-max-width` | `1400px` | Maximum width of the popout track |
| `--content-max-width` | `1064px` | Maximum width of the content track |
| `--inset-content-max-width` | `840px` | Maximum width of the inset-content track |
| `--minimum-content-padding` | `1rem` (10px) | Minimum gutter at small viewports |

---

## Notes

- Auto-imported in Nuxt — no import needed.
- `.layout-row-inner` has `container-type: inline-size` — children can use CSS container queries.
- The `full`, `full-content`, and `full-width` variants all map to `grid-column: full` — the difference is only whether inline padding is applied.
- `isLandmark` adds `tabindex="0"` and `aria-label="Layout Row Landmark"`. Prefer a semantic `tag` over this prop where possible.
