// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  {
    files: ["**/*.vue"],
    rules: {
      // Disable the rule that enforces line breaking in templates
      "@stylistic/max-len": "off",
      "vue/max-len": "off",
      "@stylistic/vue/max-len": "off",
      // Allow longer lines in Vue templates
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
      "@stylistic/member-delimiter-style": [
        "error",
        {
          multiline: {
            delimiter: "semi",
            requireLast: true,
          },
          singleline: {
            delimiter: "semi",
            requireLast: false,
          },
          multilineDetection: "brackets",
        },
      ],
    },
  }
);
