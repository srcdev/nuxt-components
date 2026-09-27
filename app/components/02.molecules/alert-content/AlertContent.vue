<template>
  <div class="alert-content" :data-theme="theme">
    <AlertContentInner
      :theme="theme"
      :custom-icon="customIcon"
      :show-icon="showIcon"
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
      <template v-if="slots.actions" #actions>
        <slot name="actions"></slot>
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
  showIcon?: boolean;
  dismissible?: boolean;
  contentId?: string;
  ariaLive?: "polite" | "assertive" | "off";
}

withDefaults(defineProps<Props>(), {
  customIcon: undefined,
  showIcon: true,
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
    --_radius-start: var(--alert-content-border-radius-start, 0.8rem);
    --_radius-end: var(--alert-content-border-radius-end, 0.4rem);

    display: grid;
    background-color: var(--alert-content-accent, var(--theme-accent));
    border: var(--alert-content-border, 0.1rem solid var(--theme-border));
    border-start-start-radius: var(--_radius-start);
    border-end-start-radius: var(--_radius-start);
    border-start-end-radius: var(--_radius-end);
    border-end-end-radius: var(--_radius-end);
    padding-inline-start: var(--alert-content-accent-width, 0.6rem);
    overflow: hidden;
  }
}
</style>
