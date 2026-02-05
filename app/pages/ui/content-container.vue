<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <ContentContainer tag="div" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2 mbe-18">Content Container</h1>
          <p class="page-body-normal-semibold">
            Small screens:
            <code class="page-body-normal">--content-max-width: auto;</code>
          </p>
          <p class="page-body-normal-semibold">
            >= Laptop screens:
            <code class="page-body-normal">--content-max-width: 1064px;</code>
          </p>
        </ContentContainer>

        <ContentContainer tag="div" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2 mbe-18">Sample content</h2>
          <p class="page-body-normal">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit
            convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora. Platea accumsan interdum
            ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit
            nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in penatibus torquent tortor. Platea gravida nam;
            egestas enim nostra ultricies.
          </p>
          <p class="page-body-normal">
            Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia leo
            lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi ullamcorper praesent. Arcu luctus
            tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur class
            suscipit quisque convallis eget? Dignissim mattis luctus enim habitant porta pretium litora. Parturient
            montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus nisi a montes.
          </p>
        </ContentContainer>

        <ContentContainer tag="div" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2 mbe-18">Sample Column content</h2>

          <TwoColumns>
            <template #col1>
              <h3 class="page-heading-3 mbe-12">Column 1</h3>
              <p class="page-body-normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.
                Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent
                et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem
                lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit.
              </p>
            </template>
            <template #col2>
              <h3 class="page-heading-3 mbe-12">Column 2</h3>
              <p class="page-body-normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.
                Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent
                et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem
                lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit.
              </p>
            </template>
          </TwoColumns>
        </ContentContainer>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "UI Layout Row",
  meta: [{ name: "description", content: "Examples of UI Component Layout Row" }],
  bodyAttrs: {
    class: "content-container-page",
  },
});
</script>

<style lang="css">
.content-container-page {
  .two-column-layout-container {
    .two-column-layout {
      .col-1 {
        outline: 1px solid green;
      }

      .col-2 {
        outline: 1px solid green;
      }

      @container two-column-layout (width >= 1064px) {
        .col-1 {
          outline: 1px solid purple;
        }

        .col-2 {
          outline: 1px solid purple;
        }
      }
    }
  }
}

.content-container-wrapper {
  .content-container {
    .content-container-inner {
      outline: 1px solid orange;
    }
  }
}
</style>
