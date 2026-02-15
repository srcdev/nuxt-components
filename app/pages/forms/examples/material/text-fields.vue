<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <ContentGrid>
          <template #slot1>
            <div>
              <h1 class="header-1">Example form</h1>
              <p class="body-normal">Use 'test@test.com' to trigger server errors</p>
            </div>
          </template>
        </ContentGrid>
        <ContentGrid>
          <template #slot1>
            <p>Themes switcher</p>
            <ul class="flex-group">
              <li>
                <InputButtonCore
                  type="button"
                  :is-pending="false"
                  button-text="Primary"
                  theme="primary"
                  size="default"
                  @click.stop.prevent="swapTheme('primary')"
                />
              </li>
              <li>
                <InputButtonCore
                  type="button"
                  :is-pending="false"
                  button-text="Secondary"
                  theme="secondary"
                  size="default"
                  @click.stop.prevent="swapTheme('secondary')"
                />
              </li>
              <li>
                <InputButtonCore
                  type="button"
                  :is-pending="false"
                  button-text="Warning"
                  theme="warning"
                  size="default"
                  @click.stop.prevent="swapTheme('warning')"
                />
              </li>
              <li>
                <InputButtonCore
                  type="button"
                  :is-pending="false"
                  button-text="Success"
                  theme="success"
                  size="default"
                  @click.stop.prevent="swapTheme('success')"
                />
              </li>
              <li>
                <InputButtonCore
                  type="button"
                  :is-pending="false"
                  button-text="Error"
                  theme="error"
                  size="default"
                  @click.stop.prevent="swapTheme('error')"
                />
              </li>
            </ul>

            <p>Size switcher - current size &raquo; {{ size }}</p>
            <p>
              <span class="body-normal-semibold">Note:</span>
              Only small and normal optimized for general usage
            </p>
            <ul class="flex-group">
              <li>
                <InputButtonCore
                  type="button"
                  :is-pending="false"
                  button-text="X-Small"
                  theme="primary"
                  size="x-small"
                  @click.stop.prevent="swapSize('x-small')"
                />
              </li>
              <li>
                <InputButtonCore
                  type="button"
                  :is-pending="false"
                  button-text="Small"
                  theme="primary"
                  size="small"
                  @click.stop.prevent="swapSize('small')"
                />
              </li>
              <li>
                <InputButtonCore
                  type="button"
                  :is-pending="false"
                  button-text="Default"
                  theme="primary"
                  size="default"
                  @click.stop.prevent="swapSize('default')"
                />
              </li>
              <li>
                <InputButtonCore
                  type="button"
                  :is-pending="false"
                  button-text="Medium"
                  theme="primary"
                  size="medium"
                  @click.stop.prevent="swapSize('medium')"
                />
              </li>
              <li>
                <InputButtonCore
                  type="button"
                  :is-pending="false"
                  button-text="Large"
                  theme="primary"
                  size="large"
                  @click.stop.prevent="swapSize('large')"
                />
              </li>
            </ul>

            <p>Select type of text input to display</p>
            <ul class="flex-group">
              <li>
                <InputButtonCore
                  type="button"
                  button-text="Normal"
                  theme="primary"
                  size="default"
                  @click.stop.prevent="inputVariant = 'normal'"
                />
              </li>
              <li>
                <InputButtonCore
                  type="button"
                  button-text="Underlined"
                  theme="primary"
                  size="default"
                  @click.stop.prevent="inputVariant = 'underlined'"
                />
              </li>
            </ul>

            <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
              <h1 class="page-heading-1 mbe-18">Settings</h1>
              <h2 class="page-heading-2 mbe-18">Theme Switcher</h2>

              <DisplayThemeSwitch />
            </LayoutRow>

            <FormWrapper width="medium">
              <template #default>
                <ClientOnly>
                  <form ref="formRef" class="form-wrapper" @submit.stop.prevent="submitForm()">
                    <div id="aria-live-message" aria-live="assertive"></div>

                    <FormField v-if="countriesData !== null" width="wide" :has-gutter="false">
                      <template #default>
                        <InputSelectWithLabel
                          v-model="state.countrySelect"
                          v-model:field-data="countriesData"
                          name="countrySelect"
                          :required="true"
                          label="Where are you from?"
                          placeholder="Please select a country"
                          :error-message="formErrors?.countrySelect?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.countrySelect)"
                          :theme
                          :size
                          :input-variant
                        >
                          <template #descriptionText>This is a descriptionText for the message input.</template>
                        </InputSelectWithLabel>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <InputTextWithLabel
                          id="emailAddress"
                          v-model="state.emailAddress"
                          type="email"
                          inputmode="email"
                          :maxlength="fieldMaxLength('email')"
                          name="emailAddress"
                          placeholder="eg. name@domain.com"
                          label="Email address"
                          :error-message="formErrors?.emailAddress?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.emailAddress)"
                          :required="true"
                          :style-class-passthrough="['style-1', 'style-2']"
                          :theme
                          :size
                          :input-variant
                        >
                          <template #descriptionText>This is a descriptionText for the email input.</template>
                          <template #left>
                            <Icon name="radix-icons:envelope-closed" class="icon" />
                          </template>
                          <template #right>
                            <Icon name="radix-icons:envelope-closed" class="icon" />
                          </template>
                        </InputTextWithLabel>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <InputTextWithLabel
                          id="username"
                          v-model="state.username"
                          type="text"
                          :maxlength="fieldMaxLength('username')"
                          name="username"
                          placeholder="eg. JoeBloggs1"
                          label="Username"
                          :error-message="formErrors?.username?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.username)"
                          :required="true"
                          :style-class-passthrough="['style-1', 'style-2']"
                          :theme
                          :size
                          :input-variant
                        >
                          <template #descriptionHtml>
                            <p class="mbs-4 mbe-8" style="font-weight: 900">
                              This is a descriptionHtml for the email input.
                            </p>
                          </template>
                          <template #left>
                            <Icon name="radix-icons:person" class="icon" />
                          </template>
                        </InputTextWithLabel>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <InputPasswordWithLabel
                          id="password"
                          v-model="state.password"
                          :maxlength="fieldMaxLength('password')"
                          name="password"
                          placeholder="eg. a mixure of numbers and letters"
                          label="Password"
                          :error-message="formErrors?.password?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.password)"
                          :required="true"
                          :style-class-passthrough="['style-1', 'style-2']"
                          :theme
                          :size
                          :input-variant
                        >
                          <template #right>
                            <Icon name="radix-icons:eye-open" class="icon" />
                          </template>
                        </InputPasswordWithLabel>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <InputTextareaWithLabel
                          v-model="state.message"
                          :maxlength="fieldMaxLength('message')"
                          name="message"
                          placeholder="Type your message here"
                          label="Your message"
                          :error-message="formErrors?.message?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.message)"
                          :required="true"
                          :style-class-passthrough="['style-1', 'style-2']"
                          :theme
                          :size
                          :input-variant
                        >
                          <template #descriptionText>This is a descriptionText for the message input.</template>
                        </InputTextareaWithLabel>
                      </template>
                    </FormField>

                    <FormField v-if="tagsData !== null" width="wide" :has-gutter="false">
                      <template #default>
                        <MultipleCheckboxes
                          v-model="state.tags"
                          v-model:field-data="tagsData"
                          name="tags"
                          legend="Choose tags (MultipleCheckboxes)"
                          :required="true"
                          label="Check between 3 and 8 tags"
                          placeholder="eg. Type something here"
                          :is-button="true"
                          :error-message="formErrors?.tags?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.tags)"
                          options-layout="inline"
                          :theme
                          :size
                          :display-as-disc="false"
                        >
                          <template #descriptionText>MultipleCheckboxes description: optionsLayout = 'inline'</template>
                          <template #itemIcon>
                            <Icon name="material-symbols:bookmark-add-outline" class="icon" />
                          </template>
                        </MultipleCheckboxes>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <ToggleSwitchWithLabel
                          v-model="state.darkMode"
                          name="darkMode"
                          label="Toggle Dark mode"
                          true-value="dark"
                          false-value="light"
                          :theme
                          :size
                        >
                          <template #description>
                            <p class="label-description">Light or Dark mode?</p>
                          </template>
                          <template #iconOn>
                            <Icon name="radix-icons:sun" class="icon" />
                          </template>
                          <template #iconOff>
                            <Icon name="radix-icons:moon" class="icon" />
                          </template>
                        </ToggleSwitchWithLabel>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <ToggleSwitchWithLabelInline
                          v-model="state.anotherToggle"
                          name="anotherToggle"
                          label="Toggle Dark mode (inline)"
                          :theme
                          size="small"
                        >
                          <template #iconOn>
                            <Icon name="radix-icons:moon" class="icon" />
                          </template>
                          <template #iconOff>
                            <Icon name="radix-icons:sun" class="icon" />
                          </template>
                        </ToggleSwitchWithLabelInline>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <ToggleSwitchWithLabel
                          v-model="state.toggleBoolean"
                          :error-message="formErrors?.toggleBoolean?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.toggleBoolean)"
                          name="toggleBoolean"
                          label="Toggle Dark mode"
                          :theme
                          :size
                        >
                          <template #description>
                            <p class="label-description">Toggle some value</p>
                          </template>
                        </ToggleSwitchWithLabel>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <InputTextAsNumberWithLabel
                          v-model.number="state.count2"
                          :maxlength="fieldMaxLength('count2')"
                          :min="25"
                          :max="75"
                          :step="5"
                          name="count2"
                          placeholder="eg. 10"
                          label="How many things? Between 25 & 75"
                          :error-message="formErrors?.count2?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.count2)"
                          :required="true"
                          :style-class-passthrough="['style-1', 'style-2']"
                          :theme
                          :size
                        >
                          <template #description>
                            <p class="label-description">Input type="text" inputmode="numeric"</p>
                          </template>
                          <template #left>
                            <Icon name="gridicons:minus-small" class="icon" />
                          </template>
                          <template #right>
                            <Icon name="gridicons:plus-small" class="icon" />
                          </template>
                        </InputTextAsNumberWithLabel>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <InputNumberDefault
                          v-model.number="state.count"
                          name="count"
                          label="How many things? Between 25 & 75 , step 5"
                          :min="25"
                          :max="75"
                          :step="5"
                          placeholder="eg. What\'s your count?"
                          :error-message="formErrors?.count?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.count)"
                          :required="true"
                          :style-class-passthrough="['count-1', 'count-2']"
                          :theme
                          :size
                        >
                          <template #description>
                            <p class="label-description">Input type="number" inputmode="numeric"</p>
                          </template>
                          <template #left>
                            <Icon name="gridicons:minus-small" class="icon" />
                          </template>
                          <template #right>
                            <Icon name="gridicons:plus-small" class="icon" />
                          </template>
                        </InputNumberDefault>
                      </template>
                    </FormField>

                    <FormField v-if="tagsData !== null" width="wide" :has-gutter="false">
                      <template #default>
                        <MultipleRadiobuttons
                          v-model="state.tagsRadio"
                          v-model:field-data="tagsData"
                          name="tagsRadio"
                          legend="Choose tags (as radiobuttons)"
                          :required="true"
                          label="Check between 3 and 8 tags"
                          placeholder="eg. Type something here"
                          :is-button="true"
                          :error-message="formErrors?.tagsRadio?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.tagsRadio)"
                          options-layout="inline"
                          :theme
                          :size
                          direction="row-reverse"
                        >
                          <template #description>
                            <p class="label-description">This is description: optionsLayout = 'inline'</p>
                          </template>
                        </MultipleRadiobuttons>
                      </template>
                    </FormField>

                    <FormField
                      width="wide"
                      :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.score)"
                      :has-gutter="false"
                    >
                      <template #default>
                        <InputRangeDefault
                          v-model.number="state.score"
                          name="score"
                          label="Score between 0 & 100"
                          :min="0"
                          :max="100"
                          :step="10"
                          placeholder="eg. What\'s your score?"
                          :error-message="formErrors?.score?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.score)"
                          :required="true"
                          :style-class-passthrough="['style-1', 'style-2']"
                          :theme
                          :size
                        >
                          <template #description>
                            <p class="label-description">This is a description of what the user is required to do</p>
                          </template>
                          <template #datalist>
                            <datalist id="score-datalist" class="input-range-datalist">
                              <option value="0" label="Rubbish!"></option>
                              <option value="25" label="Below par"></option>
                              <option value="50" label="Average"></option>
                              <option value="75" label="Quite good"></option>
                              <option value="100" label="Excellent"></option>
                            </datalist>
                          </template>
                          <template #left>
                            <Icon name="gridicons:minus-small" class="icon" />
                          </template>
                          <template #right>
                            <Icon name="gridicons:plus-small" class="icon" />
                          </template>
                        </InputRangeDefault>
                      </template>
                    </FormField>

                    <FormField v-if="titleData !== null" width="wide" :has-gutter="false">
                      <template #default>
                        <MultipleRadiobuttons
                          v-model="state.title"
                          v-model:field-data="titleData"
                          name="title"
                          legend="What is your title"
                          :required="true"
                          label="Check one"
                          placeholder="eg. Type something here"
                          :error-message="formErrors?.title?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.title)"
                          options-layout="equal-widths"
                          :theme
                          :size
                        >
                          <template #checkedIcon>
                            <Icon name="material-symbols:check-small" class="input-checked-icon" />
                          </template>
                          <template #description>
                            <p class="label-description">
                              NOTE: Custom chefck icon set via slot
                              <br />
                              This is description: optionsLayout = 'equal-widths/inline'
                            </p>
                          </template>
                        </MultipleRadiobuttons>
                      </template>
                    </FormField>

                    <FormField v-if="titleData !== null" width="wide" :has-gutter="false">
                      <template #default>
                        <MultipleRadiobuttons
                          v-model="state.otherTitle"
                          v-model:field-data="titleData"
                          name="otherTitle"
                          legend="What is your title"
                          :required="true"
                          label="Check one"
                          placeholder="eg. Type something here"
                          :error-message="formErrors?.otherTitle?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.otherTitle)"
                          options-layout="equal-widths"
                          :theme
                          :size
                        >
                          <template #description>
                            <p class="label-description">This is description: optionsLayout = 'equal-widths/inline'</p>
                          </template>
                        </MultipleRadiobuttons>
                      </template>
                    </FormField>

                    <FormField v-if="citiesData !== null" width="wide" :has-gutter="false">
                      <template #default>
                        <MultipleCheckboxes
                          v-model="state.cities"
                          v-model:field-data="citiesData"
                          name="cities"
                          legend="Choose a location"
                          :required="true"
                          label="Check all Cities you like"
                          placeholder="eg. Type something here"
                          :error-message="formErrors?.cities?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.cities)"
                          options-layout="inline"
                          :theme
                          :size
                        >
                          <template #description>
                            <p class="label-description">This is description: optionsLayout = 'equal-widths'</p>
                          </template>
                        </MultipleCheckboxes>
                      </template>
                    </FormField>

                    <FormField v-if="countriesData !== null" width="wide" :has-gutter="false">
                      <template #default>
                        <MultipleCheckboxes
                          v-model="state.countries"
                          v-model:field-data="countriesData"
                          name="countries"
                          legend="Choose a country"
                          :required="true"
                          label="Check all Countries you like"
                          placeholder="eg. Type something here"
                          :error-message="formErrors?.countries?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.countries)"
                          options-layout="equal-widths"
                          :theme
                          :size
                        >
                          <template #checkedIcon>
                            <Icon name="material-symbols:circle" class="input-checked-icon" />
                          </template>
                          <template #description>
                            <p class="label-description">
                              NOTE: Custom chefck icon set via slot
                              <br />
                              This is description: optionsLayout = 'inline'
                            </p>
                          </template>
                        </MultipleCheckboxes>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <SingleCheckbox
                          v-model="state.agreed"
                          name="agreed"
                          legend="I agree (label with description)"
                          label="Click to agree to something"
                          :required="true"
                          :error-message="formErrors?.agreed?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.agreed)"
                          :theme
                          :size
                        >
                          <template #description>
                            <p class="label-description">
                              You must
                              <strong>agree</strong>
                              to continue
                            </p>
                          </template>
                        </SingleCheckbox>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <SingleCheckbox
                          v-model="state.agree"
                          name="agree"
                          legend="I agree (label no description)"
                          label="Click to agree to something"
                          :required="true"
                          :error-message="formErrors?.agree?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.agree)"
                          :theme
                          :size
                        />
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <SingleCheckbox
                          v-model="state.terms"
                          name="terms"
                          legend="Terms and conditions"
                          :required="true"
                          :error-message="formErrors?.terms?._errors[0] ?? ''"
                          :field-has-error="Boolean(zodFormControl.submitAttempted && formErrors?.terms)"
                          :theme
                          :size
                        >
                          <template #labelContent>
                            <span class="body-normal">
                              You must agree to our
                              <NuxtLink to="/typography" class="link-normal">terms and conditions</NuxtLink>
                              to continue
                            </span>
                          </template>
                        </SingleCheckbox>
                      </template>
                    </FormField>

                    <FormField width="wide" :has-gutter="false">
                      <template #default>
                        <InputButtonCore
                          type="button"
                          :is-pending="false"
                          :readonly="zodFormControl.submitDisabled"
                          button-text="Submit"
                          :theme
                          :size
                          @click.stop.prevent="submitForm()"
                        />
                      </template>
                    </FormField>
                  </form>
                </ClientOnly>
              </template>
            </FormWrapper>
          </template>
          <template #slot2>
            <ClientOnly>
              <p>Client only state</p>
              <pre>
                {{ state }}
              </pre>
              <p>Client only zodFormControl</p>
              <pre>
                {{ zodFormControl }}
              </pre>
              <p>Client only formErrors</p>

              <pre>
                {{ formErrors }}
              </pre>
            </ClientOnly>
          </template>
        </ContentGrid>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { IFormMultipleOptions, FormTheme, FormSize, InputVariant } from "~/types/forms/types.forms";

