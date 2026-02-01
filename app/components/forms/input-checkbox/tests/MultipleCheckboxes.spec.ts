// https://nuxt.com/docs/getting-started/testing#unit-testing
import { describe, it, expect } from 'vitest';
import { VueWrapper } from '@vue/test-utils';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ComponentUnderTest from '../MultipleCheckboxes.vue';
import tagsData from './data/tags.json';

let initialPropsData = {
  dataTestid: 'multiple-checkboxes',
  id: 'tags',
  name: 'tags',
  legend: 'Choose tags (as checkboxes)',
  required: true,
  label: 'Check between 3 and 8 tags',
  placeholder: 'eg. Type something here',
  isButton: true,
  errorMessage: 'Please select between 3 and 8 tags',
  fieldHasError: false,
  fieldData: tagsData,
  size: 'small',
  optionsLayout: 'inline',
  styleClassPassthrough: ['testClass'],
  theme: 'primary',
};

const initialSlots = {
  checkedIcon: () => ``,
  itemIcon: () => `<Icon name="material-symbols:add-2" class="icon" />`,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}, slotsData = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };
  const mockSlotsData = { ...initialSlots, ...slotsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
    slots: mockSlotsData,
  });
};

describe('MultipleCheckboxes Component', () => {
  it('Mounts', async () => {
    wrapper = await wrapperFactory();
    expect(wrapper).toBeTruthy();
  });

  it('renders properly', async () => {
    wrapper = await wrapperFactory();
    const dataTestIdElem = wrapper.attributes('data-testid');
    expect(dataTestIdElem).toBe(initialPropsData.dataTestid);
    expect(wrapper.find('[data-testid]').classes()).toContain('testClass');
  });

  it('updates checkbox modelValue when items clicked', async () => {
    const modelValue = ref<string[]>([]);
    const propsData = {
      modelValue,
    };
    wrapper = await wrapperFactory(propsData);
    const checkboxElements = wrapper.findAll('input[type="checkbox"]');

    /*
     * Test the first checkbox checked
     **/
    const firstCheckbox = checkboxElements[0];
    expect(firstCheckbox.attributes('aria-checked')).toBe('false');
    const firstCheckboxTrueValue = firstCheckbox.attributes('true-value');

    await firstCheckbox.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    const firstEmittedEvents = wrapper.emitted('update:modelValue');
    if (firstEmittedEvents && firstEmittedEvents[0]) {
      expect(firstEmittedEvents[0]).includes(firstCheckboxTrueValue);
    }

    expect(firstCheckbox.attributes('aria-checked')).toBe('true');

    /*
     * Test the second checkbox chekced
     **/
    const secondCheckbox = checkboxElements[1];
    expect(secondCheckbox.attributes('aria-checked')).toBe('false');
    const secondCheckboxTrueValue = secondCheckbox.attributes('true-value');

    await secondCheckbox.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    const secondEmittedEvents = wrapper.emitted('update:modelValue');
    if (secondEmittedEvents && secondEmittedEvents[0]) {
      expect(secondEmittedEvents[1]).includes(secondCheckboxTrueValue);
    }

    expect(secondCheckbox.attributes('aria-checked')).toBe('true');
  });
});
