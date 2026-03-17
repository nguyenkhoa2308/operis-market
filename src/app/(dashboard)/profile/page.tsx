"use client";

import { useState } from "react";
import { User, Pencil, Lock, Mail, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import { useProfile, useUpdateProfile } from "@/hooks/use-settings";
import { useUser, useChangePassword } from "@/hooks/use-auth";

function ProfileCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background-secondary">
      <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
        <Icon className="size-5 text-primary" />
        <h2 className="text-base font-semibold text-card-foreground">
          {title}
        </h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: profile } = useProfile();
  const { data: user } = useUser();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [name, setName] = useState("");
  const [dirty, setDirty] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const displayName = dirty ? name : (profile?.name ?? "");

  const avatarSrc =
    profile?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name ?? "")}&background=random&color=fff&size=128&bold=true`;

  const handleSave = () => {
    const trimmed = (dirty ? name : profile?.name ?? "").trim();
    if (!trimmed) return;
    updateProfile.mutate(
      { name: trimmed },
      { onSuccess: () => setDirty(false) },
    );
  };

  const handleChangePassword = () => {
    setPwError("");
    setPwSuccess("");
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 8) {
      setPwError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setPwSuccess("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
          setCurrentPassword("");
          setNewPassword("");
        },
        onError: (error) => {
          const axiosErr = error as { response?: { data?: { message?: string } } };
          setPwError(
            axiosErr?.response?.data?.message ?? "Đổi mật khẩu thất bại",
          );
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Hồ sơ cá nhân
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Xem và cập nhật thông tin cá nhân của bạn
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Avatar & Info */}
        <ProfileCard icon={User} title="Thông tin tài khoản">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <div className="shrink-0">
              <Image
                src={avatarSrc}
                alt={profile?.name ?? ""}
                width={80}
                height={80}
                className="size-20 rounded-full object-cover ring-2 ring-border"
              />
            </div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <div className="text-lg font-semibold text-card-foreground">
                  {profile?.name ?? "—"}
                </div>
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                  <Mail className="size-3.5" />
                  {profile?.email ?? "—"}
                </div>
              </div>
            </div>
          </div>
        </ProfileCard>

        {/* Edit Name */}
        <ProfileCard icon={Pencil} title="Chỉnh sửa hồ sơ">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Họ và tên
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setName(e.target.value);
                  setDirty(true);
                }}
                placeholder="Nhập họ và tên"
                className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:max-w-md"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Email
              </label>
              <input
                type="email"
                value={profile?.email ?? ""}
                disabled
                className="h-10 w-full rounded-lg border border-border bg-muted px-4 text-sm text-muted-foreground sm:max-w-md"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Email không thể thay đổi
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || !displayName.trim() || updateProfile.isPending}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateProfile.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Lưu thay đổi
            </button>
          </div>
        </ProfileCard>

        {/* Change Password — only for users with password */}
        {user?.hasPassword && (
          <ProfileCard icon={Lock} title="Đổi mật khẩu">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPwError("");
                  }}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:max-w-md"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPwError("");
                  }}
                  placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                  className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:max-w-md"
                />
              </div>

              {pwError && (
                <p className="text-sm text-destructive">{pwError}</p>
              )}
              {pwSuccess && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {pwSuccess}
                </p>
              )}

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={
                  !currentPassword ||
                  !newPassword ||
                  changePassword.isPending
                }
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changePassword.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Lock className="size-4" />
                )}
                Đổi mật khẩu
              </button>
            </div>
          </ProfileCard>
        )}
      </div>
    </div>
  );
}
