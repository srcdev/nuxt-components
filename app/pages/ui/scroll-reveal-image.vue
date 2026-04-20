<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <!-- ── Page header ──────────────────────────────────────────────── -->
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-48']">
          <h1 class="page-heading-1">ScrollRevealImage</h1>
          <p class="page-body-normal">
            A pure-CSS parallax reveal. No scroll listeners, no JS animation — driven entirely by
            <code>animation-timeline: view()</code>
            . Scroll down to see each variant in action.
          </p>
        </LayoutRow>

        <!-- ── Interactive demo ──────────────────────────────────────────── -->
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-48']">
          <h2 class="page-heading-2 mbe-8">Interactive demo</h2>
          <p class="page-body-normal mbe-16">Adjust the props then scroll through the image on the right.</p>
          <div class="demo-controls">
            <p class="demo-controls__heading">Props</p>
            <div class="demo-controls__fields">
              <MultipleRadiobuttons
                v-model="frameHeight"
                v-model:field-data="frameHeightData"
                name="frameHeight"
                legend="frameHeight"
                label="frameHeight"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
              <MultipleRadiobuttons
                v-model="parallaxOffset"
                v-model:field-data="parallaxOffsetData"
                name="parallaxOffset"
                legend="parallaxOffset"
                label="parallaxOffset"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
              <MultipleRadiobuttons
                v-model="focalX"
                v-model:field-data="focalXData"
                name="focalX"
                legend="focalX"
                label="focalX"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
              <MultipleRadiobuttons
                v-model="radius"
                v-model:field-data="radiusData"
                name="radius"
                legend="radius"
                label="radius"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
            </div>
          </div>
        </LayoutRow>

        <!-- ── Variants ──────────────────────────────────────────────────── -->
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-24']">
          <h2 class="page-heading-2">Variants</h2>
        </LayoutRow>

        <!-- Default -->
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-32']">
          <div class="sri-demo-row">
            <div class="sri-demo-row__info">
              <h3 class="page-heading-3 mbe-8">Default</h3>
              <p class="page-body-normal mbe-12">
                All props at their default values. A portrait image with a generous parallax offset panning from top to
                bottom as the frame crosses the viewport.
              </p>
              <dl class="sri-props">
                <dt>frameHeight</dt>
                <dd>540px</dd>
                <dt>parallaxOffset</dt>
                <dd>36rem</dd>
                <dt>focalX</dt>
                <dd>50%</dd>
              </dl>
            </div>
            <ScrollRevealImage
              src="/images/page/hero/hero-blonde.jpg"
              alt="Blonde hair portrait"
              :img-width="1280"
              :img-height="1920"
            />
          </div>
        </LayoutRow>

        <!-- Short frame / banner -->
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-32']">
          <div class="sri-demo-row">
            <div class="sri-demo-row__info">
              <h3 class="page-heading-3 mbe-8">Short frame — landscape image</h3>
              <p class="page-body-normal mbe-12">
                A shallow frame with a wide banner image. The reduced
                <code>parallaxOffset</code>
                is proportional to the shorter frame height.
              </p>
              <dl class="sri-props">
                <dt>frameHeight</dt>
                <dd>320px</dd>
                <dt>parallaxOffset</dt>
                <dd>24rem</dd>
              </dl>
            </div>
            <ScrollRevealImage
              src="/images/banners/banner-mid-brown.webp"
              alt="Mid brown hair banner"
              :img-width="1920"
              :img-height="800"
              frame-height="320px"
              parallax-offset="24rem"
            />
          </div>
        </LayoutRow>

        <!-- Rounded corners -->
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-32']">
          <div class="sri-demo-row">
            <div class="sri-demo-row__info">
              <h3 class="page-heading-3 mbe-8">Rounded corners</h3>
              <p class="page-body-normal mbe-12">
                The
                <code>radius</code>
                prop applies
                <code>border-radius</code>
                to the clipping frame, so the image reveal stays contained within the rounded shape.
              </p>
              <dl class="sri-props">
                <dt>frameHeight</dt>
                <dd>480px</dd>
                <dt>parallaxOffset</dt>
                <dd>36rem</dd>
                <dt>radius</dt>
                <dd>2.4rem</dd>
              </dl>
            </div>
            <ScrollRevealImage
              src="/images/banners/banner-ginger.webp"
              alt="Ginger hair banner"
              :img-width="1920"
              :img-height="800"
              frame-height="480px"
              radius="2.4rem"
            />
          </div>
        </LayoutRow>

        <!-- Focal point -->
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-32']">
          <div class="sri-demo-row">
            <div class="sri-demo-row__info">
              <h3 class="page-heading-3 mbe-8">Horizontal focal point</h3>
              <p class="page-body-normal mbe-12">
                <code>focalX</code>
                pins the horizontal crop axis. Here it is pushed right so the subject stays centred in the narrower
                right-hand column.
              </p>
              <dl class="sri-props">
                <dt>frameHeight</dt>
                <dd>540px</dd>
                <dt>parallaxOffset</dt>
                <dd>36rem</dd>
                <dt>focalX</dt>
                <dd>75%</dd>
              </dl>
            </div>
            <ScrollRevealImage
              src="/images/page/hero/hero-red.jpg"
              alt="Red hair portrait"
              :img-width="1280"
              :img-height="1920"
              focal-x="75%"
            />
          </div>
        </LayoutRow>

        <!-- Tall frame -->
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-48']">
          <div class="sri-demo-row">
            <div class="sri-demo-row__info">
              <h3 class="page-heading-3 mbe-8">Tall frame — maximum travel</h3>
              <p class="page-body-normal mbe-12">
                A tall frame combined with a large
                <code>parallaxOffset</code>
                creates the most dramatic reveal — nearly the full image height is traversed as you scroll.
              </p>
              <dl class="sri-props">
                <dt>frameHeight</dt>
                <dd>70vh</dd>
                <dt>parallaxOffset</dt>
                <dd>60rem</dd>
              </dl>
            </div>
            <ScrollRevealImage
              src="/images/page/hero/hero-hair.jpg"
              alt="Hair portrait"
              :img-width="1280"
              :img-height="1920"
              frame-height="70vh"
              parallax-offset="60rem"
            />
          </div>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { IFormMultipleOptions } from "~/types/forms/types.forms";

