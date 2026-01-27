// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["../"],
  // devServer: {
  //   https: true,
  // },
  css: ["./assets/styles/main.css"],
  modules: ["@nuxt/eslint", "@nuxt/image"],
  typescript: {
    includeWorkspace: true,
    strict: false, // Allow more flexible type checking in playground
    typeCheck: false, // Disable type checking in playground to avoid path resolution issues
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
        "data-color-scheme": "auto",
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
    // Disable layout transitions to prevent navigation remounting
    layoutTransition: false,
    // Keep layouts alive to preserve navigation state
    keepalive: true,
  },
  components: [
    {
      path: "./components",
      pathPrefix: false,
    },
  ],
  compatibilityDate: "2024-11-01",
})
