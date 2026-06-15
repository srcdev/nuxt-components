import type { DisplayToastConfig, ToastQueueEntry } from "~/types/components";

const _queue = ref<ToastQueueEntry[]>([]);

export function useToastQueue() {
  const show = (config: DisplayToastConfig): string => {
    const id = `toast-${crypto.randomUUID()}`;
    _queue.value = [..._queue.value, { id, config, status: "pending" }];
    return id;
  };

  const promote = (id: string) => {
    const entry = _queue.value.find((e) => e.id === id);
    if (entry) entry.status = "visible";
  };

  const dismiss = (id: string) => {
    _queue.value = _queue.value.filter((e) => e.id !== id);
  };

  const clear = () => {
    _queue.value = [];
  };

  return {
    queue: readonly(_queue),
    show,
    promote,
    dismiss,
    clear,
  };
}
