import { defineNuxtModule, logger } from "@nuxt/kit";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

/**
 * Icon sets used by srcdev-nuxt-components components.
 * These must be installed in the consumer app to avoid runtime CDN fetches (FOUC).
 */
const ICON_SETS = [
  "@iconify-json/akar-icons",
  "@iconify-json/bi",
  "@iconify-json/bitcoin-icons",
  "@iconify-json/gravity-ui",
  "@iconify-json/ic",
  "@iconify-json/logos",
  "@iconify-json/lucide",
  "@iconify-json/material-symbols",
  "@iconify-json/mdi",
  "@iconify-json/radix-icons",
] as const;

export default defineNuxtModule({
  meta: {
    name: "srcdev-icon-sets",
  },
  setup(_, nuxt) {
    // Skip when running as the layer's own standalone dev/build
    if (process.env.SRCDEV_STANDALONE) return;

    // Resolve packages from the consumer's project root, not the layer's own node_modules
    const consumerRequire = createRequire(pathToFileURL(nuxt.options.rootDir + "/").href);

    const missing = ICON_SETS.filter((pkg) => {
      try {
        consumerRequire.resolve(pkg);
        return false;
      } catch {
        return true;
      }
    });

    if (missing.length > 0) {
      logger.info(
        `[srcdev-nuxt-components] Some icon set packages used by layer components are not installed in this project.\n` +
          `If you use those components and see icons flashing in on page load, install the relevant packages.\n\n` +
          `Not installed: ${missing.join(", ")}\n\n` +
          `Install all at once:\n\n` +
          `  npm install ${missing.join(" ")}\n\n` +
          `Your own app's icon sets are unaffected — this only covers sets used by layer components.\n` +
          `See .claude/skills/srcdev-nuxt-components/skills/icon-sets.md for the component→package mapping.`
      );
    }
  },
});
