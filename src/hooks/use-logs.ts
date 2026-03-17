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
