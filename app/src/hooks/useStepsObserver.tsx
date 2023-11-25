import { useRef, useMemo, useEffect } from "react";

export const useStepsObserver = (
  callback?: (target: Element | undefined) => void,
  options?: IntersectionObserverInit
) => {
  const steps = useRef<(HTMLDivElement | null)[]>([]);
  const scrollObserver = useMemo(
    () =>
      new IntersectionObserver(
        (entries) => {
          const { target } = entries.find((el) => el.isIntersecting) || {};
          callback?.(target);
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
          ...options,
        }
      ),
    []
  );

  useEffect(() => {
    steps.current?.forEach((el) => scrollObserver.observe(el));
  }, [steps, scrollObserver]);

  return steps;
};
