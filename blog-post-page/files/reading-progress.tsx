'use client';

import { useEffect, useRef } from 'react';

/**
 * How far the reader is through the target, 0–1: the part of its scroll distance (its height less the window's)
 * already behind. A target no taller than the window counts as 1 once its bottom is in view, else 0.
 */
export function readingProgress(rect: { top: number; height: number }, viewportHeight: number): number {
  const distance = rect.height - viewportHeight;
  if (distance <= 0) return rect.top + rect.height <= viewportHeight ? 1 : 0;
  return Math.min(1, Math.max(0, -rect.top / distance));
}

/**
 * A thin bar across the top of the window that fills as the reader moves through the element with id `targetId`.
 * Client island; decorative (hidden from screen readers). It updates on scroll and resize, once per frame. Drawn in
 * brand-ink, the brand colour that keeps its contrast on the surface (a pale brand would vanish).
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const target = document.getElementById(targetId);
      if (!target || !bar.current) return;
      const { top, height } = target.getBoundingClientRect();
      bar.current.style.transform = `scaleX(${readingProgress({ top, height }, window.innerHeight)})`;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div aria-hidden="true" data-reading-progress="" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1">
      <div ref={bar} className="h-full origin-left bg-[var(--oc-brand-ink,oklch(20.5%_0_none))]" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
