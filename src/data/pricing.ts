export type PricingCategory = "chat" | "video" | "image" | "music";

export interface PricingTier {
  name: string;
  category: PricingCategory;
  provider: string;
  credits: number;
  creditUnit: string;
  ourPrice: number;
  marketPrice: number | null;
}

export interface PricingGroup {
  id: string;
  model: string;
  tiers: PricingTier[];
}

export const pricingCategoryTabs: { id: "all" | PricingCategory; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "chat", label: "Chat" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "music", label: "Music" },
];

export const pricingGroups: PricingGroup[] = [
  // ── BytePlus Coding Plan ──
  {
    id: "kimi-k2.5",
    model: "Kimi K2.5",
    tiers: [
      { name: "Kimi K2.5 Input", category: "chat", provider: "BytePlus", credits: 1, creditUnit: "1K tokens", ourPrice: 1, marketPrice: 2 },
      { name: "Kimi K2.5 Output", category: "chat", provider: "BytePlus", credits: 2, creditUnit: "1K tokens", ourPrice: 2, marketPrice: 4 },
    ],
  },
  {
    id: "kimi-k2-thinking",
    model: "Kimi K2 Thinking",
    tiers: [
      { name: "Kimi K2 Thinking Input", category: "chat", provider: "BytePlus", credits: 2, creditUnit: "1K tokens", ourPrice: 2, marketPrice: 4 },
      { name: "Kimi K2 Thinking Output", category: "chat", provider: "BytePlus", credits: 3, creditUnit: "1K tokens", ourPrice: 3, marketPrice: 6 },
    ],
  },
  {
    id: "gpt-oss-120b",
    model: "GPT OSS 120B",
    tiers: [
      { name: "GPT OSS 120B Input", category: "chat", provider: "BytePlus", credits: 2, creditUnit: "1K tokens", ourPrice: 2, marketPrice: 4 },
      { name: "GPT OSS 120B Output", category: "chat", provider: "BytePlus", credits: 4, creditUnit: "1K tokens", ourPrice: 4, marketPrice: 8 },
    ],
  },
  {
    id: "bytedance-seed-code",
    model: "ByteDance Seed Code",
    tiers: [
      { name: "Seed Code Input", category: "chat", provider: "BytePlus", credits: 2, creditUnit: "1K tokens", ourPrice: 2, marketPrice: 4 },
      { name: "Seed Code Output", category: "chat", provider: "BytePlus", credits: 3, creditUnit: "1K tokens", ourPrice: 3, marketPrice: 6 },
    ],
  },
  {
    id: "glm-4.7",
    model: "GLM-4.7",
    tiers: [
      { name: "GLM-4.7 Input", category: "chat", provider: "BytePlus", credits: 1, creditUnit: "1K tokens", ourPrice: 1, marketPrice: 2 },
      { name: "GLM-4.7 Output", category: "chat", provider: "BytePlus", credits: 1, creditUnit: "1K tokens", ourPrice: 1, marketPrice: 2 },
    ],
  },
  {
    id: "deepseek-v3.2",
    model: "DeepSeek V3.2",
    tiers: [
      { name: "DeepSeek V3.2 Input", category: "chat", provider: "BytePlus", credits: 1, creditUnit: "1K tokens", ourPrice: 1, marketPrice: 2 },
      { name: "DeepSeek V3.2 Output", category: "chat", provider: "BytePlus", credits: 1, creditUnit: "1K tokens", ourPrice: 1, marketPrice: 2 },
    ],
  },
  // ── KIE.AI Chat ──
  {
    id: "gemini-2.5-flash",
    model: "Gemini 2.5 Flash",
    tiers: [
      { name: "Gemini 2.5 Flash Input", category: "chat", provider: "KIE.AI", credits: 2, creditUnit: "1K tokens", ourPrice: 2, marketPrice: 4 },
      { name: "Gemini 2.5 Flash Output", category: "chat", provider: "KIE.AI", credits: 4, creditUnit: "1K tokens", ourPrice: 4, marketPrice: 8 },
    ],
  },
  {
    id: "gemini-2.5-pro",
    model: "Gemini 2.5 Pro",
    tiers: [
      { name: "Gemini 2.5 Pro Input", category: "chat", provider: "KIE.AI", credits: 4, creditUnit: "1K tokens", ourPrice: 4, marketPrice: 8 },
      { name: "Gemini 2.5 Pro Output", category: "chat", provider: "KIE.AI", credits: 8, creditUnit: "1K tokens", ourPrice: 8, marketPrice: 16 },
    ],
  },
  {
    id: "claude-sonnet-4-5",
    model: "Claude Sonnet 4.5",
    tiers: [
      { name: "Claude Sonnet 4.5 Input", category: "chat", provider: "KIE.AI", credits: 3, creditUnit: "1K tokens", ourPrice: 3, marketPrice: 6 },
      { name: "Claude Sonnet 4.5 Output", category: "chat", provider: "KIE.AI", credits: 6, creditUnit: "1K tokens", ourPrice: 6, marketPrice: 12 },
    ],
  },
  {
    id: "claude-opus-4-5",
    model: "Claude Opus 4.5",
    tiers: [
      { name: "Claude Opus 4.5 Input", category: "chat", provider: "KIE.AI", credits: 8, creditUnit: "1K tokens", ourPrice: 8, marketPrice: 16 },
      { name: "Claude Opus 4.5 Output", category: "chat", provider: "KIE.AI", credits: 16, creditUnit: "1K tokens", ourPrice: 16, marketPrice: 32 },
    ],
  },
  {
    id: "gpt-5-4",
    model: "GPT-5.4",
    tiers: [
      { name: "GPT-5.4 Input", category: "chat", provider: "KIE.AI", credits: 5, creditUnit: "1K tokens", ourPrice: 5, marketPrice: 10 },
      { name: "GPT-5.4 Output", category: "chat", provider: "KIE.AI", credits: 10, creditUnit: "1K tokens", ourPrice: 10, marketPrice: 20 },
    ],
  },
  {
    id: "openai-codex",
    model: "OpenAI Codex",
    tiers: [
      { name: "Codex Input", category: "chat", provider: "KIE.AI", credits: 3, creditUnit: "1K tokens", ourPrice: 3, marketPrice: 6 },
      { name: "Codex Output", category: "chat", provider: "KIE.AI", credits: 6, creditUnit: "1K tokens", ourPrice: 6, marketPrice: 12 },
    ],
  },
  {
    id: "gemini-3-flash",
    model: "Gemini 3 Flash",
    tiers: [
      { name: "Gemini 3 Flash Input", category: "chat", provider: "KIE.AI", credits: 2, creditUnit: "1K tokens", ourPrice: 2, marketPrice: 4 },
      { name: "Gemini 3 Flash Output", category: "chat", provider: "KIE.AI", credits: 4, creditUnit: "1K tokens", ourPrice: 4, marketPrice: 8 },
    ],
  },
  {
    id: "gemini-3-pro",
    model: "Gemini 3 Pro",
    tiers: [
      { name: "Gemini 3 Pro Input", category: "chat", provider: "KIE.AI", credits: 4, creditUnit: "1K tokens", ourPrice: 4, marketPrice: 8 },
      { name: "Gemini 3 Pro Output", category: "chat", provider: "KIE.AI", credits: 8, creditUnit: "1K tokens", ourPrice: 8, marketPrice: 16 },
    ],
  },
  {
    id: "gemini-3.1-pro",
    model: "Gemini 3.1 Pro",
    tiers: [
      { name: "Gemini 3.1 Pro Input", category: "chat", provider: "KIE.AI", credits: 5, creditUnit: "1K tokens", ourPrice: 5, marketPrice: 10 },
      { name: "Gemini 3.1 Pro Output", category: "chat", provider: "KIE.AI", credits: 10, creditUnit: "1K tokens", ourPrice: 10, marketPrice: 20 },
    ],
  },
  // ── KIE.AI Image ──
  {
    id: "nano-banana-2",
    model: "Nano Banana 2",
    tiers: [
      { name: "Nano Banana 2", category: "image", provider: "KIE.AI", credits: 10, creditUnit: "image", ourPrice: 10, marketPrice: 15 },
    ],
  },
  {
    id: "nano-banana-pro",
    model: "Nano Banana Pro",
    tiers: [
      { name: "Nano Banana Pro", category: "image", provider: "KIE.AI", credits: 20, creditUnit: "image", ourPrice: 20, marketPrice: 30 },
    ],
  },
  {
    id: "grok-imagine",
    model: "Grok Imagine",
    tiers: [
      { name: "Grok Imagine", category: "image", provider: "KIE.AI", credits: 15, creditUnit: "image", ourPrice: 15, marketPrice: 20 },
    ],
  },
  {
    id: "midjourney",
    model: "Midjourney",
    tiers: [
      { name: "Midjourney", category: "image", provider: "KIE.AI", credits: 25, creditUnit: "image", ourPrice: 25, marketPrice: 35 },
    ],
  },
  // ── KIE.AI Video ──
  {
    id: "seedance-1.5-pro",
    model: "Seedance 1.5 Pro",
    tiers: [
      { name: "Seedance 1.5 Pro", category: "video", provider: "KIE.AI", credits: 50, creditUnit: "clip", ourPrice: 50, marketPrice: 65 },
    ],
  },
  {
    id: "sora-2-pro",
    model: "Sora 2 Pro",
    tiers: [
      { name: "Sora 2 Pro", category: "video", provider: "KIE.AI", credits: 100, creditUnit: "clip", ourPrice: 100, marketPrice: 120 },
    ],
  },
];
