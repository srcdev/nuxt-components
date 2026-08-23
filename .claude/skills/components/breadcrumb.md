# Breadcrumb Component

## Overview

`Breadcrumb` renders a `<nav aria-label="Breadcrumb"><ol>...</ol></nav>` trail from an `items`
array. Routing is delegated to the consumer: an item with a `to` renders as a `NuxtLink`; an item
without one renders as plain text marked `aria-current="page"` (typically the last item, the
current page).

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `items` | `BreadcrumbItem[]` | — | **yes** |
| `separator` | `string` | `"/"` | no |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

`BreadcrumbItem` is exported from `~/types/components/breadcrumb` (and re-exported from
`~/types/components`):

```typescript
interface BreadcrumbItem {
  label: string;
  to?: string;
}
```

## Usage

```vue
<Breadcrumb
  :items="[
    { label: 'Services', to: '/services' },
    { label: 'Balayage' },
  ]"
/>
```

Omit `to` on whichever item represents the current page — usually the last one. Every item with
a `to` is a real link; the library never guesses which item is "current" from its position.

## Notes

- Component is auto-imported in Nuxt — no import needed.
- No default content/slot — it's data-driven purely from `items`.
- `ServiceDetail` uses this component internally for its hero banner breadcrumb, overriding
  `--breadcrumb-colour` to `white` so it reads over the hero image. See
  [service-detail.md](service-detail.md).
- See `CONSUMER-STYLING.md` in the component's own folder for the full `--breadcrumb-*` token API.
