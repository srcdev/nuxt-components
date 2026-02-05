import type { StorybookConfig } from "@nuxtjs/storybook"

const config: StorybookConfig = {
  stories: ["../**/*.mdx", "../**/*.stories.ts"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook-vue/nuxt", // correct for SB 9.x + @nuxtjs/storybook@9.0.1
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import("vite")

    return mergeConfig(config, {
      optimizeDeps: {
        include: ["jsdoc-type-pratt-parser"],
      },
      resolve: {
        alias: {
          // Required for runtime template compilation
          vue: "vue/dist/vue.esm-bundler.js",
        },
      },
      server: {
        proxy: {
          // Enable Storybook to proxy Nuxt dev server assets
          "^/(_nuxt|_ipx|_icon|__nuxt_devtools__|_fonts)": {
            target: "http://localhost:3000",
            changeOrigin: true,
            secure: false,
            ws: true,
          },
        },
      },
    })
  },
}

export default config
