# ContactSection Component

## Overview

`ContactSection` is a two-column molecule that pairs a 3-item info list (using `StepperList` internally) with a contact form slot. On narrow viewports the columns stack; at 768 px and above they sit side by side.

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | Root HTML element. Use `"section"` when the landmark is meaningful. |
| `stepperIndicatorSize` | `string` | `"3rem"` | Passed through to the internal `StepperList` `indicatorSize` prop. Any valid CSS length. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root element. |

---

## Slot API

The component exposes 7 slots — 3 info-item slots, 3 indicator slots, and a form slot.

| Slot | Purpose |
|------|---------|
| `#item-0` | Content of the first info item |
| `#item-1` | Content of the second info item |
| `#item-2` | Content of the third info item |
| `#indicator-0` | Custom indicator icon for item 0 (optional — CSS counter bubble shown if omitted) |
| `#indicator-1` | Custom indicator icon for item 1 (optional) |
| `#indicator-2` | Custom indicator icon for item 2 (optional) |
| `#form` | Contact form or any right-column content |

Slots are **zero-indexed**. The internal `StepperList` is always rendered with `itemCount="3"` and `:connected="false"`.

---

## Usage examples

### Default (no slots)

```vue
<ContactSection />
```

Renders three placeholder `<p>` tags and an empty form column.

### With info content and a form

```vue
<ContactSection tag="section" :stepper-indicator-size="'2.4rem'">
  <template #item-0>
    <div>
      <strong>Get in touch</strong>
      <p class="page-body-normal">We'd love to hear from you.</p>
    </div>
  </template>
  <template #item-1>
    <div>
      <strong>Email us</strong>
      <p class="page-body-normal"><a href="mailto:hello@example.com">hello@example.com</a></p>
    </div>
  </template>
  <template #item-2>
    <div>
      <strong>Call us</strong>
      <p class="page-body-normal"><a href="tel:+441234567890">+44 1234 567 890</a></p>
    </div>
  </template>
  <template #form>
    <form>...</form>
  </template>
</ContactSection>
```

### With custom indicator icons

```vue
<ContactSection>
  <template #indicator-0>
    <Icon name="lucide-map-pin" class="indicator-icon" />
  </template>
  <template #item-0>
    <div>
      <strong>Location</strong>
      <p class="page-body-normal">123 High Street, Bath, BA1 1AA</p>
    </div>
  </template>
  <!-- repeat for indicator-1/item-1, indicator-2/item-2 -->
</ContactSection>
```

Custom indicator content should use the `indicator-icon` class so the icon inherits the correct size and colour from `StepperList`.

---

## Notes

- `stepperIndicatorSize` passes directly to the internal `StepperList` `indicatorSize` — use it to scale the indicator bubble/icon area. Default `"3rem"` is 30 px at the project's `62.5%` rem base.
- The internal `StepperList` always uses `tag="ul"`, `:connected="false"`, and `indicator-alignment="top"`. These are not configurable from `ContactSection`.
- Auto-imported in Nuxt — no manual import needed.
- See [stepper-list.md](stepper-list.md) for `StepperList` prop details and CSS custom property theming.
