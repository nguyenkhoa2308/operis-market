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
  { name: "Chat Completion", method: "POST", path: "/v1/chat/completions", description: "Generate a chat completion response from the specified model", categories: ["chat"] },
  { name: "Image Generation", method: "POST", path: "/v1/images/generations", description: "Create an image given a text prompt", categories: ["image"] },
  { name: "Video Generation", method: "POST", path: "/v1/videos/generations", description: "Create a video clip from a text or image prompt", categories: ["video"] },
  { name: "Music Generation", method: "POST", path: "/v1/music/generations", description: "Generate a music track from a text description", categories: ["music"] },
  { name: "List Models", method: "GET", path: "/v1/models", description: "List available AI models with pricing and capabilities", categories: ["chat", "image", "video", "music"] },
  { name: "Check Balance", method: "GET", path: "/v1/balance", description: "Get current credit balance for authenticated user", categories: ["chat", "image", "video", "music"] },
];

export function getApiEndpointsForCategory(category: string) {
  return apiEndpoints.filter((ep) => ep.categories.includes(category));
}

/* ─── Examples by category ─── */
export interface ExampleItem {
  title: string;
  description: string;
  prompt: string;
}

export const examplesByCategory: Record<string, ExampleItem[]> = {
  chat: [
    { title: "Tóm tắt văn bản", description: "Tóm tắt nội dung dài thành điểm chính", prompt: "Tóm tắt bài viết sau trong 3 câu ngắn gọn: [dán nội dung vào đây]" },
    { title: "Dịch thuật", description: "Dịch sang tiếng Anh chuẩn xác", prompt: "Dịch đoạn sau sang tiếng Anh một cách tự nhiên: [dán văn bản cần dịch]" },
    { title: "Viết code", description: "Tạo hàm Python theo yêu cầu", prompt: "Viết một function Python kiểm tra xem một chuỗi có phải là palindrome không, kèm docstring và test cases." },
    { title: "Phân tích dữ liệu", description: "Phân tích và đưa ra insights", prompt: "Phân tích ưu và nhược điểm của việc sử dụng microservices so với monolithic architecture, đưa ra 3 điểm mỗi loại." },
  ],
  image: [
    { title: "Cảnh thiên nhiên", description: "Tạo ảnh phong cảnh đẹp", prompt: "A serene mountain lake at golden hour, reflections of snow-capped peaks, misty atmosphere, photorealistic, 8K quality" },
    { title: "Chân dung nghệ thuật", description: "Tạo chân dung phong cách nghệ thuật", prompt: "Portrait of a wise elderly woman, dramatic lighting, oil painting style, detailed facial features, warm color palette" },
    { title: "Kiến trúc hiện đại", description: "Hình ảnh công trình kiến trúc", prompt: "Modern minimalist house exterior at dusk, floor-to-ceiling glass walls, infinity pool, surrounded by tropical garden" },
    { title: "Concept art", description: "Artwork phong cách sci-fi", prompt: "Futuristic cyberpunk city skyline at night, neon lights reflecting on rain-soaked streets, flying vehicles, detailed concept art" },
  ],
  video: [
    { title: "Timelapse thiên nhiên", description: "Video timelapse phong cảnh", prompt: "A timelapse of clouds moving over mountain peaks, dramatic lighting changes from dawn to dusk, cinematic quality" },
    { title: "Cảnh đô thị", description: "Video cảnh thành phố", prompt: "Drone footage flying over a busy Asian city at night, neon signs, traffic lights streaking, 4K cinematic" },
    { title: "Chuyển động nước", description: "Video nghệ thuật về nước", prompt: "Slow motion water waves crashing on a rocky shore, crystal clear water, underwater perspective, vibrant colors" },
    { title: "Nhân vật hoạt hình", description: "Video nhân vật 3D", prompt: "A friendly 3D animated robot character waving hello, soft studio lighting, smooth motion, Pixar style" },
  ],
  music: [
    { title: "Nhạc Lo-fi", description: "Nhạc nền học tập thư giãn", prompt: "Relaxing lo-fi hip hop beats for studying, gentle piano melodies, soft rain sounds, cozy atmosphere, 2 minutes" },
    { title: "Epic Orchestral", description: "Nhạc phim hành động", prompt: "Epic orchestral soundtrack for an action movie, rising tension, full orchestra with percussion, heroic theme" },
    { title: "Pop sôi động", description: "Ca khúc pop năng lượng cao", prompt: "Upbeat pop song about summer adventures, catchy chorus, electronic beats mixed with acoustic guitar, positive vibes" },
    { title: "Ambient Space", description: "Nhạc ambient không gian", prompt: "Atmospheric space ambient music, slowly evolving synth pads, distant cosmic sounds, meditative and peaceful" },
  ],
};

export function getExamplesForCategory(category: string): ExampleItem[] {
  return examplesByCategory[category] ?? examplesByCategory.chat;
}

/* ─── Request body examples by category ─── */
export function getRequestBodyExample(category: string, slug: string): string {
  switch (category) {
    case "image":
      return JSON.stringify({ model: slug, prompt: "A sunset over mountains", size: "1024x1024", n: 1 }, null, 2);
    case "video":
      return JSON.stringify({ model: slug, prompt: "A drone flying over a city", duration: 5 }, null, 2);
    case "music":
      return JSON.stringify({ model: slug, prompt: "An upbeat pop song about summer", duration: 60 }, null, 2);
    default:
      return JSON.stringify({ model: slug, messages: [{ role: "user", content: "Hello, how are you?" }], temperature: 0.7, max_tokens: 2048, stream: false }, null, 2);
  }
}

/* ─── Request body example (legacy, for backward compat) ─── */
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

/* ─── Root parameters by category ─── */
const chatRootParams = [
  { name: "model", type: "string", required: true, description: "The model slug to use for generation" },
  { name: "messages", type: "array", required: true, description: "Array of message objects with role and content" },
  { name: "temperature", type: "number", required: false, description: "Sampling temperature (0-2), controls randomness. Default 0.7" },
  { name: "max_tokens", type: "integer", required: false, description: "Maximum number of tokens to generate. Default 2048" },
  { name: "stream", type: "boolean", required: false, description: "Enable streaming response. Default false" },
];

const imageRootParams = [
  { name: "model", type: "string", required: true, description: "The image model slug to use" },
  { name: "prompt", type: "string", required: true, description: "Text description of the image to generate" },
  { name: "size", type: "string", required: false, description: "Image dimensions: 256x256, 512x512, 1024x1024, 1024x1792, 1792x1024. Default 1024x1024" },
  { name: "n", type: "integer", required: false, description: "Number of images to generate (1-4). Default 1" },
];

const videoRootParams = [
  { name: "model", type: "string", required: true, description: "The video model slug to use" },
  { name: "prompt", type: "string", required: true, description: "Text description of the video to generate" },
  { name: "duration", type: "integer", required: false, description: "Video duration in seconds (4-15). Default 5" },
];

const musicRootParams = [
  { name: "model", type: "string", required: true, description: "The music model slug to use" },
  { name: "prompt", type: "string", required: true, description: "Text description of the music to generate" },
  { name: "duration", type: "integer", required: false, description: "Music duration in seconds. Default 60" },
];

export function getRootParamsForCategory(category: string) {
  switch (category) {
    case "image": return imageRootParams;
    case "video": return videoRootParams;
    case "music": return musicRootParams;
    default: return chatRootParams;
  }
}

/* ─── Root parameters (legacy) ─── */
export const rootParams = chatRootParams;
