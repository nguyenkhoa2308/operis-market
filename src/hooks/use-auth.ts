"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

const protectedPaths = ["/profile", "/api-keys", "/billing", "/usage", "/logs"];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  hasPassword: boolean;
}

export function useUser() {
  return useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data.data;
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 min — user data rarely changes
    refetchOnWindowFocus: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const res = await api.post("/auth/login", body);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.push("/market");
    },
    onError: (error: any) => {
      const data = error?.response?.data?.data;
      if (
        error?.response?.status === 403 &&
        data?.code === "EMAIL_NOT_VERIFIED" &&
        data?.email
      ) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}&resend=1`);
      }
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (body: {
      name: string;
      email: string;
      password: string;
    }) => {
      const res = await api.post("/auth/register", body);
      return { ...res.data.data, email: body.email };
    },
    onSuccess: (data) => {
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      // Full page reload ensures React tree is fully rebuilt with no stale auth state
      if (protectedPaths.some((p) => pathname.startsWith(p))) {
        window.location.href = "/login";
      } else {
        window.location.href = "/";
      }
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (token: string) => {
      const res = await api.post("/auth/verify-email", { token });
      return res.data.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post("/auth/resend-verification", { email });
      return res.data.data;
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post("/auth/forgot-password", { email });
      return res.data.data;
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (body: { token: string; newPassword: string }) => {
      const res = await api.post("/auth/reset-password", body);
      return res.data.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (body: { password?: string }) => {
      const res = await api.delete("/auth/delete-account", { data: body });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.cancelQueries();
      queryClient.clear();
      router.push("/");
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (body: { currentPassword: string; newPassword: string }) => {
      const res = await api.put("/auth/change-password", body);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.cancelQueries();
      queryClient.clear();
      router.push("/login");
    },
  });
}