definePageMeta({
  layout: false,
});

useHead({
  title: "Text Field Example",
  meta: [{ name: "description", content: "Homepage" }],
  bodyAttrs: {
    class: "text-fields-page",
  },
});

const inputVariant = ref<InputVariant>("underlined");
// const inputVariantData = ref<IFormMultipleOptions>({
//   data: [
//     {
//       id: 'normal',
//       name: 'normal',
//       value: 'normal',
//       label: 'Normal',
//     },
//     {
//       id: 'outlined',
//       name: 'outlined',
//       value: 'outlined',
//       label: 'Material - Outlined',
//     },
//     {
//       id: 'underlined',
//       name: 'underlined',
//       value: 'underlined',
//       label: 'Material - Underlined',
//     },
//   ],
//   total: 3,
//   skip: 0,
//   limit: 3,
// });
const theme = ref<FormTheme>("primary");
const size = ref<FormSize>("default");
const swapTheme = (newTheme: FormTheme) => {
  theme.value = newTheme;
};
const swapSize = (newSize: FormSize) => {
  size.value = newSize;
};

/*
 * Fetch some sample data
 **/
const { data: citiesData } = await useFetch<IFormMultipleOptions>("/api/places/list?category=cities");
const { data: countriesData } = await useFetch<IFormMultipleOptions>("/api/places/list?category=countries");
const { data: titleData } = await useFetch<IFormMultipleOptions>("/api/utils?category=title");
const { data: tagsData } = await useFetch<IFormMultipleOptions>("/api/recipes/tags");

