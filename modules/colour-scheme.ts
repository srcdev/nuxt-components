import { defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "colour-scheme",
    configKey: "colourScheme",
  },
  setup(_, nuxt) {
    const enabled = (nuxt.options.runtimeConfig.public?.colourScheme as { enabled?: boolean } | undefined)?.enabled ?? true;

    if (!enabled) return;

    nuxt.options.app.head.script ||= [];
    nuxt.options.app.head.script.push({
      innerHTML: `
        (function() {
          var saved = localStorage.getItem('colourScheme');
          var valid = ['auto', 'dark', 'light'];
          var scheme = valid.includes(saved) ? saved : 'auto';
          document.documentElement.dataset.colorScheme = scheme;
        })();
      `,
      tagPosition: "head",
      tagPriority: "critical",
    } as Parameters<typeof nuxt.options.app.head.script.push>[0]);
  },
});
