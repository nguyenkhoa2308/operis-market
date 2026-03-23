"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface FeedbackItem {
  id: string;
  type: "bug" | "suggestion" | "support";
  subject: string;
  message: string;
  status: "open" | "reviewed" | "resolved";
  adminNote: string | null;
  createdAt: string;
}

export function useCreateFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { type: string; subject: string; message: string }) => {
      const res = await api.post("/feedback", body);
      return res.data.data as FeedbackItem;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedback"] });
    },
  });
}

export function useFeedbacks(page = 1, limit = 10) {
  return useQuery<{
    data: FeedbackItem[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }>({
    queryKey: ["feedback", page, limit],
    queryFn: async () => {
      const res = await api.get("/feedback", { params: { page, limit } });
      return res.data;
    },
  });
}
