/**
 * Shared static content for API documentation.
 * Used by both /docs page and model detail pages (README + API tabs).
 *
 * Dynamic data (endpoints, params, rate limits, pricing) comes from
 * the backend API via useApiDocs() hook — NOT from this file.
 */

export const BASE_URL = "https://models.operis.vn";
export const SUPPORT_EMAIL = "support@operis.vn";

// ─── Code example tabs ──────────────────────────────────────────────────────

export interface CodeTab {
  label: string;
  code: string;
}

export const QUICKSTART_CODE: CodeTab[] = [
  {
    label: "cURL",
    code: `curl ${BASE_URL}/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      { "role": "user", "content": "Xin chào!" }
    ]
  }'`,
  },
  {
    label: "Python",
    code: `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="${BASE_URL}/v1"
)

response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {"role": "user", "content": "Xin chào!"}
    ]
)

print(response.choices[0].message.content)`,
  },
  {
    label: "JavaScript",
    code: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "YOUR_API_KEY",
  baseURL: "${BASE_URL}/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [{ role: "user", content: "Xin chào!" }],
});

console.log(response.choices[0].message.content);`,
  },
];

export const AUTH_CODE: CodeTab[] = [
  {
    label: "cURL",
    code: `# Thêm API key vào header Authorization
curl ${BASE_URL}/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ ... }'`,
  },
  {
    label: "Python",
    code: `import os
from openai import OpenAI

# Lưu key trong biến môi trường
client = OpenAI(
    api_key=os.environ.get("OPERIS_API_KEY"),
    base_url="${BASE_URL}/v1"
)`,
  },
  {
    label: "JavaScript",
    code: `import OpenAI from "openai";

// Lưu key trong .env: OPERIS_API_KEY=your_key_here
const client = new OpenAI({
  apiKey: process.env.OPERIS_API_KEY,
  baseURL: "${BASE_URL}/v1",
});`,
  },
];

export const CHAT_BASIC_CODE: CodeTab[] = [
  {
    label: "cURL",
    code: `curl ${BASE_URL}/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [
      {
        "role": "system",
        "content": "Bạn là trợ lý AI hữu ích, trả lời bằng tiếng Việt."
      },
      {
        "role": "user",
        "content": "Giải thích machine learning cho người mới học."
      }
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }'`,
  },
  {
    label: "Python",
    code: `response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[
        {
            "role": "system",
            "content": "Bạn là trợ lý AI hữu ích, trả lời bằng tiếng Việt."
        },
        {
            "role": "user",
            "content": "Giải thích machine learning cho người mới học."
        }
    ],
    temperature=0.7,
    max_tokens=1024,
)

print(response.choices[0].message.content)
print(f"Tokens dùng: {response.usage.total_tokens}")`,
  },
  {
    label: "JavaScript",
    code: `const response = await client.chat.completions.create({
  model: "gemini-2.5-pro",
  messages: [
    {
      role: "system",
      content: "Bạn là trợ lý AI hữu ích, trả lời bằng tiếng Việt.",
    },
    {
      role: "user",
      content: "Giải thích machine learning cho người mới học.",
    },
  ],
  temperature: 0.7,
  max_tokens: 1024,
});

console.log(response.choices[0].message.content);
console.log("Tokens:", response.usage?.total_tokens);`,
  },
];

export const CHAT_STREAM_CODE: CodeTab[] = [
  {
    label: "cURL",
    code: `curl ${BASE_URL}/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  --no-buffer \\
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{ "role": "user", "content": "Viết một bài thơ về Hà Nội." }],
    "stream": true
  }'`,
  },
  {
    label: "Python",
    code: `stream = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {"role": "user", "content": "Viết một bài thơ về Hà Nội."}
    ],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
print()  # newline at end`,
  },
  {
    label: "JavaScript",
    code: `const stream = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [{ role: "user", content: "Viết một bài thơ về Hà Nội." }],
  stream: true,
});

for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta?.content ?? "";
  process.stdout.write(delta);
}`,
  },
];

