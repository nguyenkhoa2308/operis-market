"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { useVerifyEmail, useResendVerification } from "@/hooks/use-auth";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const shouldResend = searchParams.get("resend") === "1";
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verify = useVerifyEmail();
  const resend = useResendVerification();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-send verification code on mount
  const hasSent = useRef(false);
  useEffect(() => {
    if (email && shouldResend && !hasSent.current) {
      hasSent.current = true;
      resend.mutate(email);
    }
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, "").slice(-1);
      const next = [...code];
      next[index] = digit;
      setCode(next);
      if (digit && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [code],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setCode(next);
    const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }, []);

  const handleResend = () => {
    if (!email) return;
    setCountdown(RESEND_COOLDOWN);
    resend.mutate(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify.mutate(code.join(""));
  };

  const isComplete = code.every((d) => d !== "");

  return (
    <div className="flex min-h-screen">
      {/* Left — Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Back to home */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Trang chủ
          </Link>

          {/* Logo */}
          <Link
            href="/"
            className="mb-8 block text-2xl font-bold text-foreground"
          >
            Operis <span className="text-blue-400">Market</span>
          </Link>

          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-8 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-foreground">
              Xác minh email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Chúng tôi đã gửi mã xác minh 6 số đến
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {email || "—"}
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              {/* OTP Inputs */}
              <div
                className="flex justify-center gap-2.5"
                onPaste={handlePaste}
              >
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    title={`Mã số ${i + 1}`}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="size-12 rounded-lg border border-border bg-background-secondary text-center text-lg font-bold text-foreground transition-colors focus:border-primary focus:outline-none sm:size-14"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={!isComplete || verify.isPending}
                className="mt-6 w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {verify.isPending ? <Loader2 className="mx-auto size-4 animate-spin" /> : "Xác minh"}
              </button>
              {verify.isError && (
                <p className="mt-2 text-center text-sm text-red-500">{(verify.error as any)?.response?.data?.message || "Mã xác minh không hợp lệ"}</p>
              )}
            </form>

            {/* Resend */}
            <div className="mt-4">
              {countdown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Gửi lại mã sau{" "}
                  <span className="font-medium text-foreground">
                    {countdown}s
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Gửi lại mã
                </button>
              )}
            </div>

            {/* Back to login */}
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>

      {/* Right — Image panel */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 via-teal-600/70 to-cyan-700/80" />
        <div className="relative flex h-full flex-col items-center justify-center px-12 text-center text-white">
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <ShieldCheck className="size-10" />
          </div>
          <h2 className="text-3xl font-bold">Xác minh tài khoản</h2>
          <p className="mt-3 max-w-sm text-base text-white/80">
            Chỉ còn một bước nữa để bắt đầu sử dụng Operis Market. Kiểm tra
            email và nhập mã xác minh.
          </p>
        </div>
      </div>
    </div>
  );
}
