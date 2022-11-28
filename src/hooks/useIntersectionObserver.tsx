import React, { useEffect } from 'react';

import { useCallbackRef } from './useCallbackRef';

interface IProps {
  root?: React.MutableRefObject<HTMLElement | null>;
  target: React.MutableRefObject<HTMLElement | null>;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export default function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true,
}: IProps): void {
  const stickyIntersect = useCallbackRef(onIntersect);
  useEffect(() => {
    const el = target && target.current;

    if (!el) {
      return;
    }

    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          entry.isIntersecting && stickyIntersect();
        }),
      {
        root: root && root.current,
        rootMargin,
        threshold,
      },
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [stickyIntersect, root, target, enabled, rootMargin, threshold]);
}
