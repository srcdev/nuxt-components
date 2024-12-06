import { useResizeObserver } from '@vueuse/core';

const useNavDecoration = (navContainerRef: Ref<HTMLElement | null>, duration: number = 200) => {
  const navItems = ref<HTMLElement[] | null>(null);
  const previousTab = ref<HTMLElement>();
  const currentTab = ref<HTMLElement>();

  const initNavDecorators = () => {
    navItems.value = navContainerRef.value ? (Array.from(navContainerRef.value.querySelectorAll('[data-nav-item')) as HTMLElement[]) : [];
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

  const setFinalPositions = (resized: boolean = false) => {
    const setDuration = resized ? 0 : duration;
    const newTabWidth = currentTab.value && navContainerRef.value ? currentTab.value.offsetWidth / navContainerRef.value.offsetWidth : 0;
    navContainerRef.value?.style.setProperty('--_transition-duration', setDuration + 'ms');
    navContainerRef.value?.style.setProperty('--_left', currentTab.value?.offsetLeft + 'px');
    navContainerRef.value?.style.setProperty('--_width', newTabWidth?.toString());
  };

  const moveIndicator = () => {
    navContainerRef.value?.style.setProperty('--_transition-duration', duration + 'ms');

    const newTabPosition = previousTab.value && currentTab.value ? previousTab.value.compareDocumentPosition(currentTab.value) : 0;
    let transitionWidth;

    if (newTabPosition === 4) {
      transitionWidth = currentTab.value && previousTab.value ? currentTab.value.offsetLeft + currentTab.value.offsetWidth - previousTab.value.offsetLeft : 0;
    } else {
      transitionWidth = previousTab.value && currentTab.value ? previousTab.value.offsetLeft + previousTab.value.offsetWidth - currentTab.value.offsetLeft : 0;
      navContainerRef.value?.style.setProperty('--_left', currentTab.value ? currentTab.value.offsetLeft + 'px' : '0');
    }

    navContainerRef.value?.style.setProperty('--_width', String(transitionWidth / navContainerRef.value.offsetWidth));

    setTimeout(() => {
      setFinalPositions();
    }, Math.floor(duration + 20));
  };

  useResizeObserver(navContainerRef, () => {
    setFinalPositions(true);
  });

  return {
    initNavDecorators,
    navContainerRef,
    navItemClicked,
  };
};

export default useNavDecoration;
