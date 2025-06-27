<template>
  <div class="container-glow-wrapper" ref="containerGlowWrapper">
    <template v-for="(item, key) in data" :key="key">
      <component :is="tag" class="container-glow-core" :class="elementClasses" ref="containerGlowItem">
        <div class="glows"></div>
        <slot :name="`container-glow-${key}`"></slot>
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Data {
  title: string;
  content: string;
}

const props = defineProps({
  data: {
    type: Array as PropType<Data[]>,
    default: () => [],
  },
  tag: {
    type: String as PropType<string>,
    default: 'div',
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const controller = new AbortController();

const containerGlowWrapper = ref<HTMLElement>();
const containerGlowItem = ref<HTMLElement[]>([]);

const CONFIG = {
  proximity: 40,
  spread: 80,
  blur: 20,
  gap: 32,
  vertical: false,
  opacity: 0,
};

const PROXIMITY = 10;

const UPDATE = (event: PointerEvent) => {
  // get the angle based on the center point of the card and pointer position
  for (const CARD of containerGlowItem.value) {
    // Check the card against the proximity and then start updating
    const CARD_BOUNDS = CARD.getBoundingClientRect();
    // Get distance between pointer and outerbounds of card
    if (
      event?.x > CARD_BOUNDS.left - CONFIG.proximity &&
      event?.x < CARD_BOUNDS.left + CARD_BOUNDS.width + CONFIG.proximity &&
      event?.y > CARD_BOUNDS.top - CONFIG.proximity &&
      event?.y < CARD_BOUNDS.top + CARD_BOUNDS.height + CONFIG.proximity
    ) {
      // If within proximity set the active opacity
      CARD.style.setProperty('--active', String(1));
    } else {
      CARD.style.setProperty('--active', String(CONFIG.opacity));
    }
    const CARD_CENTER = [CARD_BOUNDS.left + CARD_BOUNDS.width * 0.5, CARD_BOUNDS.top + CARD_BOUNDS.height * 0.5];
    let ANGLE = (Math.atan2(event?.y - CARD_CENTER[1], event?.x - CARD_CENTER[0]) * 180) / Math.PI;
    ANGLE = ANGLE < 0 ? ANGLE + 360 : ANGLE;
    CARD.style.setProperty('--start', String(ANGLE + 90));
  }
};

const RESTYLE = () => {
  containerGlowWrapper.value?.style.setProperty('--gap', String(CONFIG.gap));
  containerGlowWrapper.value?.style.setProperty('--blur', String(CONFIG.blur));
  containerGlowWrapper.value?.style.setProperty('--spread', String(CONFIG.spread));
  containerGlowWrapper.value?.style.setProperty('--direction', CONFIG.vertical ? 'column' : 'row');
};

// document.body.addEventListener('pointermove', UPDATE);

onMounted(() => {
  RESTYLE();
  if (containerGlowWrapper.value) {
    document.body.addEventListener('pointermove', UPDATE, {
      signal: controller.signal,
    });
  }
});

onBeforeUnmount(() => {
  return controller.abort();
});
</script>

<style lang="css">
.container-glow-wrapper {
  --container-bg-colour: light-dark(hsl(250, 18%, 93%), hsl(246 44% 7%));
  --container-border-colour: hsl(280 10% 50% / 1);
  --card: light-dark(white, hsl(246 44% 7%));
  --container-border-width: 2px;
  --container-border-radius: 12px;
  --gradient: conic-gradient(
    from 180deg at 50% 70%,
    hsla(0, 0%, 98%, 1) 0deg,
    #eec32d 72.0000010728836deg,
    #ec4b4b 144.0000021457672deg,
    #709ab9 216.00000858306885deg,
    #4dffbf 288.0000042915344deg,
    hsla(0, 0%, 98%, 1) 1turn
  );

  @property --start {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
  }

  display: flex;
  gap: 3.2rem;

  .container-glow-core {
    & *,
    & *:after,
    & *:before {
      box-sizing: border-box;
    }

    --active: 0.15;
    --start: 0;
    height: 100%;
    background: var(--card);
    padding: 2rem;
    aspect-ratio: 330 / 400;
    border-radius: var(--container-border-radius);
    min-width: 280px;
    max-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    position: relative;

    &:is(:hover, :focus-visible) {
      z-index: 2;
    }

    &::before {
      position: absolute;
      inset: 0;
      border: var(--container-border-width) solid transparent;
      content: '';
      border-radius: var(--container-border-radius);
      pointer-events: none;
      background: var(--container-border-colour);
      background-attachment: fixed;
      border-radius: var(--container-border-radius);
      mask: linear-gradient(#0000, #0000),
        conic-gradient(from calc(((var(--start) + (var(--spread) * 0.25)) - (var(--spread) * 1.5)) * 1deg), hsl(0 0% 100% / 0.15) 0deg, white, hsl(0 0% 100% / 0.15) calc(var(--spread) * 2.5deg));
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
      opacity: var(--active);
      transition: opacity 1s;
    }

    &::after {
      /* --container-bg-colour-size: 100%; */
      content: '';
      pointer-events: none;
      position: absolute;
      background: var(--gradient);
      background-attachment: fixed;
      border-radius: var(--container-border-radius);
      opacity: var(--active, 0);
      transition: opacity 1s;
      --alpha: 0;
      inset: 0;
      border: var(--container-border-width) solid transparent;
      mask: linear-gradient(#0000, #0000), conic-gradient(from calc(((var(--start) + (var(--spread) * 0.25)) - (var(--spread) * 0.5)) * 1deg), #0000 0deg, #fff, #0000 calc(var(--spread) * 0.5deg));
      filter: brightness(1.5);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }

    .glows {
      pointer-events: none;
      position: absolute;
      inset: 0;
      filter: blur(calc(var(--blur) * 1px));

      &::after,
      &::before {
        --alpha: 0;
        content: '';
        background: var(--gradient);
        background-attachment: fixed;
        position: absolute;
        inset: -5px;
        border: 10px solid transparent;
        border-radius: var(--container-border-radius);
        mask: linear-gradient(#0000, #0000), conic-gradient(from calc((var(--start) - (var(--spread) * 0.5)) * 1deg), #000 0deg, #fff, #0000 calc(var(--spread) * 1deg));
        mask-composite: intersect;
        mask-clip: padding-box, border-box;
        opacity: var(--active);
        transition: opacity 1s;
      }
    }
  }
}
</style>
