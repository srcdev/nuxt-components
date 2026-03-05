<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Profile Section</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ContactSection tag="section" :style-class-passthrough="['mbe-20']">
            <template #indicator-0>
              <Icon name="lucide-map-pin" class="indicator-icon" />
            </template>
            <template #item-0>
              <div>
                <HeroText
                  tag="h2"
                  axis="horizontal"
                  font-size="label"
                  :text-content="[{ text: 'Location', styleClass: 'normal' }]"
                  :style-class-passthrough="['mbe-20']"
                />

                <p class="page-body-normal">
                  Mobile service across Bath — Weston, Lansdown, Larkhall, Oldfield Park &amp; surrounding areas.
                </p>
              </div>
            </template>

            <template #indicator-1>
              <Icon name="lucide-phone" class="indicator-icon" />
            </template>
            <template #item-1>
              <div>
                <HeroText
                  tag="h2"
                  axis="horizontal"
                  font-size="label"
                  :text-content="[{ text: 'Contact', styleClass: 'normal' }]"
                  :style-class-passthrough="['mbe-20']"
                />
                <p class="page-body-normal">
                  Call or text to arrange your home appointment. Evening and weekend slots available.
                </p>
              </div>
            </template>

            <template #indicator-2>
              <Icon name="lucide-clock" class="indicator-icon" />
            </template>
            <template #item-2>
              <div>
                <HeroText
                  tag="h2"
                  axis="horizontal"
                  font-size="label"
                  :text-content="[{ text: 'Hours', styleClass: 'normal' }]"
                  :style-class-passthrough="['mbe-20']"
                />
                <p class="page-body-normal">
                  Monday
                  <em>to</em>
                  Sunday
                  <br />
                  <em>between</em>
                  9:00 AM
                  <em>and</em>
                  7:00 PM
                  <br />
                  Flexible by arrangement
                  <br />
                  Sunday appointments available on request and a premium.
                </p>
              </div>
            </template>

            <template #form>
              <ClientOnly>
                <form ref="formRef" @submit.stop.prevent="submitForm()">
                  <div id="contact-aria-live" aria-live="assertive"></div>

                  <FormField width="wide" :has-gutter="false">
                    <template #default>
                      <InputTextWithLabel
                        id="fullName"
                        v-model="state.fullName"
                        type="text"
                        :maxlength="fieldMaxLength('fullName')"
                        name="fullName"
                        placeholder="eg. Jane Smith"
                        label="Full name"
                        :error-message="formErrors?.fullName?._errors[0] ?? ''"
                        :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.fullName)"
                        :required="true"
                        input-variant="underlined"
                      >
                        <template #left>
                          <Icon name="radix-icons:person" class="icon" />
                        </template>
                      </InputTextWithLabel>
                    </template>
                  </FormField>

                  <FormField width="wide" :has-gutter="false">
                    <template #default>
                      <InputTextWithLabel
                        id="telNumber"
                        v-model="state.telNumber"
                        type="tel"
                        inputmode="tel"
                        :maxlength="fieldMaxLength('telNumber')"
                        name="telNumber"
                        placeholder="eg. 07700 900000"
                        label="Telephone number"
                        :error-message="formErrors?.telNumber?._errors[0] ?? ''"
                        :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.telNumber)"
                        :required="true"
                        input-variant="underlined"
                      >
                        <template #left>
                          <Icon name="lucide-phone" class="icon" />
                        </template>
                      </InputTextWithLabel>
                    </template>
                  </FormField>

                  <FormField width="wide" :has-gutter="false">
                    <template #default>
                      <InputTextWithLabel
                        id="emailAddress"
                        v-model="state.emailAddress"
                        type="email"
                        inputmode="email"
                        :maxlength="fieldMaxLength('emailAddress')"
                        name="emailAddress"
                        placeholder="eg. name@domain.com"
                        label="Email address"
                        :error-message="formErrors?.emailAddress?._errors[0] ?? ''"
                        :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.emailAddress)"
                        :required="true"
                        input-variant="underlined"
                      >
                        <template #left>
                          <Icon name="radix-icons:envelope-closed" class="icon" />
                        </template>
                      </InputTextWithLabel>
                    </template>
                  </FormField>

                  <FormField v-if="servicesData !== null" width="wide" :has-gutter="false">
                    <template #default>
                      <MultipleCheckboxes
                        v-model="state.services"
                        v-model:field-data="servicesData"
                        name="services"
                        legend="Services of interest"
                        label="Select all that apply"
                        :error-message="formErrors?.services?._errors[0] ?? ''"
                        :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.services)"
                        options-layout="inline"
                        :is-button="true"
                        :is-pill="false"
                        input-variant="underlined"
                      >
                        <template #descriptionText>Choose one or more services you're interested in.</template>
                      </MultipleCheckboxes>
                    </template>
                  </FormField>

                  <FormField width="wide" :has-gutter="false">
                    <template #default>
                      <InputTextareaWithLabel
                        v-model="state.comments"
                        :maxlength="fieldMaxLength('comments')"
                        name="comments"
                        placeholder="Tell us a bit more about what you're looking for…"
                        label="Comments"
                        :error-message="formErrors?.comments?._errors[0] ?? ''"
                        :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.comments)"
                        input-variant="underlined"
                      >
                        <template #descriptionText>Optional — any extra information that might help us.</template>
                      </InputTextareaWithLabel>
                    </template>
                  </FormField>

                  <FormField width="wide" :has-gutter="false">
                    <template #default>
                      <InputButtonCore
                        type="submit"
                        :is-pending="zodFormControl.displayLoader"
                        :readonly="zodFormControl.submitDisabled"
                        button-text="Send enquiry"
                        @click.stop.prevent="submitForm()"
                      />
                    </template>
                  </FormField>
                </form>
              </ClientOnly>
            </template>
          </ContactSection>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { IFormMultipleOptions } from "~/types/forms/types.forms";

