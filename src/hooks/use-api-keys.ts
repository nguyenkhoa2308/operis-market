"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  isRevoked: boolean;
  hourlyLimit: number;
  dailyLimit: number;
  totalLimit: number;
  ipWhitelist: string[];
  createdAt: string;
}

export interface ApiKeyCreated {
  id: string;
  name: string;
  key: string;
  keyPrefix: string;
}

export function useApiKeys() {
  return useQuery<ApiKeyItem[]>({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const res = await api.get("/api-keys");
      return res.data.data;
    },
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post("/api-keys", { name });
      return res.data.data as ApiKeyCreated;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-keys"] }),
  });
}

export function useRenameApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await api.patch(`/api-keys/${id}`, { name });
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-keys"] }),
  });
}

export function useDeleteApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api-keys/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-keys"] }),
  });
}

export function useUpdateLimits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      hourlyLimit,
      dailyLimit,
      totalLimit,
    }: {
      id: string;
      hourlyLimit: number;
      dailyLimit: number;
      totalLimit: number;
    }) => {
      const res = await api.put(`/api-keys/${id}/limits`, { hourlyLimit, dailyLimit, totalLimit });
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-keys"] }),
  });
}

export function useUpdateWhitelist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ips }: { id: string; ips: string[] }) => {
      const res = await api.put(`/api-keys/${id}/whitelist`, { ips });
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-keys"] }),
  });
}
