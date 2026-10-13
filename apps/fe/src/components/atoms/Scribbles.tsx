'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';

interface ScribbleProps {
  className?: string;
  delay?: number;
  duration?: number;
  color?: string;
}

/**
 * Hand-drawn animated underline scribble (coret-coret garis bawah)
 */
export function ScribbleUnderline({
  className = '',
  delay = 0.2,
  duration = 1.2,
  color,
}: ScribbleProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration,
      delay,
      ease: 'power2.out',
    });
  }, [delay, duration]);

  return (
    <svg
      className={`overflow-visible pointer-events-none select-none ${className}`}
      viewBox="0 0 260 24"
      fill="none"
      role="img"
      aria-label="Dekorasi Coretan Bawah"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Dekorasi Coretan Bawah</title>
      <path
        ref={pathRef}
        d="M4 14C48 5 118 18 178 7C208 3 234 11 254 13C220 18 152 19 110 21"
        stroke={color || 'currentColor'}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand-drawn animated circle doodle (coret-coret lingkaran melingkar)
 */
export function ScribbleCircle({
  className = '',
  delay = 0.3,
  duration = 1.4,
  color,
}: ScribbleProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration,
      delay,
      ease: 'power2.out',
    });
  }, [delay, duration]);

  return (
    <svg
      className={`overflow-visible pointer-events-none select-none ${className}`}
      viewBox="0 0 170 70"
      fill="none"
      role="img"
      aria-label="Dekorasi Lingkaran Tangan"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Dekorasi Lingkaran Tangan</title>
      <path
        ref={pathRef}
        d="M26 36C22 18 54 8 102 8C148 8 162 22 160 38C156 54 124 64 78 63C32 62 8 50 10 32C12 16 48 10 88 10C120 10 148 18 144 34"
        stroke={color || 'currentColor'}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand-drawn animated arrow doodle (coret-coret panah)
 */
export function ScribbleArrow({
  className = '',
  delay = 0.4,
  duration = 1.2,
  color,
}: ScribbleProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current || !headRef.current) return;
    const pLen = pathRef.current.getTotalLength();
    const hLen = headRef.current.getTotalLength();

    gsap.set(pathRef.current, { strokeDasharray: pLen, strokeDashoffset: pLen });
    gsap.set(headRef.current, { strokeDasharray: hLen, strokeDashoffset: hLen });

    const tl = gsap.timeline({ delay });
    tl.to(pathRef.current, { strokeDashoffset: 0, duration: duration * 0.7, ease: 'power2.out' })
      .to(headRef.current, { strokeDashoffset: 0, duration: duration * 0.3, ease: 'power2.out' });
  }, [delay, duration]);

  return (
    <svg
      className={`overflow-visible pointer-events-none select-none ${className}`}
      viewBox="0 0 70 70"
      fill="none"
      role="img"
      aria-label="Dekorasi Panah Tangan"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Dekorasi Panah Tangan</title>
      {/* Curve body */}
      <path
        ref={pathRef}
        d="M8 12C14 36 28 54 52 56"
        stroke={color || 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Arrow head */}
      <path
        ref={headRef}
        d="M38 58L54 57L50 42"
        stroke={color || 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand-drawn sparkle / botanic accent (coret-coret bintang kecil)
 */
export function ScribbleSparkle({
  className = '',
  delay = 0.2,
  duration = 1,
  color,
}: ScribbleProps) {
  const elRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!elRef.current) return;
    gsap.fromTo(
      elRef.current,
      { scale: 0, rotate: -30, opacity: 0 },
      {
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'elastic.out(1, 0.5)',
      },
    );
  }, [delay, duration]);

  return (
    <svg
      ref={elRef}
      className={`overflow-visible pointer-events-none select-none ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Dekorasi Bintang Coretan"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Dekorasi Bintang Coretan</title>
      <path
        d="M16 2C16 10 10 16 2 16C10 16 16 22 16 30C16 22 22 16 30 16C22 16 16 10 16 2Z"
        fill={color || 'currentColor'}
      />
    </svg>
  );
}
