"use client";

import { useEffect } from "react";

function BrokenRobot() {
  return (
    <svg
      width="180"
      height="200"
      viewBox="0 0 180 200"
      fill="none"
    >
      {/* Smoke puffs */}
      <circle cx="60" cy="25" r="8" className="fill-muted-foreground/10 animate-pulse" />
      <circle cx="75" cy="15" r="6" className="fill-muted-foreground/8 animate-pulse [animation-delay:500ms]" />
      <circle cx="50" cy="10" r="5" className="fill-muted-foreground/6 animate-pulse [animation-delay:1000ms]" />

      {/* Antenna — tilted/broken */}
      <line x1="90" y1="52" x2="75" y2="30" className="stroke-muted-foreground/40" strokeWidth="2" strokeLinecap="round" />
      <circle cx="74" cy="28" r="4" className="fill-red-500/60 animate-pulse" />

      {/* Head */}
      <rect x="62" y="52" width="56" height="44" rx="10" className="fill-muted-foreground/12 stroke-muted-foreground/40" strokeWidth="1.5" />

      {/* Eyes — X X */}
      <g className="stroke-red-400/70" strokeWidth="2" strokeLinecap="round">
        <line x1="76" y1="68" x2="84" y2="76" />
        <line x1="84" y1="68" x2="76" y2="76" />
        <line x1="96" y1="68" x2="104" y2="76" />
        <line x1="104" y1="68" x2="96" y2="76" />
      </g>

      {/* Mouth — wavy/glitched */}
      <path d="M78 86 Q 82 82, 86 86 Q 90 90, 94 86 Q 98 82, 102 86" className="stroke-muted-foreground/40" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="84" y="96" width="12" height="8" rx="2" className="fill-muted-foreground/15" />

      {/* Body */}
      <rect x="56" y="104" width="68" height="52" rx="8" className="fill-muted-foreground/12 stroke-muted-foreground/40" strokeWidth="1.5" />

      {/* Chest panel — ERR */}
      <rect x="72" y="114" width="36" height="20" rx="3" className="fill-red-500/10 stroke-red-400/30" strokeWidth="1" />
      <text x="90" y="128" textAnchor="middle" className="fill-red-400/60 text-[10px] font-mono font-bold">ERR</text>

      {/* Bolts */}
      <circle cx="66" cy="118" r="2.5" className="fill-muted-foreground/20 stroke-muted-foreground/30" strokeWidth="0.5" />
      <circle cx="114" cy="118" r="2.5" className="fill-muted-foreground/20 stroke-muted-foreground/30" strokeWidth="0.5" />

      {/* Left arm — dangling */}
      <path d="M56 112 Q 40 118, 35 135 Q 32 145, 38 150" className="stroke-muted-foreground/30" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="38" cy="152" r="5" className="fill-muted-foreground/15 stroke-muted-foreground/30" strokeWidth="1" />

      {/* Right arm — sparking */}
      <path d="M124 112 Q 140 115, 148 128" className="stroke-muted-foreground/30" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="150" cy="130" r="5" className="fill-muted-foreground/15 stroke-muted-foreground/30" strokeWidth="1" />
      {/* Sparks */}
      <line x1="155" y1="125" x2="162" y2="120" className="stroke-yellow-400/60" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="156" y1="132" x2="164" y2="134" className="stroke-yellow-400/50" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="153" y1="138" x2="160" y2="142" className="stroke-orange-400/40" strokeWidth="1" strokeLinecap="round" />

      {/* Left leg */}
      <path d="M76 156 L 70 180" className="stroke-muted-foreground/30" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="68" cy="184" rx="8" ry="4" className="fill-muted-foreground/15 stroke-muted-foreground/30" strokeWidth="1" />

      {/* Right leg */}
      <path d="M104 156 L 112 178" className="stroke-muted-foreground/30" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="114" cy="182" rx="8" ry="4" className="fill-muted-foreground/15 stroke-muted-foreground/30" strokeWidth="1" />

      {/* Ground screw */}
      <circle cx="46" cy="190" r="3" className="fill-muted-foreground/10" />
      <circle cx="140" cy="192" r="2" className="fill-muted-foreground/8" />
    </svg>
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-background px-4 py-10 text-center">
      <BrokenRobot />

      {/* Big 500 */}
      <h1 className="mt-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-[100px] font-black leading-none tracking-tighter text-transparent sm:text-[150px]">
        500
      </h1>

      <p className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">
        Ối, robot của chúng tôi vừa nát óc
      </p>
      <p className="mt-2 max-w-md text-base text-muted-foreground">
        Có gì đó sai sai kinh khủng. Robot vấp dây điện,
        đổ cà phê lên server, và giờ đang ngồi suy ngẫm
        ý nghĩa cuộc đời.
      </p>

      {/* Error details (collapsed) */}
      <details className="mt-6 w-full max-w-md rounded-xl border border-border bg-muted/30 text-left">
        <summary className="cursor-pointer px-6 py-4 text-sm font-medium text-foreground transition-colors hover:text-primary">
          Chuyện gì đã xảy ra? (dành cho dân code)
        </summary>
        <div className="border-t border-border px-6 py-4">
          <code className="block break-all font-mono text-xs text-muted-foreground">
            {error.message || "Unknown error"}
          </code>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-muted-foreground/60">
              Digest: {error.digest}
            </p>
          )}
        </div>
      </details>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Thử Lại
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </svg>
          Về Trang Chủ
        </a>
      </div>

      {/* Decorative gradient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 size-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/5 blur-3xl" />
      </div>
    </div>
  );
}
