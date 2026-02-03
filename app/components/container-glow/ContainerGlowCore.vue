<template>
  <div class="container-glow-wrapper" :class="elementClasses" ref="containerGlowWrapper">
    <component
      :is="tag"
      v-for="(item, key) in itemCount"
      :key="key"
      class="container-glow-core"
      ref="containerGlowItem"
    >
      <div class="glows"></div>
      <slot :name="`container-glow-${key}`"></slot>
    </component>
  </div>
</template>

<script setup lang="ts">
interface Config {
  proximity: number
  spread: number
  blur: number
  gap: number
  vertical: boolean
  opacity: number
}

const props = defineProps({
  itemCount: {
    type: Number,
    required: true,
  },
  tag: {
    type: String as PropType<string>,
    default: "div",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  config: {
    type: Object as PropType<Config>,
    default: () => ({
      proximity: 40,
      spread: 80,
      blur: 20,
      gap: 32,
      vertical: false,
      opacity: 0.15,
    }),
  },
})

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const controller = new AbortController()

const containerGlowWrapper = ref<HTMLElement>()
const containerGlowItem = ref<HTMLElement[]>([])

const updateStyles = (event: PointerEvent) => {
  // Early return if event coordinates are not available
  if (typeof event.x !== "number" || typeof event.y !== "number") {
    return
  }

  // Extract coordinates for type safety
  const eventX = event.x
  const eventY = event.y

  // get the angle based on the center point of the card and pointer position
  for (const cardElem of containerGlowItem.value) {
    // Check the card against the proximity and then start updating
    const cardBounds = cardElem.getBoundingClientRect()
    // Get distance between pointer and outerbounds of card
    if (
      eventX > cardBounds.left - props.config.proximity &&
      eventX < cardBounds.left + cardBounds.width + props.config.proximity &&
      eventY > cardBounds.top - props.config.proximity &&
      eventY < cardBounds.top + cardBounds.height + props.config.proximity
    ) {
      // If within proximity set the active opacity
      cardElem.style.setProperty("--opacity-active", String(1))
    } else {
      cardElem.style.setProperty("--opacity-active", String(props.config.opacity))
    }
    const cardCentreX = cardBounds.left + cardBounds.width * 0.5
    const cardCentreY = cardBounds.top + cardBounds.height * 0.5
    let angle = (Math.atan2(eventY - cardCentreY, eventX - cardCentreX) * 180) / Math.PI
    angle = angle < 0 ? angle + 360 : angle
    cardElem.style.setProperty("--start", String(angle + 90))
  }
}

const applyStyles = () => {
  containerGlowWrapper.value?.style.setProperty("--gap", String(props.config.gap))
  containerGlowWrapper.value?.style.setProperty("--blur", String(props.config.blur))
  containerGlowWrapper.value?.style.setProperty("--spread", String(props.config.spread))
  containerGlowWrapper.value?.style.setProperty("--direction", props.config.vertical ? "column" : "row")
}

// document.body.addEventListener('pointermove', updateStyles);

onMounted(() => {
  applyStyles()
  if (containerGlowWrapper.value) {
    document.body.addEventListener("pointermove", updateStyles, {
      signal: controller.signal,
    })
  }
})

onBeforeUnmount(() => {
  return controller.abort()
})
</script>

<style lang="css">
.container-glow-wrapper {
  @property --start {
    syntax: "<number>";
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

    --gradient: conic-gradient(
      from 180deg at 50% 70%,
      hsla(0, 0%, 98%, 1) 0deg,
      #eec32d 72.0000010728836deg,
      #ec4b4b 144.0000021457672deg,
      #709ab9 216.00000858306885deg,
      #4dffbf 288.0000042915344deg,
      hsla(0, 0%, 98%, 1) 1turn
    );
    --opacity-active: 0.15;
    --start: 0;

    position: relative;

    height: 100%;
    background: light-dark(white, hsl(246 44% 7%));
    padding: 2rem;
    aspect-ratio: 330 / 400;
    border-radius: 12px;
    min-width: 280px;
    max-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &:is(:hover, :focus-visible) {
      z-index: 2;
    }

    &::before,
    &::after {
      content: "";
      position: absolute;
      inset: 0;
    }

    &::before {
      pointer-events: none;

      border: 2px solid transparent;
      border-radius: 12px;
      background: hsl(280 10% 50% / 1);
      background-attachment: fixed;
      border-radius: 12px;
      mask:
        linear-gradient(#0000, #0000),
        conic-gradient(
          from calc(((var(--start) + (var(--spread) * 0.25)) - (var(--spread) * 1.5)) * 1deg),
          hsl(0 0% 100% / 0.15) 0deg,
          white,
          hsl(0 0% 100% / 0.15) calc(var(--spread) * 2.5deg)
        );
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
      opacity: var(--opacity-active);
      transition: opacity 1s;
    }

    &::after {
      pointer-events: none;

      background: var(--gradient);
      background-attachment: fixed;
      border-radius: 12px;
      opacity: var(--opacity-active, 0);
      transition: opacity 1s;
      --alpha: 0;
      border: 2px solid transparent;
      mask:
        linear-gradient(#0000, #0000),
        conic-gradient(
          from calc(((var(--start) + (var(--spread) * 0.25)) - (var(--spread) * 0.5)) * 1deg),
          #0000 0deg,
          #fff,
          #0000 calc(var(--spread) * 0.5deg)
        );
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
        content: "";
        background: var(--gradient);
        background-attachment: fixed;
        position: absolute;
        inset: -5px;
        border: 10px solid transparent;
        border-radius: 12px;
        mask:
          linear-gradient(#0000, #0000),
          conic-gradient(
            from calc((var(--start) - (var(--spread) * 0.5)) * 1deg),
            #000 0deg,
            #fff,
            #0000 calc(var(--spread) * 1deg)
          );
        mask-composite: intersect;
        mask-clip: padding-box, border-box;
        opacity: var(--opacity-active);
        transition: opacity 1s;
      }
    }
  }
}
</style>
