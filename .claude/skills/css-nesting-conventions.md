# CSS Nesting Conventions

## Overview

This project uses **native CSS nesting** (W3C CSS Nesting spec), not Sass/SCSS. They look similar but behave differently in one important way: native CSS does not support BEM-style `&` concatenation for child element selectors.

## The key rule

> `&` must be followed by a combinator (space, `>`, `~`, `+`) or a selector starting with `.`, `#`, `:`, `[`, or `*`. It **cannot** be followed by a bare identifier or `__` prefix.

## ❌ What NOT to do — Sass-style BEM concatenation

```css
/* Sass/SCSS — does NOT work in native CSS */
.demo-controls {
  padding: 1.6rem;

  &__heading {        /* ← Invalid native CSS — esbuild converts to :is(__heading) */
    font-size: 1.1rem;
  }

  &__fields {         /* ← Invalid native CSS */
    display: flex;
  }
}
```

**Why it silently fails**: esbuild converts `&__heading` to `:is(__heading)`, which tries to match an HTML element named `__heading`. No such element exists, so the styles are never applied. There's no error — just missing styles.

The build will show this warning:
```
▲ [WARNING] Cannot use type selector "__heading" directly after nesting selector "&" [css-syntax-error]
  CSS nesting syntax does not allow the "&" selector to come before a type selector.
```

## ✅ Correct patterns

### Nested descendant (preferred for BEM child elements)

```css
.demo-controls {
  padding: 1.6rem;

  & .demo-controls__heading {   /* space + full class name */
    font-size: 1.1rem;
  }

  & .demo-controls__fields {
    display: flex;
  }
}
```

### Flat top-level rules (also valid — avoids repetition for deeply nested structures)

```css
.demo-controls {
  padding: 1.6rem;
}

.demo-controls__heading {
  font-size: 1.1rem;
}

.demo-controls__fields {
  display: flex;
}
```

### Same-element modifier (this IS valid)

```css
/* & followed by a class — matches the same element that also has this class */
.button {
  background: blue;

  &.button--large {   /* ← valid: & immediately followed by . */
    padding: 2rem;
  }

  &:hover {           /* ← valid: & immediately followed by : */
    background: darkblue;
  }

  &[disabled] {       /* ← valid: & immediately followed by [ */
    opacity: 0.5;
  }
}
```

### Pseudo-elements and pseudo-classes

```css
.component {
  &::before { content: ""; }    /* ✅ valid */
  &::after  { content: ""; }    /* ✅ valid */
  &:focus   { outline: auto; }  /* ✅ valid */
  &:not(.active) { opacity: 0.5; }  /* ✅ valid */
}
```

### Media / container queries inside a rule

```css
.component {
  grid-template-columns: 1fr;

  @media (width >= 768px) {
    grid-template-columns: 1fr 2fr;  /* ✅ valid — query wraps the property */
  }
}
```

## Spot-check during review

If you see `&__` or `&-` in a `.vue` `<style lang="css">` block, it's Sass syntax and will not work. Convert it to `& .full-class-name` or lift it to a top-level rule.

## Related

- `CLAUDE.md` → Styling Methodology section
- `css-grid-max-width-gutters.md` — example of correct native nesting in a grid utility