/*
 * Setup forms
 */
const formSchema = reactive(
  z
    .object({
      emailAddress: z
        .string({
          error: (issue) =>
            issue.input === undefined ? "Email address is required" : "Email address must be a string",
        })
        .email({ error: "Invalid email address" })
        .refine((email) => email !== zodFormControl.previousState.emailAddress.value, {
          error: "This email address has already been used",
        }),
      username: z
        .string({
          error: (issue) => (issue.input === undefined ? "Username is required" : "Username must be a string"),
        })
        .trim()
        .min(2, "Username is too short")
        .max(25, "Username is too long")
        .refine((email) => email !== zodFormControl.previousState.username.value, {
          error: "This username has already been used",
        }),
      password: z
        .string()
        .trim()
        .min(8, "Password is too short")
        .max(25, "Password is too long")
        .refine((email) => email !== zodFormControl.previousState.password.value, {
          error: "You've already used this password",
        }),
      message: z.string().trim().min(2, "Message is too short").max(255, "Message is too long"),
      count: z
        .number({
          error: (issue) => (issue.input === undefined ? "Count is required" : "Count must be a number"),
        })
        .int({ error: "Count must be a whole number" })
        .gte(25, "Count must be between 25 and 75")
        .lte(75, "Count must be between 25 and 75")
        .multipleOf(5, "Count must be a multiple of 5"),
      count2: z
        .number({
          error: (issue) => (issue.input === undefined ? "Count is required" : "Count must be a number"),
        })
        .int({ error: "Count must be a whole number" })
        .gte(25, "Count must be between 25 and 75")
        .lte(75, "Count must be between 25 and 75"),
      score: z
        .number({
          error: (issue) => (issue.input === undefined ? "Score is required" : "Score must be a number"),
        })
        .gte(0)
        .lte(100),
      cities: z.array(z.string()).min(1, "Please select at least one city"),
      countries: z
        .array(z.string())
        .min(2, "Please select at least 2 countries")
        .max(5, "Please select no more than 5 countries"),
      countrySelect: z.string().min(1, { error: "Please select a country" }),
      tags: z.array(z.string()).min(3, "Please select at least 3 tags").max(8, "Please select no more than 8 tags"),
      tagsRadio: z.string().min(1, { error: "Please choose a tag" }),
      darkMode: z.string().min(1, { error: "Please choose a mode" }),
      title: z.string().min(1, { error: "Title is required" }),
      otherTitle: z.string().min(1, { error: "Title is required" }),
      toggleBoolean: z.boolean().refine((val) => val === true, { error: "You must tick this box" }),
      agreed: z.boolean().refine((val) => val === true, { error: "You must tick this box" }),
      agree: z.boolean().refine((val) => val === true, { error: "You must tick this box" }),
      terms: z.boolean().refine((val) => val === true, { error: "You must accept our terms" }),
    })
    .required({
      emailAddress: true,
      username: true,
      password: true,
      message: true,
      count: true,
      count2: true,
      score: true,
      cities: true,
      countries: true,
      countrySelect: true,
      tags: true,
      tagsRadio: true,
      title: true,
      otherTitle: true,
      toggleBoolean: true,
      agreed: true,
      agree: true,
      terms: true,
    })
);

