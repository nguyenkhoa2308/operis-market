import type { Metadata } from "next";
import Link from "next/link";
import DocsSidebar, { type DocSection } from "@/components/docs/DocsSidebar";
import CodeBlock from "@/components/docs/CodeBlock";
import { Key, Zap, BookOpen, MessageSquare, List, AlertCircle, Code2, ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "API Docs — Operis Market",
  description: "Tài liệu tích hợp API Operis Market cho developers. Hướng dẫn xác thực, chat completions, streaming và danh sách models.",
};

const NAV_SECTIONS: DocSection[] = [
  { id: "quickstart", label: "Bắt đầu nhanh" },
  { id: "auth", label: "Xác thực" },
  {
    id: "chat",
    label: "Chat Completions",
    children: [
      { id: "chat-basic", label: "Non-streaming" },
      { id: "chat-stream", label: "Streaming" },
    ],
  },
  {
    id: "image",
    label: "Image Generation",
    children: [
      { id: "image-basic", label: "Tạo ảnh" },
      { id: "image-models", label: "Image Models" },
    ],
  },
  { id: "models", label: "Danh sách Models" },
  { id: "errors", label: "Lỗi & Giới hạn" },
  { id: "examples", label: "Ví dụ thực tế" },
];

// ─── Code examples ──────────────────────────────────────────────────────────

const QUICKSTART_CODE = [
  {
    label: "cURL",
    code: `curl https://api.operis.vn/api/chat/completions \\
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
    base_url="https://api.operis.vn/api/chat"
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
  baseURL: "https://api.operis.vn/api/chat",
});

const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [{ role: "user", content: "Xin chào!" }],
});

console.log(response.choices[0].message.content);`,
  },
];

const AUTH_CODE = [
  {
    label: "cURL",
    code: `# Thêm API key vào header Authorization
curl https://api.operis.vn/api/chat/completions \\
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
    base_url="https://api.operis.vn/api/chat"
)`,
  },
  {
    label: "JavaScript",
    code: `import OpenAI from "openai";

// Lưu key trong .env: OPERIS_API_KEY=your_key_here
const client = new OpenAI({
  apiKey: process.env.OPERIS_API_KEY,
  baseURL: "https://api.operis.vn/api/chat",
});`,
  },
];

