"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePlayground } from "@/hooks/use-playground";
import Link from "next/link";
import {
  Copy,
  Check,
  Zap,
  Play,
  Grid3X3,
  FileText,
  Code2,
  ChevronDown,
  Key,
  Shield,
  ExternalLink,
  Info,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { ModelDetail, ModelPlaygroundField } from "@/types/market";
import { useModelDetail } from "@/hooks/use-models";
import { Switch } from "@/components/ui/switch";
import {
  getPlaygroundFields,
  getApiEndpointsForCategory,
  getRequestBodyExample,
  getRootParamsForCategory,
  getExamplesForCategory,
} from "@/data/model-detail";
import { api } from "@/lib/api";

type Tab = "playground" | "examples" | "readme" | "api";

/* ─── Chat Playground (for chat models) ─── */
function ChatPlaygroundTab({ slug }: { slug: string }) {
  const { messages, isStreaming, currentResponse, tokenUsage, error, send, stop, clearMessages } = usePlayground();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 || currentResponse) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentResponse]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    send(input, { model: slug, systemPrompt: "", temperature: 1, maxTokens: 1024, topP: 1 });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isStreaming && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            Gửi tin nhắn để bắt đầu thử model
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isStreaming && currentResponse && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-muted text-foreground whitespace-pre-wrap">
              {currentResponse}
              <span className="inline-block w-1 h-4 ml-0.5 bg-foreground animate-pulse" />
            </div>
          </div>
        )}
        {isStreaming && !currentResponse && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 bg-muted flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="size-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Token usage */}
      {tokenUsage && (
        <div className="px-4 py-1.5 border-t border-border text-xs text-muted-foreground flex gap-3">
          <span>Prompt: {tokenUsage.prompt}</span>
          <span>Completion: {tokenUsage.completion}</span>
          <span>Chi phí: {Number(tokenUsage.costVnd).toLocaleString('vi-VN')}đ</span>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-3 flex gap-2">
        <button type="button" onClick={clearMessages} title="Clear" className="cursor-pointer text-xs text-muted-foreground hover:text-foreground px-2">
          Xóa
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Nhập tin nhắn..."
          rows={1}
          className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
        />
        {isStreaming ? (
          <button type="button" onClick={stop} className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white">Stop</button>
        ) : (
          <button type="button" title="Send" onClick={handleSend} disabled={!input.trim()} className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50">
            <Zap className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Playground Tab ─── */
function PlaygroundTab({
  category,
  slug,
  apiFields,
  examplePrompt,
}: {
  category: string;
  slug: string;
  apiFields?: ModelPlaygroundField[];
  examplePrompt?: string;
}) {
  const fields =
    apiFields && apiFields.length > 0
      ? apiFields
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((f) => ({
            name: f.name,
            label: f.label,
            type: f.type,
            description: f.description ?? undefined,
            required: f.required,
            placeholder: f.placeholder ?? undefined,
            defaultValue: f.defaultValue ?? undefined,
            options: f.modelFieldOptions?.map((o) => ({
              label: o.label,
              value: o.value,
            })),
          }))
      : getPlaygroundFields(
          slug,
          category as "image" | "video" | "music" | "chat",
        );
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.defaultValue) init[f.name] = f.defaultValue;
    });
    return init;
  });

  // Apply example prompt when set from Examples tab
  useEffect(() => {
    if (examplePrompt) {
      setFormValues((v) => ({ ...v, prompt: examplePrompt }));
    }
  }, [examplePrompt]);
  const [inputMode, setInputMode] = useState<"form" | "json">("form");
  const [outputMode, setOutputMode] = useState<"preview" | "json">("preview");
  const [isRunning, setIsRunning] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  if (category === "chat") {
    return <ChatPlaygroundTab slug={slug} />;
  }

  const outputType =
    category === "image"
      ? "image"
      : category === "video"
        ? "video"
        : category === "music"
          ? "audio"
          : "text";

  const credits =
    category === "image"
      ? 8
      : category === "video"
        ? 20
        : category === "music"
          ? 10
          : 2;

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunError(null);
    setOutputUrl(null);
    try {
      if (category === "image") {
        const res = await api.post("/chat/image-playground", {
          model: slug,
          prompt: formValues.prompt ?? "",
          aspect_ratio: formValues.aspect_ratio ?? "1:1",
          resolution: formValues.resolution ?? "1K",
        }, { timeout: 150000 });
        setOutputUrl(res.data.data?.url ?? null);
      } else {
        setRunError("Video/music generation coming soon.");
      }
    } catch (err: any) {
      setRunError(err?.response?.data?.message ?? err.message ?? "Generation failed");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
      {/* Input */}
      <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Input</h3>
          <div className="flex rounded-lg bg-muted/50 p-0.5">
            {(["form", "json"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setInputMode(m)}
                className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                  inputMode === m
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "form" ? "Form" : "JSON"}
              </button>
            ))}
          </div>
        </div>

        {inputMode === "form" ? (
          <div className="space-y-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">
                  {field.label}
                  {field.required && (
                    <span className="ml-0.5 text-red-400">*</span>
                  )}
                </label>

                {field.type === "textarea" && (
                  <textarea
                    placeholder={field.placeholder}
                    value={formValues[field.name] ?? ""}
                    onChange={(e) =>
                      setFormValues((v) => ({
                        ...v,
                        [field.name]: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full resize-y rounded-lg border border-border bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                )}

                {field.type === "select" && (
                  <div className="relative">
                    <select
                      title={field.label}
                      value={formValues[field.name] ?? field.defaultValue}
                      onChange={(e) =>
                        setFormValues((v) => ({
                          ...v,
                          [field.name]: e.target.value,
                        }))
                      }
                      className="w-full appearance-none rounded-lg border border-border bg-background-secondary px-4 py-3 pr-10 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                )}

                {field.type === "options" && (
                  <div className="flex flex-wrap gap-2">
                    {field.options?.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setFormValues((v) => ({
                            ...v,
                            [field.name]: opt.value,
                          }))
                        }
                        className={`cursor-pointer rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                          (formValues[field.name] ?? field.defaultValue) ===
                          opt.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {field.type === "toggle" && (
                  <Switch
                    checked={formValues[field.name] === "true"}
                    onCheckedChange={(checked) =>
                      setFormValues((v) => ({
                        ...v,
                        [field.name]: checked ? "true" : "false",
                      }))
                    }
                    aria-label={field.label}
                  />
                )}

                {field.type === "file" && (
                  <div className="rounded-lg border-2 border-dashed border-border bg-background-secondary px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Kéo thả hoặc click để upload file
                    </p>
                  </div>
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    title={field.label}
                    placeholder={field.placeholder ?? field.label}
                    value={formValues[field.name] ?? field.defaultValue}
                    onChange={(e) =>
                      setFormValues((v) => ({
                        ...v,
                        [field.name]: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background-secondary px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                )}

                {field.description && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {field.description}
                  </p>
                )}
              </div>
            ))}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => {
                  const init: Record<string, string> = {};
                  fields.forEach((f) => { if (f.defaultValue) init[f.name] = f.defaultValue; });
                  setFormValues(init);
                  setOutputUrl(null);
                  setRunError(null);
                }}
                className="cursor-pointer rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleRun}
                disabled={isRunning || !formValues.prompt?.trim()}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {isRunning ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Zap className="size-4" />
                )}
                {credits} Run
              </button>
            </div>
          </div>
        ) : (
          <pre className="rounded-lg bg-background-secondary p-4 text-[13px] leading-relaxed text-foreground">
            <code>{JSON.stringify(formValues, null, 2)}</code>
          </pre>
        )}
      </div>

      {/* Output */}
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Output</h3>
          <div className="flex rounded-lg bg-muted/50 p-0.5">
            {(["preview", "json"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setOutputMode(m)}
                className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                  outputMode === m
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "preview" ? "Preview" : "JSON"}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">output type</span>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
            {outputType}
          </span>
        </div>

        {/* Output area */}
        {runError && (
          <p className="mb-3 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{runError}</p>
        )}
        <div className="flex aspect-video items-center justify-center rounded-xl border border-border bg-muted/20 overflow-hidden">
          {outputUrl && outputType === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={outputUrl} alt="Generated" className="h-full w-full object-contain" />
          ) : isRunning ? (
            <div className="flex flex-col items-center gap-3">
              <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Đang tạo ảnh...</p>
            </div>
          ) : (
            <div className="text-center">
              <Play className="mx-auto mb-3 size-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                Nhấn &quot;Run&quot; để tạo kết quả
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Examples Tab ─── */
function ExamplesTab({ category, onUseExample }: { category: string; onUseExample?: (prompt: string) => void }) {
  const examples = getExamplesForCategory(category);

  return (
    <div className="p-6">
      <div className="rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground">Examples</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Click an example to load it into the Playground
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {examples.map((ex) => (
            <button
              key={ex.title}
              type="button"
              onClick={() => onUseExample?.(ex.prompt)}
              className="group cursor-pointer rounded-xl border border-border bg-muted/20 p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <p className="mb-1 text-sm font-bold text-foreground group-hover:text-primary">
                {ex.title}
              </p>
              <p className="mb-3 text-xs text-muted-foreground">{ex.description}</p>
              <p className="line-clamp-3 rounded-lg bg-background/60 p-3 text-xs text-foreground/70">
                {ex.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── README Tab ─── */
function ReadmeTab({
  modelName,
  slug,
  description,
  category,
  pricing,
}: {
  modelName: string;
  slug: string;
  description: string;
  category: string;
  pricing: string;
}) {
  const endpointPath = category === "image"
    ? "/v1/images/generations"
    : category === "video"
    ? "/v1/videos/generations"
    : category === "music"
    ? "/v1/music/generations"
    : "/v1/chat/completions";

  const exampleBody = getRequestBodyExample(category, slug);


  return (
    <div className="p-6">
      <div className="rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground">README</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete guide to using {slug}
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              {modelName} API
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-base font-bold text-foreground">💰 Pricing</h3>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="text-sm text-foreground">{pricing}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-base font-bold text-foreground">🚀 Quick Start</h3>
            <ol className="space-y-1.5 text-sm text-muted-foreground">
              <li>1. Đăng ký tài khoản tại Operis Market</li>
              <li>2. Nạp credits vào tài khoản</li>
              <li>3. Tạo API Key tại trang quản lý</li>
              <li>4. Gọi API endpoint bên dưới</li>
            </ol>
          </div>

          <div>
            <h3 className="mb-3 text-base font-bold text-foreground">📡 API Endpoint</h3>
            <pre className="overflow-x-auto rounded-lg bg-background-secondary p-4 text-xs text-foreground">
              <code>{`POST ${endpointPath}
Authorization: Bearer YOUR_API_KEY

${exampleBody}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-2 text-base font-bold text-foreground">⚡ Rate Limits</h3>
            <p className="text-sm text-muted-foreground">
              Free tier: 10 requests/minute. Paid tier: 100 requests/minute.
              Liên hệ hỗ trợ nếu bạn cần rate limit cao hơn.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-base font-bold text-foreground">🆘 Support</h3>
            <p className="text-sm text-muted-foreground">
              Nếu bạn gặp vấn đề, liên hệ qua Discord hoặc email
              support@operis.market
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── API Tab ─── */
function ApiTab({ slug, category }: { slug: string; category: string }) {
  const endpoints = getApiEndpointsForCategory(category);
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [copied, setCopied] = useState(false);
  const ep = endpoints[activeEndpoint] ?? endpoints[0];
  const rootParams = getRootParamsForCategory(category);
  const requestBodyExampleStr = getRequestBodyExample(category, slug);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="border-b border-border p-6 lg:w-[300px] lg:border-b-0 lg:border-r">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
            API
          </span>
          API Endpoints
        </h3>

        <div className="space-y-2">
          {endpoints.map((endpoint, i) => (
            <button
              key={endpoint.name}
              type="button"
              onClick={() => setActiveEndpoint(i)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                activeEndpoint === i
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted/50"
              }`}
            >
              <Zap className="size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{endpoint.name}</p>
                <p
                  className={`text-[11px] ${activeEndpoint === i ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {endpoint.method}
                </p>
              </div>
            </button>
          ))}

          <Link
            href="#"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-foreground transition-colors hover:bg-muted/50"
          >
            <Info className="size-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-primary">Get Started</p>
              <p className="text-[11px] text-muted-foreground">
                Things You Should Know
              </p>
            </div>
            <ChevronRight className="ml-auto size-4 text-muted-foreground" />
          </Link>
        </div>

        {/* Auth section */}
        <div className="mt-6 border-t border-border pt-6">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
            <Shield className="size-4 text-yellow-500" />
            Authentication
          </h4>
          <p className="mb-3 text-xs text-muted-foreground">
            All APIs require authentication via Bearer Token.
          </p>
          <pre className="rounded-lg bg-muted/50 p-3 text-[12px] text-foreground">
            <code>Authorization: Bearer{"\n"}YOUR_API_KEY</code>
          </pre>

          <p className="mb-2 mt-4 text-xs text-muted-foreground">
            Get API Key:
          </p>
          <Link
            href="/api-keys"
            className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-muted"
          >
            <Key className="size-3.5" />
            API Key Management
            <ExternalLink className="size-3" />
          </Link>

          <div className="mt-4 space-y-1 text-[11px] text-muted-foreground">
            <p>🔒 Keep your API Key secure</p>
            <p>🚫 Do not share it with others</p>
            <p>⚡ Reset immediately if compromised</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Endpoint header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span
              className={`rounded-lg px-3 py-1 text-xs font-bold text-white ${ep.method === "POST" ? "bg-green-600" : "bg-blue-600"}`}
            >
              {ep.method}
            </span>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
              <code className="text-sm text-foreground">{ep.path}</code>
              <button
                type="button"
                title="Copy path"
                onClick={() => handleCopy(ep.path)}
                className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? (
                  <Check className="size-3.5 text-green-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground">{ep.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{ep.description}</p>
        </div>

        {/* Request Parameters */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              Request Parameters
            </h3>
            <p className="text-sm text-muted-foreground">
              The API accepts a JSON payload with the following structure:
            </p>
          </div>

          {/* Request body */}
          <div className="rounded-xl border border-border bg-muted/20 p-6">
            <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
              <Code2 className="size-4 text-primary" />
              Request Body Structure
            </h4>
            <pre className="overflow-x-auto rounded-lg bg-background-secondary p-4 text-[13px] leading-relaxed text-foreground">
              <code>{requestBodyExampleStr}</code>
            </pre>
          </div>

          {/* Root params */}
          <div className="rounded-xl border border-border bg-muted/20 p-6">
            <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="text-primary">💎</span>
              Root Level Parameters
            </h4>
            <div className="space-y-4">
              {rootParams.map((param) => (
                <div
                  key={param.name}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <code className="rounded bg-muted/60 px-2 py-0.5 text-sm font-mono font-semibold text-foreground">
                      {param.name}
                    </code>
                    {param.required && (
                      <span className="rounded bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-400">
                        Required
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {param.type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {param.description}
                  </p>
                  {param.name === "model" && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Example:</p>
                      <code className="text-xs text-primary">
                        &quot;{slug}&quot;
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Client Component ─── */
export default function ModelDetailClient({
  slug,
  initialData,
}: {
  slug: string;
  initialData?: ModelDetail;
}) {
  const { data: model, isLoading } = useModelDetail(slug, initialData);
  const [activeTab, setActiveTab] = useState<Tab>("playground");
  const [copied, setCopied] = useState(false);
  const [examplePrompt, setExamplePrompt] = useState<string | undefined>(undefined);

  const handleCopyName = () => {
    if (!model) return;
    navigator.clipboard.writeText(model.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: Tab; label: string; icon: typeof Play }[] = [
    { id: "playground", label: "Playground", icon: Play },
    { id: "examples", label: "Examples", icon: Grid3X3 },
    { id: "readme", label: "README", icon: FileText },
    { id: "api", label: "API", icon: Code2 },
  ];

  const scrollSections = ["playground", "examples", "readme"] as const;
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isApiTab = activeTab === "api";

  // Scroll-spy: update active tab based on scroll position
  useEffect(() => {
    if (isApiTab || !model) return;
    let hasScrolled = false;
    const onScroll = () => { hasScrolled = true; };
    window.addEventListener("scroll", onScroll, { once: true });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!hasScrolled) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id as Tab);
          }
        }
      },
      { rootMargin: "-140px 0px -50% 0px", threshold: 0 },
    );
    scrollSections.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });
    observerRef.current = observer;
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [isApiTab, model]);

  const handleTabClick = useCallback(
    (id: Tab) => {
      if (id === "api") {
        setActiveTab("api");
        return;
      }
      // If currently on API tab, switch back first
      if (isApiTab) setActiveTab(id);
      // Scroll to section
      setTimeout(
        () => {
          sectionRefs.current[id]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        },
        isApiTab ? 50 : 0,
      );
    },
    [isApiTab],
  );

  if (isLoading || !model) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 lg:pb-10">
      {/* Model header */}
      <div className="mb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {/* Name + copy */}
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="size-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {model.name}
                  </h1>
                  <button
                    type="button"
                    title="Copy model name"
                    onClick={handleCopyName}
                    className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="size-4 text-green-400" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>
                <span className="mt-1 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-3 py-0.5 text-xs font-medium text-green-400">
                  Commercial use
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {model.description}
            </p>

            {/* Pricing */}
            <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <span>💰</span>
              <span>
                Pricing: {model.name} — {model.pricingDisplay ?? model.pricing}.
                High-tier top-ups (+10% bonus) bring effective pricing down.
              </span>
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex shrink-0 flex-col gap-3">
            <Link
              href="/api-keys"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Zap className="size-4" />
              Run with API
            </Link>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Copy className="size-4" />
              Copy page
              <ChevronDown className="size-3.5" />
            </button>
          </div>
        </div>

        {/* TODO: Status monitor — enable when real API available */}
      </div>

      {/* Tabs — sticky below the fixed header (h-[57px]) */}
      <div className="sticky top-[61px] z-30 -mx-px border-b border-border bg-background sm:top-[67px]">
        <div className="flex overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              title={tab.label}
              onClick={() => handleTabClick(tab.id)}
              className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors sm:px-6 sm:py-3.5 sm:text-base ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="size-4 sm:size-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="rounded-b-xl border-x border-b border-border">
        {isApiTab ? (
          <ApiTab slug={model.slug} category={model.category} />
        ) : (
          <>
            <div
              id="playground"
              ref={(el) => { sectionRefs.current.playground = el; }}
              className="scroll-mt-[120px]"
            >
              <PlaygroundTab
                category={model.category}
                slug={model.slug}
                apiFields={model.modelPlaygroundFields}
                examplePrompt={examplePrompt}
              />
            </div>
            <div
              id="examples"
              ref={(el) => { sectionRefs.current.examples = el; }}
              className="scroll-mt-[120px] border-t border-border"
            >
              <ExamplesTab
                category={model.category}
                onUseExample={(prompt) => {
                  setExamplePrompt(prompt);
                  sectionRefs.current.playground?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </div>
            <div
              id="readme"
              ref={(el) => { sectionRefs.current.readme = el; }}
              className="scroll-mt-[120px] border-t border-border"
            >
              <ReadmeTab
                modelName={model.name}
                slug={model.slug}
                description={model.description}
                category={model.category}
                pricing={model.pricing}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
