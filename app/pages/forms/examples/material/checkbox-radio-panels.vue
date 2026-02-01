<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <div>
          <h1 class="header-1">Checkbox/Radio panels</h1>
        </div>
        <ContentGrid>
          <template #slot1>
            <FormWrapper width="medium">
              <template #default>
                <ClientOnly>
                  <form class="form-wrapper" @submit.stop.prevent="submitForm()" ref="formRef">
                    <div aria-live="assertive" id="aria-live-message"></div>

                    <FormField v-if="limitedTags !== null" width="wide" :has-gutter="false">
                      <template #default>
                        <MultipleCheckboxes
                          name="tags"
                          legend="Choose tags (MultipleCheckboxes)"
                          :required="true"
                          label="Check between 3 and 8 tags"
                          placeholder="eg. Type something here"
                          :isButton="true"
                          :error-message="formErrors?.tags?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.tags)"
                          v-model="state.tags"
                          v-model:fieldData="limitedTags"
                          options-layout="inline"
                          :theme
                          :size
                          :display-as-disc="false"
                          :display-as-lozenge="false"
                        >
                          <template #descriptionText>MultipleCheckboxes description: optionsLayout = 'inline'</template>
                          <template #itemIcon>
                            <Icon name="material-symbols:bookmark-add-outline" class="icon" />
                          </template>
                        </MultipleCheckboxes>
                      </template>
                    </FormField>

                    <FormField v-if="limitedTags !== null" width="wide" :has-gutter="false">
                      <template #default>
                        <MultipleRadiobuttons
                          name="tagsRadio"
                          legend="Choose tags (as radiobuttons)"
                          :required="true"
                          label="Check between 3 and 8 tags"
                          placeholder="eg. Type something here"
                          :isButton="true"
                          :error-message="formErrors?.tagsRadio?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.tagsRadio)"
                          v-model="state.tagsRadio"
                          v-model:fieldData="limitedTags"
                          options-layout="inline"
                          :theme
                          :size
                          direction="row-reverse"
                          :display-as-lozenge="true"
                        >
                          <template #description>
                            <p class="label-description">This is description: optionsLayout = 'inline'</p>
                          </template>
                          <template #checkedIcon>
                            <Icon name="material-symbols:check-circle-rounded" class="icon" />
                          </template>
                        </MultipleRadiobuttons>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <InputButtonSubmit
                          type="button"
                          @click.stop.prevent="submitForm()"
                          :is-pending="false"
                          :readonly="zodFormControl.submitDisabled"
                          button-text="Submit"
                          :theme
                          :size
                        />
                      </template>
                    </FormField>
                  </form>
                </ClientOnly>
              </template>
            </FormWrapper>
          </template>
        </ContentGrid>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod"
import type { IFormMultipleOptions } from "../../../../../../shared/types/types.forms"

definePageMeta({
  layout: false,
})

useHead({
  title: "Text Field Example",
  meta: [{ name: "description", content: "Homepage" }],
  bodyAttrs: {
    class: "checkbox-radio-panels-page",
  },
})

const theme = ref("primary")
const size = ref<"x-small" | "small" | "default" | "medium" | "large">("default")

/*
 * Fetch some sample data
 **/
const { data: tagsData } = await useFetch<IFormMultipleOptions>("/api/recipes/tags")

// 1st 3 items from tagsData
const limitedTags = computed(() => {
  if (!tagsData.value) return null

  const count = 3
  const tags: IFormMultipleOptions = {
    data: tagsData.value.data.slice(0, count),
    total: count,
    skip: 0,
    limit: 3,
  }

  return tags
})

/*
 * Setup forms
 */
const formSchema = reactive(
  z
    .object({
      tags: z.array(z.string()).min(3, "Please select at least 3 tags").max(8, "Please select no more than 8 tags"),
      tagsRadio: z.string().min(1, { error: "Please choose a tag" }),
    })
    .required({
      tags: true,
      tagsRadio: true,
    })
)

type formSchema = z.infer<typeof formSchema>
const formErrors = computed<z.ZodFormattedError<formSchema> | null>(() => zodErrorObj.value)

const state = reactive({
  tags: ["pizza"],
  tagsRadio: "italian",
})

const formRef = ref<HTMLFormElement | null>(null)

const {
  initZodForm,
  zodFormControl,
  zodErrorObj,
  // formErrors,
  pushCustomErrors,
  doZodValidate,
  fieldMaxLength,
  scrollToFirstError,
  scrollToFormHead,
} = useZodValidation(formSchema, formRef)

initZodForm()

const submitForm = async () => {
  zodFormControl.submitAttempted = true
  if (!(await doZodValidate(state))) {
    scrollToFirstError()
    return
  }
  zodFormControl.displayLoader = true
  try {
    console.log("Form valid - post it")
    const data = await $fetch("/api/textFields", {
      method: "post",
      body: state,
      async onResponse({ response }) {
        if (response.status === 400) {
          console.log("onResponse", response)
          console.log(response.status)

          // useApiErrors(response._data.data.errors);
          // for (const [key, message] of Object.entries(response._data.data.errors)) {
          //   console.log(`${key}: ${message}`);
          //   updateErrorMessages(key, message);
          // }

          // if (error instanceof Error) {
          await pushCustomErrors(response._data, state)
          // zodFormControl.formIsValid = false;
          // }
          // zodFormControl.submitAttempted = false;
        }
        if (response.status === 200) {
          zodFormControl.submitSuccessful = true
        }
      },
    })
    console.log("3: Finished data", data)
    // return data;
  } catch (error) {
    console.warn("2: An error occured posting form data", error)
  } finally {
    zodFormControl.displayLoader = false
  }
}

watch(
  () => state,
  () => {
    // console.log('Watching state');
    doZodValidate(state)
  },
  { deep: true }
)
</script>

<style lang="css">
.checkbox-radio-panels-page {
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

.header-1 {
  font-family: var(--font-family);
  color: var(--brand-success-text-text);
}
</style>