const CHAT_BASIC_CODE = [
  {
    label: "cURL",
    code: `curl https://api.operis.vn/api/chat/completions \\
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

const CHAT_STREAM_CODE = [
  {
    label: "cURL",
    code: `curl https://api.operis.vn/api/chat/completions \\
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

const IMAGE_BASIC_CODE = [
  {
    label: "cURL",
    code: `curl https://api.operis.vn/api/chat/image/generations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "nano-banana-2",
    "prompt": "A serene mountain lake at golden hour, photorealistic",
    "aspect_ratio": "16:9",
    "resolution": "2K"
  }'`,
  },
  {
    label: "Python",
    code: `import requests

response = requests.post(
    "https://api.operis.vn/api/chat/image/generations",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "model": "nano-banana-2",
        "prompt": "A serene mountain lake at golden hour, photorealistic",
        "aspect_ratio": "16:9",
        "resolution": "2K",
    },
    timeout=150,  # Image generation có thể mất 10-60 giây
)

data = response.json()["data"]
print(f"Created: {data['created']}")
for img in data["data"]:
    print(f"URL: {img['url']}")`,
  },
  {
    label: "JavaScript",
    code: `const response = await fetch("https://api.operis.vn/api/chat/image/generations", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "nano-banana-2",
    prompt: "A serene mountain lake at golden hour, photorealistic",
    aspect_ratio: "16:9",
    resolution: "2K",
  }),
});

const { data } = await response.json();
console.log("Image URL:", data.data[0].url);`,
  },
];

const IMAGE_COMPLETIONS_CODE = [
  {
    label: "cURL",
    code: `# Hoặc dùng endpoint /api/chat/completions với image model:
curl https://api.operis.vn/api/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "grok-imagine",
    "prompt": "Cyberpunk city at night, neon lights",
    "aspect_ratio": "1:1"
  }'`,
  },
  {
    label: "Python",
    code: `# Image models cũng hoạt động qua endpoint completions
response = requests.post(
    "https://api.operis.vn/api/chat/completions",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "model": "grok-imagine",
        "prompt": "Cyberpunk city at night, neon lights",
        "aspect_ratio": "1:1",
    },
    timeout=150,
)

images = response.json()["data"]["data"]
for img in images:
    print(img["url"])`,
  },
];

const MODELS_CODE = [
  {
    label: "cURL",
    code: `curl https://api.operis.vn/api/chat/models \\
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

const EXAMPLE_CHATBOT_CODE = [
  {
    label: "Python",
    code: `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.operis.vn/api/chat"
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
  baseURL: "https://api.operis.vn/api/chat",
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

// ─── Section component ────────────────────────────────────────────────────────

function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SubSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-20 space-y-4 pl-1">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold mt-0.5">
        {n}
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-accent px-1.5 py-0.5 text-[13px] font-mono text-foreground">
      {children}
    </code>
  );
}

function ParamRow({ name, type, required, desc }: { name: string; type: string; required?: boolean; desc: string }) {
  return (
    <tr className="border-b border-border">
      <td className="py-3 pr-4">
        <InlineCode>{name}</InlineCode>
        {required && <span className="ml-2 text-xs text-red-400">*</span>}
      </td>
      <td className="py-3 pr-4 text-xs text-muted-foreground font-mono">{type}</td>
      <td className="py-3 text-sm text-muted-foreground">{desc}</td>
    </tr>
  );
}

function ErrorRow({ code, name, desc }: { code: number; name: string; desc: string }) {
  return (
    <tr className="border-b border-border">
      <td className="py-3 pr-4 font-mono text-sm text-foreground">{code}</td>
      <td className="py-3 pr-4 text-sm font-medium text-foreground">{name}</td>
      <td className="py-3 text-sm text-muted-foreground">{desc}</td>
    </tr>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border bg-background-secondary">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <BookOpen className="size-4" />
            <span>Tài liệu API</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">API Reference</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Tích hợp các model AI hàng đầu vào sản phẩm của bạn qua một API đơn giản, tương thích OpenAI.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <Link
              href="/api-keys"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Key className="size-4" />
              Tạo API Key
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Zap className="size-4" />
              Thử Playground
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nội dung
              </p>
              <DocsSidebar sections={NAV_SECTIONS} />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-16">

            {/* ── Quickstart ── */}
            <Section id="quickstart" icon={Zap} title="Bắt đầu nhanh">
              <p className="text-muted-foreground">
                Gọi API đầu tiên trong vài phút. Chỉ cần tài khoản và API key.
              </p>
              <div className="space-y-4">
                <Step n={1} title="Tạo tài khoản" desc="Đăng ký tại operis.vn và xác thực email." />
                <Step n={2} title="Nạp credit" desc="Vào Thanh toán để nạp credit. 1 credit ≈ 1.000 tokens input." />
                <Step
                  n={3}
                  title="Tạo API Key"
                  desc='Vào API Keys → "Tạo API Key mới". Sao chép key ngay, không thể xem lại sau.'
                />
                <Step n={4} title="Gọi API" desc="Dùng code mẫu bên dưới để thực hiện request đầu tiên." />
              </div>
              <CodeBlock tabs={QUICKSTART_CODE} />
            </Section>

            {/* ── Auth ── */}
            <Section id="auth" icon={Key} title="Xác thực">
              <p className="text-muted-foreground">
                Tất cả request yêu cầu API key trong header{" "}
                <InlineCode>Authorization</InlineCode>.
              </p>
              <div className="rounded-xl border border-border bg-background-secondary p-5 space-y-3">
                <p className="text-sm font-medium text-foreground">Format header</p>
                <InlineCode>Authorization: Bearer YOUR_API_KEY</InlineCode>
                <div className="space-y-2 text-sm text-muted-foreground pt-1">
                  <p>
                    Không chia sẻ key — chỉ hiển thị một lần khi tạo.
                  </p>
                  <p>
                    Luôn lưu key trong biến môi trường, không hardcode vào source code.
                  </p>
                </div>
              </div>
              <CodeBlock tabs={AUTH_CODE} />
            </Section>

            {/* ── Chat Completions ── */}
            <Section id="chat" icon={MessageSquare} title="Chat Completions">
              <p className="text-muted-foreground">
                Endpoint chính để tương tác với các LLM. Tương thích 100% với OpenAI SDK.
              </p>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 bg-background-secondary px-4 py-3 border-b border-border">
                  <span className="rounded-md bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-400">POST</span>
                  <code className="text-sm font-mono text-foreground">/api/chat/completions</code>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-2 text-xs font-medium text-muted-foreground">Tham số</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground">Kiểu</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ParamRow name="model" type="string" required desc="Tên model (xem /api/chat/models để biết danh sách)" />
                      <ParamRow name="messages" type="array" required desc="Mảng tin nhắn [{ role, content }]. role: system | user | assistant" />
                      <ParamRow name="stream" type="boolean" desc="Bật SSE streaming (mặc định: false)" />
                      <ParamRow name="temperature" type="number" desc="Độ ngẫu nhiên 0–2 (mặc định: 1). Thấp hơn = xác định hơn." />
                      <ParamRow name="max_tokens" type="integer" desc="Số token tối đa trong response" />
                      <ParamRow name="top_p" type="number" desc="Nucleus sampling 0–1 (mặc định: 1)" />
                    </tbody>
                  </table>
                </div>
              </div>

              <SubSection id="chat-basic" title="Non-streaming">
                <p className="text-sm text-muted-foreground">
                  Gửi request và nhận toàn bộ response sau khi model hoàn thành. Phù hợp cho task không cần real-time.
                </p>
                <CodeBlock tabs={CHAT_BASIC_CODE} />
              </SubSection>

              <SubSection id="chat-stream" title="Streaming (SSE)">
                <p className="text-sm text-muted-foreground">
                  Nhận token theo thời gian thực qua Server-Sent Events. Giảm perceived latency đáng kể, giống ChatGPT.
                  Đặt <InlineCode>stream: true</InlineCode> trong request body.
                </p>
                <CodeBlock tabs={CHAT_STREAM_CODE} />
              </SubSection>
            </Section>

            {/* ── Image Generation ── */}
            <Section id="image" icon={ImageIcon} title="Image Generation">
              <p className="text-muted-foreground">
                Tạo ảnh từ prompt văn bản. Response trả về URL ảnh trực tiếp. Thời gian tạo ảnh thường 10–60 giây tùy model.
              </p>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 bg-background-secondary px-4 py-3 border-b border-border">
                  <span className="rounded-md bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-400">POST</span>
                  <code className="text-sm font-mono text-foreground">/api/chat/image/generations</code>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-2 text-xs font-medium text-muted-foreground">Tham số</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground">Kiểu</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ParamRow name="model" type="string" required desc="Model ID: nano-banana-2, nano-banana-pro, grok-imagine" />
                      <ParamRow name="prompt" type="string" required desc="Mô tả hình ảnh muốn tạo" />
                      <ParamRow name="aspect_ratio" type="string" desc="Tỷ lệ ảnh: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3. Mặc định: 1:1" />
                      <ParamRow name="resolution" type="string" desc="Độ phân giải: 1K, 2K, 4K. Mặc định: 1K (không áp dụng cho grok-imagine)" />
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background-secondary p-5 space-y-3">
                <p className="text-sm font-medium text-foreground">Response format</p>
                <CodeBlock
                  tabs={[{
                    label: "JSON",
                    code: `{
  "success": true,
  "data": {
    "created": 1773896512,
    "data": [
      {
        "url": "https://..../generated-image.jpg",
        "revised_prompt": "A serene mountain lake..."
      }
    ]
  }
}`,
                  }]}
                />
              </div>

              <SubSection id="image-basic" title="Tạo ảnh">
                <p className="text-sm text-muted-foreground">
                  Gửi prompt mô tả hình ảnh và nhận URL ảnh. Lưu ý đặt timeout ≥ 150 giây vì quá trình tạo ảnh có thể mất thời gian.
                </p>
                <CodeBlock tabs={IMAGE_BASIC_CODE} />

                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                  <p className="text-sm font-medium text-amber-400">Lưu ý quan trọng</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>URL ảnh là <strong>tạm thời</strong> — tải về và lưu trữ riêng nếu cần dùng lâu dài.</li>
                    <li>Image models cũng hoạt động qua <InlineCode>/api/chat/completions</InlineCode> — hệ thống tự nhận diện image model.</li>
                    <li>Credits bị trừ <strong>sau khi</strong> ảnh tạo thành công, không trừ nếu thất bại.</li>
                  </ul>
                </div>

                <CodeBlock tabs={IMAGE_COMPLETIONS_CODE} />
              </SubSection>

              <SubSection id="image-models" title="Image Models">
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-background-secondary">
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Model ID</th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Credits/ảnh</th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Tỷ lệ hỗ trợ</th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Độ phân giải</th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: "nano-banana-2", credits: 10, ratios: "1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3", res: "1K, 2K, 4K", note: "Nhanh, chất lượng tốt" },
                          { id: "nano-banana-pro", credits: 20, ratios: "1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3", res: "1K, 2K, 4K", note: "Chất lượng cao, chi tiết hơn" },
                          { id: "grok-imagine", credits: 15, ratios: "1:1, 16:9, 9:16, 4:3, 3:4", res: "N/A", note: "Phong cách nghệ thuật, trả nhiều ảnh" },
                          { id: "midjourney", credits: 25, ratios: "—", res: "—", note: "Sắp ra mắt" },
                        ].map((m) => (
                          <tr key={m.id} className="border-b border-border last:border-0">
                            <td className="px-4 py-3"><InlineCode>{m.id}</InlineCode></td>
                            <td className="px-4 py-3 text-muted-foreground">{m.credits}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{m.ratios}</td>
                            <td className="px-4 py-3 text-muted-foreground">{m.res}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{m.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </SubSection>
            </Section>

            {/* ── Models ── */}
            <Section id="models" icon={List} title="Danh sách Models">
              <p className="text-muted-foreground">
                Lấy danh sách tất cả model đang hoạt động từ hệ thống.
              </p>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 bg-background-secondary px-4 py-3 border-b border-border">
                  <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-400">GET</span>
                  <code className="text-sm font-mono text-foreground">/api/chat/models</code>
                </div>
                <div className="p-4 text-sm text-muted-foreground">
                  Trả về mảng <InlineCode>data[]</InlineCode> với các model đang khả dụng.
                  Dùng field <InlineCode>id</InlineCode> làm giá trị cho tham số <InlineCode>model</InlineCode>.
                </div>
              </div>
              <CodeBlock tabs={MODELS_CODE} />

              {/* Model list table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-background-secondary px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">Models hiện tại</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-background-secondary">
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Model ID</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Loại</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Input (credits/1k tokens)</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Output (credits/1k tokens)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "gemini-2.5-flash", type: "Chat", input: 2, output: 4 },
                        { id: "gemini-2.5-pro", type: "Chat", input: 4, output: 8 },
                        { id: "claude-sonnet-4-5", type: "Chat", input: 3, output: 6 },
                        { id: "kimi-k2.5", type: "Chat", input: 1, output: 2 },
                        { id: "kimi-k2-thinking", type: "Chat (Reasoning)", input: 2, output: 3 },
                        { id: "deepseek-v3.2", type: "Chat", input: 1, output: 1 },
                        { id: "gpt-5-4", type: "Chat", input: 5, output: 10 },
                      ].map((m) => (
                        <tr key={m.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3">
                            <InlineCode>{m.id}</InlineCode>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{m.type}</td>
                          <td className="px-4 py-3 text-muted-foreground">{m.input}</td>
                          <td className="px-4 py-3 text-muted-foreground">{m.output}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* ── Errors ── */}
            <Section id="errors" icon={AlertCircle} title="Lỗi & Giới hạn">
              <p className="text-muted-foreground">
                API trả về HTTP status code chuẩn. Xử lý lỗi theo bảng bên dưới.
              </p>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background-secondary">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Code</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Tên lỗi</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Nguyên nhân</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border px-4">
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-mono text-sm">400</td>
                      <td className="px-4 py-3 font-medium">Bad Request</td>
                      <td className="px-4 py-3 text-muted-foreground">Thiếu tham số bắt buộc (model, messages)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-mono text-sm">401</td>
                      <td className="px-4 py-3 font-medium">Unauthorized</td>
                      <td className="px-4 py-3 text-muted-foreground">API key không hợp lệ hoặc đã bị thu hồi</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-mono text-sm">402</td>
                      <td className="px-4 py-3 font-medium">Insufficient Credits</td>
                      <td className="px-4 py-3 text-muted-foreground">Số credit không đủ, cần nạp thêm</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-mono text-sm">408</td>
                      <td className="px-4 py-3 font-medium">Request Timeout</td>
                      <td className="px-4 py-3 text-muted-foreground">Tạo ảnh/video vượt quá thời gian cho phép (120s)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-mono text-sm">429</td>
                      <td className="px-4 py-3 font-medium">Too Many Requests</td>
                      <td className="px-4 py-3 text-muted-foreground">Vượt rate limit, thử lại sau vài giây</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm">502</td>
                      <td className="px-4 py-3 font-medium">Bad Gateway</td>
                      <td className="px-4 py-3 text-muted-foreground">AI provider gặp sự cố, thử lại sau</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-border bg-background-secondary p-5 space-y-2">
                <p className="text-sm font-medium text-foreground">Format response lỗi</p>
                <CodeBlock
                  tabs={[{
                    label: "JSON",
                    code: `{
  "success": false,
  "message": "Insufficient credits. Balance: 0"
}`,
                  }]}
                />
              </div>
            </Section>

            {/* ── Examples ── */}
            <Section id="examples" icon={Code2} title="Ví dụ thực tế">
              <p className="text-muted-foreground">
                Chatbot đa lượt với lịch sử hội thoại và streaming.
              </p>
              <CodeBlock tabs={EXAMPLE_CHATBOT_CODE} />
              <p className="text-sm text-muted-foreground">
                Xem thêm ví dụ về image generation, function calling và multi-modal tại trang{" "}
                <Link href="/playground" className="text-primary hover:underline">
                  Playground
                </Link>.
              </p>
            </Section>

          </main>
        </div>
      </div>
    </div>
  );
}
