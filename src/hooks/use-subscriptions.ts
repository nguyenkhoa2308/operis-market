"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyCredits: number;
  features: string[];
}

export interface Subscription {
  id: string;
  planSlug: string;
  billingCycle: string;
  status: string;
  currentPeriodEnd: string;
}

export function useSubscriptionPlans() {
  return useQuery<SubscriptionPlan[]>({
    queryKey: ["subscriptions", "plans"],
    queryFn: async () => {
      const res = await api.get("/subscriptions/plans");
      return res.data.data;
    },
  });
}

export function useMySubscription() {
  return useQuery<Subscription | null>({
    queryKey: ["subscriptions", "my"],
    queryFn: async () => {
      const res = await api.get("/subscriptions/my");
      return res.data.data;
    },
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { planSlug: string; billingCycle: string }) => {
      const res = await api.post("/subscriptions/subscribe", body);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
      qc.invalidateQueries({ queryKey: ["billing", "balance"] });
    },
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/subscriptions/cancel");
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });
}

export function useChangePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newPlanSlug: string) => {
      const res = await api.put("/subscriptions/change-plan", { newPlanSlug });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
      qc.invalidateQueries({ queryKey: ["billing", "balance"] });
    },
  });
}
