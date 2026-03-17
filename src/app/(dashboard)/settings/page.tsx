"use client";

import { useState } from "react";
import {
  Users,
  Webhook,
  Moon,
  Mail,
  AlertTriangle,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useThemeTransition } from "@/hooks/useThemeTransition";
import { useUser, useDeleteAccount } from "@/hooks/use-auth";



function SettingsCard({
  icon: Icon,
  title,
  danger,
  children,
}: {
  icon: React.ElementType;
  title: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background-secondary">
      <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
        <Icon
          className={`size-5 ${danger ? "text-destructive" : "text-primary"}`}
        />
        <h2
          className={`text-base font-semibold ${danger ? "text-destructive" : "text-card-foreground"}`}
        >
          {title}
        </h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeTransition();
  const mounted = useIsMounted();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePw, setShowDeletePw] = useState(false);
  const { data: user } = useUser();
  const deleteAccount = useDeleteAccount();

  const isLoggedIn = !!user;
  const isDark = mounted ? theme === "dark" : false;

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Cài đặt
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý cài đặt tài khoản và tuỳ chọn của bạn
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Theme Settings — always visible */}
        <SettingsCard icon={Moon} title="Giao diện">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-card-foreground">
                Chế độ tối
              </div>
              <div className="text-sm text-muted-foreground">
                Bật giao diện tối để giảm mỏi mắt
              </div>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={() => toggleTheme()}
              aria-label="Toggle dark mode"
            />
          </div>
        </SettingsCard>

        {isLoggedIn && (
          <>
            <SettingsCard icon={Users} title="Nhóm & Cài đặt">
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
                <span className="text-sm text-amber-600 dark:text-amber-400">Tính năng này sắp có</span>
              </div>
            </SettingsCard>

            <SettingsCard icon={Webhook} title="Khoá HMAC Webhook">
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
                <span className="text-sm text-amber-600 dark:text-amber-400">Tính năng này sắp có</span>
              </div>
            </SettingsCard>

            <SettingsCard icon={Mail} title="Thông báo">
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
                <span className="text-sm text-amber-600 dark:text-amber-400">Tính năng này sắp có</span>
              </div>
            </SettingsCard>

            <SettingsCard icon={AlertTriangle} title="Vùng nguy hiểm" danger>
              <p className="mb-4 text-sm text-muted-foreground">
                Sau khi xoá tài khoản, bạn sẽ không thể khôi phục lại. Hãy cân
                nhắc kỹ.
              </p>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-destructive px-5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                  Xoá tài khoản
                </button>
              ) : (
                <div className="space-y-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-destructive">
                    Bạn có chắc chắn muốn xoá tài khoản? Hành động này không thể hoàn tác.
                  </p>

                  {user?.hasPassword && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Nhập mật khẩu để xác nhận
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type={showDeletePw ? "text" : "password"}
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="Mật khẩu hiện tại"
                          className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowDeletePw(!showDeletePw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showDeletePw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {deleteAccount.isError && (
                    <p className="text-sm text-red-500">
                      {(deleteAccount.error as any)?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={deleteAccount.isPending || (user?.hasPassword && !deletePassword)}
                      onClick={() => deleteAccount.mutate({ password: deletePassword || undefined })}
                      className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-destructive px-5 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deleteAccount.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                      Xoá vĩnh viễn
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword("");
                        setShowDeletePw(false);
                        deleteAccount.reset();
                      }}
                      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      Huỷ
                    </button>
                  </div>
                </div>
              )}
            </SettingsCard>
          </>
        )}
      </div>
    </div>
  );
}
