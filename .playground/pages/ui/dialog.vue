<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Dialog</h2>
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
});

const controlDialogs = (name: string, state: boolean) => {
  console.log('controlDialogs > name > ', name, state);
  (dialogsConfig.value as Record<string, { open: boolean }>)[name].open = state;
};
</script>
