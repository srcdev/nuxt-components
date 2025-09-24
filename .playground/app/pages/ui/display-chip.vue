<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout">
          <h1 class="page-heading-2">Display Chip</h1>

          <form>
            <div class="form-row">
              <div class="form-col">
                <label for="size">Size - {{ chipConfig.size }}</label>
                <input @input="changeSize" id="size" type="range" min="1" max="24" :value="12" />
              </div>
              <div class="form-col">
                <label for="gap">Gap - {{ chipConfig.gap }}</label>
                <input @input="changeGap" id="gap" type="range" min="0" max="12" :value="4" />
              </div>
              <div class="form-col">
                <label for="offset">Offset - {{ chipConfig.offset }}</label>
                <input @input="changeOffset" id="offset" type="range" min="-12" max="12" :value="2" />
              </div>
              <div class="form-col">
                <label for="angle">Angle - {{ chipConfig.angle }}</label>
                <input @input="changeAngle" id="angle" type="range" min="0" max="360" :value="45" />
              </div>
            </div>
          </form>

          <section>
            <div class="dl">
              <div class="dt">Round</div>
              <div class="dd">
                <DisplayChip shape="circle" v-model="chipConfig" :style-class-passthrough="['online']">
                  <div class="chip-content round">
                    <Icon name="akar-icons:info" size="24" color="white" />
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Square</div>
              <div class="dd">
                <DisplayChip shape="square" v-model="chipConfig" :style-class-passthrough="['idle']">
                  <div class="chip-content square">
                    <Icon name="akar-icons:info" size="24" color="white" />
                  </div>
                </DisplayChip>
              </div>
            </div>
          </section>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: "UI Display Chips",
  meta: [{ name: "description", content: "Examples of UI Display Chips" }],
  bodyAttrs: {
    class: "ui-display-chip-page",
  },
})

const chipConfig = reactive({
  size: "12px",
  gap: "4px",
  offset: "2px",
  angle: "45deg",
})

const changeSize = (e: Event) => {
  const target = e.target as HTMLInputElement
  chipConfig.size = `${target.value}px`
}

const changeGap = (e: Event) => {
  const target = e.target as HTMLInputElement
  chipConfig.gap = `${target.value}px`
}

const changeOffset = (e: Event) => {
  const target = e.target as HTMLInputElement
  chipConfig.offset = `${target.value}px`
}

const changeAngle = (e: Event) => {
  const target = e.target as HTMLInputElement
  chipConfig.angle = `${target.value}deg`
}
</script>

<style lang="css">
.ui-display-chip-page {
  form {
    margin-bottom: 2rem;

    .form-row {
      .form-col {
        display: grid;
        grid-template-columns: 200px 200px;
        gap: 1rem;
        padding: 0.5rem 0;

        label {
          font-weight: bold;
        }

        input {
          padding: 0.5rem;
          border: 1px solid var(--gray-7);
          border-radius: 4px;
          font-size: 1rem;
        }
      }
    }
  }
  section {
    margin-top: 2rem;

    .dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2rem;
      align-items: center;

      /* background-color: var(--gray-5); */

      .dt {
        font-weight: bold;
      }
      .dd {
        margin: 0;

        .chip-content {
          display: flex;
          align-items: center;
          justify-content: center;

          &.round {
            width: 50px;
            height: 50px;
            background-color: var(--gray-12);
            border-radius: 50%;
          }

          &.square {
            width: 50px;
            height: 50px;
            background-color: var(--gray-12);
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>
