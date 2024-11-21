// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      titleTemplate: '%s - Nuxt Components Layer',
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
  components: [
    {
      path: './components',
      pathPrefix: false,
    },
  ],
  plugins: ['~/plugins/css-anchor-positioning.ts'],
  compatibilityDate: '2024-07-13',
});
