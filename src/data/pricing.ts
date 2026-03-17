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
  {
    id: "gpt-4o",
    model: "GPT-4o",
    tiers: [
      { name: "GPT-4o Input", category: "chat", provider: "OpenAI", credits: 1000, creditUnit: "1K tokens", ourPrice: 2.0, marketPrice: 2.5 },
      { name: "GPT-4o Output", category: "chat", provider: "OpenAI", credits: 1000, creditUnit: "1K tokens", ourPrice: 6.0, marketPrice: 7.5 },
    ],
  },
  {
    id: "claude-3-5-sonnet",
    model: "Claude 3.5 Sonnet",
    tiers: [
      { name: "Claude Sonnet Input", category: "chat", provider: "Anthropic", credits: 1000, creditUnit: "1K tokens", ourPrice: 3.0, marketPrice: 3.0 },
      { name: "Claude Sonnet Output", category: "chat", provider: "Anthropic", credits: 1000, creditUnit: "1K tokens", ourPrice: 15.0, marketPrice: 15.0 },
    ],
  },
  {
    id: "gemini-2-flash",
    model: "Gemini 2.0 Flash",
    tiers: [
      { name: "Gemini Flash Input", category: "chat", provider: "Google", credits: 1000, creditUnit: "1K tokens", ourPrice: 0.075, marketPrice: 0.1 },
      { name: "Gemini Flash Output", category: "chat", provider: "Google", credits: 1000, creditUnit: "1K tokens", ourPrice: 0.3, marketPrice: 0.4 },
    ],
  },
  {
    id: "llama-3-1-405b",
    model: "Llama 3.1 405B",
    tiers: [
      { name: "Llama 405B Input", category: "chat", provider: "Meta", credits: 1000, creditUnit: "1K tokens", ourPrice: 2.0, marketPrice: 3.0 },
      { name: "Llama 405B Output", category: "chat", provider: "Meta", credits: 1000, creditUnit: "1K tokens", ourPrice: 6.0, marketPrice: 8.0 },
    ],
  },
  {
    id: "dall-e-3",
    model: "DALL-E 3",
    tiers: [
      { name: "DALL-E 3 Standard", category: "image", provider: "OpenAI", credits: 1, creditUnit: "image", ourPrice: 8.0, marketPrice: 10.0 },
      { name: "DALL-E 3 HD", category: "image", provider: "OpenAI", credits: 1, creditUnit: "image", ourPrice: 12.0, marketPrice: 15.0 },
    ],
  },
  {
    id: "stable-diffusion-xl",
    model: "Stable Diffusion XL",
    tiers: [
      { name: "SDXL Standard", category: "image", provider: "Stability AI", credits: 1, creditUnit: "image", ourPrice: 4.0, marketPrice: 6.0 },
    ],
  },
  {
    id: "midjourney-v6",
    model: "Midjourney v6",
    tiers: [
      { name: "Midjourney v6", category: "image", provider: "Midjourney", credits: 1, creditUnit: "image", ourPrice: 12.0, marketPrice: 15.0 },
    ],
  },
  {
    id: "runway-gen3-alpha",
    model: "Runway Gen-3 Alpha",
    tiers: [
      { name: "Runway Gen-3 5s", category: "video", provider: "Runway", credits: 1, creditUnit: "5s clip", ourPrice: 50.0, marketPrice: 65.0 },
    ],
  },
  {
    id: "sora",
    model: "Sora",
    tiers: [
      { name: "Sora 10s", category: "video", provider: "OpenAI", credits: 1, creditUnit: "10s clip", ourPrice: 100.0, marketPrice: 120.0 },
    ],
  },
  {
    id: "suno-v3-5",
    model: "Suno v3.5",
    tiers: [
      { name: "Suno Song", category: "music", provider: "Suno", credits: 1, creditUnit: "song", ourPrice: 20.0, marketPrice: 25.0 },
    ],
  },
];