definePageMeta({
  layout: false,
});

useHead({
  title: "ScrollRevealImage Component",
  meta: [
    {
      name: "description",
      content: "ScrollRevealImage — pure-CSS parallax scroll reveal effect demo",
    },
  ],
  bodyAttrs: {
    class: "scroll-reveal-image-page",
  },
});

const frameHeight = ref("540px");
const parallaxOffset = ref("36rem");
const focalX = ref("50%");
const radius = ref("0px");

const frameHeightData = ref<IFormMultipleOptions>({
  data: [
    { id: "fh-320", name: "frameHeight", value: "320px", label: "320px" },
    { id: "fh-540", name: "frameHeight", value: "540px", label: "540px" },
    { id: "fh-60vh", name: "frameHeight", value: "60vh", label: "60vh" },
    { id: "fh-80vh", name: "frameHeight", value: "80vh", label: "80vh" },
  ],
  total: 4,
  skip: 0,
  limit: 4,
});

const parallaxOffsetData = ref<IFormMultipleOptions>({
  data: [
    { id: "po-20", name: "parallaxOffset", value: "20rem", label: "20rem" },
    { id: "po-36", name: "parallaxOffset", value: "36rem", label: "36rem" },
    { id: "po-48", name: "parallaxOffset", value: "48rem", label: "48rem" },
    { id: "po-60", name: "parallaxOffset", value: "60rem", label: "60rem" },
  ],
  total: 4,
  skip: 0,
  limit: 4,
});

const focalXData = ref<IFormMultipleOptions>({
  data: [
    { id: "fx-left", name: "focalX", value: "20%", label: "left" },
    { id: "fx-center", name: "focalX", value: "50%", label: "center" },
    { id: "fx-right", name: "focalX", value: "80%", label: "right" },
  ],
  total: 3,
  skip: 0,
  limit: 3,
});

const radiusData = ref<IFormMultipleOptions>({
  data: [
    { id: "r-0", name: "radius", value: "0px", label: "none" },
    { id: "r-8", name: "radius", value: "0.8rem", label: "0.8rem" },
    { id: "r-16", name: "radius", value: "1.6rem", label: "1.6rem" },
    { id: "r-24", name: "radius", value: "2.4rem", label: "2.4rem" },
  ],
  total: 4,
  skip: 0,
  limit: 4,
});
</script>

<style lang="css">
.scroll-reveal-image-page {
  .sri-demo-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3.2rem;
    align-items: start;

    @media (width >= 768px) {
      grid-template-columns: 1fr 2fr;
    }

    &__info {
      position: sticky;
      top: 2.4rem;
    }
  }

  .sri-props {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.4rem 1.2rem;
    font-size: 1.3rem;
    margin: 0;

    dt {
      color: var(--slate-07);
      font-family: monospace;
    }

    dd {
      margin: 0;
      font-family: monospace;
      color: var(--slate-10);
    }
  }

  .demo-controls {
    padding: 1.6rem;
    border: 1px solid var(--slate-06);
    border-radius: 0.8rem;
    margin-block: 2.4rem;

    &__heading {
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--slate-08);
      margin-block-end: 1.2rem;
    }

    &__fields {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }
  }
}
</style>
