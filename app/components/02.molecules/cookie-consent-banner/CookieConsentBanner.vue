<template>
  <Teleport to="body">
    <div
      class="cookie-consent-banner"
      :class="[{ 'cookie-consent-banner-closed': isClosed }, elementClasses]"
      :data-theme="resolved.theme"
      data-test-id="cookie-consent-banner"
    >
      <div class="cookie-consent-banner-inner" role="region" :aria-label="ariaLabel">
        <AlertContent :theme="resolved.theme" :custom-icon="icon" :show-icon="showIcon">
          <template #title>
            <slot name="title">Cookies</slot>
          </template>
          <template #content>
            <slot name="message">This site uses cookies to understand how it's used. You can accept or reject them.</slot>
          </template>
          <template #actions>
            <InputButton
              type="button"
              variant="inline"
              class="cookie-consent-banner-reject"
              data-test-id="cookie-consent-banner-reject"
              :button-text="rejectLabel"
              @click="rejectAll()"
            />
            <InputButton
              type="button"
              variant="inline"
              class="cookie-consent-banner-accept"
              data-test-id="cookie-consent-banner-accept"
              :button-text="acceptLabel"
              @click="acceptAll()"
            />
          </template>
        </AlertContent>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { CookieConsentBannerProps } from "../../../types/components";

const props = withDefaults(defineProps<CookieConsentBannerProps>(), {
  theme: undefined,
  ariaLabel: "Cookie consent",
  acceptLabel: "Accept",
  rejectLabel: "Reject",
  icon: "material-symbols:cookie-outline",
  showIcon: true,
  styleClassPassthrough: () => [],
});

const appConfig = useAppConfig();

const resolved = computed(() => {
  const config = appConfig.srcdev?.cookieConsentBanner;
  return {
    theme: props.theme ?? config?.theme ?? "info",
  } as const;
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const { status, acceptAll, rejectAll } = useCookieConsent();
const isClosed = computed(() => status.value !== "unset");
</script>

<style lang="css">
@layer components {
  .cookie-consent-banner {
    --_gutter: var(--cookie-consent-banner-gutter, 1.6rem);
    --_transition-duration: var(--cookie-consent-banner-transition-duration, 200ms);
    --_accent: var(--cookie-consent-banner-accent, var(--theme-accent));

    position: fixed;
    inset-inline: var(--_gutter);
    inset-block-end: var(--_gutter);
    z-index: var(--cookie-consent-banner-z-index, 999999);
    margin-inline: auto;
    max-width: var(--cookie-consent-banner-max-width, 64rem);

    display: grid;
    grid-template-rows: 1fr;
    opacity: 1;
    transition:
      grid-template-rows var(--_transition-duration) ease-in-out,
      opacity var(--_transition-duration) ease-in-out,
      visibility var(--_transition-duration);

    &.cookie-consent-banner-closed {
      grid-template-rows: 0fr;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }

    .cookie-consent-banner-inner {
      min-height: 0;
      overflow: hidden;
    }

    .cookie-consent-banner-reject.input-button,
    .cookie-consent-banner-accept.input-button {
      box-sizing: border-box;
      min-height: auto;
      padding: var(--cookie-consent-banner-button-padding, 0.8rem 1.6rem);
      border-radius: var(--cookie-consent-banner-button-border-radius, 0.4rem);
      border: 0.1rem solid transparent;
      font: inherit;
      cursor: pointer;
      transition:
        border-color var(--_transition-duration),
        background-color var(--_transition-duration);

      &:focus-visible {
        outline: 0.2rem solid var(--cookie-consent-banner-focus-ring, var(--theme-border-focus));
        outline-offset: 0.2rem;
      }

      .button-text {
        font-size: inherit;
        text-transform: none;
      }
    }

    .cookie-consent-banner-reject.input-button {
      background-color: transparent;
      color: inherit;
      border-color: var(--cookie-consent-banner-reject-border-colour, var(--theme-border));

      &:hover,
      &:focus-visible {
        border-color: var(--cookie-consent-banner-reject-border-colour-hover, var(--_accent));
      }
    }

    .cookie-consent-banner-accept.input-button {
      background-color: var(--cookie-consent-banner-accept-background, var(--_accent));
      color: var(--cookie-consent-banner-accept-text-colour, var(--theme-on-surface));

      &:hover,
      &:focus-visible {
        opacity: 0.9;
      }
    }
  }
}
</style>
