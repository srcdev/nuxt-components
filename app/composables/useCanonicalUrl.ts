export const useCanonicalUrl = () => {
  const route = useRoute();
  const config = useRuntimeConfig();

  const canonicalHost = config.public.canonicalHost;

  // Construct the canonical URL
  const canonicalUrl = `https://${canonicalHost}${route.path}`;

  // Set the canonical link in the head
  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
  });

  return {
    canonicalUrl,
  };
};
