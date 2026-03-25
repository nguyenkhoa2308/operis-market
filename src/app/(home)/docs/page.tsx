"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import DocsSidebar, { type DocSection } from "@/components/docs/DocsSidebar";
import CodeBlock from "@/components/docs/CodeBlock";
import {
  Section,
  SubSection,
  Step,
  InlineCode,
  ParamRow,
  ErrorRow,
  EndpointHeader,
  NoteBox,
  LinkButton,
} from "@/components/docs/DocsComponents";
import {
  Key,
  Zap,
  BookOpen,
  MessageSquare,
  List,
  AlertCircle,
  Code2,
  ImageIcon,
  DollarSign,
  Gauge,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { useApiDocs } from "@/hooks/use-api-docs";
import { usePricingList } from "@/hooks/use-models";
import { USD_TO_VND } from "@/data/pricing-constants";
import {
  QUICKSTART_CODE,
  AUTH_CODE,
  CHAT_BASIC_CODE,
  CHAT_STREAM_CODE,
  IMAGE_BASIC_CODE,
  IMAGE_I2I_CODE,
  MODELS_CODE,
  EXAMPLE_CHATBOT_CODE,
  QUICKSTART_STEPS,
  CHAT_RESPONSE_EXAMPLE,
  CHAT_STREAM_RESPONSE_EXAMPLE,
  IMAGE_RESPONSE_EXAMPLE,
  ERROR_RESPONSE_EXAMPLE,
  RATE_LIMIT_ERROR_EXAMPLE,
  IMAGE_NOTES,
  RATE_LIMIT_BEST_PRACTICES,
  RATE_LIMIT_HEADERS,
} from "@/data/api-docs-content";

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
      { id: "image-to-image", label: "Image-to-Image" },
      { id: "image-models", label: "Image Models" },
    ],
  },
  { id: "models", label: "Danh sách Models" },
  { id: "rate-limits", label: "Rate Limits" },
  { id: "errors", label: "Lỗi & Giới hạn" },
  { id: "billing", label: "Billing & Usage" },
  { id: "examples", label: "Ví dụ thực tế" },
];

function formatVnd(usd: number): string {
  return Math.round(usd * USD_TO_VND).toLocaleString("vi-VN");
}

