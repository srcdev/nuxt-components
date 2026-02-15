<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1 mbe-18">Settings</h1>
          <h2 class="page-heading-2 mbe-18">Theme Switcher</h2>

          <DisplayThemeSwitch />
        </LayoutRow>

        <ContentGrid>
          <template #slot1>
            <div>
              <h1>Example buttons</h1>
              <p>Primary submit</p>

              <p>Themes switcher</p>
              <ul class="flex-group">
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="false"
                    button-text="Default"
                    theme="default"
                    @click.stop.prevent="swapTheme('default')"
                  />
                </li>
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="false"
                    button-text="Success"
                    theme="success"
                    @click.stop.prevent="swapTheme('success')"
                  />
                </li>
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="false"
                    button-text="Error"
                    theme="error"
                    @click.stop.prevent="swapTheme('error')"
                  />
                </li>
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="false"
                    button-text="Warning"
                    theme="warning"
                    @click.stop.prevent="swapTheme('warning')"
                  />
                </li>
              </ul>

              <p>Variants switcher</p>
              <ul class="flex-group">
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="false"
                    button-text="Primary"
                    :theme
                    variant="primary"
                    @click.stop.prevent="swapVariant('primary')"
                  />
                </li>
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="false"
                    button-text="Secondary"
                    :theme
                    variant="secondary"
                    @click.stop.prevent="swapVariant('secondary')"
                  />
                </li>
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="false"
                    button-text="Tertiary"
                    :theme
                    variant="tertiary"
                    @click.stop.prevent="swapVariant('tertiary')"
                  />
                </li>
              </ul>

              <p>Pending Settings</p>
              <ul class="flex-group">
                <li>
                  <p>Toggle pending state</p>
                  <InputButtonCore
                    type="button"
                    :button-text="`Pending is ${isPending}`"
                    :theme
                    variant="primary"
                    @click.stop.prevent="isPending = !isPending"
                  />
                </li>
                <li>
                  <p>Toggle pending effect</p>
                  <InputButtonCore
                    type="button"
                    :button-text="`Pending effect is ${hasPendingEffect}`"
                    :theme
                    :readonly="!isPending"
                    variant="primary"
                    @click.stop.prevent="hasPendingEffect = !hasPendingEffect"
                  />
                </li>
              </ul>
            </div>
          </template>
        </ContentGrid>

        <ContentGrid>
          <template #slot1>
            <div>
              <h1>Example buttons</h1>
              <p>Currently displaying {{ buttonText }}</p>
              <ul class="flex-group">
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="isPending"
                    :has-pending-effect="hasPendingEffect"
                    button-text="Submit"
                    :theme="theme"
                    :variant="variant"
                  />
                </li>
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="isPending"
                    :has-pending-effect="hasPendingEffect"
                    button-text="Submit"
                    :theme="theme"
                    :variant="variant"
                  >
                    <template #left>
                      <Icon name="radix-icons:eye-none" class="icon" />
                    </template>
                  </InputButtonCore>
                </li>
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="isPending"
                    :has-pending-effect="hasPendingEffect"
                    button-text="Submit"
                    :theme="theme"
                    :variant="variant"
                  >
                    <template #right>
                      <Icon name="radix-icons:eye-none" class="icon" />
                    </template>
                  </InputButtonCore>
                </li>
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="isPending"
                    :has-pending-effect="hasPendingEffect"
                    button-text="Submit"
                    :theme="theme"
                    :variant="variant"
                    true;
                  >
                    <template #left>
                      <Icon name="mdi:arrow-left" class="icon" />
                    </template>
                    <template #right>
                      <Icon name="mdi:arrow-right" class="icon" />
                    </template>
                  </InputButtonCore>
                </li>
                <li>
                  <InputButtonCore
                    type="button"
                    :is-pending="isPending"
                    :has-pending-effect="hasPendingEffect"
                    button-text="Submit"
                    :theme="theme"
                    :variant="variant"
                  >
                    <template #iconOnly>
                      <Icon name="radix-icons:eye-none" class="icon" />
                    </template>
                  </InputButtonCore>
                </li>
              </ul>
            </div>
          </template>
        </ContentGrid>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { IFieldsInitialState } from "~/types/forms/types.forms";

definePageMeta({
  layout: false,
});

useHead({
  title: "Homepage",
  meta: [{ name: "description", content: "Homepage" }],
  bodyAttrs: {
    class: "buttons-examples-page",
  },
});

const theme = ref<"default" | "success" | "error" | "warning">("default");
const swapTheme = (newTheme: "default" | "success" | "error" | "warning") => {
  theme.value = newTheme;
};

const variant = ref<"primary" | "secondary" | "tertiary">("primary");
const swapVariant = (newVariant: "primary" | "secondary" | "tertiary") => {
  variant.value = newVariant;
};

const hasPendingEffect = ref(false);
const isPending = ref(false);

const buttonText = computed(() => {
  return `Theme: ${theme.value.charAt(0).toUpperCase() + theme.value.slice(1)} | Variant: ${variant.value.charAt(0).toUpperCase() + variant.value.slice(1)}`;
});

/*
 * Setup forms
 */
const fieldsInitialState = ref<IFieldsInitialState>({
  emailAddress: "",
  username: "",
  password: "",
});

// Setup formData
const { formData, initFormData, getErrorCount, formIsValid } = useFormControl();
await initFormData(fieldsInitialState);

const submitForm = async () => {
  await getErrorCount(true);

  if (formIsValid.value) {
    formData.value.isPending = true;
    console.log("Form is good - post it!");
    // await useSleep(2000);
    // formData.value.isPending = false;
  } else {
    console.warn("Form has errors");
  }
};
</script>

<style lang="css">
.buttons-examples-page {
  .layout-row {
    .ui-content-grid {
      --_margin-inline: 12px;
    }
  }

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
}
</style>
