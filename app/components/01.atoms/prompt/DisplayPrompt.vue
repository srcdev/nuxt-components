<template>
  <div
    ref="promptElementRef"
    class="display-prompt-core"
    :class="[{ closed: !componentOpen }]"
    :data-test-id="`display-prompt-core-${theme}`"
    tabindex="0"
  >
    <div class="display-prompt-wrapper" :data-theme="theme" :class="[elementClasses]" data-test-id="display-prompt">
      <AlertContent
        :theme="theme"
        :dismissible="dismissible"
        :aria-live="useAutoFocus ? 'polite' : undefined"
        @dismiss="updateComponentState()"
      >
        <template v-if="slots.customDecoratorIcon" #icon>
          <slot name="customDecoratorIcon"></slot>
        </template>
        <template v-if="slots.title" #title>
          <slot name="title"></slot>
        </template>
        <template v-if="slots.content" #content>
          <slot name="content"></slot>
        </template>
        <template v-if="slots.customCloseIcon" #dismissIcon>
          <slot name="customCloseIcon"></slot>
        </template>
        <template #dismissLabel>
          <slot name="customTitle">Close this prompt</slot>
        </template>
      </AlertContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DisplayPromptTheme } from "~/types/components";

interface Props {
  theme?: DisplayPromptTheme;
  dismissible?: boolean;
  useAutoFocus?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  theme: "info",
  dismissible: false,
  useAutoFocus: false,
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const promptElementRef = useTemplateRef<HTMLElement>("promptElementRef");
const parentComponentState = defineModel<boolean>({ default: false });
const componentOpen = ref(true);
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const updateComponentState = () => {
  if (parentComponentState.value) {
    parentComponentState.value = false;
    return;
  }

  componentOpen.value = false;
};

onMounted(async () => {
  if (props.useAutoFocus && promptElementRef.value) {
    promptElementRef.value.focus();
  }
});
</script>

<style lang="css">
@layer components {
  .display-prompt-core {
    display: grid;
    grid-template-rows: 1fr;
    opacity: 1;
    transition: all 200ms ease-in-out;

    &.closed {
      grid-template-rows: 0fr;
      opacity: 0;
      pointer-events: none;
    }

    .display-prompt-wrapper {
      background-color: var(--theme-accent);
      border: 0px solid transparent;
      border-radius: 4px;
      border-start-start-radius: 8px;
      border-end-start-radius: 8px;
      padding-inline-start: 8px;

      overflow: hidden;

      &.outlined {
        border: 1px solid var(--theme-border);
      }

    }
  }
}
</style>