type ReturnTypeUseZodValidation = ReturnType<typeof useZodValidation>;

definePageMeta({
  layout: false,
});

useHead({
  title: "Contact Section",
  meta: [
    {
      name: "description",
      content: "Contact Section Meta description content",
    },
  ],
  bodyAttrs: {
    class: "contact-section-page",
  },
});

// Fetch the real services list from the existing API endpoint.
// Transform the raw service objects into the IFormMultipleOptions shape
// that MultipleCheckboxes expects: { id, name, value, label }[].
// Fetch the real services list from the existing API endpoint.
// Transform the raw service objects into the IFormMultipleOptions shape
// that MultipleCheckboxes expects: { id, name, value, label }[].
type ServiceItem = { slug: string; title: string };
const { data: servicesData } = await useFetch<IFormMultipleOptions>("/api/services", {
  transform: (raw) => {
    const services = raw as unknown as ServiceItem[];
    return {
      data: services.map((s) => ({ id: s.slug, name: "services", value: s.slug, label: s.title })),
      total: services.length,
      skip: 0,
      limit: services.length,
    };
  },
});

const formSchema = z.object({
  fullName: z
    .string({ error: (i) => (i.input === undefined ? "Full name is required" : "Full name must be a string") })
    .trim()
    .min(2, "Name is too short")
    .max(80, "Name is too long"),
  telNumber: z
    .string({
      error: (i) => (i.input === undefined ? "Telephone number is required" : "Telephone number must be a string"),
    })
    .trim()
    .min(7, "Telephone number is too short")
    .max(20, "Telephone number is too long"),
  emailAddress: z
    .string({ error: (i) => (i.input === undefined ? "Email address is required" : "Email address must be a string") })
    .email({ error: "Invalid email address" }),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  comments: z.string().trim().max(500, "Comments must be 500 characters or fewer").optional(),
});

type FormSchema = z.infer<typeof formSchema>;
const formErrors = computed<z.ZodFormattedError<FormSchema> | null>(() => zodErrorObj.value);

const state = reactive({
  fullName: "",
  telNumber: "",
  emailAddress: "",
  services: [] as string[],
  comments: "",
});

const formRef = ref<HTMLFormElement | null>(null);

const { initZodForm, zodFormControl, zodErrorObj, doZodValidate, fieldMaxLength, scrollToFirstError } =
  useZodValidation<typeof formSchema>(formSchema, formRef) as ReturnTypeUseZodValidation;

initZodForm();

const submitForm = async () => {
  zodFormControl.submitAttempted = true;
  if (!(await doZodValidate(state))) {
    scrollToFirstError();
    return;
  }
  zodFormControl.displayLoader = true;
  try {
    // POST validated form data to the server route — Resend is called server-side
    await $fetch("/api/contact", { method: "POST", body: state });
    zodFormControl.submitSuccessful = true;
  } catch (error) {
    // Server-side failures (e.g. Resend API error) surface here
    console.warn("Contact form submission failed", error);
  } finally {
    zodFormControl.displayLoader = false;
  }
};

watch(
  () => state,
  () => {
    doZodValidate(state);
  },
  { deep: true }
);
</script>

<style lang="css">
.contact-section-page {
  .contact-section {
    /* max-inline-size: 800px; */
    margin-inline: auto;
  }
}
</style>
