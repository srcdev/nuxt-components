import type { Preview } from '@storybook-vue/nuxt';
// import { setup } from '@nuxtjs/storybook';

import 'modern-normalize';
import '@/assets/styles/main.css';

// setup(app) => {
//   app.components: [
//     {
//       path: './components',
//       pathPrefix: false,
//     },
//   ],
// }

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
