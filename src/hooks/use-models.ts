"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Model, ModelDetail, ModelPricingTier, BannerSlide } from "@/types/market";

interface RawFilterOption {
  id: string;
  label: string;
}

interface RawFilterCategory {
  label: string;
  filterOptions: RawFilterOption[];
}

interface RawFiltersResponse {
  categories: RawFilterCategory[];
  providers: (string | { name: string })[];
}

interface FilterOption {
  id: string;
  label: string;
}

interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FiltersData {
  categories: FilterCategory[];
  providers: string[];
}

interface ModelsResponse {
  data: Model[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export function useModels(params: {
  q?: string;
  category?: string;
  taskTags?: string;
  provider?: string;
  page?: number;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: ["models", params],
    queryFn: async () => {
      const res = await api.get("/models", { params });
      return res.data as ModelsResponse;
    },
    placeholderData: keepPreviousData,
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
  return useQuery<FiltersData>({
    queryKey: ["filters"],
    queryFn: async () => {
      const res = await api.get("/filters");
      const raw = res.data.data as RawFiltersResponse;
      const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
      return {
        categories: (raw.categories ?? [])
          .filter((cat) => cat.label !== "Provider")
          .map((cat) => ({
            id: toSlug(cat.label),
            label: cat.label,
            options: (cat.filterOptions ?? []).map((opt) => ({
              id: toSlug(opt.label),
              label: opt.label,
            })),
          })),
        providers: (raw.providers ?? []).map((p) =>
          typeof p === "string" ? p : p.name,
        ),
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

interface PricingListModel {
  id: string;
  name: string;
  slug: string;
  category: string;
  provider: string;
  priceCount: number;
  prices: (ModelPricingTier & { discount: number | null })[];
}

interface PricingListResponse {
  models: PricingListModel[];
  counts: Record<string, number>;
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export function usePricingList(params: {
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
} = {}) {
  return useQuery<PricingListResponse>({
    queryKey: ["pricing-list", params],
    queryFn: async () => {
      const res = await api.get("/models/pricing", { params });
      return res.data;
    },
  });
}

export function useModelPricing(slug: string) {
  return useQuery<ModelPricingTier[]>({
    queryKey: ["models", slug, "pricing"],
    queryFn: async () => {
      const res = await api.get(`/models/${slug}/pricing`);
      return res.data.data;
    },
    enabled: !!slug,
  });
}