export const IMAGE_BASIC_CODE: CodeTab[] = [
  {
    label: "cURL",
    code: `curl -X POST ${BASE_URL}/v1/images/generations \\
  -H "Authorization: Bearer $OPERIS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "nano-banana-2",
    "prompt": "A serene mountain lake at golden hour, photorealistic",
    "resolution": "2K",
    "aspect_ratio": "16:9"
  }'`,
  },
  {
    label: "Python",
    code: `import requests

response = requests.post(
    "${BASE_URL}/v1/images/generations",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "model": "nano-banana-2",
        "prompt": "A serene mountain lake at golden hour, photorealistic",
        "resolution": "2K",
        "aspect_ratio": "16:9",
    },
    timeout=300,  # Image generation có thể mất 10-60 giây
)

data = response.json()["data"]
print(f"Created: {data['created']}")
for img in data["data"]:
    print(f"URL: {img['url']}")`,
  },
  {
    label: "JavaScript",
    code: `const response = await fetch("${BASE_URL}/v1/images/generations", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "nano-banana-2",
    prompt: "A serene mountain lake at golden hour, photorealistic",
    resolution: "2K",
    aspect_ratio: "16:9",
  }),
});

const { data } = await response.json();
console.log("Image URL:", data.data[0].url);`,
  },
];

export const IMAGE_I2I_CODE: CodeTab[] = [
  {
    label: "cURL",
    code: `# Image-to-Image: chỉnh sửa ảnh dựa trên ảnh tham chiếu
# nano-banana-2: tối đa 14 ảnh | nano-banana-pro: tối đa 8 ảnh | grok-imagine: tối đa 1 ảnh
curl -X POST ${BASE_URL}/v1/images/generations \\
  -H "Authorization: Bearer $OPERIS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "nano-banana-2",
    "prompt": "Turn this photo into a cartoon illustration style",
    "resolution": "2K",
    "aspect_ratio": "1:1",
    "image_input": ["https://example.com/my-photo.jpg"]
  }'`,
  },
  {
    label: "Python",
    code: `import requests

# Image-to-Image: chỉnh sửa ảnh dựa trên ảnh tham chiếu
response = requests.post(
    "${BASE_URL}/v1/images/generations",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "model": "nano-banana-2",
        "prompt": "Turn this photo into a cartoon illustration style",
        "resolution": "2K",
        "aspect_ratio": "1:1",
        "image_input": ["https://example.com/my-photo.jpg"],
    },
    timeout=300,
)

data = response.json()["data"]
for img in data["data"]:
    print(f"URL: {img['url']}")`,
  },
  {
    label: "JavaScript",
    code: `// Image-to-Image: chỉnh sửa ảnh dựa trên ảnh tham chiếu
const response = await fetch("${BASE_URL}/v1/images/generations", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "nano-banana-2",
    prompt: "Turn this photo into a cartoon illustration style",
    resolution: "2K",
    aspect_ratio: "1:1",
    image_input: ["https://example.com/my-photo.jpg"],
  }),
});

const { data } = await response.json();
console.log("Image URL:", data.data[0].url);`,
  },
];

export const MODELS_CODE: CodeTab[] = [
  {
    label: "cURL",
    code: `curl ${BASE_URL}/v1/models \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  },
  {
    label: "Python",
    code: `models = client.models.list()
for model in models.data:
    print(model.id)`,
  },
  {
    label: "JavaScript",
    code: `const models = await client.models.list();
for (const model of models.data) {
  console.log(model.id);
}`,
  },
];

export const EXAMPLE_CHATBOT_CODE: CodeTab[] = [
  {
    label: "Python",
    code: `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="${BASE_URL}/v1"
)

history = [
    {"role": "system", "content": "Bạn là trợ lý hỗ trợ khách hàng."}
]

while True:
    user_input = input("Bạn: ")
    if user_input.lower() in ("quit", "exit"):
        break

    history.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=history,
        stream=True,
    )

    print("AI: ", end="")
    collected = ""
    for chunk in response:
        delta = chunk.choices[0].delta.content or ""
        print(delta, end="", flush=True)
        collected += delta
    print()

    history.append({"role": "assistant", "content": collected})`,
  },
  {
    label: "JavaScript",
    code: `import OpenAI from "openai";
import * as readline from "readline";

