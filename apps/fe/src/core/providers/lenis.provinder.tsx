'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

interface LenisProviderProps {
  children: ReactNode;
}

// Component to sync Lenis with GSAP ScrollTrigger
function ScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Set up GSAP ticker to sync with Lenis
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateRaf);

    // Disable Lenis internal RAF since GSAP handles it
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(updateRaf);
    };
  }, [lenis]);

  return null;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname();
  const isPrivate = pathname?.startsWith('/member') || pathname?.startsWith('/owner');

  if (isPrivate) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
        autoRaf: false, // Disable auto RAF, let GSAP handle it
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
