export interface Service {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  image: string;
  shortDescription: string;
  longDescription: string;
  whatIsIt: string;
  process: string[];
  idealFor: string[];
  maintenance: string;
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
}

export const useServicesStore = defineStore(
  "useServicesStore",
  () => {
    // State
    const servicesData = ref<Service[]>([]);

    // Actions
    const fetchServicesData = async () => {
      try {
        const data = await $fetch<Service[]>("/api/services");
        servicesData.value = data;
      } catch (error) {
        console.error("Error fetching services data:", error);
      }
    };

    // Getter to find a service by slug
    const serviceDataBySlug = (slug: string) => {
      return servicesData.value.find((service) => service.slug === slug);
    };

    return {
      fetchServicesData,
      servicesData,
      serviceDataBySlug,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
    },
  }
);
