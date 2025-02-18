<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="full-width" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Layout Grid 'A'</h2>

          <div class="canvas-switcher">
            <p>Canvas switcher</p>
            <ul class="canvas-switcher mbe-20">
              <li>
                <button type="button" @click.stop.prevent="swapTheme('mobile')">
                  <Icon name="ic:baseline-phone-iphone" class="icon" :class="[{ current: media === 'mobile' }]" />
                </button>
              </li>
              <li>
                <button type="button" @click.stop.prevent="swapTheme('tablet')">
                  <Icon name="ic:baseline-tablet-mac" class="icon" :class="[{ current: media === 'tablet' }]" />
                </button>
              </li>
              <li>
                <button type="button" @click.stop.prevent="swapTheme('desktop')">
                  <Icon name="ic:baseline-laptop-mac" class="icon" :class="[{ current: media === 'desktop' }]" />
                </button>
              </li>
            </ul>
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <LayoutGridA :styleClassPassthrough="[media]">
            <template #slot1>
              <h3 class="heading-3">Slot 1</h3>
              <p>
                Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora.
                Platea accumsan interdum ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in
                penatibus torquent tortor. Platea gravida nam; egestas enim nostra ultricies.
              </p>
            </template>
            <template #slot2>
              <h3 class="heading-3">Slot 2</h3>
              <p>
                Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi
                ullamcorper praesent. Arcu luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur class suscipit quisque convallis eget? Dignissim
                mattis luctus enim habitant porta pretium litora. Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus nisi a montes.
              </p>
            </template>
            <template #slot3>
              <h3 class="heading-3">Slot 3</h3>
              <p>
                Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi
                ullamcorper praesent. Arcu luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur class suscipit quisque convallis eget? Dignissim
                mattis luctus enim habitant porta pretium litora. Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus nisi a montes.
              </p>
            </template>
            <template #slot4>
              <h3 class="heading-3">Slot 4</h3>
              <p>
                Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi
                ullamcorper praesent. Arcu luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur class suscipit quisque convallis eget? Dignissim
                mattis luctus enim habitant porta pretium litora. Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus nisi a montes.
              </p>
            </template>
          </LayoutGridA>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Full Width</h2>
          <p>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora.
            Platea accumsan interdum ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in
            penatibus torquent tortor. Platea gravida nam; egestas enim nostra ultricies.
          </p>
          <p>
            Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi
            ullamcorper praesent. Arcu luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur class suscipit quisque convallis eget? Dignissim mattis
            luctus enim habitant porta pretium litora. Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus nisi a montes.
          </p>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: 'UI Layout Row',
  meta: [{ name: 'description', content: 'Examples of UI Component Layout Row' }],
  bodyAttrs: {
    class: 'home',
  },
});

type MediaCanvas = 'mobile' | 'tablet' | 'desktop';
const media = ref<MediaCanvas>('desktop');

const swapTheme = (newTheme: MediaCanvas) => {
  media.value = newTheme;
};
</script>

<style lang="css">
.canvas-switcher {
  display: flex;
  align-items: center;
  gap: 20px;

  ul {
    display: flex;
    gap: 10px;
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      button {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        border: 0px solid light-dark(var(--gray-10), var(--gray-2));
        border-radius: 4px;
        cursor: pointer;

        .icon {
          color: light-dark(var(--gray-10), var(--gray-2));

          width: 24px;
          height: 24px;

          &.current {
            color: light-dark(var(--green-10), var(--green-4));
          }
        }
      }
    }
  }
}

.layout-grid-a-wrapper {
  margin-inline: auto;
  &.mobile {
    max-width: 412px;
  }
  &.tablet {
    max-width: 768px;
  }
  &.desktop {
    max-width: 1060px;
  }
}
</style>
