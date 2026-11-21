import { config } from "zod";

// Skips zod 4's `new Function` eval probe, which strict CSPs report as a violation.
// See skill composable-zod-validation.md, "Strict CSP".
export default defineNuxtPlugin(() => {
  config({ jitless: true });
});
