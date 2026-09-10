'use client';

import { Suspense, lazy } from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-zinc-400 font-mono text-xs gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400/40 border-t-cyan-300 animate-spin" />
          <span className="tracking-widest uppercase text-[11px] text-zinc-500">Initializing 3D Core...</span>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
