# Automate nuxt prepare and Claude Skills with postinstall

## Overview

Prevent common "forgot to run after install" problems in a consuming app:

1. `nuxt prepare` — generates Nuxt type declarations. Skipping it causes TypeScript errors after install or package updates.
2. `npm run setup:claude` — copies the latest `srcdev-nuxt-components` skills into `.claude/skills/srcdev-nuxt-components/`. Skipping it leaves Claude working from stale skill docs after a package update.

Additionally, `srcdev-nuxt-components` automatically copies VSCode snippet files (`.code-snippets`) to your `.vscode/` folder during its own postinstall, so components' code snippets are available immediately.

A consumer app's `postinstall` script runs both automatically after every `npm install`.

## Steps

### 1. Add the scripts to package.json

```json
"scripts": {
  "setup:claude": "mkdir -p .claude/skills/srcdev-nuxt-components && cp -r node_modules/srcdev-nuxt-components/.claude/skills/. .claude/skills/srcdev-nuxt-components",
  "postinstall": "node node_modules/srcdev-nuxt-components/scripts/copy-snippets.mjs && nuxt prepare && npm run setup:claude"
}
```

This postinstall hook does three things in order:

1. Copies VSCode snippets from the layer to your `.vscode/` folder
2. Runs `nuxt prepare` to generate type declarations
3. Runs `setup:claude` to copy skills into `.claude/skills/srcdev-nuxt-components/`

### 2. Check whether your app needs an env flag for nuxt prepare

Some apps set an env var to switch `nuxt.config.ts` behaviour when running outside the full dev server (e.g. `NUXT_STANDALONE=true`). Check your own `nuxt.config.ts` — if it gates any config behind such a variable, add it to the `postinstall` command:

```json
"postinstall": "NUXT_STANDALONE=true nuxt prepare && npm run setup:claude"
```

If your `nuxt.config.ts` has no such conditional, plain `nuxt prepare` is sufficient.

### 3. Run once manually to bootstrap

```bash
npm run setup:claude
```

From this point on, `npm install` and `npm ci` trigger both steps automatically.

## Notes

- **Snippet copy must run in consumer app**: npm doesn't invoke postinstall hooks for dependencies. Each consumer app must explicitly call `scripts/copy-snippets.mjs` in its own postinstall to copy VSCode snippets to `.vscode/`. The layer's postinstall is used when the layer runs standalone, but consumers are responsible for their own `.vscode/` folder.
- Skills land in `.claude/skills/srcdev-nuxt-components/` — safe to re-run without overwriting your own project's skills.
- `postinstall` also fires on `npm ci`, so CI environments get the skills and snippets too if they have a `.claude/` directory in the project.
- If you do not want `postinstall` running in CI, guard it: `"postinstall": "[ \"$CI\" = \"true\" ] || (node node_modules/srcdev-nuxt-components/scripts/copy-snippets.mjs && nuxt prepare && npm run setup:claude)"`.
