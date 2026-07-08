import type { MaybeRefOrGetter } from "vue";

// "main" is deliberately excluded: a <main> landmark doesn't need an accessible
// name unless a page has more than one, so it should never auto-label itself.
const LABELLED_TAGS = new Set(["section", "article", "aside"]);

export function useAriaLabelledById(tag: MaybeRefOrGetter<string>) {
  const headingId = useId();

  const ariaLabelledby = computed(() => {
    return LABELLED_TAGS.has(toValue(tag)) ? headingId : undefined;
  });

  // Safety net: consumers are responsible for binding `headingId` to a real
  // heading (directly, or via a slot prop) whenever aria-labelledby is set.
  // Forgetting to do so produces a broken ARIA reference that otherwise only
  // shows up in an accessibility audit (e.g. WAVE) — warn immediately instead.
  onMounted(() => {
    if (ariaLabelledby.value && !document.getElementById(headingId)) {
      console.warn(
        `[useAriaLabelledById] aria-labelledby="${headingId}" was set on a <${toValue(tag)}> element, ` +
          `but no element with that id was found. Bind the "headingId" value returned by this composable ` +
          `(often exposed as a "heading-id" slot prop) onto a visible heading, or the accessibility tree ` +
          `will contain a broken ARIA reference.`
      );
    }
  });

  return { headingId, ariaLabelledby };
}
