import { defineNuxtModule, logger } from "@nuxt/kit";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const layerDir = fileURLToPath(new URL("..", import.meta.url));

function sameFile(a: string, b: string) {
  return existsSync(b) && readFileSync(a, "utf8") === readFileSync(b, "utf8");
}

export default defineNuxtModule({
  meta: {
    name: "srcdev-consumer-setup",
  },
  setup(_, nuxt) {
    if (process.env.SRCDEV_STANDALONE) return;

    const rootDir = nuxt.options.rootDir;
    const steps: string[] = [];

    const snippetDir = join(layerDir, ".vscode");
    const snippets = existsSync(snippetDir) ? readdirSync(snippetDir).filter((f) => f.endsWith(".code-snippets")) : [];
    if (snippets.some((f) => !sameFile(join(snippetDir, f), join(rootDir, ".vscode", f)))) {
      steps.push("  node node_modules/srcdev-nuxt-components/scripts/copy-snippets.mjs   (VS Code snippets)");
    }

    const skillIndex = join(layerDir, ".claude/skills/index.md");
    if (existsSync(skillIndex) && !sameFile(skillIndex, join(rootDir, ".claude/skills/srcdev-nuxt-components/index.md"))) {
      steps.push("  npm run setup:claude   (Claude skills and rules)");
    }

    if (steps.length === 0) return;

    logger.info(
      `[srcdev-nuxt-components] Your copies of the layer's snippets or Claude docs are missing or older than the installed version.\n` +
        `The layer ships no install script (supply-chain scanners flag packages that run code on install), ` +
        `so these copies are made by your app, not by npm install. Run:\n\n` +
        `${steps.join("\n")}\n\n` +
        `To automate it, add both to your own app's postinstall. ` +
        `See .claude/skills/srcdev-nuxt-components/setup-postinstall.md or the layer README.`
    );
  },
});
