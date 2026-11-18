# Refresh the layer's copies after installing or upgrading it

After installing or bumping `srcdev-nuxt-components`, or when `nuxt prepare`/`nuxt dev` logs a
`[srcdev-nuxt-components]` setup reminder, run
`node node_modules/srcdev-nuxt-components/scripts/copy-snippets.mjs` and `npm run setup:claude`
from the app root (or the app's `postinstall`, if it already chains them).

For the app-side changes a new version needs (matching `nuxt`, copied `overrides`, per-release
steps), follow skill `consumer-layer-upgrade.md` (srcdev-nuxt-components).

Why: the layer deliberately ships no install script, since supply-chain scanners flag packages that
run code on install, so `npm install` alone leaves VS Code snippets and these Claude skills and
rules stale. Detail: skill `setup-postinstall.md` (srcdev-nuxt-components).
