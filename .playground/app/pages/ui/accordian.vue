<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h1 class="page-heading-2">Accordian</h1>
          <p>Any item open and/closed</p>

          <AccordianCore :itemCount="3" :style-class-passthrough="['class-modifier-narrow']">
            <template v-for="(item, key) in data" v-slot:[`accordian-${key}-summary`]>
              {{ key }} - {{ item.title }}
            </template>
            <template v-for="(item, key) in data" v-slot:[`accordian-${key}-icon`]>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template v-for="(item, key) in data" v-slot:[`accordian-${key}-content`]>
              <p class="pb-12">{{ item.content }}</p>
            </template>
          </AccordianCore>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="page-heading-2">Accordian</h2>
          <p>Only 1 item open, pass a name prop</p>

          <AccordianCore
            :itemCount="3"
            :name="`accordian-${useId()}`"
            :style-class-passthrough="['class-modifier-wide']"
          >
            <template v-for="(item, key) in data" v-slot:[`accordian-${key}-summary`]>
              {{ key }} - {{ item.title }}
            </template>
            <template v-for="(item, key) in data" v-slot:[`accordian-${key}-icon`]>
              <Icon name="bi:caret-down-fill" class="icon" />
            </template>
            <template v-slot:[`accordian-0-content`]>
              <p class="pb-12">This is content slot 0</p>
            </template>
            <template v-slot:[`accordian-1-content`]>
              <p class="pb-12">This is content slot 1</p>
            </template>
            <template v-slot:[`accordian-2-content`]>
              <p class="pb-12">This is content slot 2</p>
            </template>
          </AccordianCore>
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
  title: "Display Accordian",
  meta: [{ name: "description", content: "Display Accordian" }],
  bodyAttrs: {
    class: "",
  },
})

interface IAccordianData {
  title: string
  content: string
}

const data = ref<IAccordianData[]>([
  {
    title: "Trigger Item 1",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!. Lorem ipsum dolor sit, adipisicing elit. Iusto, amet!",
  },
  {
    title: "Trigger Item 2",
    content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!",
  },
  {
    title: "Trigger Item 3",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!, Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, amet!",
  },
])
</script>

<style lang="css">
.class-modifier-wide {
  &.display-accordian {
    max-width: 800px;
    margin: 0 auto;
  }
}

.class-modifier-narrow {
  &.display-accordian {
    max-width: 300px;
    margin: 0 auto;

    .accordian-item {
      &.expanding-panel {
        --_border-radius: 0.6rem;
        --_margin-block-end: 1rem;

        border: 1px solid var(--gray-0);
        will-change: margin-block-end, border-radius, background-color;
        transition: margin-block-end 300ms ease-in-out, border-radius 300ms ease-in-out,
          background-color 300ms ease-in-out;

        &:first-child {
          background-color: darkblue; /* DEV STYLES */
          border-start-start-radius: var(--_border-radius);
          border-start-end-radius: var(--_border-radius);

          &:has(.expanding-panel-details[open]) {
            margin-block-end: var(--_margin-block-end);
          }
        }

        &:last-child {
          background-color: darkred; /* DEV STYLES */
          border-end-start-radius: var(--_border-radius);
          border-end-end-radius: var(--_border-radius);
          &:has(.expanding-panel-details[open]) {
            background-color: darkorange; /* DEV STYLES */
            border-end-start-radius: var(--_border-radius);
            border-end-end-radius: var(--_border-radius);
          }
        }

        &:has(.expanding-panel-details[open]) + .expanding-panel {
          background-color: darkcyan; /* DEV STYLES */
          border-radius: var(--_border-radius);
        }

        /* Previous element is open */
        &:not(:first-child):has(.expanding-panel-details[open]) {
          border-start-start-radius: var(--_border-radius);
          border-start-end-radius: var(--_border-radius);
          margin-block-end: var(--_margin-block-end);
        }

        /* Next element is open */
        &:has(+ .expanding-panel .expanding-panel-details[open]) {
          /* &:has(.expanding-panel-details[open]) { */
          background-color: darkgreen; /* DEV STYLES */
          border-end-start-radius: var(--_border-radius);
          border-end-end-radius: var(--_border-radius);
          margin-block-end: var(--_margin-block-end);
          /* } */
        }

        /* Current element is open */
        &:has(.expanding-panel-details[open]) {
          border-radius: var(--_border-radius);
          margin-block-end: 0.4rem;
        }

        .expanding-panel-details {
          padding-block: 0.8rem;
          padding-inline: 1.4rem;

          .expanding-panel-summary {
            padding: 0.1rem;

            .label-wrapper {
              /* Custom css */
            }
            .icon-wrapper {
              /* Custom css */

              .icon {
                /* Custom css */
              }
            }
          }

          &[open] {
            .expanding-panel-summary {
              .icon-wrapper {
                .icon {
                  /* Custom css */
                }
              }
            }
            + .expanding-panel-content {
              /* Custom css */
              .inner {
                /* Custom css */
              }
            }
          }
        }

        .expanding-panel-content {
          /* Custom css */

          .inner {
            /* Custom css */
          }
        }
      }
    }
  }
}
</style>
