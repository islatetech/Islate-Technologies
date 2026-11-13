"use client";

import { useSyncExternalStore } from "react";

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

let cached: boolean | null = null;
const subscribe = () => () => {};
const snapshot = () => {
  if (cached === null) cached = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && webglOk();
  return cached;
};

/**
 * null while the page is rendering on the server or hydrating, then true when
 * WebGL works (and motion is allowed) or false when it does not. The null state
 * lets the page keep its 3D layout instead of flashing a flat fallback image.
 */
export function useCan3d(): boolean | null {
  return useSyncExternalStore<boolean | null>(subscribe, snapshot, () => null);
}
