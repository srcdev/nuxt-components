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
                <label for="maskWidth">Mask Width - {{ chipConfig.maskWidth }}</label>
                <input @input="changeMaskWidth" id="maskWidth" type="range" min="0" max="12" :value="4" />
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
                <DisplayChip shape="circle" :config="chipConfig" :style-class-passthrough="['online']">
                  <div class="demo-content round">
                    <Icon name="akar-icons:info" class="icon" />
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Round + Icon</div>
              <div class="dd">
                <DisplayChip
                  shape="circle"
                  icon="material-symbols:star-outline"
                  :config="chipConfig"
                  :style-class-passthrough="['online']"
                >
                  <div class="demo-content round">
                    <p class="page-body-normal">SRC</p>
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Round + Text (1 character)</div>
              <div class="dd">
                <DisplayChip shape="circle" label="2" :config="chipConfig" :style-class-passthrough="['online']">
                  <div class="demo-content round">
                    <p class="page-body-normal">SRC</p>
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Round + Text (2 character)</div>
              <div class="dd">
                <DisplayChip shape="circle" label="+2" :config="chipConfig" :style-class-passthrough="['online']">
                  <div class="demo-content round">
                    <p class="page-body-normal">SRC</p>
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Round + Text (3 character)</div>
              <div class="dd">
                <DisplayChip shape="circle" label="314" :config="chipConfig" :style-class-passthrough="['online']">
                  <div class="demo-content round">
                    <p class="page-body-normal">SRC</p>
                  </div>
                </DisplayChip>
              </div>

              <div class="dt">Square</div>
              <div class="dd">
                <DisplayChip shape="square" :config="chipConfig" :style-class-passthrough="['idle']">
                  <div class="demo-content square">
                    <Icon name="akar-icons:info" class="icon" />
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
  maskWidth: "4px",
  offset: "2px",
  angle: "45deg",
})

const changeSize = (e: Event) => {
  const target = e.target as HTMLInputElement
  chipConfig.size = `${target.value}px`
}

const changeMaskWidth = (e: Event) => {
  const target = e.target as HTMLInputElement
  chipConfig.maskWidth = `${target.value}px`
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
      grid-template-columns: auto auto;
      gap: 2rem;
      align-items: center;
      justify-content: start;

      /* background-color: var(--gray-5); */

      .dt {
        font-weight: bold;
      }
      .dd {
        margin: 0;

        .demo-content {
          display: flex;
          align-items: center;
          justify-content: center;

          .page-body-normal {
            color: light-dark(var(--gray-12), var(--gray-11));
          }

          .icon {
            width: 24px;
            height: 24px;
            color: light-dark(var(--gray-12), var(--gray-11));
          }

          &.round {
            width: 50px;
            height: 50px;
            background-color: light-dark(var(--gray-3), var(--gray-4));
            border-radius: 50%;
          }

          &.square {
            width: 50px;
            height: 50px;
            background-color: light-dark(var(--gray-3), var(--gray-4));
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>
