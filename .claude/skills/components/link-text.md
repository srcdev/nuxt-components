# LinkText Component

## Overview

`LinkText` renders a `NuxtLink` styled as a standalone text link, with optional left and/or right icon slots. Icons are vertically centred with the label text. Intended as a CTA-style link — distinct from `InputButtonCore` (which is a button/link hybrid with button styling).

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `to` | `string` | — | yes |
| `linkText` | `string` | — | yes |
| `external` | `boolean` | `false` | no |
| `target` | `string` | `undefined` | no |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

## Slots

| Slot | Purpose |
|------|---------|
| `left` | Icon rendered before the label |
| `right` | Icon rendered after the label |

Both slots are optional. If neither is provided, no icon wrapper elements are rendered.

## Basic Usage

```vue
<LinkText to="/about" linkText="About Us" />
```

## With Left Icon (back/previous pattern)

```vue
<LinkText to="/blog" linkText="Back to Blog">
  <template #left>
    <Icon name="lucide:arrow-left" />
  </template>
</LinkText>
```

## With Right Icon (forward/more pattern)

```vue
<LinkText to="/services" linkText="Learn More">
  <template #right>
    <Icon name="lucide:arrow-right" />
  </template>
</LinkText>
```

## Both Icons

```vue
<LinkText to="/collection" linkText="Explore">
  <template #left>
    <Icon name="lucide:sparkles" />
  </template>
  <template #right>
    <Icon name="lucide:arrow-right" />
  </template>
</LinkText>
```

## External Link

```vue
<LinkText
  to="https://example.com"
  linkText="Visit Site"
  :external="true"
  target="_blank"
>
  <template #right>
    <Icon name="lucide:external-link" />
  </template>
</LinkText>
```

## Styling

Key CSS custom properties — define these in your consuming app to control appearance:

| Property | Default | Purpose |
|----------|---------|---------|
| `--link-text-colour` | `currentColor` | Link text/icon colour |
| `--link-text-colour-hover` | `currentColor` | Colour on hover/focus |
| `--link-text-gap` | `0.4em` | Gap between icon and label |
| `--link-text-font-size` | `inherit` | Font size |
| `--link-text-decoration` | `underline` | Text decoration |
| `--link-text-decoration-hover` | `none` | Text decoration on hover |
| `--link-text-underline-offset` | `0.2em` | Underline offset |

Override via `styleClassPassthrough` or a parent HOC `<style>` block targeting `.link-text`.

## Notes

- Component is auto-imported in Nuxt — no import needed.
- NuxtLink handles both internal (`/path`) and external (`https://...`) URLs automatically. Only set `external: true` if you need to force external handling on an internal-looking path.
- The label is always rendered inside `.link-text__label` — target this class if you need to style the text independently of the icons.
- DOM order is always: left icon → label → right icon.
