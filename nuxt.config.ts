// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['modern-normalize', './assets/styles/main.css'],
  modules: ['@nuxt/icon', '@nuxt/image'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        'data-color-scheme': 'auto',
      },
      titleTemplate: '%s - Nuxt Components Layer',
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in',
    },
  },
  components: [
    {
      path: './components',
      pathPrefix: false,
    },
  ],
  vue: {
    runtimeCompiler: true,
  },
  compatibilityDate: '2024-07-13',
  typescript: {
    includeWorkspace: true,
  },
});
