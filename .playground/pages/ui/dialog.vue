<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Dialog withscrollable content</h2>
          <p><button @click="controlDialogs('sample1', !dialogsConfig['sample1'].open)" type="button">Show Dialog</button></p>

          <DisplayDialogScrollableContent v-if="dialogsConfig['sample1'].open" v-model="dialogsConfig['sample1'].open" :style-class-passthrough="['content-width']" :allowContentScroll="true">
            <template #dialogTitle>
              <p class="text-normal wght-700">Confirm logout?</p>
            </template>

            <template #dialogContent>
              <div class="pt-12 pb-12">
                <p class="text-normal">
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Scelerisque tincidunt vestibulum litora torquent aliquam a. Sem litora tellus mattis nisi vehicula sodales arcu egestas.
                  Consectetur ultrices maximus pulvinar habitant imperdiet habitasse feugiat. Varius vehicula potenti aliquam mollis efficitur at mus ridiculus. Nec dis elit euismod posuere etiam
                  fermentum, nisi ante. Pharetra ligula laoreet commodo et mollis, semper malesuada urna. Id porttitor hendrerit scelerisque justo ridiculus sagittis. Adipiscing pellentesque eget
                  metus orci; potenti natoque habitasse. Adipiscing leo parturient dis nullam condimentum id.
                </p>
                <p class="text-normal">
                  Justo molestie felis tellus tellus taciti? Ullamcorper viverra quis felis donec aliquam torquent imperdiet. Curabitur vitae quis malesuada imperdiet hendrerit felis quam dictum.
                  Aptent curabitur lacus dapibus; nunc enim vestibulum finibus. Lorem commodo tortor blandit nisl curabitur interdum ultricies magnis. Dui vehicula ex; congue sagittis commodo
                  tincidunt. Varius sociosqu finibus facilisi per, vel quisque. Ornare fames cubilia diam maximus habitant nulla nisl. Sollicitudin cubilia inceptos taciti hac tristique mauris
                  hendrerit vestibulum.
                </p>
                <p class="text-normal">
                  Lobortis efficitur enim litora dictum montes. Sagittis eget etiam curae suspendisse cubilia. Ante aliquam orci mus ultricies nostra. Ad augue quam egestas ipsum sem lacus tempus.
                  Magnis enim posuere eros montes fermentum velit. Montes lacinia nisl facilisi volutpat vehicula porttitor auctor condimentum venenatis. Semper varius nascetur imperdiet laoreet
                  vivamus montes praesent purus nostra. Magna nascetur augue curae proin nascetur sagittis urna adipiscing.
                </p>
                <p class="text-normal">
                  Venenatis adipiscing integer eget donec ridiculus risus. Nulla quis sollicitudin sem nam bibendum ligula. Curabitur malesuada platea egestas venenatis in torquent. Eget eros euismod
                  vehicula consequat at, efficitur ullamcorper. Donec nibh molestie semper nulla vehicula. Vulputate porta euismod cras; inceptos vel erat. Vehicula urna mattis suscipit iaculis nostra
                  eget. Eleifend vivamus nullam porta urna nulla dictum praesent aenean. Etiam ipsum placerat bibendum nullam rhoncus egestas. Mollis pretium nullam nullam donec eget imperdiet.
                </p>
                <p class="text-normal">
                  Curae maximus nam tortor porta sodales at, feugiat iaculis integer. Lacus habitasse odio fames natoque neque varius nostra. Imperdiet tellus libero ornare lobortis maximus rutrum
                  parturient litora viverra. Praesent proin sem nulla mauris justo mi morbi. Neque diam sodales nam nascetur commodo risus. Ornare at sit, mattis erat aenean ipsum. Dictum integer
                  ipsum suspendisse sagittis nisl sollicitudin.
                </p>
                <p class="text-normal">
                  Curae maximus nam tortor porta sodales at, feugiat iaculis integer. Lacus habitasse odio fames natoque neque varius nostra. Imperdiet tellus libero ornare lobortis maximus rutrum
                  parturient litora viverra. Praesent proin sem nulla mauris justo mi morbi. Neque diam sodales nam nascetur commodo risus. Ornare at sit, mattis erat aenean ipsum. Dictum integer
                  ipsum suspendisse sagittis nisl sollicitudin.
                </p>
                <p class="text-normal">
                  Curae maximus nam tortor porta sodales at, feugiat iaculis integer. Lacus habitasse odio fames natoque neque varius nostra. Imperdiet tellus libero ornare lobortis maximus rutrum
                  parturient litora viverra. Praesent proin sem nulla mauris justo mi morbi. Neque diam sodales nam nascetur commodo risus. Ornare at sit, mattis erat aenean ipsum. Dictum integer
                  ipsum suspendisse sagittis nisl sollicitudin.
                </p>
              </div>
            </template>
            <template #actionButtonLeft>
              <button @click="controlDialogs('sample1', !dialogsConfig['sample1'].open)" type="submit">Cancel</button>
            </template>
            <template #actionButtonRight>
              <button @click="controlDialogs('sample1', !dialogsConfig['sample1'].open)" type="submit">Confirm</button>
            </template>
          </DisplayDialogScrollableContent>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Confirm Dialog</h2>
          <p><button @click="controlDialogs('logout', !dialogsConfig['logout'].open)" type="button">Show Dialog Prompt</button></p>

          <DisplayDialogConfirm v-if="dialogsConfig['logout'].open" v-model="dialogsConfig['logout'].open" :style-class-passthrough="['content-width']">
            <template #dialogTitle>
              <p class="text-normal wght-700">Confirm logout?</p>
            </template>

            <template #dialogContent>
              <div class="pt-12 pb-12">
                <p class="text-normal">Are you sure you wish to log out?</p>
              </div>
            </template>
            <template #actionButtonLeft>
              <button @click="controlDialogs('logout', !dialogsConfig['logout'].open)" type="submit">Cancel</button>
            </template>
            <template #actionButtonRight>
              <button @click="controlDialogs('logout', !dialogsConfig['logout'].open)" type="submit">Confirm</button>
            </template>
          </DisplayDialogConfirm>
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

const displayDialog = ref(false);
const toggleDialog = (state: boolean) => {
  displayDialog.value = state;
};

const dialogsConfig = ref({
  logout: {
    open: false,
  },
  sample1: {
    open: false,
  },
});

const controlDialogs = (name: string, state: boolean) => {
  console.log('controlDialogs > name > ', name, state);
  (dialogsConfig.value as Record<string, { open: boolean }>)[name].open = state;
};
</script>
