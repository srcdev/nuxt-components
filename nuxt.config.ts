// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from "@nuxt/kit";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const { resolve } = createResolver(import.meta.url);
const isStandalone = !!process.env.SRCDEV_STANDALONE;
const execFileAsync = promisify(execFile);

export default defineNuxtConfig({
  // debug: !isProduction,
  debug: false,
  devtools: { enabled: true },

  // Server-only secrets — Nuxt reads matching NUXT_* env vars automatically.
  // e.g. NUXT_RESEND_API_KEY → runtimeConfig.resendApiKey
  // These are never sent to the browser.
  runtimeConfig: {
    resendApiKey: "", // NUXT_RESEND_API_KEY
    contactEmailTo: "", // NUXT_CONTACT_EMAIL_TO   — inbox that receives enquiries
    contactEmailFrom: "", // NUXT_CONTACT_EMAIL_FROM — must be a verified Resend domain
    public: {
      whatsappNumber: "", // NUXT_PUBLIC_WHATSAPP_NUMBER — in international format, no + or spaces, e.g. 447700900000
      // Consumer apps that don't support dark/light mode can opt out entirely:
      // set NUXT_PUBLIC_COLOUR_SCHEME_ENABLED=false (env var) or override in their nuxt.config.ts
      colourScheme: {
        enabled: true,
      },
    },
  },
  css: ["./app/assets/styles/main.css"],
  modules: [
    // Required by consumers — always included
    resolve("./modules/colour-scheme"),
    resolve("./modules/icon-sets"),
    "@nuxt/icon",
    ...(process.env.STORYBOOK ? [] : ["@nuxt/fonts"]),
    "@nuxt/image",
    "@pinia/nuxt",
    "@vueuse/motion/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    // Dev-only — only when running the layer as a standalone app
    ...(isStandalone ? ["@nuxt/eslint", "nuxt-qrcode", "@nuxt/test-utils/module"] : []),
  ],
  imports: {
    dirs: ["./stores"],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      titleTemplate: "%s - Nuxt Components Layer",
      meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
      bodyAttrs: {
        class: "srcdev-components-extended",
      },
    },
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    layoutTransition: {
      name: "layout",
      mode: "out-in",
    },
    keepalive: true,
  },
  components: [
    {
      path: "./components",
      pathPrefix: false,
    },
  ],
  fonts: {
    assets: {
      // The baseURL where font files are served.
      prefix: "/_fonts",
    },
    families: [
      {
        name: "Poppins",
        weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        styles: ["normal", "italic"],
        provider: "bunny",
        display: "optional",
      },
      {
        name: "Playfair Display",
        weights: [400, 500, 600, 700, 800, 900],
        styles: ["normal", "italic"],
        provider: "bunny",
        display: "optional",
      },
      // {
      //   name: "Quicksand",
      //   weights: [300, 400, 500, 600, 700],
      //   styles: ["normal"],
      //   provider: "local",
      //   display: "swap",
      //   preload: false,
      // },
      // {
      //   name: "Inter Variable",
      //   styles: ["normal", "italic"],
      //   provider: "fontsource",
      // },
    ],
  },
  image: {
    // In Storybook, use 'none' provider so images render as plain /images/... paths
    // (avoids /_vercel/image which has no source images in storybook-static/)
    provider: process.env.STORYBOOK ? "none" : undefined,
  },
  nitro: {
    externals: {
      // Nitro's dependency tracer only copies vue's CJS build but Node.js 22 (ESM)
      // resolves the "import"+"node" export condition → ./index.mjs, which doesn't exist
      // in the output. Inlining forces Nitro/Rollup to bundle Vue directly, avoiding the
      // runtime resolution entirely.
      inline: ["vue", "@vue/runtime-core", "@vue/runtime-dom", "@vue/reactivity", "@vue/shared", "@vue/server-renderer"],
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        "@oddbird/css-anchor-positioning",
        "@vue/devtools-core",
        "@vue/devtools-kit",
        ...(isStandalone ? ["vue-qrcode-reader"] : []),
      ],
    },
  },
  vue: {
    runtimeCompiler: true,
  },
  // Re-generate ramps on config change during local dev.
  // Guarded by isStandalone so consumers extending this layer never trigger
  // generation inside node_modules (they never set SRCDEV_STANDALONE).
  hooks: isStandalone
    ? {
        async "builder:watch"(_event, path) {
          if (!path.endsWith("ramps.config.mjs")) return;
          console.log("[ramps] ramps.config.mjs changed, regenerating…");
          await execFileAsync("node", ["scripts/generate-ramps.mjs"], { cwd: resolve("./") });
          console.log("[ramps] done.");
        },
      }
    : {},
  compatibilityDate: "2026-05-20",
  typescript: {
    includeWorkspace: true,
    strict: true,
    typeCheck: "build", // Enable type checking during build only - Fixes vue-tsc dependency issues
    ...(isStandalone
      ? {
          tsConfig: {
            compilerOptions: {
              types: ["vitest/globals"], // TypeScript support for globals
            },
          },
        }
      : {}),
  },
});
