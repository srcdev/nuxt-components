// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Server-only secrets — Nuxt reads matching NUXT_* env vars automatically.
  // e.g. NUXT_RESEND_API_KEY → runtimeConfig.resendApiKey
  // These are never sent to the browser.
  runtimeConfig: {
    resendApiKey: "", // NUXT_RESEND_API_KEY
    contactEmailTo: "", // NUXT_CONTACT_EMAIL_TO   — inbox that receives enquiries
    contactEmailFrom: "", // NUXT_CONTACT_EMAIL_FROM — must be a verified Resend domain
  },
  css: ["./app/assets/styles/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    ...(process.env.STORYBOOK ? [] : ["@nuxt/fonts"]),
    "@nuxt/image",
    "@nuxtjs/i18n",
    "nuxt-qrcode",
    "@pinia/nuxt",
    "@vueuse/motion/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/test-utils/module",
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
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
      script: [
        {
          // Inlined so it runs synchronously before first paint
          innerHTML: `
            (function() {
              var saved = localStorage.getItem('colourScheme');
              var valid = ['auto', 'dark', 'light'];
              var scheme = valid.includes(saved) ? saved : 'auto';
              document.documentElement.dataset.colorScheme = scheme;
            })();
          `,
          tagPosition: "head",
          tagPriority: "critical",
        },
      ],
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
      },
      {
        name: "Playfair Display",
        weights: [400, 500, 600, 700, 800, 900],
        styles: ["normal", "italic"],
        provider: "bunny",
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
  vue: {
    runtimeCompiler: true,
  },
  compatibilityDate: "2026-01-30",
  typescript: {
    includeWorkspace: true,
    strict: true,
    typeCheck: "build", // Enable type checking during build only - Fixes vue-tsc dependency issues
    tsConfig: {
      compilerOptions: {
        types: ["vitest/globals"], // TypeScript support for globals
      },
    },
  },
});
