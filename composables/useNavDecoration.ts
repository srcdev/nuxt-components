const useNavDecoration = (navContainerRef: Ref<HTMLElement | null>) => {
  const navItems = ref<HTMLElement[] | null>(null);
  const previousTab = ref<HTMLElement>();
  const currentTab = ref<HTMLElement>();

  const initNavDecorators = () => {
    navItems.value = navContainerRef.value ? (Array.from(navContainerRef.value.querySelectorAll('[role=tab]')) as HTMLElement[]) : [];
    previousTab.value = navItems.value[0];
    currentTab.value = navItems.value[0];
  };

  const navItemClicked = (event: Event) => {
    const target = event.target as HTMLElement;

    previousTab.value = currentTab.value;
    currentTab.value = target;

    navItems.value?.forEach((tab) => {
      tab.setAttribute('aria-selected', currentTab.value === tab ? 'true' : 'false');
    });

    moveIndicator();
  };

  const moveIndicator = () => {
    const newTabPosition = previousTab.value.compareDocumentPosition(currentTab.value);
    const newTabWidth = currentTab.value.offsetWidth / navContainerRef.value.offsetWidth;
    let transitionWidth;

    if (newTabPosition === 4) {
      transitionWidth = currentTab.value.offsetLeft + currentTab.value.offsetWidth - previousTab.value.offsetLeft;
    } else {
      transitionWidth = previousTab.value.offsetLeft + previousTab.value.offsetWidth - currentTab.value.offsetLeft;
      navContainerRef.value.style.setProperty('--_left', currentTab.value.offsetLeft + 'px');
    }

    navContainerRef.value.style.setProperty('--_width', transitionWidth / navContainerRef.value.offsetWidth);

    setTimeout(() => {
      navContainerRef.value.style.setProperty('--_left', currentTab.value.offsetLeft + 'px');
      navContainerRef.value.style.setProperty('--_width', newTabWidth);
    }, 220);
  };

  return {
    initNavDecorators,
    navContainerRef,
    navItemClicked,
  };
};

export default useNavDecoration;
