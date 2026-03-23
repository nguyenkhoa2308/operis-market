"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface TopupPackage {
  id: string;
  price: number;
  badge?: string;
}

export interface Transaction {
  id: string;
  amountVnd: number;
  type: string;
  status: string;
  description: string | null;
  createdAt: string;
}

export interface SepayOrder {
  transactionId: string;
  orderCode: string;
  amountVnd: number;
  status: string;
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    transferContent: string;
    qrCodeUrl: string;
  };
  expiresAt: string;
  createdAt: string;
}

export function useBalance() {
  return useQuery<{ balance: number }>({
    queryKey: ["billing", "balance"],
    queryFn: async () => {
      const res = await api.get("/billing/balance");
      return res.data.data;
    },
  });
}

export function usePackages() {
  return useQuery<TopupPackage[]>({
    queryKey: ["billing", "packages"],
    queryFn: async () => {
      const res = await api.get("/billing/packages");
      return res.data.data;
    },
  });
}

export function useTransactions(page = 1, limit = 10) {
  return useQuery<{
    data: Transaction[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }>({
    queryKey: ["billing", "transactions", page, limit],
    queryFn: async () => {
      const res = await api.get("/billing/transactions", { params: { page, limit } });
      return res.data;
    },
  });
}

export function usePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (packageId: string) => {
      const res = await api.post("/billing/purchase", { packageId });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing"] });
    },
  });
}

export function usePendingOrder() {
  return useQuery<SepayOrder | null>({
    queryKey: ["billing", "sepay", "pending"],
    queryFn: async () => {
      const res = await api.get("/billing/sepay/pending");
      return res.data.data?.order ?? null;
    },
  });
}

export function useCreateSepayOrder() {
  return useMutation({
    mutationFn: async (body: { amount: number }) => {
      const res = await api.post("/billing/sepay/create-order", body);
      return res.data.data as SepayOrder;
    },
  });
}

export function useSepayStatus(id: string | null) {
  const qc = useQueryClient();
  return useQuery<SepayOrder>({
    queryKey: ["billing", "sepay", id],
    queryFn: async () => {
      const res = await api.get(`/billing/sepay/status/${id}`);
      const data = res.data.data as SepayOrder;
      if (data.status === "completed") {
        qc.invalidateQueries({ queryKey: ["billing", "balance"] });
        qc.invalidateQueries({ queryKey: ["billing", "transactions"] });
        qc.invalidateQueries({ queryKey: ["billing", "sepay", "pending"] });
      }
      return data;
    },
    enabled: !!id,
  });
}
