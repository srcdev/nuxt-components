import type { Slots } from "vue";

export function useAriaDescribedById(name: string | Ref<string>, fieldHasError: Ref<boolean>, slots: Slots) {
  const id = `${name}-${useId()}`;
  const errorId = `${id}-error-message`;
  const descriptionId = `${id}-description`;

  const ariaDescribedby = computed(() => {
    const hasDescription = slots.descriptionText || slots.descriptionHtml || slots.description;
    const ids = [];

    if (hasDescription) ids.push(descriptionId);
    if (fieldHasError.value) ids.push(errorId);

    return ids.length ? ids.join(" ") : null;
  });

  return { id, errorId, descriptionId, ariaDescribedby };
}
