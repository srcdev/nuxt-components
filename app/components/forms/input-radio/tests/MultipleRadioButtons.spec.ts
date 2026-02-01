// https://nuxt.com/docs/getting-started/testing#unit-testing
import { describe, it, expect } from 'vitest';
import { VueWrapper } from '@vue/test-utils';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ComponentUnderTest from '../MultipleRadioButtons.vue';
import tagsData from './data/tags.json';

let initialPropsData = {
  dataTestid: 'multiple-radio-buttons',
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

describe('MultipleRadioButtons Component', () => {
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

  it('updates radio modelValue when items clicked', async () => {
    const modelValue = ref<string>('');
    const propsData = {
      modelValue,
    };
    wrapper = await wrapperFactory(propsData);

    /*
     * Test the first radio button
     **/
    const radiobuttonElements = wrapper.findAll('input[type="radio"]');
    const firstRadioButton = radiobuttonElements[0];
    expect(firstRadioButton.attributes('aria-checked')).toBe('false');
    const firstRadioButtonTrueValue = firstRadioButton.attributes('true-value');

    await firstRadioButton.trigger('click');
    wrapper.vm.modelValue.value = firstRadioButtonTrueValue;
    expect(firstRadioButton.attributes('aria-checked')).toBe('true');
    expect(wrapper.vm.modelValue.value).toEqual(firstRadioButtonTrueValue);

    /*
     * Test the second radio button
     **/
    const secondRadioButton = radiobuttonElements[1];
    expect(secondRadioButton.attributes('aria-checked')).toBe('false');
    const secondRadioButtonTrueValue = secondRadioButton.attributes('true-value');

    await secondRadioButton.trigger('click');
    wrapper.vm.modelValue.value = secondRadioButtonTrueValue;
    expect(firstRadioButton.attributes('aria-checked')).toBe('false');
    expect(secondRadioButton.attributes('aria-checked')).toBe('true');
    expect(wrapper.vm.modelValue.value).toEqual(secondRadioButtonTrueValue);
  });
});
