<template>
  <Teleport to="body">
    <div
      class="cookie-consent-banner"
      :class="[{ closed: status !== 'unset' }, elementClasses]"
      :data-theme="resolved.theme"
      data-test-id="cookie-consent-banner"
    >
      <div class="cookie-consent-banner-inner" role="region" :aria-label="ariaLabel">
        <div class="cookie-consent-banner-message">
          <slot name="message">This site uses cookies to understand how it's used. You can accept or reject them.</slot>
        </div>
        <div class="cookie-consent-banner-actions">
          <button
            type="button"
            class="cookie-consent-banner-reject"
            data-test-id="cookie-consent-banner-reject"
            @click="rejectAll()"
          >
            <slot name="rejectLabel">Reject</slot>
          </button>
          <button
            type="button"
            class="cookie-consent-banner-accept"
            data-test-id="cookie-consent-banner-accept"
            @click="acceptAll()"
          >
            <slot name="acceptLabel">Accept</slot>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { CookieConsentBannerProps } from "../../../types/components";

const props = withDefaults(defineProps<CookieConsentBannerProps>(), {
  theme: undefined,
  styleClassPassthrough: () => [],
});

const appConfig = useAppConfig();

const resolved = computed(() => {
  const config = appConfig.srcdev?.cookieConsentBanner;
  return {
    theme: props.theme ?? config?.theme ?? "info",
  } as const;
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const { status, acceptAll, rejectAll } = useCookieConsent();
const ariaLabel = "Cookie consent";
</script>

<style lang="css">
@layer components {
  .cookie-consent-banner {
    /* Matches DisplayToastProvider/DisplayDialog's z-index convention so
       this clears ordinary page chrome (and a consumer's sticky header) but
       still sits below an active modal dialog if one somehow overlaps. */
    --_z-index: var(--cookie-consent-banner-z-index, 999999);
    --_gutter: var(--cookie-consent-banner-gutter, 1.6rem);
    --_max-width: var(--cookie-consent-banner-max-width, 64rem);
    --_border-radius: var(--cookie-consent-banner-border-radius, 0.8rem);
    --_border: var(--cookie-consent-banner-border, 0.1rem solid light-dark(var(--slate-10), var(--slate-02)));
    --_background: var(--cookie-consent-banner-background, light-dark(var(--slate-00), var(--slate-10)));
    --_transition-duration: var(--cookie-consent-banner-transition-duration, 200ms);

    position: fixed;
    inset-inline: var(--_gutter);
    inset-block-end: var(--_gutter);
    z-index: var(--_z-index);
    margin-inline: auto;
    max-width: var(--_max-width);

    display: grid;
    grid-template-rows: 1fr;
    opacity: 1;
    transition: all var(--_transition-duration) ease-in-out;

    &.closed {
      grid-template-rows: 0fr;
      opacity: 0;
      pointer-events: none;
    }

    .cookie-consent-banner-inner {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.2rem;
      padding: 1.6rem;
      border-radius: var(--_border-radius);
      border: var(--_border);
      background-color: var(--_background);

      &[aria-label] {
        border-block-start: 0.2rem solid var(--theme-accent);
      }
    }

    .cookie-consent-banner-message {
      flex: 1 1 24rem;
    }

    .cookie-consent-banner-actions {
      display: flex;
      gap: 0.8rem;
      margin-inline-start: auto;
    }

    .cookie-consent-banner-reject,
    .cookie-consent-banner-accept {
      padding: 0.8rem 1.6rem;
      border-radius: 0.4rem;
      border: 0.1rem solid transparent;
      cursor: pointer;
      transition:
        border-color var(--_transition-duration),
        background-color var(--_transition-duration);
    }

    .cookie-consent-banner-reject {
      background-color: transparent;
      border: 0.1rem solid light-dark(var(--slate-08), var(--slate-04));

      &:hover,
      &:focus-visible {
        border-color: var(--theme-accent);
      }
    }

    .cookie-consent-banner-accept {
      background-color: var(--theme-accent);
      color: light-dark(var(--slate-00), var(--slate-12));

      &:hover,
      &:focus-visible {
        opacity: 0.9;
      }
    }
  }
}
</style>
