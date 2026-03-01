<template>
  <component :is="tag" class="services-section" :class="[elementClasses]">
    <div class="image-wrapper">
      <NuxtImg :src="serviceData.image" :alt="serviceData.title" class="image" />
    </div>
    <div>
      <EyebrowText :text-content="serviceData.subtitle" />
      <HeroHeading
        tag="h1"
        font-size="medium"
        :text-content="[
          {
            text: serviceData.title,
            styleClass: 'normal',
          },
        ]"
        :style-class-passthrough="['mb-20']"
      />

      <div class="price-duration">
        <div class="flex-row">
          <Icon name="mdi:clock-time-four-outline" class="decorator" />
          <span>{{ serviceData.duration }}</span>
        </div>
        <div class="flex-row">
          <Icon name="mdi:currency-gbp" class="decorator" />
          <span>{{ serviceData.price }}</span>
        </div>
      </div>

      <p class="page-body-normal">{{ serviceData.longDescription }}</p>

      <HeroHeading
        tag="h2"
        axis="horizontal"
        font-size="smaller"
        :text-content="[
          { text: 'What is ', styleClass: 'normal' },
          { text: 'highlights?', styleClass: 'accent' },
        ]"
        :style-class-passthrough="['mb-20']"
      />
      <p class="page-body-normal">
        {{ serviceData.whatIsIt }}
      </p>

      <HeroHeading
        tag="h2"
        axis="horizontal"
        font-size="smaller"
        :text-content="[{ text: 'The Process ', styleClass: 'normal' }]"
        :style-class-passthrough="['mb-20']"
      />
      <IndicatorList tag="ol" :item-count="serviceData.process.length">
        <template v-for="(item, index) in serviceData.process" #[`item-${index}`]>
          {{ item }}
        </template>
      </IndicatorList>

      <HeroHeading
        tag="h2"
        axis="horizontal"
        font-size="smaller"
        :text-content="[{ text: 'Ideal For', styleClass: 'normal' }]"
        :style-class-passthrough="['mb-20']"
      />

      <div class="mb-12">
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <Icon name="mdi:checkbox-marked-circle-outline" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span class="text-muted-foreground font-light">
              Those wanting noticeable, defined brightness throughout
            </span>
          </li>
          <li class="flex items-start gap-3">
            <Icon name="mdi:checkbox-marked-circle-outline" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span class="text-muted-foreground font-light">Blending and disguising early grey hairs</span>
          </li>
          <li class="flex items-start gap-3">
            <Icon name="mdi:checkbox-marked-circle-outline" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span class="text-muted-foreground font-light">Adding dramatic contrast against a darker base</span>
          </li>
          <li class="flex items-start gap-3">
            <Icon name="mdi:checkbox-marked-circle-outline" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span class="text-muted-foreground font-light">
              Clients who prefer a more structured, polished finish than balayage
            </span>
          </li>
        </ul>
      </div>
      <div class="mb-12">
        <h2 class="font-display text-2xl mb-4">Aftercare &amp; Maintenance</h2>
        <p class="text-muted-foreground font-light leading-relaxed">
          Highlights have a more defined regrowth line than balayage, so most clients return every 8–12 weeks for a root
          touch-up or refresh. A T-section or face-frame option can stretch this further if you're looking for lower
          maintenance. Purple shampoo once a week will keep blonde highlights cool and bright.
        </p>
      </div>
      <div class="mb-12">
        <h2 class="font-display text-2xl mb-6">Frequently Asked Questions</h2>
        <div class="w-full" data-orientation="vertical">
          <div data-state="closed" data-orientation="vertical" class="border-b border-border/30">
            <h3 data-orientation="vertical" data-state="closed" class="flex">
              <button
                id="radix-:r0:"
                type="button"
                aria-controls="radix-:r1:"
                aria-expanded="false"
                data-state="closed"
                data-orientation="vertical"
                class="flex flex-1 items-center justify-between py-4 font-medium transition-all [&amp;[data-state=open]&gt;svg]:rotate-180 text-left font-display text-base hover:no-underline hover:text-primary"
                data-radix-collection-item=""
              >
                What's the difference between a full head and half head?
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-down h-4 w-4 shrink-0 transition-transform duration-200"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div
              id="radix-:r1:"
              data-state="closed"
              hidden=""
              role="region"
              aria-labelledby="radix-:r0:"
              data-orientation="vertical"
              class="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              style="
                --radix-accordion-content-height: var(--radix-collapsible-content-height);
                --radix-accordion-content-width: var(--radix-collapsible-content-width);
              "
            ></div>
          </div>
          <div data-state="closed" data-orientation="vertical" class="border-b border-border/30">
            <h3 data-orientation="vertical" data-state="closed" class="flex">
              <button
                id="radix-:r2:"
                type="button"
                aria-controls="radix-:r3:"
                aria-expanded="false"
                data-state="closed"
                data-orientation="vertical"
                class="flex flex-1 items-center justify-between py-4 font-medium transition-all [&amp;[data-state=open]&gt;svg]:rotate-180 text-left font-display text-base hover:no-underline hover:text-primary"
                data-radix-collection-item=""
              >
                What is a T-section?
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-down h-4 w-4 shrink-0 transition-transform duration-200"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div
              id="radix-:r3:"
              data-state="closed"
              hidden=""
              role="region"
              aria-labelledby="radix-:r2:"
              data-orientation="vertical"
              class="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              style="
                --radix-accordion-content-height: var(--radix-collapsible-content-height);
                --radix-accordion-content-width: var(--radix-collapsible-content-width);
              "
            ></div>
          </div>
          <div data-state="closed" data-orientation="vertical" class="border-b border-border/30">
            <h3 data-orientation="vertical" data-state="closed" class="flex">
              <button
                id="radix-:r4:"
                type="button"
                aria-controls="radix-:r5:"
                aria-expanded="false"
                data-state="closed"
                data-orientation="vertical"
                class="flex flex-1 items-center justify-between py-4 font-medium transition-all [&amp;[data-state=open]&gt;svg]:rotate-180 text-left font-display text-base hover:no-underline hover:text-primary"
                data-radix-collection-item=""
              >
                Can highlights go wrong?
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-down h-4 w-4 shrink-0 transition-transform duration-200"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div
              id="radix-:r5:"
              data-state="closed"
              hidden=""
              role="region"
              aria-labelledby="radix-:r4:"
              data-orientation="vertical"
              class="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              style="
                --radix-accordion-content-height: var(--radix-collapsible-content-height);
                --radix-accordion-content-width: var(--radix-collapsible-content-width);
              "
            ></div>
          </div>
        </div>
      </div>
      <div class="glass-card p-8 text-center">
        <h3 class="font-display text-xl mb-3">Ready to book your highlights appointment?</h3>
        <p class="text-muted-foreground font-light text-sm mb-6">Mobile service across Bath — I come to you.</p>
        <a
          href="/#contact"
          class="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase hover:bg-primary/90 transition-all duration-300 glow-rose"
        >
          Get in Touch
        </a>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
export interface Service {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  image: string;
  shortDescription: string;
  longDescription: string;
  whatIsIt: string;
  process: string[];
  idealFor: string[];
  maintenance: string;
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
}

interface Props {
  tag?: "div" | "section" | "article" | "main";
  serviceData: Service;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
.services-section {
  /* Component styles */
  container-type: inline-size;
  container-name: services-section;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(446px, 1fr));
  gap: 3rem;

  .image-wrapper {
    /* Image wrapper styles */
    .image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .price-duration {
    display: flex;
    flex-direction: row;
    gap: 3rem;
    align-items: center;
    margin-block-end: 2rem;

    > div {
      display: flex;
      flex-direction: row;
      gap: 0.8rem;
      align-items: center;

      .decorator {
        width: 2rem;
        height: 2rem;
      }
    }
  }
}
</style>
