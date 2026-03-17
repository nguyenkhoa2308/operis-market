/* ─── Playground field types ─── */
interface FieldOption {
  label: string;
  value: string;
}

interface PlaygroundField {
  name: string;
  label: string;
  type: "textarea" | "select" | "options" | "toggle" | "file" | "number";
  description?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: FieldOption[];
}

/* ─── Category-based playground fields ─── */
const chatFields: PlaygroundField[] = [
  { name: "prompt", label: "Prompt", type: "textarea", description: "Enter your message", required: true, placeholder: "Type your message here..." },
  { name: "temperature", label: "Temperature", type: "number", description: "Controls randomness (0-2)", defaultValue: "0.7" },
  { name: "max_tokens", label: "Max Tokens", type: "number", description: "Maximum tokens to generate", defaultValue: "2048" },
  { name: "stream", label: "Stream", type: "toggle", description: "Enable streaming response", defaultValue: "true" },
];

const imageFields: PlaygroundField[] = [
  { name: "prompt", label: "Prompt", type: "textarea", description: "Describe the image", required: true, placeholder: "A sunset over mountains..." },
  {
    name: "size", label: "Size", type: "select", description: "Image dimensions", required: true, defaultValue: "1024x1024",
    options: [
      { label: "256x256", value: "256x256" },
      { label: "512x512", value: "512x512" },
      { label: "1024x1024", value: "1024x1024" },
      { label: "1024x1792", value: "1024x1792" },
      { label: "1792x1024", value: "1792x1024" },
    ],
  },
  {
    name: "style", label: "Style", type: "select", description: "Art style", defaultValue: "natural",
    options: [
      { label: "Natural", value: "natural" },
      { label: "Vivid", value: "vivid" },
      { label: "Anime", value: "anime" },
      { label: "Photorealistic", value: "photorealistic" },
    ],
  },
];

const videoFields: PlaygroundField[] = [
  { name: "prompt", label: "Prompt", type: "textarea", description: "Describe the video", required: true, placeholder: "A drone flying over a city..." },
  {
    name: "duration", label: "Duration", type: "select", description: "Video length", required: true, defaultValue: "5",
    options: [
      { label: "4 seconds", value: "4" },
      { label: "5 seconds", value: "5" },
      { label: "10 seconds", value: "10" },
      { label: "15 seconds", value: "15" },
    ],
  },
  { name: "reference_image", label: "Reference Image", type: "file", description: "Optional reference image for img-to-video" },
];

const musicFields: PlaygroundField[] = [
  { name: "prompt", label: "Prompt", type: "textarea", description: "Describe the music", required: true, placeholder: "An upbeat pop song about summer..." },
  {
    name: "genre", label: "Genre", type: "select", description: "Music genre", defaultValue: "pop",
    options: [
      { label: "Pop", value: "pop" },
      { label: "Rock", value: "rock" },
      { label: "Hip Hop", value: "hiphop" },
      { label: "Electronic", value: "electronic" },
      { label: "Jazz", value: "jazz" },
      { label: "Classical", value: "classical" },
      { label: "Lo-Fi", value: "lofi" },
    ],
  },
  { name: "instrumental", label: "Instrumental Only", type: "toggle", description: "Remove vocals", defaultValue: "false" },
];

const fieldsByCategory: Record<string, PlaygroundField[]> = {
  chat: chatFields,
  image: imageFields,
  video: videoFields,
  music: musicFields,
};

export function getPlaygroundFields(
  _slug: string,
  category: "image" | "video" | "music" | "chat",
): PlaygroundField[] {
  return fieldsByCategory[category] ?? chatFields;
}

/* ─── Status bars ─── */
export function generateStatusBars(): ("ok" | "degraded" | "error")[] {
  const bars: ("ok" | "degraded" | "error")[] = [];
  for (let i = 0; i < 48; i++) {
    const r = Math.random();
    bars.push(r < 0.92 ? "ok" : r < 0.97 ? "degraded" : "error");
  }
  return bars;
}

/* ─── API Endpoints (for API tab) ─── */
export const apiEndpoints = [
  { name: "Chat Completion", method: "POST", path: "/v1/chat/completions", description: "Generate a chat completion response from the specified model" },
  { name: "Image Generation", method: "POST", path: "/v1/images/generations", description: "Create an image given a text prompt" },
  { name: "Video Generation", method: "POST", path: "/v1/videos/generations", description: "Create a video clip from a text or image prompt" },
  { name: "Music Generation", method: "POST", path: "/v1/music/generations", description: "Generate a music track from a text description" },
  { name: "List Models", method: "GET", path: "/v1/models", description: "List available AI models with pricing and capabilities" },
  { name: "Check Balance", method: "GET", path: "/v1/balance", description: "Get current credit balance for authenticated user" },
];

/* ─── Request body example ─── */
export const requestBodyExample = `{
  "model": "string",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2048,
  "stream": false
}`;

/* ─── Root parameters ─── */
export const rootParams = [
  { name: "model", type: "string", required: true, description: "The model slug to use for generation (e.g. gpt-4o, claude-3-5-sonnet)" },
  { name: "messages", type: "array", required: true, description: "Array of message objects with role and content" },
  { name: "temperature", type: "number", required: false, description: "Sampling temperature (0-2), controls randomness. Default 0.7" },
  { name: "max_tokens", type: "integer", required: false, description: "Maximum number of tokens to generate. Default 2048" },
  { name: "stream", type: "boolean", required: false, description: "Enable streaming response. Default false" },
];
