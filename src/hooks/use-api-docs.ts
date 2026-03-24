"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ApiEndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiEndpointData {
  id: string;
  method: string;
  name: string;
  path: string;
  description: string;
  category: string;
  params: ApiEndpointParam[];
}

export interface ApiDocsRateLimits {
  rpm: number;
  tpm: number;
  maxParallelRequests: number;
}

export interface ApiDocsErrorCode {
  code: number;
  name: string;
  description: string;
}

export interface ApiDocsReference {
  endpoints: ApiEndpointData[];
  rateLimits: ApiDocsRateLimits;
  errorCodes: ApiDocsErrorCode[];
}

export function useApiDocs() {
  return useQuery<ApiDocsReference>({
    queryKey: ["api-docs-reference"],
    queryFn: async () => {
      const res = await api.get("/api-reference/reference");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Get endpoints filtered by category */
export function getEndpointsForCategory(
  endpoints: ApiEndpointData[] | undefined,
  category: string,
): ApiEndpointData[] {
  if (!endpoints) return [];
  return endpoints.filter(
    (ep) => ep.category === category || ep.category === "all",
  );
}

/** Get the primary endpoint for a category (the main POST endpoint) */
export function getPrimaryEndpoint(
  endpoints: ApiEndpointData[] | undefined,
  category: string,
): ApiEndpointData | undefined {
  if (!endpoints) return undefined;
  return endpoints.find((ep) => ep.category === category && ep.method === "POST");
}