const client = new OpenAI({
  apiKey: process.env.OPERIS_API_KEY,
  baseURL: "${BASE_URL}/v1",
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const history = [
  { role: "system", content: "Bạn là trợ lý hỗ trợ khách hàng." },
];

async function chat(userInput) {
  history.push({ role: "user", content: userInput });

  const stream = await client.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: history,
    stream: true,
  });

  process.stdout.write("AI: ");
  let collected = "";
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    process.stdout.write(delta);
    collected += delta;
  }
  console.log();

  history.push({ role: "assistant", content: collected });
}`,
  },
];

// ─── Response format examples ────────────────────────────────────────────────

export const CHAT_RESPONSE_EXAMPLE = `{
  "success": true,
  "message": "Success",
  "data": {
    "id": "chatcmpl-...",
    "model": "gemini-2.5-flash",
    "choices": [{
      "message": { "content": "Xin chào! Tôi có thể giúp gì?", "role": "assistant" },
      "finish_reason": "stop",
      "index": 0
    }],
    "usage": {
      "prompt_tokens": 10,
      "completion_tokens": 50,
      "total_tokens": 60
    },
    "cost": { "vnd": 1.5 }
  }
}`;

export const CHAT_STREAM_RESPONSE_EXAMPLE = `data: {"id":"chatcmpl-...","choices":[{"delta":{"content":"Xin"},"index":0}]}

data: {"id":"chatcmpl-...","choices":[{"delta":{"content":" chào"},"index":0}]}

data: {"choices":[{"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":10,"completion_tokens":50}}

data: {"cost":{"vnd":1.5,"promptTokens":10,"completionTokens":50}}

data: [DONE]`;

export const IMAGE_RESPONSE_EXAMPLE = `{
  "success": true,
  "message": "Success",
  "data": {
    "created": 1774234991,
    "data": [
      { "url": "https://tempfile...", "revised_prompt": "a cute cat", "b64_json": null }
    ]
  }
}`;

export const ERROR_RESPONSE_EXAMPLE = `{
  "success": false,
  "message": "Số dư không đủ. Số dư hiện tại: 0đ"
}`;

export const RATE_LIMIT_ERROR_EXAMPLE = `{
  "error": {
    "message": "Bạn đã vượt quá giới hạn request. Vui lòng thử lại sau.",
    "type": "rate_limit_error",
    "code": 429
  }
}`;

// ─── Quickstart steps ────────────────────────────────────────────────────────

export const QUICKSTART_STEPS = [
  { n: 1, title: "Tạo tài khoản", desc: "Đăng ký tại operis.vn và xác thực email." },
  { n: 2, title: "Nạp tiền", desc: "Vào Thanh toán để nạp tiền (VND) vào tài khoản." },
  { n: 3, title: "Tạo API Key", desc: 'Vào API Keys → "Tạo API Key mới". Sao chép key ngay, không thể xem lại sau.' },
  { n: 4, title: "Cài đặt SDK", desc: "Cài đặt OpenAI SDK cho ngôn ngữ bạn sử dụng." },
  { n: 5, title: "Gọi API", desc: "Dùng code mẫu bên dưới để thực hiện request đầu tiên." },
];

// ─── Important notes ─────────────────────────────────────────────────────────

export const IMAGE_NOTES = [
  "URL ảnh là tạm thời — tải về và lưu trữ riêng nếu cần dùng lâu dài.",
  "Image models cũng hoạt động qua /v1/chat/completions — hệ thống tự nhận diện image model.",
  "Số dư bị trừ sau khi ảnh tạo thành công, không trừ nếu thất bại.",
];

export const RATE_LIMIT_BEST_PRACTICES = [
  "Thêm exponential backoff khi gặp lỗi 429",
  "Đọc header retry-after để biết thời gian chờ chính xác",
  "Tránh gửi nhiều request lớn cùng lúc — chia nhỏ và xử lý tuần tự",
  "Cache kết quả khi có thể để giảm số lượng request",
];

export const RATE_LIMIT_HEADERS = [
  { header: "retry-after", desc: "số giây cần chờ trước khi gửi lại" },
  { header: "x-ratelimit-remaining-requests", desc: "số request còn lại trong chu kỳ" },
  { header: "x-ratelimit-remaining-tokens", desc: "số tokens còn lại trong chu kỳ" },
];
