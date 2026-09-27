<template>
  <div
    ref="promptElementRef"
    class="display-prompt-core"
    :class="[{ closed: !componentOpen }]"
    :data-test-id="`display-prompt-core-${resolved.theme}`"
    tabindex="0"
  >
    <div class="display-prompt-wrapper" :data-theme="resolved.theme" :class="[elementClasses]" data-test-id="display-prompt">
      <component
        :is="contentComponent"
        :theme="resolved.theme"
        :dismissible="resolved.dismissible"
        :aria-live="resolved.useAutoFocus ? 'polite' : undefined"
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
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import AlertContent from "~/components/02.molecules/alert-content/AlertContent.vue";
import AlertMaskedContent from "~/components/02.molecules/alert-masked-content/AlertMaskedContent.vue";
import type { DisplayPromptTheme } from "~/types/components";

interface Props {
  theme?: DisplayPromptTheme;
  dismissible?: boolean;
  useAutoFocus?: boolean;
  masked?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
  theme: undefined,
  dismissible: undefined,
  useAutoFocus: undefined,
  masked: undefined,
});

const appConfig = useAppConfig();

const resolved = computed(() => {
  const config = appConfig.srcdev?.displayPrompt;
  return {
    theme: props.theme ?? config?.theme ?? "info",
    dismissible: props.dismissible ?? config?.dismissible ?? false,
    useAutoFocus: props.useAutoFocus ?? config?.useAutoFocus ?? false,
    masked: props.masked ?? config?.masked ?? false,
  } as const;
});

const contentComponent = computed(() => (resolved.value.masked ? AlertMaskedContent : AlertContent));

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
  if (resolved.value.useAutoFocus && promptElementRef.value) {
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
      overflow: hidden;
    }
  }
}
</style>
