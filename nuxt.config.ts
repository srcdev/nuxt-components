// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["modern-normalize", "./app/assets/styles/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "nuxt-qrcode",
    "@pinia/nuxt",
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
