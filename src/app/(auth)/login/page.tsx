"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import Image from "next/image";
import { useLogin, useForgotPassword } from "@/hooks/use-auth";

type Mode = "login" | "forgot";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const login = useLogin();
  const forgotPw = useForgotPassword();

  return (
    <div className="flex min-h-screen">
      {/* Left — Form */}
      <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-6 py-10 sm:px-12 lg:px-20">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -left-32 -top-32 size-[400px] rounded-full bg-blue-400/5 blur-3xl dark:bg-blue-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-[300px] rounded-full bg-indigo-400/5 blur-3xl dark:bg-indigo-500/8" />
        <div className="bg-grid-dots pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" />

        <div className="relative mx-auto w-full max-w-md">
          <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" />
            Trang chủ
          </Link>
          <Link href="/" className="mb-8 block text-2xl font-bold text-foreground">
            Operis <span className="text-blue-400">Market</span>
          </Link>

          {mode === "forgot" ? (
            <div>
              <button type="button" onClick={() => { setMode("login"); setForgotSent(false); }}
                className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="size-4" />
                Quay lại đăng nhập
              </button>
              <h1 className="text-2xl font-bold text-foreground">Quên mật khẩu</h1>
              <p className="mt-2 text-sm text-muted-foreground">Nhập email để nhận link đặt lại mật khẩu</p>

              {forgotSent ? (
                <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center">
                  <Mail className="mx-auto mb-2 size-8 text-green-400" />
                  <p className="text-sm font-medium text-foreground">Email đã được gửi!</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Kiểm tra hộp thư tại <span className="font-medium text-foreground">{forgotEmail}</span>
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); forgotPw.mutate(forgotEmail, { onSuccess: () => setForgotSent(true) }); }} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input type="email" required placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background-secondary py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={forgotPw.isPending} className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
                    {forgotPw.isPending ? <Loader2 className="mx-auto size-4 animate-spin" /> : "Gửi link đặt lại"}
                  </button>
                  {forgotPw.isError && (
                    <p className="text-center text-sm text-red-500">{(forgotPw.error as any)?.response?.data?.message || "Có lỗi xảy ra"}</p>
                  )}
                </form>
              )}
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-foreground">Đăng nhập</h1>
              <p className="mt-2 text-sm text-muted-foreground">Chào mừng trở lại! Đăng nhập để tiếp tục.</p>

              <form onSubmit={(e) => { e.preventDefault(); login.mutate({ email, password }); }} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background-secondary py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Mật khẩu</label>
                    <button type="button" onClick={() => setMode("forgot")} className="cursor-pointer text-xs text-primary transition-colors hover:text-primary/80">
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background-secondary py-3 pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                    <button type="button" title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={login.isPending} className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
                  {login.isPending ? <Loader2 className="mx-auto size-4 animate-spin" /> : "Đăng nhập"}
                </button>
                {login.isError && (
                  <p className="text-center text-sm text-red-500">{(login.error as any)?.response?.data?.message || "Đăng nhập thất bại"}</p>
                )}
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">hoặc</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-3">
                <button type="button" onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`; }} className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Đăng nhập với Google
                </button>
                {/* <button type="button" onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`; }} className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Đăng nhập với GitHub
                </button> */}
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="font-medium text-primary transition-colors hover:text-primary/80">Đăng ký</Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right — Image panel */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/auth/login.webp"
          alt="Operis Market — API Marketplace"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        <div className="relative flex h-full flex-col items-end justify-end p-10 text-white">
          <h2 className="text-2xl font-bold">Chào mừng trở lại</h2>
          <p className="mt-2 max-w-sm text-right text-sm text-white/80">
            Truy cập hàng trăm AI API cho video, hình ảnh, âm nhạc và chat với giá cả hợp lý.
          </p>
        </div>
      </div>
    </div>
  );
}
