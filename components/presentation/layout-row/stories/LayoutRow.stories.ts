import type { Meta, StoryFn } from '@nuxtjs/storybook';
import LayoutRow from '../LayoutRow.vue';

export default {
  title: 'Components/UI/LayoutRow',
  component: LayoutRow,
  argTypes: {
    tag: {
      options: ['div', 'header', 'footer', 'section'],
      control: { type: 'select' },
    },
    variant: {
      options: [
        'full',
        'full-start',
        'full-end',
        'popout',
        'popout-start',
        'popout-end',
        'content',
        'content-start',
        'content-end',
        'inset-content',
        'inset-content-start',
        'inset-content-end',
        'full-width',
        'full-content',
        'full-content-nopad',
        'full-content',
      ],
      control: { type: 'select' },
    },
  },
} as Meta<typeof LayoutRow>;

const Template: StoryFn<typeof LayoutRow> = (args) => ({
  components: { LayoutRow },
  setup() {
    return { args };
  },
  template: `
    <LayoutRow v-bind="args">
      <template #default>${args.content}</template>
    </LayoutRow>
  `,
  // template: '<LayoutRow v-bind="args" />',
});

export const Primary = Template.bind({});
Primary.args = {
  tag: 'div',
  variant: 'full',
  styleClassPassthrough: ['mbe-20'],
  content: `
    <h2 class="heading-2">Full Track (1fr)</h2>
    <p>
      Lorem ipsum odor amet, consectetuer adipiscing elit. Nec elementum maecenas placerat laoreet curae elit convallis himenaeos. Tellus varius cursus convallis commodo suspendisse litora.
      Platea accumsan interdum ultrices adipiscing molestie cras dui. Vehicula egestas nisi sagittis fames metus velit. Sodales blandit nisi eu dis sit, ridiculus aliquam. Morbi tellus eu in
      penatibus torquent tortor. Platea gravida nam; egestas enim nostra ultricies.
    </p>
    <p>
      Mi nibh quisque taciti porta curabitur nostra volutpat. Habitant sodales arcu habitasse mi duis conubia leo lacinia. Montes torquent sodales adipiscing; proin semper feugiat morbi
      ullamcorper praesent. Arcu luctus tempor quam ligula vestibulum sapien faucibus ridiculus. Cursus consequat ultricies consectetur class suscipit quisque convallis eget? Dignissim mattis
      luctus enim habitant porta pretium litora. Parturient montes imperdiet massa; sollicitudin varius hac aptent. Eleifend parturient mattis tellus nisi a montes.
    </p>
  `,
};
