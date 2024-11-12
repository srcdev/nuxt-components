// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: [
    {
      path: './components',
      pathPrefix: false,
    },
  ],
  compatibilityDate: '2024-07-13',
});
