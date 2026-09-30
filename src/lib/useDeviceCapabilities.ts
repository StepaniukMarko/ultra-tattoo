'use client';

import { useEffect, useState } from 'react';

export type DeviceCaps = {
  reducedMotion: boolean;
  isTouch: boolean;
  lowPower: boolean; // coarse pointer, few cores, or small screen → prefer CSS over WebGL
  ready: boolean;
};

export function useDeviceCapabilities(): DeviceCaps {
  const [caps, setCaps] = useState<DeviceCaps>({
    reducedMotion: false,
    isTouch: false,
    lowPower: false,
    ready: false,
  });

  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const smallScreen = window.innerWidth < 768;
    const lowPower = isTouch || cores <= 4 || smallScreen;

    const update = () =>
      setCaps({
        reducedMotion: mqReduced.matches,
        isTouch,
        lowPower,
        ready: true,
      });

    update();
    mqReduced.addEventListener('change', update);
    return () => mqReduced.removeEventListener('change', update);
  }, []);

  return caps;
}
