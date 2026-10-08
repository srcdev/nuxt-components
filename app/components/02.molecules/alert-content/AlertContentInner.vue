<template>
  <div class="alert-content-inner">
    <div v-if="showIcon" class="alert-content-icon" data-test-id="alert-icon" aria-hidden="true">
      <slot name="icon">
        <Icon :name="customIcon || themeIcon" class="icon" />
      </slot>
    </div>

    <div class="alert-content-main">
      <div :id="contentId" class="alert-content-body" :aria-live="ariaLive">
        <p v-if="slots.title" class="alert-content-title" data-test-id="alert-title">
          <slot name="title"></slot>
        </p>
        <p v-if="slots.content" class="alert-content-text" data-test-id="alert-content">
          <slot name="content"></slot>
        </p>
      </div>

      <div v-if="slots.actions" class="alert-content-actions" data-test-id="alert-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="alert-content-dismiss"
      data-test-id="alert-dismiss"
      @click.prevent="emit('dismiss')"
    >
      <slot name="dismissIcon">
        <Icon :name="dismissIcon" class="icon" />
      </slot>
      <span class="sr-only">
        <slot name="dismissLabel">Close</slot>
      </span>
    </button>
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

const props = withDefaults(defineProps<Props>(), {
  customIcon: undefined,
  showIcon: true,
  dismissible: false,
  contentId: undefined,
  ariaLive: undefined,
});

const emit = defineEmits<{ dismiss: [] }>();

const slots = useSlots();

const appConfig = useAppConfig();

const fallbackIcons: Record<SemanticTheme, string> = {
  info: "akar-icons:info",
  success: "akar-icons:check",
  warning: "akar-icons:circle-alert",
  error: "akar-icons:circle-alert",
};

const themeIcon = computed(() => {
  const icons = appConfig.srcdev?.alertContent?.icons as Partial<Record<SemanticTheme, string>> | undefined;
  return icons?.[props.theme] ?? fallbackIcons[props.theme];
});
const dismissIcon = computed(() => appConfig.srcdev?.alertContent?.dismissIcon ?? "material-symbols:close");
</script>

<style lang="css">
@layer components {
  .alert-content-inner {
    display: flex;
    align-items: center;
    gap: var(--alert-content-gap, 1.2rem);
    background-color: var(--alert-content-inner-background, var(--theme-surface-subtle));
    color: var(--alert-content-text-colour, var(--theme-text));
    border-start-start-radius: var(--alert-content-border-radius-start, 0.8rem);
    border-end-start-radius: var(--alert-content-border-radius-start, 0.8rem);
    padding: var(--alert-content-padding, 1.2rem 1.5rem);
    min-inline-size: 0;
    overflow: hidden;

    .alert-content-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .icon {
        color: var(--alert-content-icon-colour, currentColor);
        display: inline-block;
        font-size: var(--alert-content-icon-size, 2.5rem);
        font-style: normal;
        font-weight: normal;
        overflow: hidden;
      }
    }

    .alert-content-main {
      flex: 1;
      min-width: 0;
      display: grid;
      gap: var(--alert-content-actions-spacing, 1.2rem);
    }

    .alert-content-body {
      display: flex;
      flex-direction: column;
      gap: var(--alert-content-body-gap, 0.4rem);

      .alert-content-title {
        font-size: var(--alert-content-title-font-size, var(--step-4));
        font-weight: 600;
        line-height: 1.2;
        margin: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        overflow-wrap: anywhere;
        -webkit-line-clamp: var(--alert-content-title-line-clamp, none);
        line-clamp: var(--alert-content-title-line-clamp, none);
      }

      .alert-content-text {
        font-size: var(--alert-content-text-font-size, var(--step-3));
        font-weight: normal;
        line-height: 1.4;
        margin: 0;
        opacity: 0.9;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        overflow-wrap: anywhere;
        -webkit-line-clamp: var(--alert-content-text-line-clamp, none);
        line-clamp: var(--alert-content-text-line-clamp, none);
      }
    }

    .alert-content-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: var(--alert-content-actions-justify, flex-end);
      gap: var(--alert-content-actions-gap, 0.8rem);
      --input-button-text-white-space: normal;

      & > * {
        min-inline-size: 0;
        max-inline-size: 100%;
      }
    }

    .alert-content-dismiss {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: transparent;
      border: 0.1rem solid var(--alert-content-dismiss-border-colour, var(--theme-border));
      outline: 0.1rem solid transparent;
      border-radius: 50%;
      color: inherit;
      cursor: pointer;
      padding: 0.5rem;
      transition: all 200ms ease;

      .icon {
        color: inherit;
        display: block;
        font-size: var(--alert-content-dismiss-icon-size, 1.5rem);
      }

      &:hover,
      &:focus-visible {
        background-color: var(--alert-content-dismiss-background-hover, var(--theme-surface-hover));
        color: var(--alert-content-dismiss-colour-hover, var(--theme-on-surface));
        outline: 0.1rem solid var(--alert-content-dismiss-ring, var(--theme-ring));
        outline-offset: 0.2rem;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }
  }
}
</style>
