import { useResizeObserver, onClickOutside } from "@vueuse/core";
import type { NavItemData } from "~/types/components";

interface NavCollapseOptions {
  onResize?: () => void;
  onRouteChange?: () => void;
  onMounted?: () => void;
}

export const useNavCollapse = (navItemData: NavItemData, stateKey: string, options: NavCollapseOptions = {}) => {
  const navRef = ref<HTMLElement | null>(null);
  const navListRef = ref<HTMLUListElement | null>(null);

  const isCollapsed = ref(false);
  const isLoaded = useState(stateKey, () => false);
  const isMenuOpen = ref(false);
  const isMounted = ref(false);

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

  const navigationStore = useNavigationStore();
  const route = useRoute();

  const activeHref = computed(() => navigationStore.currentActiveHref);

  // Client-side only active state check to prevent hydration mismatch
  const isActiveItem = (href?: string) => isMounted.value && activeHref.value === href;

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
    navigationStore.initializeFromRoute(navItemData.main ?? [], route.path);
    isMounted.value = true;
    options.onMounted?.();
  });

  return {
    navRef,
    navListRef,
    isCollapsed,
    isLoaded,
    isMenuOpen,
    isMounted,
    activeHref,
    checkOverflow,
    toggleMenu,
    closeMenu,
    isActiveItem,
    navigationStore,
  };
};
