import { useResizeObserver } from '@vueuse/core';

const useTabs = (tabsNavRef: Ref<HTMLElement | null>, tabsContentRefs: Ref<HTMLElement[] | null>, duration: number = 200) => {
  const navItems = ref<HTMLElement[] | null>(null);
  const previousActiveTab = useState<HTMLElement | null>('previousActiveTab', () => null);
  const currentActiveTab = ref<HTMLElement>();

  const previousHoveredTab = ref<HTMLElement>();
  const currentHoveredTab = ref<HTMLElement>();
  const tagName = ref<string>();

  const initNavDecorators = () => {
    navItems.value = tabsNavRef.value ? (Array.from(tabsNavRef.value.querySelectorAll('[data-nav-item')) as HTMLElement[]) : [];
    tagName.value = navItems.value[0].tagName.toLowerCase();

    const activeIndex = ref(0);

    // Temporarily set the first nav item as active
    navItems.value[0].setAttribute('aria-selected', 'true');

    // Test if navItems are hyperlinks
    if (navItems.value[0].tagName.toLowerCase() === 'a') {
      // Find index of element with class "router-link-active"
      activeIndex.value = navItems.value.findIndex((el) => el.classList.contains('router-link-active'));
    }
    // else {
    //  Set actve tab
    // }

    currentActiveTab.value = navItems.value[activeIndex.value];
    currentHoveredTab.value = navItems.value[activeIndex.value];

    previousActiveTab.value = navItems.value[activeIndex.value];
    previousHoveredTab.value = navItems.value[activeIndex.value];

    addNavDecorators();
    setActiveTabContent();
  };

  const addNavDecorators = () => {
    const elementClasses = ['nav__active-indicator', 'nav__active', 'nav__hovered'];
    if (tabsNavRef.value) {
      for (let i = 0; i < 3; i++) {
        const div = document.createElement('div');
        div.classList.add(elementClasses[i]);
        tabsNavRef.value.appendChild(div);
      }
    }
  };

  const navItemHovered = (event: Event) => {
    const target = event.target as HTMLElement;
    const newTabPosition = currentHoveredTab.value ? currentHoveredTab.value.compareDocumentPosition(target) : 0;

    if (newTabPosition !== 0) {
      previousHoveredTab.value = currentHoveredTab.value;
      currentHoveredTab.value = target;
      moveHoveredIndicator();
    }
  };

  const resetHoverToActivePosition = () => {
    previousHoveredTab.value = currentHoveredTab.value;
    currentHoveredTab.value = currentActiveTab.value;
    moveHoveredIndicator();
  };

  const navItemClicked = (event: Event) => {
    const target = event.target as HTMLElement;

    previousActiveTab.value = currentActiveTab.value || null;
    currentActiveTab.value = target;

    navItems.value?.forEach((tab) => {
      tab.setAttribute('aria-selected', currentActiveTab.value === tab ? 'true' : 'false');
    });

    moveActiveIndicator();
    setActiveTabContent();
  };

  const setFinalHoveredPositions = (resized: boolean = false) => {
    const setDuration = resized ? 0 : duration;
    const newTabWidth = currentHoveredTab.value && tabsNavRef.value ? currentHoveredTab.value.offsetWidth / tabsNavRef.value.offsetWidth : 0;
    tabsNavRef.value?.style.setProperty('--_transition-duration', setDuration + 'ms');
    tabsNavRef.value?.style.setProperty('--_left-hovered', currentHoveredTab.value?.offsetLeft + 'px');
    tabsNavRef.value?.style.setProperty('--_width-hovered', newTabWidth?.toString());
  };

  const setFinalActivePositions = (resized: boolean = false) => {
    const setDuration = resized ? 0 : duration;
    const newTabWidth = currentActiveTab.value && tabsNavRef.value ? currentActiveTab.value.offsetWidth / tabsNavRef.value.offsetWidth : 0;
    tabsNavRef.value?.style.setProperty('--_transition-duration', setDuration + 'ms');
    tabsNavRef.value?.style.setProperty('--_left-active', currentActiveTab.value?.offsetLeft + 'px');
    tabsNavRef.value?.style.setProperty('--_width-active', newTabWidth?.toString());
  };

  const moveActiveIndicator = () => {
    tabsNavRef.value?.style.setProperty('--_transition-duration', duration + 'ms');

    const newTabPosition = previousActiveTab.value && currentActiveTab.value ? previousActiveTab.value.compareDocumentPosition(currentActiveTab.value) : 0;
    let transitionWidth;

    if (newTabPosition === 4) {
      transitionWidth = currentActiveTab.value && previousActiveTab.value ? currentActiveTab.value.offsetLeft + currentActiveTab.value.offsetWidth - previousActiveTab.value.offsetLeft : 0;
    } else {
      transitionWidth = previousActiveTab.value && currentActiveTab.value ? previousActiveTab.value.offsetLeft + previousActiveTab.value.offsetWidth - currentActiveTab.value.offsetLeft : 0;
      tabsNavRef.value?.style.setProperty('--_left-active', currentActiveTab.value ? currentActiveTab.value.offsetLeft + 'px' : '0');
    }

    tabsNavRef.value?.style.setProperty('--_width-active', String(transitionWidth / tabsNavRef.value.offsetWidth));

    setTimeout(() => {
      setFinalActivePositions();
    }, Math.floor(duration + 20));
  };

  const moveHoveredIndicator = () => {
    tabsNavRef.value?.style.setProperty('--_transition-duration', duration + 'ms');

    const newTabPosition = previousHoveredTab.value && currentHoveredTab.value ? previousHoveredTab.value.compareDocumentPosition(currentHoveredTab.value) : 0;
    let transitionWidth;

    if (newTabPosition === 4) {
      transitionWidth = currentHoveredTab.value && previousHoveredTab.value ? currentHoveredTab.value.offsetLeft + currentHoveredTab.value.offsetWidth - previousHoveredTab.value.offsetLeft : 0;
    } else {
      transitionWidth = previousHoveredTab.value && currentHoveredTab.value ? previousHoveredTab.value.offsetLeft + previousHoveredTab.value.offsetWidth - currentHoveredTab.value.offsetLeft : 0;
      tabsNavRef.value?.style.setProperty('--_left-hovered', currentHoveredTab.value ? currentHoveredTab.value.offsetLeft + 'px' : '0');
    }

    tabsNavRef.value?.style.setProperty('--_width-hovered', String(transitionWidth / tabsNavRef.value.offsetWidth));

    setTimeout(() => {
      setFinalHoveredPositions();
    }, Math.floor(duration + 20));
  };

  const setActiveTabContent = () => {
    const activeIndex = navItems.value?.findIndex((el) => el === currentActiveTab.value);
    tabsContentRefs.value?.forEach((tabContent: HTMLElement, index: number) => {
      tabContent.style.display = activeIndex === index ? 'block' : 'none';
    });
  };

  const animationRunning = (running: boolean) => {
    console.log('animationRunning', running);
  };

  useResizeObserver(tabsNavRef, () => {
    setFinalActivePositions(true);
    setFinalHoveredPositions(true);
  });

  return {
    initNavDecorators,
    navItemClicked,
    navItemHovered,
    resetHoverToActivePosition,
  };
};

export default useTabs;
