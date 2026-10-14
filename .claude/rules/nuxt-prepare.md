# Regenerate `.nuxt` with `npm run prepare`

Always run `npm run prepare`, never bare `npx nuxt prepare`.

Why: the script sets `SRCDEV_STANDALONE=true`; without it `.nuxt/eslint.config.mjs` silently goes
missing and Storybook type-checking breaks.
