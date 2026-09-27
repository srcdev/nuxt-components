const PAUSE_POLL_MS = 100;

export function useCancellableTimer() {
  let _isActive = false;
  let _isPaused = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let rejectCurrent: (() => void) | null = null;

  // While paused, a due timer re-arms itself instead of firing, so the sequence resumes where it stopped.
  const arm = (fn: () => void, ms: number) => {
    timeoutId = setTimeout(() => {
      if (!_isActive) return;
      if (_isPaused) {
        arm(fn, PAUSE_POLL_MS);
        return;
      }
      fn();
    }, ms);
  };

  const wait = (ms: number): Promise<void> =>
    new Promise((resolve, reject) => {
      if (!_isActive) {
        reject();
        return;
      }
      rejectCurrent = reject;
      arm(() => {
        rejectCurrent = null;
        resolve();
      }, ms);
    });

  const schedule = (fn: () => void, ms: number) => {
    if (!_isActive) return;
    arm(fn, ms);
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

  const pause = () => {
    _isPaused = true;
  };

  const resume = () => {
    _isPaused = false;
  };

  return { wait, schedule, stop, start, pause, resume };
}
