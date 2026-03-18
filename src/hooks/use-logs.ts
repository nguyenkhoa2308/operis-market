"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface LogEntry {
  id: string;
  model: string;
  date: string;
  time: string;
  duration: number;
  input: string;
  status: "success" | "failed" | "processing";
  creditsConsumed: number;
  taskId: string;
  hasResult: boolean;
}

export interface DailyUsage {
  date: string;
  spend: number;
  credits: number;
}

export interface UsageStats {
  dailyUsage: DailyUsage[];
  endpointUsage: {
    name: string;
    totalSpend: number;
    totalCredits: number;
    daily: DailyUsage[];
  }[];
  keyUsage: {
    name: string;
    keyHash: string;
    createdAt: string;
    lastUsed: string;
    totalSpend: number;
    totalCredits: number;
    daily: DailyUsage[];
  }[];
}

export function useLogs(
  params: {
    model?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  } = {},
) {
  return useQuery<{
    data: LogEntry[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }>({
    queryKey: ["logs", params],
    queryFn: async () => {
      const res = await api.get("/logs", { params });
      return res.data;
    },
  });
}

export function useUsage() {
  return useQuery<UsageStats>({
    queryKey: ["logs", "usage"],
    queryFn: async () => {
      const res = await api.get("/logs/usage");
      return res.data.data;
    },
  });
}

export interface AccountUsage {
  totalSpend: number;
  totalRequests: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  dailyUsage: { date: string; spend: number }[];
  modelUsage: { model: string; spend: number; requests: number; promptTokens: number; completionTokens: number }[];
}

export interface KeyUsageItem {
  keyAlias: string | null;
  keyHash: string | null;
  keyPrefix: string | null;
  spend: number;
  maxBudget: number | null;
  createdAt: string | null;
  expiresAt: string | null;
  models: string[];
}

export function useAccountUsage(startDate?: string, endDate?: string) {
  return useQuery<AccountUsage>({
    queryKey: ["logs", "account-usage", startDate, endDate],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await api.get("/logs/usage/account", { params });
      return res.data.data;
    },
  });
}

export function useKeyUsage() {
  return useQuery<KeyUsageItem[]>({
    queryKey: ["logs", "key-usage"],
    queryFn: async () => {
      const res = await api.get("/logs/usage/keys");
      return res.data.data;
    },
  });
}
