"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ApiUpdate {
  id: string;
  date: string;
  tag: string;
  title: string;
  content: string;
}

export function useUpdates(params: { tag?: string; page?: number; limit?: number } = {}) {
  return useQuery<{
    data: ApiUpdate[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }>({
    queryKey: ["updates", params],
    queryFn: async () => {
      const res = await api.get("/updates", { params });
      return res.data;
    },
  });
}

export function useUpdateTags() {
  return useQuery<{ id: string; name: string }[]>({
    queryKey: ["updates", "tags"],
    queryFn: async () => {
      const res = await api.get("/updates/tags");
      return res.data.data;
    },
  });
}
