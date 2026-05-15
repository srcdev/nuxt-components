<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow :style-class-passthrough="['mbe-4']">
          <h1 class="page-heading-2">PageRow</h1>
          <p>
            Each
            <code>PageRow</code>
            is both a CSS grid container and a grid item. All direct children default to the
            <strong>content</strong>
            column (max 1064px). Nest a
            <code>PageRow</code>
            with a different
            <code>variant</code>
            to break out to a wider or narrower track.
          </p>
        </PageRow>

        <!-- Direct content — defaults to content column -->
        <PageRow tag="section" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Default — content column</h2>
          <pre>variant="content" (default)</pre>
          <p>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
            convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora.
          </p>
        </PageRow>

        <!-- Nesting: full-width background, constrained content -->
        <PageRow
          tag="section"
          variant="full"
          :style-class-passthrough="['mbe-20']"
          style="background: #1e3a5f; color: white; padding-block: 4rem"
        >
          <h2 class="page-heading-2">Full-width background with constrained content</h2>
          <pre style="color: #93c5fd">Outer: variant="full" — Inner: default content column</pre>
          <p>
            Wrap a
            <code style="color: #93c5fd">PageRow</code>
            in another with
            <code style="color: #93c5fd">variant="full"</code>
            to get a full-width background while keeping text in the content column. No extra wrapper divs required.
          </p>
        </PageRow>

        <!-- Popout -->
        <PageRow tag="section" :style-class-passthrough="['mbe-20']">
          <PageRow variant="popout" :style-class-passthrough="['mbe-4']">
            <h2 class="page-heading-2">Popout track (max 1400px)</h2>
            <pre>variant="popout"</pre>
            <p>
              Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
              convallis himenaeos. Tellus varius cursus convallis commodo.
            </p>
          </PageRow>
        </PageRow>

        <!-- Inset content -->
        <PageRow tag="section" :style-class-passthrough="['mbe-20']">
          <PageRow variant="inset-content">
            <h2 class="page-heading-2">Inset content track (max 840px)</h2>
            <pre>variant="inset-content"</pre>
            <p>
              Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
              convallis himenaeos. Tellus varius cursus convallis commodo.
            </p>
          </PageRow>
        </PageRow>

        <!-- Mixed nesting: multiple tracks in one section -->
        <PageRow
          tag="section"
          variant="full"
          :style-class-passthrough="['mbe-20']"
          style="background: #f00000; padding-block: 4rem"
        >
          <h2 class="page-heading-2">Mixed nesting</h2>
          <p>Content column (default) alongside sibling rows at other tracks.</p>

          <PageRow
            variant="popout"
            style="background: #00fc11; padding: 2rem; border-radius: 0.6rem; margin-block: 2rem"
          >
            <p>Popout sibling (max 1400px)</p>
          </PageRow>

          <PageRow variant="inset-content">
            <p style="font-style: italic">Inset content sibling (max 840px) — ideal for pull-quotes or callouts.</p>
          </PageRow>
        </PageRow>

        <!-- Semantic tags + landmark -->
        <PageRow tag="section" is-landmark :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Semantic tag + landmark</h2>
          <pre>tag="section" :is-landmark="true"</pre>
          <p>
            Any semantic HTML element is supported via the
            <code>tag</code>
            prop. Enabling
            <code>isLandmark</code>
            adds
            <code>tabindex="0"</code>
            and
            <code>aria-label="Page Row"</code>
            .
          </p>
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "UI PageRow",
  meta: [{ name: "description", content: "Examples of the PageRow layout component" }],
  bodyAttrs: {
    class: "home",
  },
});
</script>
