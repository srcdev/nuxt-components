<template>
  <div
    ref="promptElementRef"
    class="display-prompt"
    :class="[{ closed: !componentOpen }]"
    :data-test-id="`display-prompt-${resolved.theme}`"
    :tabindex="resolved.useAutoFocus ? -1 : undefined"
    :inert="!componentOpen || undefined"
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
          <slot name="customTitle">{{ resolved.closeLabel }}</slot>
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
  closeLabel?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
  theme: undefined,
  dismissible: undefined,
  useAutoFocus: undefined,
  masked: undefined,
  closeLabel: undefined,
});

const appConfig = useAppConfig();

const resolved = computed(() => {
  const config = appConfig.srcdev?.displayPrompt;
  return {
    theme: props.theme ?? config?.theme ?? "info",
    dismissible: props.dismissible ?? config?.dismissible ?? false,
    useAutoFocus: props.useAutoFocus ?? config?.useAutoFocus ?? false,
    masked: props.masked ?? config?.masked ?? false,
    closeLabel: props.closeLabel ?? config?.closeLabel ?? "Close this prompt",
  } as const;
});

const contentComponent = computed(() => (resolved.value.masked ? AlertMaskedContent : AlertContent));

const slots = useSlots();
const promptElementRef = useTemplateRef<HTMLElement>("promptElementRef");
const parentComponentState = defineModel<boolean>({ default: false });
const componentOpen = ref(true);
const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const updateComponentState = () => {
  if (parentComponentState.value) {
    parentComponentState.value = false;
    return;
  }

  componentOpen.value = false;
};

onMounted(() => {
  if (resolved.value.useAutoFocus && promptElementRef.value) {
    promptElementRef.value.focus();
  }
});
</script>

<style lang="css">
@layer components {
  .display-prompt {
    display: grid;
    grid-template-rows: 1fr;
    opacity: 1;
    transition:
      grid-template-rows var(--display-prompt-transition-duration, 200ms) ease-in-out,
      opacity var(--display-prompt-transition-duration, 200ms) ease-in-out;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }

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
