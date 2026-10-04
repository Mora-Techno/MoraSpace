'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export function useGsapStagger<T extends HTMLElement>(
  deps: unknown[] = [],
  selector = '[data-stagger-item]',
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(selector);
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      },
    );
  }, [...deps, selector]);

  return containerRef;
}
