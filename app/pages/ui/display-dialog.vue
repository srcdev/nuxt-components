<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Dialog with scrollable content</h1>
          <p><button type="button" @click.prevent="openDialog('sample1')">Show Dialog</button></p>

          <DisplayDialog
            v-if="dialogsConfig['sample1']"
            v-model="dialogsConfig['sample1']"
            variant="dialog"
            :style-class-passthrough="['your-modifier-class']"
            :allow-content-scroll="true"
            data-dialog-id="sample1"
          >
            <template #dialogTitle>
              <p class="text-normal wght-700 m-0">Dialog with scrollable content</p>
            </template>

            <template #dialogContent>
              <div class="pt-12 pb-12">
                <p class="text-normal">
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Scelerisque tincidunt vestibulum litora torquent
                  aliquam a. Sem litora tellus mattis nisi vehicula sodales arcu egestas. Consectetur ultrices maximus
                  pulvinar habitant imperdiet habitasse feugiat. Varius vehicula potenti aliquam mollis efficitur at mus
                  ridiculus. Nec dis elit euismod posuere etiam fermentum, nisi ante. Pharetra ligula laoreet commodo et
                  mollis, semper malesuada urna. Id porttitor hendrerit scelerisque justo ridiculus sagittis. Adipiscing
                  pellentesque eget metus orci; potenti natoque habitasse. Adipiscing leo parturient dis nullam
                  condimentum id.
                </p>
                <p class="text-normal">
                  Justo molestie felis tellus tellus taciti? Ullamcorper viverra quis felis donec aliquam torquent
                  imperdiet. Curabitur vitae quis malesuada imperdiet hendrerit felis quam dictum. Aptent curabitur
                  lacus dapibus; nunc enim vestibulum finibus. Lorem commodo tortor blandit nisl curabitur interdum
                  ultricies magnis. Dui vehicula ex; congue sagittis commodo tincidunt. Varius sociosqu finibus facilisi
                  per, vel quisque. Ornare fames cubilia diam maximus habitant nulla nisl. Sollicitudin cubilia inceptos
                  taciti hac tristique mauris hendrerit vestibulum.
                </p>
                <p class="text-normal">
                  Lobortis efficitur enim litora dictum montes. Sagittis eget etiam curae suspendisse cubilia. Ante
                  aliquam orci mus ultricies nostra. Ad augue quam egestas ipsum sem lacus tempus. Magnis enim posuere
                  eros montes fermentum velit. Montes lacinia nisl facilisi volutpat vehicula porttitor auctor
                  condimentum venenatis. Semper varius nascetur imperdiet laoreet vivamus montes praesent purus nostra.
                  Magna nascetur augue curae proin nascetur sagittis urna adipiscing.
                </p>
                <p class="text-normal">
                  Venenatis adipiscing integer eget donec ridiculus risus. Nulla quis sollicitudin sem nam bibendum
                  ligula. Curabitur malesuada platea egestas venenatis in torquent. Eget eros euismod vehicula consequat
                  at, efficitur ullamcorper. Donec nibh molestie semper nulla vehicula. Vulputate porta euismod cras;
                  inceptos vel erat. Vehicula urna mattis suscipit iaculis nostra eget. Eleifend vivamus nullam porta
                  urna nulla dictum praesent aenean. Etiam ipsum placerat bibendum nullam rhoncus egestas. Mollis
                  pretium nullam nullam donec eget imperdiet.
                </p>
                <p class="text-normal">
                  Curae maximus nam tortor porta sodales at, feugiat iaculis integer. Lacus habitasse odio fames natoque
                  neque varius nostra. Imperdiet tellus libero ornare lobortis maximus rutrum parturient litora viverra.
                  Praesent proin sem nulla mauris justo mi morbi. Neque diam sodales nam nascetur commodo risus. Ornare
                  at sit, mattis erat aenean ipsum. Dictum integer ipsum suspendisse sagittis nisl sollicitudin.
                </p>
              </div>
            </template>
            <template #actionButtonLeft>
              <button type="submit" @click.prevent="closeDialog('sample1', 'cancel')">Cancel</button>
            </template>
            <template #actionButtonRight>
              <button type="submit" @click.prevent="closeDialog('sample1', 'confirm')">Confirm</button>
            </template>
          </DisplayDialog>
        </PageRow>

        <PageRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Confirm Dialog</h2>
          <p><button type="button" @click.prevent="openDialog('logout')">Show Confirm Dialog</button></p>

          <DisplayDialog
            v-if="dialogsConfig['logout']"
            v-model="dialogsConfig['logout']"
            variant="confirm"
            :style-class-passthrough="['your-modifier-class']"
            data-dialog-id="logout"
          >
            <template #dialogTitle>
              <p class="text-normal wght-700 m-0">Confirm logout?</p>
            </template>

            <template #dialogContent>
              <div class="m-0">
                <p class="text-normal">Are you sure you wish to log out?</p>
              </div>
            </template>
            <template #actionButtonLeft>
              <button type="submit" @click.prevent="closeDialog('logout', 'cancel')">Cancel</button>
            </template>
            <template #actionButtonRight>
              <button type="submit" @click.prevent="closeDialog('logout', 'confirm')">Confirm</button>
            </template>
          </DisplayDialog>
        </PageRow>

        <PageRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Alert Dialog</h2>
          <p class="text-normal">Cannot be dismissed by clicking outside or pressing Escape — requires explicit action.</p>
          <p><button type="button" @click.prevent="openDialog('deleteAccount')">Show Alert Dialog</button></p>

          <DisplayDialog
            v-if="dialogsConfig['deleteAccount']"
            v-model="dialogsConfig['deleteAccount']"
            variant="alert"
            :style-class-passthrough="['your-modifier-class']"
            data-dialog-id="deleteAccount"
          >
            <template #dialogTitle>
              <p class="text-normal wght-700 m-0">Delete account?</p>
            </template>

            <template #dialogContent>
              <div class="m-0">
                <p class="text-normal">This action is permanent and cannot be undone. All your data will be removed.</p>
              </div>
            </template>
            <template #actionButtonLeft>
              <button type="button" @click.prevent="closeDialog('deleteAccount', 'cancel')">Cancel</button>
            </template>
            <template #actionButtonRight>
              <button type="button" @click.prevent="closeDialog('deleteAccount', 'confirm')">Delete account</button>
            </template>
          </DisplayDialog>
        </PageRow>

        <PageRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Fullscreen Dialog</h2>
          <p><button type="button" @click.prevent="openDialog('fullscreen')">Show Fullscreen Dialog</button></p>

          <DisplayDialog
            v-if="dialogsConfig['fullscreen']"
            v-model="dialogsConfig['fullscreen']"
            variant="fullscreen"
            :style-class-passthrough="['your-modifier-class']"
            data-dialog-id="fullscreen"
          >
            <template #dialogTitle>
              <p class="text-normal wght-700 m-0">Fullscreen dialog</p>
            </template>

            <template #dialogContent>
              <div class="pt-12 pb-12">
                <p class="text-normal">This dialog fills the entire viewport. Useful for immersive flows such as onboarding, image editors, or multi-step wizards.</p>
              </div>
            </template>
            <template #actionButtonLeft>
              <button type="button" @click.prevent="closeDialog('fullscreen', 'cancel')">Cancel</button>
            </template>
            <template #actionButtonRight>
              <button type="button" @click.prevent="closeDialog('fullscreen', 'confirm')">Done</button>
            </template>
          </DisplayDialog>
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
  title: "UI Dialogs",
  meta: [{ name: "description", content: "Examples of Dialogs" }],
  bodyAttrs: {
    class: "home",
  },
});

const { dialogsConfig, openDialog, closeDialog } = useDialogControls({
  sample1: {
    onConfirm: () => console.log("Sample1 dialog confirmed"),
    onCancel: () => console.log("Sample1 dialog cancelled"),
  },
  logout: {
    onConfirm: () => console.log("User logged out"),
    onCancel: () => console.log("Logout cancelled"),
  },
  deleteAccount: {
    onConfirm: () => console.log("Account deleted"),
    onCancel: () => console.log("Delete account cancelled"),
  },
  fullscreen: {
    onConfirm: () => console.log("Fullscreen dialog confirmed"),
    onCancel: () => console.log("Fullscreen dialog cancelled"),
  },
});
</script>