type formSchema = z.infer<typeof formSchema>;
const formErrors = computed<z.ZodFormattedError<formSchema> | null>(() => zodErrorObj.value);

const state = reactive({
  emailAddress: "",
  username: "",
  password: "",
  message: "",
  count: 25,
  count2: 25,
  score: 50,
  cities: [],
  countries: [],
  countrySelect: "",
  tags: [],
  tagsRadio: [],
  title: "",
  otherTitle: "",
  darkMode: "light",
  toggleBoolean: false,
  anotherToggle: false,
  agreed: false,
  agree: false,
  terms: false,
});

const formRef = ref<HTMLFormElement | null>(null);

const {
  initZodForm,
  zodFormControl,
  zodErrorObj,
  // formErrors,
  pushCustomErrors,
  doZodValidate,
  fieldMaxLength,
  scrollToFirstError,
  // scrollToFormHead,
} = useZodValidation(formSchema, formRef);

initZodForm();

const submitForm = async () => {
  zodFormControl.submitAttempted = true;
  if (!(await doZodValidate(state))) {
    scrollToFirstError();
    return;
  }
  zodFormControl.displayLoader = true;
  try {
    console.log("Form valid - post it");
    const data = await $fetch("/api/textFields", {
      method: "post",
      body: state,
      async onResponse({ response }) {
        if (response.status === 400) {
          console.log("onResponse", response);
          console.log(response.status);

          // useApiErrors(response._data.data.errors);
          // for (const [key, message] of Object.entries(response._data.data.errors)) {
          //   console.log(`${key}: ${message}`);
          //   updateErrorMessages(key, message);
          // }

          // if (error instanceof Error) {
          await pushCustomErrors(response._data, state);
          // zodFormControl.formIsValid = false;
          // }
          // zodFormControl.submitAttempted = false;
        }
        if (response.status === 200) {
          zodFormControl.submitSuccessful = true;
        }
      },
    });
    console.log("3: Finished data", data);
    // return data;
  } catch (error) {
    console.warn("2: An error occured posting form data", error);
  } finally {
    zodFormControl.displayLoader = false;
  }
};

watch(
  () => state,
  () => {
    // console.log('Watching state');
    doZodValidate(state);
  },
  { deep: true }
);
</script>

<style lang="css">
.text-fields-page {
  .layout-row {
    .ui-content-grid {
      --_margin-inline: 12px;
    }
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

.header-1 {
  font-family: var(--font-family);
  color: var(--brand-success-text-text);
}
</style>
