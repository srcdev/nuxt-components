<template>
  <div class="alert-masked-content" :data-theme="theme">
    <AlertMaskCore :config="resolvedMaskConfig">
      <AlertContentInner
        :theme="theme"
        :custom-icon="customIcon"
        :dismissible="dismissible"
        :content-id="contentId"
        :aria-live="ariaLive"
        @dismiss="emit('dismiss')"
      >
        <template v-if="slots.icon" #icon>
          <slot name="icon"></slot>
        </template>
        <template v-if="slots.title" #title>
          <slot name="title"></slot>
        </template>
        <template v-if="slots.content" #content>
          <slot name="content"></slot>
        </template>
        <template v-if="slots.dismissIcon" #dismissIcon>
          <slot name="dismissIcon"></slot>
        </template>
        <template v-if="slots.dismissLabel" #dismissLabel>
          <slot name="dismissLabel"></slot>
        </template>
      </AlertContentInner>
    </AlertMaskCore>
  </div>
</template>

<script setup lang="ts">
import type { SemanticTheme, AlertMaskConfig } from "~/types/components";

interface Props {
  theme: SemanticTheme;
  customIcon?: string;
  dismissible?: boolean;
  contentId?: string;
  ariaLive?: "polite" | "assertive" | "off";
  maskConfig?: AlertMaskConfig;
}

const props = withDefaults(defineProps<Props>(), {
  customIcon: undefined,
  dismissible: false,
  contentId: undefined,
  ariaLive: undefined,
  maskConfig: undefined,
});

const emit = defineEmits<{ dismiss: [] }>();

const slots = useSlots();

// Shape matches AlertContent: 8px left radius, 4px right, 6px accent bar on left, 1px border elsewhere
const resolvedMaskConfig = computed<AlertMaskConfig>(() => ({
  borderColour: "var(--theme-accent)",
  backgroundColour: "rgba(0, 0, 0, 0.3)",
  radiusLeft: 8,
  radiusRight: 4,
  borderLeft: 6,
  borderTop: 1,
  borderRight: 1,
  borderBottom: 1,
  ...props.maskConfig,
}));
</script>

<style lang="css">
@layer components {
  .alert-masked-content {
    .alert-content-inner {
      --_alert-content-inner-bg: transparent;
    }
  }
}
</style>
