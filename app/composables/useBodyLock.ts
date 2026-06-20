const getCount = (): number => Number(document.body.dataset.lockCount ?? 0);

const setCount = (n: number) => {
  if (n > 0) document.body.dataset.lockCount = String(n);
  else delete document.body.dataset.lockCount;
};

export const useBodyLock = () => {
  const lock = () => {
    setCount(getCount() + 1);
    document.body.classList.add("lock");
  };

  const unlock = () => {
    const next = Math.max(0, getCount() - 1);
    setCount(next);
    if (next === 0) document.body.classList.remove("lock");
  };

  return { lock, unlock };
};
