import { useRef, useMemo, useEffect } from "react";

export const useStepsObserver = (
  callback?: (target: Element | undefined, entries: any) => void,
  options?: IntersectionObserverInit
) => {
  const steps = useRef<(HTMLDivElement | null)[]>([]);
  const scrollObserver = useMemo(
    () =>
      new IntersectionObserver(
        (entries) => {
          const { target } = entries.find((el) => el.isIntersecting) || {};
          callback?.(target, entries);
        },
        {
          root: null,
          threshold: 0.5,
          ...options,
        }
      ),
    []
  );

  useEffect(() => {
    steps.current?.forEach((el) => scrollObserver.observe(el));
    return () => {
      steps.current?.forEach((el) => scrollObserver.unobserve(el));
    };
  }, [steps, scrollObserver]);

  return steps;
};
