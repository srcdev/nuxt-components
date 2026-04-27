export function useCancellableTimer() {
  let _isActive = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let rejectCurrent: (() => void) | null = null;

  const wait = (ms: number): Promise<void> =>
    new Promise((resolve, reject) => {
      if (!_isActive) {
        reject();
        return;
      }
      rejectCurrent = reject;
      timeoutId = setTimeout(() => {
        rejectCurrent = null;
        if (_isActive) resolve();
        else reject();
      }, ms);
    });

  const schedule = (fn: () => void, ms: number) => {
    if (!_isActive) return;
    timeoutId = setTimeout(() => {
      if (_isActive) fn();
    }, ms);
  };

  const stop = () => {
    _isActive = false;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    rejectCurrent?.();
    rejectCurrent = null;
  };

  const start = () => {
    _isActive = true;
  };

  return { wait, schedule, stop, start };
}
