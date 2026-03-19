export type PricingCategory = "chat" | "video" | "image" | "music";

export const USD_TO_VND = 26000;

export interface PricingModel {
  id: string;
  model: string;
  category: PricingCategory;
  provider: string;
  unit: string;
  inputPrice: number;
  outputPrice: number;
  inputOfficial: number | null;
  outputOfficial: number | null;
}

export const pricingCategoryTabs: { id: "all" | PricingCategory; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "chat", label: "Chat" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "music", label: "Music" },
];

export const pricingModels: PricingModel[] = [
  // ── Moonshot ──
  { id: "kimi-k2.5", model: "Kimi K2.5", category: "chat", provider: "Moonshot", unit: "1M tokens", inputPrice: 1, outputPrice: 2, inputOfficial: 2, outputOfficial: 4 },
  { id: "kimi-k2-thinking", model: "Kimi K2 Thinking", category: "chat", provider: "Moonshot", unit: "1M tokens", inputPrice: 2, outputPrice: 3, inputOfficial: 4, outputOfficial: 6 },
  // ── ByteDance ──
  { id: "gpt-oss-120b", model: "GPT OSS 120B", category: "chat", provider: "ByteDance", unit: "1M tokens", inputPrice: 2, outputPrice: 4, inputOfficial: 4, outputOfficial: 8 },
  { id: "bytedance-seed-code", model: "ByteDance Seed Code", category: "chat", provider: "ByteDance", unit: "1M tokens", inputPrice: 2, outputPrice: 3, inputOfficial: 4, outputOfficial: 6 },
  // ── Zhipu ──
  { id: "glm-4.7", model: "GLM-4.7", category: "chat", provider: "Zhipu", unit: "1M tokens", inputPrice: 1, outputPrice: 1, inputOfficial: 2, outputOfficial: 2 },
  // ── DeepSeek ──
  { id: "deepseek-v3.2", model: "DeepSeek V3.2", category: "chat", provider: "DeepSeek", unit: "1M tokens", inputPrice: 1, outputPrice: 1, inputOfficial: 2, outputOfficial: 2 },
  // ── Google ──
  { id: "gemini-2.5-flash", model: "Gemini 2.5 Flash", category: "chat", provider: "Google", unit: "1M tokens", inputPrice: 0.108, outputPrice: 0.90, inputOfficial: 0.30, outputOfficial: 2.50 },
  { id: "gemini-2.5-pro", model: "Gemini 2.5 Pro", category: "chat", provider: "Google", unit: "1M tokens", inputPrice: 0.456, outputPrice: 3.60, inputOfficial: 1.25, outputOfficial: 10.00 },
  { id: "gemini-3-flash", model: "Gemini 3 Flash", category: "chat", provider: "Google", unit: "1M tokens", inputPrice: 0.18, outputPrice: 1.08, inputOfficial: 0.50, outputOfficial: 3.00 },
  { id: "gemini-3-pro", model: "Gemini 3 Pro", category: "chat", provider: "Google", unit: "1M tokens", inputPrice: 0.60, outputPrice: 4.20, inputOfficial: 2.00, outputOfficial: 12.00 },
  { id: "gemini-3.1-pro", model: "Gemini 3.1 Pro", category: "chat", provider: "Google", unit: "1M tokens", inputPrice: 0.60, outputPrice: 4.20, inputOfficial: 2.00, outputOfficial: 12.00 },
  // ── Anthropic ──
  { id: "claude-sonnet-4-5", model: "Claude Sonnet 4.5", category: "chat", provider: "Anthropic", unit: "1M tokens", inputPrice: 1.20, outputPrice: 3.60, inputOfficial: 3.00, outputOfficial: 15.00 },
  { id: "claude-opus-4-5", model: "Claude Opus 4.5", category: "chat", provider: "Anthropic", unit: "1M tokens", inputPrice: 3.60, outputPrice: 6.00, inputOfficial: 5.00, outputOfficial: 25.00 },
  // ── OpenAI ──
  { id: "gpt-5-4", model: "GPT-5.4", category: "chat", provider: "OpenAI", unit: "1M tokens", inputPrice: 0.528, outputPrice: 4.20, inputOfficial: 2.50, outputOfficial: 10.00 },
  { id: "openai-codex", model: "OpenAI Codex", category: "chat", provider: "OpenAI", unit: "1M tokens", inputPrice: 3, outputPrice: 6, inputOfficial: 6, outputOfficial: 12 },
  // ── Google — Image ──
  { id: "nano-banana-2-4k", model: "Nano Banana 2, 4K", category: "image", provider: "Google", unit: "image", inputPrice: 0.09, outputPrice: 0, inputOfficial: 0.16, outputOfficial: null },
  { id: "nano-banana-2-2k", model: "Nano Banana 2, 2K", category: "image", provider: "Google", unit: "image", inputPrice: 0.06, outputPrice: 0, inputOfficial: 0.12, outputOfficial: null },
  { id: "nano-banana-2-1k", model: "Nano Banana 2, 1K", category: "image", provider: "Google", unit: "image", inputPrice: 0.04, outputPrice: 0, inputOfficial: 0.08, outputOfficial: null },
  { id: "nano-banana-pro-half-2k", model: "Nano Banana Pro, 1/2K", category: "image", provider: "Google", unit: "image", inputPrice: 0.09, outputPrice: 0, inputOfficial: 0.15, outputOfficial: null },
  { id: "nano-banana-pro-4k", model: "Nano Banana Pro, 4K", category: "image", provider: "Google", unit: "image", inputPrice: 0.12, outputPrice: 0, inputOfficial: 0.30, outputOfficial: null },
  // ── Black Forest Labs — Image ──
  { id: "flux-2-pro-t2i-2k", model: "Flux-2 Pro, text-to-image, 2K", category: "image", provider: "Black Forest Labs", unit: "image", inputPrice: 0.035, outputPrice: 0, inputOfficial: 0.045, outputOfficial: null },
  { id: "flux-2-pro-i2i-2k", model: "Flux-2 Pro, image-to-image, 2K", category: "image", provider: "Black Forest Labs", unit: "image", inputPrice: 0.035, outputPrice: 0, inputOfficial: 0.06, outputOfficial: null },
  { id: "flux-2-pro-t2i-1k", model: "Flux-2 Pro, text-to-image, 1K", category: "image", provider: "Black Forest Labs", unit: "image", inputPrice: 0.025, outputPrice: 0, inputOfficial: 0.03, outputOfficial: null },
  { id: "flux-2-pro-i2i-1k", model: "Flux-2 Pro, image-to-image, 1K", category: "image", provider: "Black Forest Labs", unit: "image", inputPrice: 0.025, outputPrice: 0, inputOfficial: 0.045, outputOfficial: null },
  // ── ByteDance — Image ──
  { id: "seedream-5-lite-i2i", model: "Seedream 5.0 Lite, image-to-image", category: "image", provider: "ByteDance", unit: "image", inputPrice: 0.0275, outputPrice: 0, inputOfficial: 0.035, outputOfficial: null },
  { id: "seedream-5-lite-t2i", model: "Seedream 5.0 Lite, text-to-image", category: "image", provider: "ByteDance", unit: "image", inputPrice: 0.0275, outputPrice: 0, inputOfficial: 0.035, outputOfficial: null },
  // ── Grok — Image ──
  { id: "grok-imagine-i2i", model: "Grok Imagine, image-to-image", category: "image", provider: "Grok", unit: "image", inputPrice: 0.02, outputPrice: 0, inputOfficial: null, outputOfficial: null },
  { id: "grok-imagine-t2i", model: "Grok Imagine, text-to-image", category: "image", provider: "Grok", unit: "image", inputPrice: 0.02, outputPrice: 0, inputOfficial: null, outputOfficial: null },
  // ── Midjourney — Image ──
  { id: "midjourney", model: "Midjourney", category: "image", provider: "Midjourney", unit: "image", inputPrice: 25, outputPrice: 0, inputOfficial: 35, outputOfficial: null },
  // ── Video ──
  { id: "seedance-1.5-pro", model: "Seedance 1.5 Pro", category: "video", provider: "ByteDance", unit: "clip", inputPrice: 50, outputPrice: 0, inputOfficial: 65, outputOfficial: null },
  { id: "sora-2-pro", model: "Sora 2 Pro", category: "video", provider: "OpenAI", unit: "clip", inputPrice: 100, outputPrice: 0, inputOfficial: 120, outputOfficial: null },
];
