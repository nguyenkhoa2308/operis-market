"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useResetPassword } from "@/hooks/use-auth";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const resetPw = useResetPassword();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (newPassword.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    resetPw.mutate({ token, newPassword });
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-500/10">
            <KeyRound className="size-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Link is invalid
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The password reset link is missing or invalid. Please request a new one.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

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
              <Lock className="size-8 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-foreground">
              Set new password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
              {/* New password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setValidationError("");
                    }}
                    className="w-full rounded-lg border border-border bg-background-secondary py-3 pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showNew ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Enter password again"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setValidationError("");
                    }}
                    className="w-full rounded-lg border border-border bg-background-secondary py-3 pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Errors */}
              {(validationError || resetPw.isError) && (
                <p className="text-center text-sm text-red-500">
                  {validationError ||
                    (resetPw.error as any)?.response?.data?.message ||
                    "An error occurred. Please try again."}
                </p>
              )}

              <button
                type="submit"
                disabled={!newPassword || !confirmPassword || resetPw.isPending}
                className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resetPw.isPending ? (
                  <Loader2 className="mx-auto size-4 animate-spin" />
                ) : (
                  "Reset password"
                )}
              </button>
            </form>

            {/* Back to login */}
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Right — Image panel */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/80 via-purple-600/70 to-indigo-700/80" />
        <div className="relative flex h-full flex-col items-center justify-center px-12 text-center text-white">
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <KeyRound className="size-10" />
          </div>
          <h2 className="text-3xl font-bold">Reset your password</h2>
          <p className="mt-3 max-w-sm text-base text-white/80">
            Choose a strong password to keep your Operis Market account secure.
          </p>
        </div>
      </div>
    </div>
  );
}
