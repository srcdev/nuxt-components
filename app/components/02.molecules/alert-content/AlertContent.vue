<template>
  <div class="alert-content" :data-theme="theme">
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
  </div>
</template>

<script setup lang="ts">
import type { SemanticTheme } from "~/types/components";

interface Props {
  theme: SemanticTheme;
  customIcon?: string;
  dismissible?: boolean;
  contentId?: string;
  ariaLive?: "polite" | "assertive" | "off";
}

withDefaults(defineProps<Props>(), {
  customIcon: undefined,
  dismissible: false,
  contentId: undefined,
  ariaLive: undefined,
});

const emit = defineEmits<{ dismiss: [] }>();

const slots = useSlots();
</script>

<style lang="css">
@layer components {
  .alert-content {
    background-color: var(--theme-accent);
    border: 0.1rem solid var(--theme-border);
    border-start-start-radius: 8px;
    border-end-start-radius: 8px;
    border-start-end-radius: 4px;
    border-end-end-radius: 4px;
    padding-inline-start: 6px;
    overflow: hidden;

  }
}
</style>
