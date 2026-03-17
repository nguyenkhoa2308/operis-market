import Link from "next/link";

function FloatingAstronaut() {
  return (
    <svg
      width="200"
      height="220"
      viewBox="0 0 200 220"
      fill="none"
      className="animate-bounce-slow"
    >
      {/* Tether cable */}
      <path
        d="M100 180 Q 120 160, 110 140 Q 100 120, 105 105"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        className="text-muted-foreground/30"
      />

      {/* Backpack */}
      <rect x="72" y="62" width="16" height="40" rx="4" className="fill-muted-foreground/20" />

      {/* Body */}
      <rect x="82" y="58" width="40" height="48" rx="10" className="fill-muted-foreground/15 stroke-muted-foreground/40" strokeWidth="1.5" />

      {/* Helmet */}
      <circle cx="102" cy="42" r="24" className="fill-muted-foreground/10 stroke-muted-foreground/40" strokeWidth="1.5" />
      {/* Visor */}
      <ellipse cx="102" cy="42" rx="16" ry="14" className="fill-blue-500/20 stroke-blue-400/50" strokeWidth="1" />
      {/* Visor shine */}
      <ellipse cx="96" cy="37" rx="4" ry="3" className="fill-blue-300/40" />

      {/* Left arm waving */}
      <path
        d="M82 68 Q 62 55, 55 40"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        className="text-muted-foreground/25"
      />
      {/* Left glove */}
      <circle cx="54" cy="38" r="5" className="fill-muted-foreground/20 stroke-muted-foreground/40" strokeWidth="1" />

      {/* Right arm */}
      <path
        d="M122 72 Q 140 78, 148 90"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        className="text-muted-foreground/25"
      />
      {/* Right glove */}
      <circle cx="149" cy="92" r="5" className="fill-muted-foreground/20 stroke-muted-foreground/40" strokeWidth="1" />

      {/* Left leg */}
      <path
        d="M92 106 Q 80 125, 72 140"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        className="text-muted-foreground/25"
      />
      {/* Left boot */}
      <ellipse cx="70" cy="143" rx="7" ry="5" className="fill-muted-foreground/20 stroke-muted-foreground/40" strokeWidth="1" />

      {/* Right leg */}
      <path
        d="M112 106 Q 118 128, 130 138"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        className="text-muted-foreground/25"
      />
      {/* Right boot */}
      <ellipse cx="132" cy="141" rx="7" ry="5" className="fill-muted-foreground/20 stroke-muted-foreground/40" strokeWidth="1" />

      {/* Stars */}
      <circle cx="20" cy="30" r="1.5" className="fill-blue-400/60 animate-pulse" />
      <circle cx="175" cy="20" r="1" className="fill-purple-400/60 animate-pulse [animation-delay:500ms]" />
      <circle cx="160" cy="170" r="1.5" className="fill-pink-400/60 animate-pulse [animation-delay:1000ms]" />
      <circle cx="30" cy="150" r="1" className="fill-blue-300/60 animate-pulse [animation-delay:1500ms]" />
      <circle cx="45" cy="90" r="1" className="fill-purple-300/50 animate-pulse [animation-delay:700ms]" />
      <circle cx="170" cy="100" r="1.5" className="fill-pink-300/50 animate-pulse [animation-delay:1200ms]" />

      {/* Planet */}
      <circle cx="175" cy="55" r="12" className="fill-purple-500/10 stroke-purple-400/30" strokeWidth="1" />
      <ellipse cx="175" cy="55" rx="18" ry="4" className="fill-none stroke-purple-400/20" strokeWidth="1" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-background px-4 py-10 text-center">
      <FloatingAstronaut />

      {/* Big 404 */}
      <h1 className="mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-[100px] font-black leading-none tracking-tighter text-transparent sm:text-[150px]">
        404
      </h1>

      <p className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">
        Houston, ta có vấn đề!
      </p>
      <p className="mt-2 max-w-md text-base text-muted-foreground">
        Trang này đã trôi vào không gian sâu thẳm.
        Phi hành gia của chúng tôi tìm khắp nơi
        nhưng chỉ thấy bụi vũ trụ và một con alien đang hoang mang.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-muted/30 px-6 py-4 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Bạn có biết:</span>{" "}
        Lỗi 404 được đặt tên theo phòng 404 tại CERN, nơi đặt
        các máy chủ web đầu tiên. Cái phòng đó... thực ra không hề tồn tại.
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </svg>
          Về Trang Chủ
        </Link>
        <Link
          href="/market"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Khám Phá Models
        </Link>
      </div>

      {/* Decorative gradient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 size-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/5 blur-3xl" />
      </div>
    </div>
  );
}
