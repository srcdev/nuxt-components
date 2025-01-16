// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['..'],
  devServer: {
    https: true,
  },
  css: ['modern-normalize', './assets/styles/main.css'],
  modules: ['@nuxt/icon'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
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
      path: '../components',
      pathPrefix: false,
    },
  ],

  compatibilityDate: '2024-11-12',
});
