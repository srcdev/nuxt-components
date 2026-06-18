<template>
  <div class="alert-content">
    <div class="alert-content-inner">
      <div class="alert-content-icon" data-test-id="alert-icon" aria-hidden="true">
        <slot name="icon">
          <Icon :name="customIcon || defaultThemeIcons[theme]" class="icon" />
        </slot>
      </div>

      <div :id="contentId" class="alert-content-body" :aria-live="ariaLive">
        <p v-if="slots.title" class="title" data-test-id="alert-title">
          <slot name="title"></slot>
        </p>
        <p v-if="slots.content" class="content" data-test-id="alert-content">
          <slot name="content"></slot>
        </p>
      </div>

      <button
        v-if="dismissible"
        class="alert-content-dismiss"
        data-test-id="alert-dismiss"
        @click.prevent="emit('dismiss')"
      >
        <slot name="dismissIcon">
          <Icon name="material-symbols:close" class="icon" />
        </slot>
        <span class="sr-only">
          <slot name="dismissLabel">Close</slot>
        </span>
      </button>
    </div>
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

const defaultThemeIcons: Record<SemanticTheme, string> = {
  info: "akar-icons:info",
  success: "akar-icons:check",
  warning: "akar-icons:circle-alert",
  error: "akar-icons:circle-alert",
};
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

    .alert-content-inner {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1.2rem;
      align-items: center;
      background-color: var(--theme-surface-subtle);
      border-start-start-radius: 8px;
      border-end-start-radius: 8px;
      padding: 1.2rem 1.5rem;
      overflow: hidden;

      .alert-content-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        .icon {
          color: var(--theme-text);
          display: inline-block;
          font-size: 2.5rem;
          font-style: normal;
          font-weight: normal;
          overflow: hidden;
        }
      }

      .alert-content-body {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        color: var(--theme-text);

        .title {
          font-size: var(--step-4);
          font-weight: 600;
          line-height: 1.2;
          margin: 0;
        }

        .content {
          font-size: var(--step-3);
          font-weight: normal;
          line-height: 1.4;
          margin: 0;
          opacity: 0.9;
        }
      }

      .alert-content-dismiss {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 0.1rem solid var(--theme-border);
        outline: 0.1rem solid transparent;
        border-radius: 50%;
        color: var(--theme-text);
        cursor: pointer;
        flex-shrink: 0;
        padding: 0.5rem;
        transition: all 200ms ease;

        .icon {
          color: inherit;
          display: block;
          font-size: 1.5rem;
        }

        &:hover,
        &:focus-visible {
          background-color: var(--theme-surface-hover);
          color: var(--theme-on-surface);
          outline: 0.1rem solid var(--theme-ring);
          outline-offset: 0.2rem;
        }
      }
    }
  }
}
</style>
