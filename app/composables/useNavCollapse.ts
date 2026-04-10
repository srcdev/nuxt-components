import { useResizeObserver, onClickOutside } from "@vueuse/core";

interface NavCollapseOptions {
  onResize?: () => void;
  onRouteChange?: () => void;
  onMounted?: () => void;
}

export const useNavCollapse = (stateKey: string, options: NavCollapseOptions = {}) => {
  const navRef = ref<HTMLElement | null>(null);
  const navListRef = ref<HTMLUListElement | null>(null);

  const isCollapsed = ref(false);
  const isLoaded = useState(stateKey, () => false);
  const isMenuOpen = ref(false);

  // Stored natural width of the list — used when the list is not in the DOM
  let navListNaturalWidth = 0;

  const checkOverflow = () => {
    if (!navRef.value) return;
    if (navListRef.value) {
      navListNaturalWidth = navListRef.value.scrollWidth;
    }
    isCollapsed.value = navListNaturalWidth > navRef.value.clientWidth;
  };

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
  };

  // useRoute() in Nuxt is SSR-aware — route.path is consistent on server and client,
  // so isActiveItem can be used directly without a isMounted guard.
  const route = useRoute();

  const activeHref = computed(() => route.path);
  const isActiveItem = (href?: string) => href === route.path;

  watch(
    () => route.path,
    () => {
      closeMenu();
      options.onRouteChange?.();
    },
    { flush: "post" }
  );

  useResizeObserver(navRef, () => {
    checkOverflow();
    if (!isCollapsed.value) closeMenu();
    options.onResize?.();
  });

  onClickOutside(navRef, closeMenu);

  const router = useRouter();

  onMounted(async () => {
    await nextTick();
    checkOverflow();
    isLoaded.value = true;
    await router.isReady();
    options.onMounted?.();
  });

  return {
    navRef,
    navListRef,
    isCollapsed,
    isLoaded,
    isMenuOpen,
    activeHref,
    checkOverflow,
    toggleMenu,
    closeMenu,
    isActiveItem,
  };
};
