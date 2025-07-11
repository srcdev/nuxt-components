import { ref, nextTick } from 'vue';
import type { Ref } from 'vue';

interface UseCarouselAnimationOptions {
  carouselItems: Ref<HTMLElement[] | null>;
  thumbnailItems: Ref<HTMLLIElement[] | null>;
  transitionSpeed: number;
  itemCount: Ref<number>;
}

export function useCarouselAnimation({ carouselItems, thumbnailItems, transitionSpeed, itemCount }: UseCarouselAnimationOptions) {
  const isAnimating = ref(false);
  const transitionSpeedStr = `${transitionSpeed}ms`;

  const animate = (direction: 'next' | 'prev') => {
    if (isAnimating.value) return;
    isAnimating.value = true;

    const items = carouselItems.value;
    const thumbs = thumbnailItems.value;

    if (!items || !thumbs) {
      isAnimating.value = false;
      return;
    }

    const itemsToAnimate = [...items, ...thumbs];
    const itemWidth = items[0].offsetWidth;
    const gap = 10; // from CSS gap property

    itemsToAnimate.forEach((el) => {
      el.style.transition = `transform ${transitionSpeedStr} ease`;
    });

    if (direction === 'next') {
      const firstItem = items.find((el) => parseInt(el.style.order) === 1);
      const firstThumb = thumbs.find((el) => parseInt(el.style.order) === 1);

      if (firstItem) firstItem.style.transform = `translateX(-${itemWidth + gap}px)`;
      if (firstThumb) firstThumb.style.transform = `translateX(-${firstThumb.offsetWidth + gap}px)`;

      items.forEach((el) => {
        if (parseInt(el.style.order) !== 1) {
          el.style.transform = `translateX(-${itemWidth + gap}px)`;
        }
      });
      thumbs.forEach((el) => {
        if (parseInt(el.style.order) !== 1) {
          el.style.transform = `translateX(-${el.offsetWidth + gap}px)`;
        }
      });
    } else {
      // prev
      const lastItem = items.find((el) => parseInt(el.style.order) === itemCount.value);
      const lastThumb = thumbs.find((el) => parseInt(el.style.order) === itemCount.value);

      if (lastItem) {
        lastItem.style.transition = 'none';
        lastItem.style.transform = `translateX(-${itemWidth + gap}px)`;
      }
      if (lastThumb) {
        lastThumb.style.transition = 'none';
        lastThumb.style.transform = `translateX(-${lastThumb.offsetWidth + gap}px)`;
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
    }

    setTimeout(() => {
      itemsToAnimate.forEach((el) => {
        el.style.transition = 'none';
        el.style.transform = '';
      });
      isAnimating.value = false;
    }, transitionSpeed);
  };

  return {
    animate,
    isAnimating,
  };
}
