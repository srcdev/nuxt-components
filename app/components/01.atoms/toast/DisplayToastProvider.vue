<template>
  <Teleport to="body">
    <TransitionGroup
      tag="div"
      class="display-toast-provider"
      :class="[position, fullWidth ? 'full-width' : alignment]"
      @before-leave="onBeforeLeave"
      @after-leave="onAfterLeave"
      @after-enter="onAfterEnter"
    >
      <div
        v-for="entry in visibleEntries"
        :key="entry.id"
        class="display-toast-provider-item has-theme"
        :style="{
          '--_reveal': revealDurationFor(entry) + 'ms',
          '--_duration': displayDurationFor(entry) + 'ms',
        }"
        :data-theme="themeFor(entry)"
        :role="roleFor(entry)"
        :aria-live="ariaLiveFor(entry)"
        tabindex="0"
        :aria-describedby="'toast-message-' + entry.id"
        @keydown.escape="handleDismiss(entry.id)"
      >
        <DefaultToastContent
          :theme="themeFor(entry)"
          :custom-icon="entry.config.content?.customIcon"
          :toast-id="entry.id"
          :toast-display-text="entry.config.content?.text ?? ''"
          :toast-title="entry.config.content?.title ?? ''"
          :toast-description="entry.config.content?.description ?? ''"
          :auto-dismiss="autoDismissFor(entry)"
          :set-dismiss-toast="() => handleDismiss(entry.id)"
        />
        <div v-if="autoDismissFor(entry)" class="display-toast-provider-progress"></div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import type {
  DisplayToastTheme,
  DisplayToastPosition,
  DisplayToastAlignment,
  ToastQueueEntry,
} from "~/types/components";

interface Props {
  position?: DisplayToastPosition;
  alignment?: DisplayToastAlignment;
  fullWidth?: boolean;
  maxVisible?: number;
}

const props = withDefaults(defineProps<Props>(), {
  position: "top",
  alignment: "right",
  fullWidth: false,
  maxVisible: 1,
});

const { queue, promote, dismiss } = useToastQueueProvider();

const visibleEntries = computed<ToastQueueEntry[]>(() =>
  (queue.value as ToastQueueEntry[]).filter((e) => e.status === "visible")
);

const themeFor = (entry: ToastQueueEntry): DisplayToastTheme => entry.config.appearance?.theme ?? "info";
const autoDismissFor = (entry: ToastQueueEntry) => entry.config.behavior?.autoDismiss ?? true;
const displayDurationFor = (entry: ToastQueueEntry) => entry.config.behavior?.duration ?? 5000;
const revealDurationFor = (entry: ToastQueueEntry) => entry.config.behavior?.revealDuration ?? 550;
const roleFor = (entry: ToastQueueEntry) =>
  ["error", "warning"].includes(themeFor(entry)) ? "alert" : "status";
const ariaLiveFor = (entry: ToastQueueEntry) =>
  ["error", "warning"].includes(themeFor(entry)) ? "assertive" : "polite";

const timers = new Map<string, ReturnType<typeof setTimeout>>();

const handleDismiss = (id: string) => {
  const timer = timers.get(id);
  if (timer !== undefined) {
    clearTimeout(timer);
    timers.delete(id);
  }
  dismiss(id);
};

const startTimer = (entry: ToastQueueEntry) => {
  if (!autoDismissFor(entry)) return;
  const timer = setTimeout(() => {
    timers.delete(entry.id);
    dismiss(entry.id);
  }, displayDurationFor(entry));
  timers.set(entry.id, timer);
};

watch(
  queue,
  (newQueue) => {
    const entries = newQueue as ToastQueueEntry[];

    // Clear timers for entries that no longer exist (e.g. clear()).
    const entryIds = new Set(entries.map((e) => e.id));
    for (const [id, timer] of timers) {
      if (!entryIds.has(id)) {
        clearTimeout(timer);
        timers.delete(id);
      }
    }

    const visibleCount = entries.filter((e) => e.status === "visible").length;
    const slots = props.maxVisible - visibleCount;
    const pending = entries.filter((e) => e.status === "pending");
    for (let i = 0; i < Math.min(slots, pending.length); i++) {
      promote(pending[i]!.id);
      startTimer(pending[i]!);
    }
  },
  { immediate: true }
);


let _leavingCount = 0;
let _containerEl: HTMLElement | null = null;

const onBeforeLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  if (_leavingCount === 0) {
    _containerEl = htmlEl.parentElement as HTMLElement;
    if (_containerEl) {
      _containerEl.style.minWidth = `${_containerEl.offsetWidth}px`;
    }
  }
  _leavingCount++;
  htmlEl.style.top = `${htmlEl.offsetTop}px`;
  htmlEl.style.width = `${htmlEl.offsetWidth}px`;
};

const onAfterLeave = () => {
  _leavingCount--;
  if (_leavingCount === 0 && _containerEl) {
    _containerEl.style.minWidth = "";
    _containerEl = null;
  }
};

const onAfterEnter = (el: Element) => {
  (el as HTMLElement).focus();
};

onUnmounted(() => {
  timers.forEach(clearTimeout);
  timers.clear();
});
</script>

<style lang="css">
@layer components {
  @keyframes showTop {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes showBottom {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .display-toast-provider {
    --_gutter: 12px;
    @media (width >= 600px) {
      --_gutter: 24px;
    }

    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 100;

    inset-inline: var(--_gutter);
    margin-inline: auto;
    width: max-content;
    max-width: calc(100% - 2 * var(--_gutter));

    &.top {
      inset-block-start: var(--_gutter);
    }

    &.bottom {
      inset-block-end: var(--_gutter);
      flex-direction: column-reverse;
    }

    @media (width >= 600px) {
      &.left {
        inset-inline-start: var(--_gutter);
        inset-inline-end: unset;
        margin-inline: 0;
      }

      &.right {
        inset-inline-end: var(--_gutter);
        inset-inline-start: unset;
        margin-inline: 0;
      }

      &.center:not(.full-width) {
        inset-inline: 0;
        margin-inline: auto;
      }

      &.full-width {
        inset-inline: var(--_gutter);
        width: unset;
        max-width: unset;
      }
    }
  }

  .display-toast-provider-item {
    --_reveal: 550ms;
    --_duration: 5000ms;

    display: block;
    position: relative;
    overflow: hidden;

    &:focus {
      outline: 2px solid var(--theme-ring);
      outline-offset: 2px;
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }

    /* TransitionGroup enter/leave */
    .display-toast-provider.top & {
      &.v-enter-from {
        opacity: 0;
        transform: translateY(-30px);
      }

      &.v-enter-active {
        @supports (animation-timing-function: linear(0, 1)) {
          animation: showTop var(--_reveal) var(--spring-easing) forwards;
        }

        @supports not (animation-timing-function: linear(0, 1)) {
          animation: showTop calc(var(--_reveal) / 2) linear forwards;
        }
      }

      &.v-leave-active {
        position: absolute;

        @supports (animation-timing-function: linear(0, 1)) {
          animation: hideTop var(--_reveal) var(--spring-easing) forwards;
        }

        @supports not (animation-timing-function: linear(0, 1)) {
          animation: hideTop calc(var(--_reveal) / 2) linear forwards;
        }
      }
    }

    .display-toast-provider.bottom & {
      &.v-enter-from {
        opacity: 0;
        transform: translateY(30px);
      }

      &.v-enter-active {
        @supports (animation-timing-function: linear(0, 1)) {
          animation: showBottom var(--_reveal) var(--spring-easing) forwards;
        }

        @supports not (animation-timing-function: linear(0, 1)) {
          animation: showBottom calc(var(--_reveal) / 2) linear forwards;
        }
      }

      &.v-leave-active {
        position: absolute;

        @supports (animation-timing-function: linear(0, 1)) {
          animation: hideBottom var(--_reveal) var(--spring-easing) forwards;
        }

        @supports not (animation-timing-function: linear(0, 1)) {
          animation: hideBottom calc(var(--_reveal) / 2) linear forwards;
        }
      }
    }

    &.v-move {
      transition: transform 0.3s ease;
    }

    &.has-theme {
      padding-inline-start: 6px;
      background-color: var(--theme-surface);
      border: 0.1rem solid var(--theme-border);
      border-start-start-radius: 8px;
      border-end-start-radius: 8px;
      border-start-end-radius: 4px;
      border-end-end-radius: 4px;
      overflow: hidden;
    }

    .display-toast-provider-progress {
      position: absolute;
      inset-block-end: 4px;
      inset-inline: 15px 8px;
      height: 3px;
      transform: scaleX(0);
      transform-origin: right;
      background: var(--theme-surface);
      border-radius: inherit;
      animation: progress var(--_duration) linear forwards;
    }
  }
}
</style>
