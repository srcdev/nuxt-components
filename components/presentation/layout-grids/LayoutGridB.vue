<template>
  <div class="layout-reporting-grid" :class="[elementClasses]">
    <section class="reporting-block">
      <div class="slot-1">
        <div v-for="key in slot1ItemCount" class="panel">
          <slot :name="`slot1-${key}-content`"></slot>
        </div>
      </div>

      <!-- Delete slot-2 to test not present -->
      <div class="slot-2">
        <div class="panel">
          <h2>Sentiment Panel</h2>
          <h2>Content of this cell will fill available space</h2>
          <p>Width can be changed by tinkering with the minmax in css</p>
          <pre>grid-template-columns: 1fr minmax(calc(4/12 * 100%), 460px);</pre>
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
        </div>
      </div>
      <div class="slot-3">
        <div class="panel">
          <h2>Content of this cell will fill available space</h2>
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
        </div>
      </div>
    </section>

    <section class="dashboard-block">
      <div class="panel">
        <h2>Top Employee Priorities</h2>
        <h2>Content of this cell will fill available space and match heights</h2>
        <p>Cells set to 50% width gap of 25px</p>
        Panel 1<br />Panel 1<br />Panel 1<br />Panel 1
      </div>
      <div class="panel">
        <h2>Highest Red and Green Zone Populations</h2>
        <h2>Content of this cell will fill available space and match heights</h2>
        <p>Cells set to 50% width gap of 25px</p>
        Panel 2<br />Panel 2
      </div>
      <!-- Delete next panel to test not present -->
      <div class="panel">
        <h2>Sentiment Analysis</h2>
        <h2>Content of this cell will fill available space and match heights</h2>
        <p>Cells set to 50% width gap of 25px</p>
        Panel 3
      </div>
      <div class="panel">
        <h2>Trend Analysis on Average Satisfaction</h2>
        <h2>Content of this cell will fill available space and match heights</h2>
        <p>Cells set to 50% width gap of 25px</p>
        Panel 4<br />Panel 4<br />Panel 4<br />Panel 4<br />Panel 4
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  slot1ItemCount: {
    type: Number as PropType<number>,
    default: 5,
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
.layout-reporting-grid {
  --brand-purple: #781d7d;
  --brand-blue: #00bbe4;
  --brand-green: #8ec73f;
  --brand-light-grey: #cccccc;
  --brand-dark-grey: #333333;
  --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  .panel {
    background-color: white;
    border: 1px solid var(--brand-light-grey);
    border-radius: 12px;
    padding: 12px;
    height: auto;
  }

  container-type: inline-size;
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  width: 100%;
  margin-inline: auto;

  /* Adding a media/container query to reporting-block can make this responsive mobile upwards */
  .reporting-block {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas:
      'slot1'
      'slot3';
    gap: 25px;
    width: 100%;

    &:has(.slot-2) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'slot1'
        'slot2'
        'slot3';

      @container (min-width: 1024px) {
        grid-template-columns: 1fr minmax(460px, 33%);
        grid-template-areas:
          'slot1 slot2'
          'slot3 slot2';
      }
    }
  }

  .slot-1 {
    display: grid;
    grid-area: slot1;
    /* Force 5 equally paced items     */
    /* grid-template-columns: 1fr; */

    /* gap: 12px; */

    /* Columns will be fluid between 250px and full width depending on space available */
    /* @container (min-width: 680px) { */
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
    /* } */

    .panel {
      display: grid;
      color: white;

      &:nth-child(1) {
        background-color: var(--brand-purple);
      }

      &:nth-child(2) {
        background-color: var(--brand-blue);
      }

      &:nth-child(3) {
        background-color: var(--brand-green);
      }

      &:nth-child(4) {
        background-color: var(--brand-light-grey);
      }

      &:nth-child(5) {
        background-color: var(--brand-dark-grey);
      }
    }
  }
  .slot-2 {
    grid-area: slot2;
    display: grid;
  }
  .slot-3 {
    grid-area: slot3;
    display: grid;
  }

  .dashboard-block {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
}
</style>
