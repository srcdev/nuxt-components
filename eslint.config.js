import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
  features: {
    typescript: true,
    prettier: false,
  },
  rules: {
    // Disable all the problematic rules for this components playground
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-wrapper-object-types': 'off',
    '@typescript-eslint/no-import-type-side-effects': 'off',
    'vue/require-valid-default-prop': 'off',
    'vue/require-v-for-key': 'off',
    'vue/html-self-closing': 'off',
    'vue/attributes-order': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/v-slot-style': 'off',
    'vue/no-parsing-error': 'off',
    'vue/valid-v-for': 'off',
  },
});
