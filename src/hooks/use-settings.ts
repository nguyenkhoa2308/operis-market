"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarUrl: string | null;
  role: string;
}

export interface UserSettings {
  userId: string;
  theme: string;
  emailNotifications: boolean;
  balanceAlerts: number[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  status: string;
}

export interface WebhookKey {
  id: string;
  hmacKey: string;
  createdAt: string;
}

export function useSettings(enabled = true) {
  return useQuery<UserSettings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data.data;
    },
    enabled,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { theme?: string; emailNotifications?: boolean; balanceAlerts?: number[] }) => {
      const res = await api.put("/settings", body);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ["settings", "profile"],
    queryFn: async () => {
      const res = await api.get("/settings/profile");
      return res.data.data;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name?: string; avatarUrl?: string }) => {
      const res = await api.put("/settings/profile", body);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "profile"] });
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useTeam(enabled = true) {
  return useQuery<TeamMember[]>({
    queryKey: ["settings", "team"],
    queryFn: async () => {
      const res = await api.get("/settings/team");
      return res.data.data;
    },
    enabled,
  });
}

export function useWebhooks(enabled = true) {
  return useQuery<WebhookKey[]>({
    queryKey: ["settings", "webhooks"],
    queryFn: async () => {
      const res = await api.get("/settings/webhooks");
      return res.data.data;
    },
    enabled,
  });
}

export function useCreateWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/settings/webhooks");
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "webhooks"] }),
  });
}
