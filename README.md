# SRCDEV Nuxt Components

## NOTE

Althought this repo is public and feel free to do what you wish with it, this has been developed for use with websites we develop.

## Install Nuxt Forms layer

```bash
npm install --save nuxt-compnents
```

## Additional reuired packages

```bash
npm install --save @oddbird/css-anchor-positioning
```

Then add the dependency to their `extends` in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: 'nuxt-compnents',
});
```
