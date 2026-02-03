// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  {
    files: ["**/*.vue"],
    rules: {
      // Vue-specific rules that work without additional plugins
      "vue/max-len": "off",
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always", // <img />
            normal: "never", // <div></div>
            component: "always", // <MyComponent />
          },
        },
      ],
    },
  }
);
