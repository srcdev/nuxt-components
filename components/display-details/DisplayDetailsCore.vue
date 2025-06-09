<template>
  <details @click.prevent="handleClick()" :name="name" class="display-details" :class="[elementClasses]" ref="detailsRef">
    <summary class="display-details-summary" :id="triggerId" :aria-controls="contentId" ref="summaryRef">
      <span class="label">
        <slot name="summary"></slot>
      </span>
      <slot name="summaryIcon">
        <Icon name="bi:caret-down-fill" class="icon mi-12" :class="iconSize" />
      </slot>
    </summary>
    <div class="display-details-content" :aria-labelledby="triggerId" :id="contentId" role="region" ref="contentRef">
      <slot name="content"></slot>
    </div>
  </details>
</template>

<script lang="ts">
// Create a global store to track open details elements by name
const openDetailsByName = reactive(new Map<string, HTMLDetailsElement>());

export const useDetailsTransition = (detailsRef: Ref<HTMLDetailsElement | null>, summaryRef: Ref<HTMLElement | null>, contentRef: Ref<HTMLDivElement | null>, name: string, animationDuration: number) => {
  // State
  const animation = ref<Animation | null>(null);
  const isClosing = ref(false);
  const isExpanding = ref(false);

  // Check if refs are available
  if (!detailsRef.value || !summaryRef.value || !contentRef.value) {
    console.warn('Details, summary, or content ref is null');
    return {
      clickAction: () => console.warn('Component not fully initialized'),
    };
  }

  const closeOtherDetailsWithSameName = () => {
    const currentDetails = detailsRef.value;
    if (!currentDetails || !name) return;

    // Get the currently open details with the same name
    const openDetails = openDetailsByName.get(name);

    // If there's an open details with the same name and it's not the current one, close it
    if (openDetails && openDetails !== currentDetails && openDetails.open) {
      // Simulate a click on the other details to close it with animation
      const otherSummary = openDetails.querySelector('summary');
      if (otherSummary) {
        otherSummary.click();
      } else {
        // Fallback: close directly without animation
        openDetails.open = false;
      }
    }

    // Update the map with the current details if it's open
    if (currentDetails.open) {
      openDetailsByName.set(name, currentDetails);
    } else {
      // If it's closed and was the one in the map, remove it
      if (openDetailsByName.get(name) === currentDetails) {
        openDetailsByName.delete(name);
      }
    }
  };

  const clickAction = () => {
    const details = detailsRef.value;
    const summary = summaryRef.value;
    const content = contentRef.value;

    if (!details || !summary || !content) return;

    // Add overflow hidden to avoid content jumping
    details.style.overflow = 'hidden';

    if (isClosing.value || !details.open) {
      // Close other details with the same name first
      closeOtherDetailsWithSameName();

      // Open the details
      details.open = true;
      isExpanding.value = true;
      isClosing.value = false;

      // Get the height of the content
      const detailsHeight = details.offsetHeight;
      const contentHeight = content.offsetHeight;
      const summaryHeight = summary.offsetHeight;

      const startHeight = `${detailsHeight - contentHeight}px`;
      const endHeight = `${summaryHeight + contentHeight}px`;

      // If there's an animation running, cancel it
      if (animation.value) {
        animation.value.cancel();
      }

      // Start animation
      animation.value = details.animate(
        {
          height: [startHeight, endHeight],
        },
        {
          duration: animationDuration,
          easing: 'ease-out',
        }
      );

      animation.value.onfinish = () => {
        // Animation finished - reset everything
        details.style.height = 'auto';
        details.style.overflow = '';
        isExpanding.value = false;
        animation.value = null;

        // Register this as the open details for this name
        openDetailsByName.set(name, details);
      };

      animation.value.oncancel = () => {
        isExpanding.value = false;
      };
    } else if (isExpanding.value || details.open) {
      // Close the details
      isClosing.value = true;
      isExpanding.value = false;

      // Get the height of the content
      const startHeight = `${details.offsetHeight}px`;
      const endHeight = `${details.offsetHeight - content.offsetHeight}px`;

      // If there's an animation running, cancel it
      if (animation.value) {
        animation.value.cancel();
      }

      // Start animation
      animation.value = details.animate(
        {
          height: [startHeight, endHeight],
        },
        {
          duration: animationDuration,
          easing: 'ease-out',
        }
      );

      animation.value.onfinish = () => {
        // Animation finished - reset everything
        details.open = false;
        details.style.height = 'auto';
        details.style.overflow = '';
        isClosing.value = false;
        animation.value = null;

        // Remove this from the open details map if it's there
        if (openDetailsByName.get(name) === details) {
          openDetailsByName.delete(name);
        }
      };

      animation.value.oncancel = () => {
        isClosing.value = false;
      };
    }
  };

  return {
    clickAction,
    isClosing,
    isExpanding,
  };
};
</script>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  animationDuration: {
    type: Number,
    default: 400,
  },
  iconSize: {
    type: String,
    default: 'small',
    validator(value: string) {
      return ['small', 'medium', 'large'].includes(value);
    },
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const triggerId = computed(() => `${props.id}-trigger`);
const contentId = computed(() => `${props.id}-content`);

const { elementClasses, resetElementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

updateElementClasses([props.iconSize]);

const detailsRef = ref<HTMLDetailsElement | null>(null);
const summaryRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);

// Initialize with dummy function that will be replaced when refs are available
let clickAction = () => console.warn('Component not fully initialized');

// Handle click with the current clickAction function
const handleClick = () => {
  clickAction();
};

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

onMounted(() => {
  // Initialize the composable once the component is mounted and refs are available
  if (detailsRef.value && contentRef.value && summaryRef.value) {
    const details = useDetailsTransition(detailsRef, summaryRef, contentRef, props.name, props.animationDuration);
    clickAction = details.clickAction; // Assign the real click handler
  } else {
    console.error('Refs not available after mounting');
  }
});
</script>

<style lang="css">
  .display-details {
    /* Component setup */
    --_display-details-icon-transform: scaleY(1);
    --_display-details-icon-size: 1.2rem;

    /* Configurable properties */
    --_display-details-border: none;
    --_display-details-outline: none;
    --_display-details-box-shadow: none;
    --_display-details-border-radius: 0;
    --_display-details-mbe: 1em;

    --_display-details-summary-gap: 12px;
    --_display-details-summary-flex-direction: row;

    --_display-details-content-padding: 0;

    &.medium {
      --_display-details-icon-size: 1.8rem;
    }
    &.large {
      --_display-details-icon-size: 2.4rem;
    }

    &[open] {
      --_display-details-icon-transform: scaleY(-1);
    }

    border: var(--_display-details-border);
    outline: var(--_display-details-outline);
    box-shadow: var(--_display-details-box-shadow);
    border-radius: var(--_display-details-border-radius);
    margin-block-end: var(--_display-details-mbe);

    .display-details-summary {

      display: flex;
      align-items: center;
      justify-content: space-between;

      list-style: none;

      &::-webkit-details-marker,
      &::marker {
        display: none;
      }

      display: flex !important;
      flex-direction: var(--_display-details-summary-flex-direction);
      align-items: center;
      gap: var(--_display-details-summary-gap);
      overflow: clip;

      .label {
        display: block;
        flex-grow: 1;
      }

      .icon {
        display: block;

        font-size: var(--_display-details-icon-size);
        transform: var(--_display-details-icon-transform);
        transition: transform 200ms;
      }
    }

    .display-details-content {
      padding: var(--_display-details-content-padding);
    }
  }

</style>
