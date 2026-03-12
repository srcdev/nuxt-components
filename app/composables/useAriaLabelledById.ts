import type { MaybeRefOrGetter } from "vue";

const LABELLED_TAGS = new Set(["section", "main", "article", "aside"]);

export function useAriaLabelledById(tag: MaybeRefOrGetter<string>) {
  const headingId = useId();

  const ariaLabelledby = computed(() => {
    return LABELLED_TAGS.has(toValue(tag)) ? headingId : undefined;
  });

  return { headingId, ariaLabelledby };
}
