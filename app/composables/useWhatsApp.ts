// composables/useWhatsApp.ts

export const useWhatsApp = () => {
  const config = useRuntimeConfig();

  const openWhatsApp = (fields: { label: string; value: string }[]) => {
    const number = config.public.whatsappNumber;

    if (!number) {
      console.warn("[useWhatsApp] whatsappNumber is not configured");
      return;
    }

    const message = fields
      .filter((f) => f.value?.trim())
      .map((f) => `*${f.label}:* ${f.value}`)
      .join("\n");

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return { openWhatsApp };
};
