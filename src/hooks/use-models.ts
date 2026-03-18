"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Model, ModelDetail, BannerSlide } from "@/types/market";

export function useModels(params: {
  q?: string;
  category?: string;
  tags?: string;
  provider?: string;
  page?: number;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: ["models", params],
    queryFn: async () => {
      const res = await api.get("/models", { params });
      return res.data as {
        data: Model[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      };
    },
  });
}

export function useFeaturedModels() {
  return useQuery<BannerSlide[]>({
    queryKey: ["models", "featured"],
    queryFn: async () => {
      const res = await api.get("/models/featured");
      return res.data.data;
    },
  });
}

export function useFilters() {
  return useQuery<{ categories: { id: string; label: string; options: { id: string; label: string }[] }[]; providers: string[] }>({
    queryKey: ["filters"],
    queryFn: async () => {
      const res = await api.get("/filters");
      const raw = res.data.data;
      const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
      return {
        categories: (raw.categories ?? [])
          .filter((cat: any) => cat.label !== "Provider")
          .map((cat: any) => ({
            id: toSlug(cat.label),
            label: cat.label,
            options: (cat.filterOptions ?? []).map((opt: any) => ({
              id: toSlug(opt.label),
              label: opt.label,
            })),
          })),
        providers: (raw.providers ?? []).map((p: any) => p.name ?? p),
      };
    },
  });
}

export function useModelDetail(slug: string, initialData?: ModelDetail) {
  return useQuery<ModelDetail>({
    queryKey: ["models", slug],
    queryFn: async () => {
      const res = await api.get(`/models/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
    initialData,
  });
}

export function useModelPricing(slug: string) {
  return useQuery({
    queryKey: ["models", slug, "pricing"],
    queryFn: async () => {
      const res = await api.get(`/models/${slug}/pricing`);
      return res.data.data;
    },
    enabled: !!slug,
  });
}