export default function DocsPage() {
  const { data: docs, isLoading: docsLoading } = useApiDocs();
  const { data: chatPricing } = usePricingList({ category: "chat", limit: 50 });
  const { data: imagePricing } = usePricingList({ category: "image", limit: 50 });
  const contentRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    if (!contentRef.current) return;
    const text = contentRef.current.innerText;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find endpoints from API
  const chatEndpoint = docs?.endpoints.find((e) => e.path === "/v1/chat/completions");
  const imageEndpoint = docs?.endpoints.find((e) => e.path === "/v1/images/generations");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border bg-background-secondary">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="size-4" />
            <span>Tài liệu API</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-foreground">
            API Reference
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Tích hợp các model AI hàng đầu vào sản phẩm của bạn qua một API đơn
            giản, tương thích OpenAI.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <LinkButton href="/api-keys" icon={Key}>
              Tạo API Key
            </LinkButton>
            <LinkButton href="/market" icon={Zap} variant="secondary">
              Xem Models
            </LinkButton>
            <button
              onClick={handleCopyAll}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background-secondary"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-green-500" />
                  Đã copy!
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy tất cả
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-20">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nội dung
              </p>
              <DocsSidebar sections={NAV_SECTIONS} />
            </div>
          </aside>

          {/* Main content */}
          <main ref={contentRef} className="min-w-0 flex-1 space-y-16">
            {docsLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">Đang tải...</span>
              </div>
            )}

            {/* ── Quickstart ── */}
            <Section id="quickstart" icon={Zap} title="Bắt đầu nhanh">
              <p className="text-muted-foreground">
                Gọi API đầu tiên trong vài phút. Chỉ cần tài khoản và API key.
              </p>
              <div className="space-y-4">
                {QUICKSTART_STEPS.map((s) => (
                  <Step key={s.n} n={s.n} title={s.title} desc={s.desc} />
                ))}
              </div>

              <div className="space-y-3 rounded-xl border border-border bg-background-secondary p-5">
                <p className="text-sm font-medium text-foreground">
                  Cài đặt SDK
                </p>
                <CodeBlock
                  tabs={[
                    { label: "Python", code: "# Python\npip install openai" },
                    {
                      label: "JavaScript",
                      code: "# JavaScript / Node.js\nnpm install openai",
                    },
                  ]}
                />
              </div>

              <CodeBlock tabs={QUICKSTART_CODE} />
            </Section>

            {/* ── Auth ── */}
            <Section id="auth" icon={Key} title="Xác thực">
              <p className="text-muted-foreground">
                Tất cả request yêu cầu API key trong header{" "}
                <InlineCode>Authorization</InlineCode>.
              </p>
              <div className="space-y-3 rounded-xl border border-border bg-background-secondary p-5">
                <p className="text-sm font-medium text-foreground">
                  Format header
                </p>
                <InlineCode>Authorization: Bearer YOUR_API_KEY</InlineCode>
                <div className="space-y-2 pt-1 text-sm text-muted-foreground">
                  <p>Không chia sẻ key — chỉ hiển thị một lần khi tạo.</p>
                  <p>
                    Luôn lưu key trong biến môi trường, không hardcode vào source
                    code.
                  </p>
                </div>
              </div>
              <CodeBlock tabs={AUTH_CODE} />
            </Section>

            {/* ── Chat Completions ── */}
            <Section id="chat" icon={MessageSquare} title="Chat Completions">
              <p className="text-muted-foreground">
                Endpoint chính để tương tác với các LLM. Tương thích 100% với
                OpenAI SDK.
              </p>

              {chatEndpoint && (
                <div className="overflow-hidden rounded-xl border border-border">
                  <EndpointHeader
                    method={chatEndpoint.method}
                    path={chatEndpoint.path}
                  />
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="pb-2 text-xs font-medium text-muted-foreground">
                            Tham số
                          </th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">
                            Kiểu
                          </th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">
                            Mô tả
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {chatEndpoint.params.map((p) => (
                          <ParamRow
                            key={p.name}
                            name={p.name}
                            type={p.type}
                            required={p.required}
                            desc={p.description}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <SubSection id="chat-basic" title="Non-streaming">
                <p className="text-sm text-muted-foreground">
                  Gửi request và nhận toàn bộ response sau khi model hoàn thành.
                  Phù hợp cho task không cần real-time.
                </p>
                <CodeBlock tabs={CHAT_BASIC_CODE} />

                <div className="space-y-3 rounded-xl border border-border bg-background-secondary p-5">
                  <p className="text-sm font-medium text-foreground">
                    Response format
                  </p>
                  <CodeBlock
                    tabs={[
                      { label: "JSON", code: CHAT_RESPONSE_EXAMPLE },
                    ]}
                  />
                </div>
              </SubSection>

              <SubSection id="chat-stream" title="Streaming (SSE)">
                <p className="text-sm text-muted-foreground">
                  Nhận token theo thời gian thực qua Server-Sent Events. Giảm
                  perceived latency đáng kể, giống ChatGPT. Đặt{" "}
                  <InlineCode>stream: true</InlineCode> trong request body.
                </p>
                <CodeBlock tabs={CHAT_STREAM_CODE} />

                <div className="space-y-3 rounded-xl border border-border bg-background-secondary p-5">
                  <p className="text-sm font-medium text-foreground">
                    Streaming SSE format
                  </p>
                  <CodeBlock
                    tabs={[
                      { label: "SSE", code: CHAT_STREAM_RESPONSE_EXAMPLE },
                    ]}
                  />
                </div>
              </SubSection>
            </Section>

            {/* ── Image Generation ── */}
            <Section id="image" icon={ImageIcon} title="Image Generation">
              <p className="text-muted-foreground">
                Tạo ảnh từ prompt văn bản. Response trả về URL ảnh trực tiếp.
                Thời gian tạo ảnh thường 10–60 giây tùy model.
              </p>

              {imageEndpoint && (
                <div className="overflow-hidden rounded-xl border border-border">
                  <EndpointHeader
                    method={imageEndpoint.method}
                    path={imageEndpoint.path}
                  />
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="pb-2 text-xs font-medium text-muted-foreground">
                            Tham số
                          </th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">
                            Kiểu
                          </th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">
                            Mô tả
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {imageEndpoint.params.map((p) => (
                          <ParamRow
                            key={p.name}
                            name={p.name}
                            type={p.type}
                            required={p.required}
                            desc={p.description}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <SubSection id="image-basic" title="Tạo ảnh">
                <p className="text-sm text-muted-foreground">
                  Gửi prompt mô tả hình ảnh và nhận URL ảnh. Lưu ý đặt timeout
                  {" >= "}150 giây vì quá trình tạo ảnh có thể mất thời gian.
                </p>
                <CodeBlock tabs={IMAGE_BASIC_CODE} />

                <div className="space-y-3 rounded-xl border border-border bg-background-secondary p-5">
                  <p className="text-sm font-medium text-foreground">
                    Response format
                  </p>
                  <CodeBlock
                    tabs={[
                      { label: "JSON", code: IMAGE_RESPONSE_EXAMPLE },
                    ]}
                  />
                </div>

                <NoteBox title="Lưu ý quan trọng">
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {IMAGE_NOTES.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </NoteBox>
              </SubSection>

              <SubSection id="image-to-image" title="Image-to-Image (chỉnh sửa ảnh)">
                <p className="text-sm text-muted-foreground">
                  Gửi kèm <InlineCode>image_input</InlineCode> (mảng URL ảnh) để chỉnh sửa hoặc tham chiếu ảnh có sẵn.
                  Giới hạn: nano-banana-2 tối đa 14 ảnh, nano-banana-pro tối đa 8 ảnh, grok-imagine tối đa 1 ảnh. Kích thước mỗi ảnh tối đa 30MB. Định dạng: JPEG, PNG, WebP.
                </p>
                <CodeBlock tabs={IMAGE_I2I_CODE} />

                <NoteBox title="Lưu ý">
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>Nếu không gửi <InlineCode>image_input</InlineCode>, API hoạt động như text-to-image bình thường</li>
                    <li>URL ảnh phải truy cập được công khai (public URL) để hệ thống có thể tải về</li>
                    <li>grok-imagine khi có <InlineCode>image_input</InlineCode> sẽ tự động chuyển sang chế độ image-to-image</li>
                  </ul>
                </NoteBox>
              </SubSection>

              <SubSection id="image-models" title="Image Models">
                <p className="text-sm text-muted-foreground">
                  Độ phân giải được chọn qua tham số{" "}
                  <InlineCode>resolution</InlineCode> (ví dụ:{" "}
                  <InlineCode>{`"resolution": "2K"`}</InlineCode>). Chỉ áp dụng
                  cho nano-banana models.
                </p>
                {imagePricing && imagePricing.models.length > 0 && (
                  <div className="overflow-hidden rounded-xl border border-border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-background-secondary">
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                              Model ID
                            </th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                              Đơn vị
                            </th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                              Giá (VND)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {imagePricing.models.flatMap((model) =>
                            model.prices.map((tier, i) => (
                              <tr
                                key={`${model.slug}-${i}`}
                                className="border-b border-border last:border-0"
                              >
                                <td className="px-4 py-3">
                                  <InlineCode>{model.slug}</InlineCode>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                  {tier.unit}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                  {formatVnd(tier.inputPrice)}đ
                                </td>
                              </tr>
                            )),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </SubSection>
            </Section>

            {/* ── Models ── */}
            <Section id="models" icon={List} title="Danh sách Models">
              <p className="text-muted-foreground">
                Lấy danh sách tất cả model đang hoạt động từ hệ thống.
              </p>
              {docs?.endpoints.find((e) => e.path === "/v1/models") && (
                <div className="overflow-hidden rounded-xl border border-border">
                  <EndpointHeader method="GET" path="/v1/models" />
                  <div className="p-4 text-sm text-muted-foreground">
                    Trả về mảng <InlineCode>data[]</InlineCode> với các model
                    đang khả dụng. Dùng field <InlineCode>id</InlineCode> làm
                    giá trị cho tham số <InlineCode>model</InlineCode>.
                  </div>
                </div>
              )}
              <CodeBlock tabs={MODELS_CODE} />

              <NoteBox title="Lưu ý">
                <p className="text-sm text-muted-foreground">
                  Field <InlineCode>owned_by</InlineCode> trong response hiện
                  trả giá trị mặc định, không phản ánh provider thực tế. Dùng{" "}
                  <InlineCode>id</InlineCode> để xác định model.
                </p>
              </NoteBox>

              {/* Chat models pricing from DB */}
              {chatPricing && chatPricing.models.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="border-b border-border bg-background-secondary px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      Chat Models
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-background-secondary">
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                            Model ID
                          </th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                            Input (VND/1M tokens)
                          </th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                            Output (VND/1M tokens)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {chatPricing.models.map((model) => {
                          const tier = model.prices[0];
                          if (!tier) return null;
                          return (
                            <tr
                              key={model.slug}
                              className="border-b border-border last:border-0"
                            >
                              <td className="px-4 py-3">
                                <InlineCode>{model.slug}</InlineCode>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {formatVnd(tier.inputPrice)}đ
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {tier.outputPrice
                                  ? `${formatVnd(tier.outputPrice)}đ`
                                  : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Section>

            {/* ── Rate Limits ── */}
            <Section id="rate-limits" icon={Gauge} title="Rate Limits">
              <p className="text-muted-foreground">
                Mỗi API key có giới hạn sử dụng để đảm bảo chất lượng dịch vụ
                cho tất cả người dùng.
              </p>

              {docs?.rateLimits && (
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-background-secondary">
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                          Giới hạn
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                          Giá trị
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                          Mô tả
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 font-medium">RPM</td>
                        <td className="px-4 py-3 font-mono text-sm">
                          {docs.rateLimits.rpm.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Số request tối đa mỗi phút
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 font-medium">TPM</td>
                        <td className="px-4 py-3 font-mono text-sm">
                          {docs.rateLimits.tpm.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Số tokens tối đa mỗi phút
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Đồng thời</td>
                        <td className="px-4 py-3 font-mono text-sm">
                          {docs.rateLimits.maxParallelRequests}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Số request chạy song song tối đa
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <SubSection id="rate-limits-429" title="Khi vượt giới hạn">
                <p className="text-muted-foreground">
                  Khi vượt giới hạn, API trả về HTTP{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                    429
                  </code>{" "}
                  với các headers:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {RATE_LIMIT_HEADERS.map((h) => (
                    <li key={h.header}>
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                        {h.header}
                      </code>{" "}
                      — {h.desc}
                    </li>
                  ))}
                </ul>
                <CodeBlock
                  tabs={[
                    { label: "JSON", code: RATE_LIMIT_ERROR_EXAMPLE },
                  ]}
                />
              </SubSection>

              <SubSection
                id="rate-limits-best-practices"
                title="Best practices"
              >
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {RATE_LIMIT_BEST_PRACTICES.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </SubSection>
            </Section>

            {/* ── Errors ── */}
            <Section id="errors" icon={AlertCircle} title="Lỗi & Giới hạn">
              <p className="text-muted-foreground">
                API trả về HTTP status code chuẩn. Xử lý lỗi theo bảng bên
                dưới.
              </p>
              {docs?.errorCodes && (
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-background-secondary">
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                          Code
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                          Tên lỗi
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                          Nguyên nhân
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border px-4">
                      {docs.errorCodes.map((err) => (
                        <ErrorRow
                          key={err.code}
                          code={err.code}
                          name={err.name}
                          desc={err.description}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="space-y-2 rounded-xl border border-border bg-background-secondary p-5">
                <p className="text-sm font-medium text-foreground">
                  Format response lỗi
                </p>
                <CodeBlock
                  tabs={[
                    { label: "JSON", code: ERROR_RESPONSE_EXAMPLE },
                  ]}
                />
              </div>
            </Section>

            {/* ── Billing & Usage ── */}
            <Section id="billing" icon={DollarSign} title="Billing & Usage">
              <p className="text-muted-foreground">
                Kiểm tra số dư và lịch sử sử dụng qua các endpoint sau. Lưu ý:
                các endpoint này sử dụng cookie authentication (đăng nhập
                website), không dùng API key Bearer auth.
              </p>

              <div className="overflow-hidden rounded-xl border border-border">
                <EndpointHeader method="GET" path="/api/billing/balance" />
                <div className="p-4 text-sm text-muted-foreground">
                  Trả về số dư hiện tại của tài khoản (VND). Yêu cầu cookie
                  auth (đăng nhập trên website).
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <EndpointHeader method="GET" path="/api/logs/usage" />
                <div className="p-4 text-sm text-muted-foreground">
                  Trả về lịch sử sử dụng API (tokens, chi phí). Yêu cầu cookie
                  auth (đăng nhập trên website).
                </div>
              </div>

              <NoteBox title="Lưu ý">
                <p className="text-sm text-muted-foreground">
                  Các endpoint billing/usage chỉ hoạt động khi bạn đã đăng nhập
                  trên website operis.vn. Không hỗ trợ xác thực bằng API key
                  Bearer token.
                </p>
              </NoteBox>
            </Section>

            {/* ── Examples ── */}
            <Section id="examples" icon={Code2} title="Ví dụ thực tế">
              <p className="text-muted-foreground">
                Chatbot đa lượt với lịch sử hội thoại và streaming.
              </p>
              <CodeBlock tabs={EXAMPLE_CHATBOT_CODE} />
              <p className="text-sm text-muted-foreground">
                Xem thêm ví dụ về image generation và multi-modal tại trang{" "}
                <Link href="/market" className="text-primary hover:underline">
                  Market
                </Link>
                .
              </p>
            </Section>
          </main>
        </div>
      </div>
    </div>
  );
}
