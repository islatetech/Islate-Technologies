"use client";

import { ReactLenis } from "lenis/react";
import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};
const wantsMotion = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Inertia scrolling for the whole site. It is what makes the 3D hero feel like
 * it glides rather than steps. Disabled for people who ask for reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(subscribe, wantsMotion, () => false);

  if (!enabled) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
