<template>
  <component :is="tag" class="services-section" :class="[elementClasses]">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
      <div class="aspect-[3/4] overflow-hidden sticky top-24" style="opacity: 1; transform: none">
        <NuxtImg :src="serviceData.image" :alt="serviceData.title" class="w-full h-full object-cover" />
      </div>
      <div style="opacity: 1; transform: none">
        <p class="text-xs tracking-[0.3em] uppercase text-primary mb-3">Precision foils &amp; face-framing</p>
        <h1 class="font-display text-5xl md:text-6xl mb-6">Highlights</h1>
        <div class="flex items-center gap-6 mb-8 pb-8 border-b border-border/30">
          <span class="flex items-center gap-2 text-sm text-muted-foreground">
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
              class="lucide lucide-sparkles w-4 h-4 text-primary"
            >
              <path
                d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
              />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>
            From £120
          </span>
          <span class="flex items-center gap-2 text-sm text-muted-foreground">
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
              class="lucide lucide-clock w-4 h-4 text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            2 – 3 hours
          </span>
        </div>
        <p class="text-muted-foreground font-light leading-relaxed text-lg mb-10">
          Highlights use foils to isolate individual sections of hair, allowing precise control over placement,
          thickness, and lift. Whether you want a full head of fine, woven highlights for an all-over brightness, a
          half-head to freshen up the top layers, or face-framing pieces for a subtle lift, foils deliver clean, defined
          results.
        </p>
        <div class="mb-12">
          <h2 class="font-display text-2xl mb-4">
            What is
            <span class="italic text-gradient-gold">highlights</span>
            ?
          </h2>
          <p class="text-muted-foreground font-light leading-relaxed">
            Foil highlighting is a technique where thin sections of hair are woven out, painted with lightener, and
            wrapped in foil to process. The foil traps heat and keeps the lightener concentrated on just those strands,
            which allows for more lift than open-air techniques. This makes highlights ideal when you want noticeable
            contrast or need to go significantly lighter.
          </p>
        </div>
        <div class="mb-12">
          <h2 class="font-display text-2xl mb-6">The Process</h2>
          <ol class="space-y-4">
            <li class="flex gap-4">
              <span
                class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium"
              >
                1
              </span>
              <p class="text-muted-foreground font-light leading-relaxed pt-1">
                Consultation — we determine the placement pattern (full head, half head, T-section, or face frame) and
                target shade
              </p>
            </li>
            <li class="flex gap-4">
              <span
                class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium"
              >
                2
              </span>
              <p class="text-muted-foreground font-light leading-relaxed pt-1">
                Weaving — fine sections are woven from each panel using a tail comb for precision
              </p>
            </li>
            <li class="flex gap-4">
              <span
                class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium"
              >
                3
              </span>
              <p class="text-muted-foreground font-light leading-relaxed pt-1">
                Application — lightener is applied to each woven section and sealed in foil
              </p>
            </li>
            <li class="flex gap-4">
              <span
                class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium"
              >
                4
              </span>
              <p class="text-muted-foreground font-light leading-relaxed pt-1">
                Processing — foils develop for 25–45 minutes depending on desired lift level
              </p>
            </li>
            <li class="flex gap-4">
              <span
                class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium"
              >
                5
              </span>
              <p class="text-muted-foreground font-light leading-relaxed pt-1">
                Removal &amp; toning — foils are removed, hair is rinsed, and a toner is applied to refine the final
                shade
              </p>
            </li>
            <li class="flex gap-4">
              <span
                class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium"
              >
                6
              </span>
              <p class="text-muted-foreground font-light leading-relaxed pt-1">
                Blow-dry &amp; styling — finished with a professional style to showcase the dimension
              </p>
            </li>
          </ol>
        </div>
        <div class="mb-12">
          <h2 class="font-display text-2xl mb-6">Ideal For</h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
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
                class="lucide lucide-circle-check-big w-5 h-5 text-primary mt-0.5 flex-shrink-0"
              >
                <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              <span class="text-muted-foreground font-light">
                Those wanting noticeable, defined brightness throughout
              </span>
            </li>
            <li class="flex items-start gap-3">
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
                class="lucide lucide-circle-check-big w-5 h-5 text-primary mt-0.5 flex-shrink-0"
              >
                <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              <span class="text-muted-foreground font-light">Blending and disguising early grey hairs</span>
            </li>
            <li class="flex items-start gap-3">
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
                class="lucide lucide-circle-check-big w-5 h-5 text-primary mt-0.5 flex-shrink-0"
              >
                <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              <span class="text-muted-foreground font-light">Adding dramatic contrast against a darker base</span>
            </li>
            <li class="flex items-start gap-3">
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
                class="lucide lucide-circle-check-big w-5 h-5 text-primary mt-0.5 flex-shrink-0"
              >
                <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              <span class="text-muted-foreground font-light">
                Clients who prefer a more structured, polished finish than balayage
              </span>
            </li>
          </ul>
        </div>
        <div class="mb-12">
          <h2 class="font-display text-2xl mb-4">Aftercare &amp; Maintenance</h2>
          <p class="text-muted-foreground font-light leading-relaxed">
            Highlights have a more defined regrowth line than balayage, so most clients return every 8–12 weeks for a
            root touch-up or refresh. A T-section or face-frame option can stretch this further if you're looking for
            lower maintenance. Purple shampoo once a week will keep blonde highlights cool and bright.
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
}
</style>
