<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <div>
          <h1>Example buttons</h1>
          <p>Primary submit</p>

          <p>Themes switcher</p>
          <ul class="flex-group">
            <li>
              <InputButtonSubmit
                type="button"
                @click.stop.prevent="swapTheme('primary')"
                :is-pending="false"
                button-text="Primary"
                theme="primary"
                size="default"
              />
            </li>
            <li>
              <InputButtonSubmit
                type="button"
                @click.stop.prevent="swapTheme('secondary')"
                :is-pending="false"
                button-text="Secondary"
                theme="secondary"
                size="default"
              />
            </li>
            <li>
              <InputButtonSubmit
                type="button"
                @click.stop.prevent="swapTheme('tertiary')"
                :is-pending="false"
                button-text="Tertiary"
                theme="tertiary"
                size="default"
              />
            </li>
            <li>
              <InputButtonSubmit
                type="button"
                @click.stop.prevent="swapTheme('warning')"
                :is-pending="false"
                button-text="Warning"
                theme="warning"
                size="default"
              />
            </li>
            <li>
              <InputButtonSubmit
                type="button"
                @click.stop.prevent="swapTheme('success')"
                :is-pending="false"
                button-text="Success"
                theme="success"
                size="default"
              />
            </li>
            <li>
              <InputButtonSubmit
                type="button"
                @click.stop.prevent="swapTheme('error')"
                :is-pending="false"
                button-text="Error"
                theme="error"
                size="default"
              />
            </li>
            <li>
              <InputButtonSubmit
                type="button"
                @click.stop.prevent="swapTheme('ghost')"
                :is-pending="false"
                button-text="Ghost"
                theme="ghost"
                size="default"
              />
            </li>
          </ul>

          <FormWrapper width="medium">
            <template #default>
              <form @submit.prevent="submitForm">
                <div class="flex-group">
                  <InputButtonSubmit
                    type="button"
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Submit"
                    :theme
                    size="x-small"
                  />

                  <InputButtonSubmit
                    type="button"
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Submit"
                    :theme
                    size="small"
                  />

                  <InputButtonSubmit
                    type="button"
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Submit"
                    :theme
                    size="default"
                  />
                  <InputButtonSubmit
                    type="button"
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Submit"
                    :theme
                    size="medium"
                  />
                  <InputButtonSubmit
                    type="button"
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Submit"
                    :theme
                    size="large"
                  />
                </div>

                <div class="flex-group">
                  <InputButtonConfirm
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Confirm"
                    :theme
                    size="x-small"
                  />
                  <InputButtonConfirm
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Confirm"
                    :theme
                    size="small"
                  />
                  <InputButtonConfirm
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Confirm"
                    :theme
                    size="default"
                  />
                  <InputButtonConfirm
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Confirm"
                    :theme
                    size="medium"
                  />
                  <InputButtonConfirm
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Confirm"
                    :theme
                    size="large"
                  />
                </div>
                <div class="flex-group">
                  <InputButtonCore
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Submit"
                    :theme
                    size="x-small"
                  >
                    <template #iconOnly>
                      <Icon name="radix-icons:eye-none" class="icon" />
                    </template>
                  </InputButtonCore>

                  <InputButtonCore
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Submit"
                    :theme
                    size="small"
                    :style-class-passthrough="['main-navigation-button']"
                  >
                    <template #iconOnly>
                      <Icon name="radix-icons:eye-none" class="icon" />
                    </template>
                  </InputButtonCore>

                  <InputButtonCore
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Submit"
                    :theme
                    size="default"
                  >
                    <template #iconOnly>
                      <Icon name="radix-icons:eye-none" class="icon" />
                    </template>
                  </InputButtonCore>

                  <InputButtonCore
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Submit"
                    :theme
                    size="medium"
                  >
                    <template #iconOnly>
                      <Icon name="radix-icons:eye-none" class="icon" />
                    </template>
                  </InputButtonCore>

                  <InputButtonCore
                    @click.stop.prevent="submitForm"
                    :is-pending="false"
                    button-text="Submit"
                    :theme
                    size="large"
                  >
                    <template #iconOnly>
                      <Icon name="radix-icons:eye-none" class="icon" />
                    </template>
                  </InputButtonCore>
                </div>
              </form>
            </template>
          </FormWrapper>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { IFieldsInitialState, IOptionsConfig } from "~/types/forms/types.forms"

definePageMeta({
  layout: false,
})

useHead({
  title: "Homepage",
  meta: [{ name: "description", content: "Homepage" }],
  bodyAttrs: {
    class: "",
  },
})

const theme = ref("primary")

const swapTheme = (newTheme: string) => {
  theme.value = newTheme
}

/*
 * Setup forms
 */
const fieldsInitialState = ref<IFieldsInitialState>({
  emailAddress: "",
  username: "",
  password: "",
})

// Setup formData
const { formData, initFormData, getErrorCount, updateErrorMessages, formIsValid, submitDisabled, useApiErrors } =
  useFormControl()
await initFormData(fieldsInitialState)

const submitForm = async () => {
  await getErrorCount(true)

  if (formIsValid.value) {
    formData.value.isPending = true
    console.log("Form is good - post it!")
    // await useSleep(2000);
    // formData.value.isPending = false;
  } else {
    console.warn("Form has errors")
  }
}
</script>

<style lang="css">
.flex-group {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 2.4rem;
  margin-bottom: 3.2rem;
}

ul.flex-group {
  list-style-type: none;
  padding: 0;
}
</style>
