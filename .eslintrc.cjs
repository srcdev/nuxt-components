module.exports = {
  "root": true,
  "extends": [
    'plugin:vue/vue3-recommended', // Ensure Vue rules are included
  ],
  "rules": {
    "vue/multi-word-component-names": "off",
    "vue/no-multiple-template-root": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "vue/html-self-closing": [
      "error", {
        "html": {
        "void": "any",
        "normal": "any",
        "component": "any"
      },
      "svg": "always",
      "math": "always"
      }
    ],
    'vue/attribute-hyphenation': ['error', 'always'], // Enforce hyphenated attribute names
  }
};
