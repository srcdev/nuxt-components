export const useNavigationStore = defineStore(
  "useNavigationStore",
  () => {
    // State
    const activeHref = ref<string | null>(null);
    const isInitialized = ref(false);

    // Getters
    const currentActiveHref = computed(() => activeHref.value);

    // Actions
    const setActiveHref = (href: string | null) => {
      activeHref.value = href;
    };

    /**
     * Initialize active href based on current route and navigation items
     * Used on component mount to handle deep links and initial page loads
     */
    const initializeFromRoute = (navItems: Array<{ href?: string }>, routePath: string) => {
      if (isInitialized.value) return;

      const items = navItems.filter((item): item is { href: string } => Boolean(item.href));

      // Try exact match first
      const exact = items.find((item) => routePath === item.href);
      if (exact) {
        activeHref.value = exact.href;
        isInitialized.value = true;
        return;
      }

      // Fall back to longest prefix match
      const prefixMatches = items
        .filter((item) => routePath.startsWith(item.href + "/"))
        .sort((a, b) => b.href.length - a.href.length);

      if (prefixMatches.length > 0) {
        activeHref.value = prefixMatches[0]!.href;
      } else {
        // Default to null if no matches (let component handle fallback)
        activeHref.value = null;
      }

      isInitialized.value = true;
    };

    /**
     * Update active href when user clicks a navigation link
     * Provides explicit control over active state
     */
    const handleNavLinkClick = (href: string) => {
      activeHref.value = href;
    };

    /**
     * Sync with route changes (for programmatic navigation)
     * Re-runs the route matching logic when route changes
     */
    const syncWithRoute = (navItems: Array<{ href?: string }>, routePath: string) => {
      const items = navItems.filter((item): item is { href: string } => Boolean(item.href));

      // Try exact match first
      const exact = items.find((item) => routePath === item.href);
      if (exact) {
        activeHref.value = exact.href;
        return;
      }

      // Fall back to longest prefix match
      const prefixMatches = items
        .filter((item) => routePath.startsWith(item.href + "/"))
        .sort((a, b) => b.href.length - a.href.length);

      if (prefixMatches.length > 0) {
        activeHref.value = prefixMatches[0]!.href;
      }
      // Don't reset to null if no matches - preserve existing active state
    };

    /**
     * Reset store state (useful for testing or when navigation data changes)
     */
    const reset = () => {
      activeHref.value = null;
      isInitialized.value = false;
    };

    return {
      // State
      activeHref,
      isInitialized,

      // Getters
      currentActiveHref,

      // Actions
      setActiveHref,
      initializeFromRoute,
      handleNavLinkClick,
      syncWithRoute,
      reset,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.sessionStorage(),
      // Only persist the active href, not initialization state
      // (we want to re-initialize on page refresh to handle route changes)
      pick: ["activeHref"],
    },
  }
);
