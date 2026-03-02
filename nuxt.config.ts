// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["./app/assets/styles/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/fonts",
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
