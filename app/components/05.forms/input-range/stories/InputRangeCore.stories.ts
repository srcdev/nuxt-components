import type { Meta, StoryFn } from "@nuxtjs/storybook";
import { ref } from "vue";
import StorybookComponent from "../InputRangeCore.vue";

interface InputRangeCoreStoryArgs {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  required: boolean;
  fieldHasError: boolean;
  weight: string;
}

export default {
  title: "Components/Forms/Input Range/InputRangeCore",
  component: StorybookComponent,
  argTypes: {
    id: { control: "text", table: { category: "Basic" } },
    name: { control: "text", table: { category: "Basic" } },
    min: { control: "number", table: { category: "Basic" } },
    max: { control: "number", table: { category: "Basic" } },
    step: { control: "number", table: { category: "Basic" } },
    required: { control: "boolean", table: { category: "Basic" } },
    fieldHasError: { control: "boolean", table: { category: "States" } },
    weight: { control: "text", table: { category: "Styling" } },
  },
  args: {
    id: "range-default",
    name: "rangeDefault",
    min: 0,
    max: 100,
    step: 1,
    required: false,
    fieldHasError: false,
    weight: "normal",
  },
} as Meta<InputRangeCoreStoryArgs>;

const Template: StoryFn<InputRangeCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref(50);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      <StorybookComponent v-bind="args" v-model="modelValue" />
    </div>
  `,
});

export const Default = Template.bind({});

export const ErrorState = Template.bind({});
ErrorState.args = { fieldHasError: true };

const WithStepButtonsTemplate: StoryFn<InputRangeCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref(50);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      <StorybookComponent v-bind="args" v-model="modelValue">
        <template #left>
          <button type="button" @click="modelValue = Math.max(args.min, modelValue - args.step)">−</button>
        </template>
        <template #right>
          <button type="button" @click="modelValue = Math.min(args.max, modelValue + args.step)">+</button>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const WithStepButtons = WithStepButtonsTemplate.bind({});

const WithMarkersTemplate: StoryFn<InputRangeCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref(50);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      <StorybookComponent v-bind="args" v-model="modelValue">
        <template #markers>
          <div class="input-range-markers">
            <div class="marker"><span class="marker-icon">😀</span></div>
            <div class="marker"><span class="marker-icon">🙂</span></div>
            <div class="marker"><span class="marker-icon">😐</span></div>
          </div>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const WithMarkers = WithMarkersTemplate.bind({});
WithMarkers.args = { min: 0, max: 2, step: 1 };

const WithDatalistTemplate: StoryFn<InputRangeCoreStoryArgs> = (args) => ({
  components: { StorybookComponent },
  setup() {
    const modelValue = ref(50);
    return { args, modelValue };
  },
  template: `
    <div style="margin: 36px; max-width: 320px;">
      <StorybookComponent v-bind="args" v-model="modelValue">
        <template #datalist>
          <datalist :id="\`\${args.name}-datalist\`" class="input-range-datalist">
            <option value="0" label="Low"></option>
            <option value="50" label="Medium"></option>
            <option value="100" label="High"></option>
          </datalist>
        </template>
      </StorybookComponent>
    </div>
  `,
});

export const WithDatalist = WithDatalistTemplate.bind({});
