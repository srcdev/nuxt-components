# Adding a New Font to Storybook

## Overview

`@nuxt/fonts` is disabled in Storybook (via `process.env.STORYBOOK` check in `nuxt.config.ts`).
Fonts are served instead via `.storybook/fonts.css`, which is imported in `.storybook/preview.ts`.
Font files live in `.storybook/public/_fonts/` and are served as static assets via `staticDirs: ["./public"]` in `.storybook/main.ts`.

## Steps

### 1. Check what weights/styles exist

`@nuxt/fonts` caches font metadata here after a `nuxt build` or `nuxt dev`:

```url
node_modules/.cache/nuxt/fonts/meta/bunny/<hash>/bunny/<FontName>-<hash>-data.json
```

Open the matching JSON file — it lists every available `weight`, `style`, and `src.url`.
The bunny CDN URL pattern is predictable:

```url
https://fonts.bunny.net/<font-slug>/files/<font-slug>-<subset>-<weight>-<style>.woff2
```

Example for Playfair Display latin, 700 normal:

```url
https://fonts.bunny.net/playfair-display/files/playfair-display-latin-700-normal.woff2
```

Common subsets: `latin`, `latin-ext`, `cyrillic`, `vietnamese`. For Storybook, `latin` only is sufficient.

### 2. Create the font directory

```url
.storybook/public/_fonts/<font-slug>/
```

### 3. Download the font files

Run this from the project root, substituting `<font-slug>` and the weights that actually exist:

```bash
mkdir -p .storybook/public/_fonts/<font-slug>
cd .storybook/public/_fonts/<font-slug>

for weight in 400 500 600 700 800 900; do
  for style in normal italic; do
    curl -sfLo "<font-slug>-latin-${weight}-${style}.woff2" \
      "https://fonts.bunny.net/<font-slug>/files/<font-slug>-latin-${weight}-${style}.woff2" \
      && echo "OK: ${weight} ${style}" || echo "FAIL: ${weight} ${style}"
  done
done
```

`FAIL` results mean that weight/style combination doesn't exist — safe to ignore.

### 4. Add @font-face declarations to `.storybook/fonts.css`

```css
/* Font Name */
@font-face {
  font-family: "Font Name";
  src: url("/_fonts/<font-slug>/<font-slug>-latin-400-normal.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
/* repeat for each weight/style downloaded */
```

### 5. Register the font in `nuxt.config.ts`

Add to the `fonts.families` array (used by the Nuxt app, not Storybook):

```ts
{
  name: "Font Name",
  weights: [400, 500, 600, 700, 800, 900],
  styles: ["normal", "italic"],
  provider: "bunny",
},
```

### 6. Update the font table in `README.md`

Add a row to the Storybook fonts table under `## Storybook > ### Fonts`.

## Notes

**Architecture summary**

| Context   | Font source                                                          |
| --------- | -------------------------------------------------------------------- |
| Nuxt app  | `@nuxt/fonts` (bunny CDN → hashed `/_fonts/*.woff2`)                 |
| Storybook | `.storybook/fonts.css` + static files in `.storybook/public/_fonts/` |

**Poppins exception** — Poppins files use TTF (not woff2) and are stored as
`.storybook/public/_fonts/poppins/Poppins-<Weight>.ttf`. These came from Google Fonts
directly, not bunny, so there is no equivalent curl script.
