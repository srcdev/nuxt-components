import type { Slots } from "vue";

export function useAriaDescribedById(name: string | Ref<string>, fieldHasError: Ref<boolean>, slots: Slots) {
  const id = `${name}-${useId()}`;
  const errorId = `${id}-error-message`;
  const descriptionId = `${id}-description`;

  // A plain function, not a computed: the slots object isn't reactive, so a computed would cache
  // its first answer and keep pointing at (or away from) the description after a description slot
  // is added or removed post-mount (Claude.md pitfall #25). Call it from the template,
  // `:aria-describedby="ariaDescribedby()"`, so it's re-evaluated on every render.
  const ariaDescribedby = () => {
    const hasDescription = slots.descriptionText || slots.descriptionHtml || slots.description;
    const ids = [];

    if (hasDescription) ids.push(descriptionId);
    if (fieldHasError.value) ids.push(errorId);

    return ids.length ? ids.join(" ") : null;
  };

  return { id, errorId, descriptionId, ariaDescribedby };
}
