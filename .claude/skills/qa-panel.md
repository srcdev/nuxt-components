# QA Panel

## Overview

A collapsible dev-only panel that lets you toggle component props live on a page — without touching the component or breaking the visual layout. Hidden in production via `import.meta.dev`. Uses a native `<details>`/`<summary>` so it takes up no space when collapsed. Useful on both demo pages in this library and on pages in consuming apps.

## Structure

```
<details>            ← collapses the whole panel
  <summary>          ← always visible: title + live status line
  <body>             ← groups of chip buttons (and optional free-text inputs)
```

Each group controls one prop. The status `<code>` in the summary mirrors the current state so you can see it at a glance without opening the panel.

## Steps

### 1. Add the reactive state to `<script setup>`

```ts
// ── QA controls (dev only) ────────────────────────────────────────
const isDev = import.meta.dev;

// One ref per controllable prop
const qaMyBoolean = ref(true);
const qaMyNumber  = ref(400);
const qaMyString  = ref<"a" | "b" | "c">("a");

// Preset arrays for numeric/string chip groups
const myNumberPresets = [100, 200, 400, 800, 1600];
const myStringPresets = ["a", "b", "c"] as const;
```

### 2. Wire the refs to the component

```vue
<MyComponent
  :my-boolean="qaMyBoolean"
  :my-number="qaMyNumber"
  :my-string="qaMyString"
/>
```

### 3. Add the panel markup

Place directly above (or below) the component being QA'd, outside any layout wrapper that clips content:

```vue
<!-- ── QA Panel (dev only) ───────────────────────────────── -->
<div v-if="isDev" class="qa-panel">
  <details class="qa-panel__details">
    <summary class="qa-panel__summary">
      <span class="qa-panel__title">QA — MyComponent</span>
      <code class="qa-panel__status">
        bool:{{ qaMyBoolean ? "on" : "off" }} · {{ qaMyNumber }}ms · {{ qaMyString }}
      </code>
    </summary>
    <div class="qa-panel__body">

      <!-- Boolean group -->
      <div class="qa-panel__group">
        <span class="qa-panel__label">My Boolean</span>
        <div class="qa-panel__chips">
          <button
            v-for="opt in [true, false]"
            :key="String(opt)"
            class="qa-panel__chip"
            :class="{ 'is-active': qaMyBoolean === opt }"
            @click="qaMyBoolean = opt"
          >{{ opt ? "on" : "off" }}</button>
        </div>
      </div>

      <!-- Number group (preset chips) -->
      <div class="qa-panel__group">
        <span class="qa-panel__label">My Number</span>
        <div class="qa-panel__chips">
          <button
            v-for="preset in myNumberPresets"
            :key="preset"
            class="qa-panel__chip"
            :class="{ 'is-active': qaMyNumber === preset }"
            @click="qaMyNumber = preset"
          >{{ preset }}</button>
        </div>
      </div>

      <!-- String union group -->
      <div class="qa-panel__group">
        <span class="qa-panel__label">My String</span>
        <div class="qa-panel__chips">
          <button
            v-for="opt in myStringPresets"
            :key="opt"
            class="qa-panel__chip"
            :class="{ 'is-active': qaMyString === opt }"
            @click="qaMyString = opt"
          >{{ opt }}</button>
        </div>
      </div>

      <!-- Free-text input (for strings where presets aren't enough) -->
      <div class="qa-panel__group">
        <span class="qa-panel__label">Custom Value</span>
        <input v-model="qaMyString" placeholder="e.g. 4/3" class="qa-panel__input" />
      </div>

    </div>
  </details>
</div>
```

### 4. Add the CSS

Scope inside your page body class (e.g. `.my-page`) so styles don't bleed. The panel is always dark regardless of colour scheme — it's a dev tool, not a UI element.

```css
.my-page {
  /* ── QA Panel ──────────────────────────────────────────────────── */

  .qa-panel {
    background: oklch(15% 0 0);
    color: white;
    font-size: 1.3rem;
  }

  .qa-panel__details {
    padding: 1rem 2rem;
  }

  .qa-panel__summary {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1.6rem;
    list-style: none;
    user-select: none;

    &::-webkit-details-marker { display: none; }
  }

  .qa-panel__title {
    font-weight: 600;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .qa-panel__status {
    font-family: monospace;
    font-size: 1.2rem;
    background: oklch(0% 0 0 / 0.3);
    padding: 0.2rem 0.8rem;
    border-radius: 0.4rem;
    user-select: text;
    cursor: text;
  }

  .qa-panel__body {
    display: flex;
    flex-wrap: wrap;
    gap: 2.4rem;
    padding-block: 1.2rem 0.4rem;
  }

  .qa-panel__group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .qa-panel__label {
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.55;
  }

  .qa-panel__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .qa-panel__chip {
    font-family: monospace;
    font-size: 1.2rem;
    color: white;
    background: oklch(0% 0 0 / 0.25);
    border: 1px solid oklch(100% 0 0 / 0.18);
    padding: 0.3rem 1rem;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: background 0.15s;

    &:hover { background: oklch(0% 0 0 / 0.4); }

    &.is-active {
      background: oklch(55% 0.18 240);
      border-color: oklch(55% 0.18 240);
    }
  }

  .qa-panel__input {
    font-family: monospace;
    font-size: 1.2rem;
    color: white;
    background: oklch(0% 0 0 / 0.25);
    border: 1px solid oklch(100% 0 0 / 0.18);
    padding: 0.3rem 1rem;
    border-radius: 0.4rem;
    width: 18rem;

    &::placeholder { opacity: 0.45; }
  }
}
```

## Notes

- **Production safety**: `import.meta.dev` is `false` in production builds — the entire `v-if="isDev"` block is tree-shaken. No runtime cost.
- **Consuming apps**: The active chip color (`oklch(55% 0.18 240)`) is a neutral blue. Replace with a brand accent token if preferred: `background: var(--color-brand-accent)`.
- **Panel placement**: Outside any `overflow: hidden` or clipping container, otherwise the panel may be clipped or push layout unexpectedly. Placing it as a direct sibling of the component row works well.
- **Computed CSS vars**: When a prop controls a CSS custom property (e.g. max-height tiers), use a `computed` that returns a style object and bind it with `:style` on the component wrapper:

  ```ts
  const qaStyleOverrides = computed(() => ({
    "--theme-component-max-height": qaMaxHeight.value || undefined,
  }));
  ```
