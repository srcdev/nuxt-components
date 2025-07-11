import { ref, nextTick } from 'vue';
import type { Ref } from 'vue';

export function useCarouselSlider(carouselItems: Ref<HTMLElement[]>, thumbnailItems: Ref<HTMLLIElement[]>, itemCount: Ref<number>, transitionSpeed: number) {
  const isAnimating = ref(false);
  const transitionSpeedStr = `${transitionSpeed}ms`;

  const initialSetup = () => {
    if (!carouselItems.value || !thumbnailItems.value) return;
    carouselItems.value.forEach((item, index) => {
      item.style.order = String(index + 1);
    });
    thumbnailItems.value.forEach((thumb, index) => {
      thumb.style.order = String(index + 1);
    });
  };

  const updateOrder = (direction: 'next' | 'prev') => {
    const updateElementOrder = (el: HTMLElement) => {
      let currentOrder = parseInt(el.style.order, 10);
      if (direction === 'next') {
        currentOrder = currentOrder === 1 ? itemCount.value : currentOrder - 1;
      } else {
        // prev
        currentOrder = currentOrder === itemCount.value ? 1 : currentOrder + 1;
      }
      el.style.order = String(currentOrder);
    };
    carouselItems.value.forEach(updateElementOrder);
    thumbnailItems.value.forEach(updateElementOrder);
  };

  const animateNext = () => {
    if (isAnimating.value || !carouselItems.value || !thumbnailItems.value) return;
    isAnimating.value = true;

    const items = carouselItems.value;
    const thumbs = thumbnailItems.value;
    if (!items.length || !thumbs.length) {
      isAnimating.value = false;
      return;
    }

    const itemWidth = items[0].offsetWidth;
    const thumbWidth = thumbs[0].offsetWidth;
    const gap = 10; // Assuming a 10px gap from your CSS

    items.forEach((el) => (el.style.transition = `transform ${transitionSpeedStr} ease`));
    thumbs.forEach((el) => (el.style.transition = `transform ${transitionSpeedStr} ease`));

    items.forEach((el) => (el.style.transform = `translateX(-${itemWidth + gap}px)`));
    thumbs.forEach((el) => (el.style.transform = `translateX(-${thumbWidth + gap}px)`));

    setTimeout(() => {
      updateOrder('next');
      items.forEach((el) => {
        el.style.transition = 'none';
        el.style.transform = '';
      });
      thumbs.forEach((el) => {
        el.style.transition = 'none';
        el.style.transform = '';
      });
      isAnimating.value = false;
    }, transitionSpeed);
  };

  const animatePrev = () => {
    if (isAnimating.value || !carouselItems.value || !thumbnailItems.value) return;
    isAnimating.value = true;

    const items = carouselItems.value;
    const thumbs = thumbnailItems.value;
    if (!items.length || !thumbs.length) {
      isAnimating.value = false;
      return;
    }

    const itemWidth = items[0].offsetWidth;
    const thumbWidth = thumbs[0].offsetWidth;
    const gap = 10;

    updateOrder('prev');

    const lastItem = items.find((el) => parseInt(el.style.order) === 1);
    const lastThumb = thumbs.find((el) => parseInt(el.style.order) === 1);

    if (lastItem) {
      lastItem.style.transition = 'none';
      lastItem.style.transform = `translateX(-${itemWidth + gap}px)`;
    }
    if (lastThumb) {
      lastThumb.style.transition = 'none';
      lastThumb.style.transform = `translateX(-${thumbWidth + gap}px)`;
    }

    requestAnimationFrame(() => {
      items.forEach((el) => {
        el.style.transition = `transform ${transitionSpeedStr} ease`;
        el.style.transform = 'translateX(0)';
      });
      thumbs.forEach((el) => {
        el.style.transition = `transform ${transitionSpeedStr} ease`;
        el.style.transform = 'translateX(0)';
      });
    });

    setTimeout(() => {
      items.forEach((el) => {
        el.style.transition = 'none';
        el.style.transform = '';
      });
      thumbs.forEach((el) => {
        el.style.transition = 'none';
        el.style.transform = '';
      });
      isAnimating.value = false;
    }, transitionSpeed);
  };

  return {
    animateNext,
    animatePrev,
    initialSetup,
  };
}
