"use client";

import { useRef, useEffect, useState, KeyboardEvent } from "react";
import { Send, Square, RotateCcw, Trash2, Bot, User, AlertCircle } from "lucide-react";
import type { PlaygroundMessage, TokenUsage, PlaygroundParams } from "@/hooks/use-playground";

interface ChatPanelProps {
  messages: PlaygroundMessage[];
  isStreaming: boolean;
  currentResponse: string;
  tokenUsage: TokenUsage | null;
  error: string | null;
  systemPrompt: string;
  onSystemPromptChange: (v: string) => void;
  onSend: (input: string) => void;
  onStop: () => void;
  onRegenerate: () => void;
  onClear: () => void;
}

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5 ${
          isUser ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"
        }`}
      >
        {isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-accent text-foreground rounded-tl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default function ChatPanel({
  messages,
  isStreaming,
  currentResponse,
  tokenUsage,
  error,
  systemPrompt,
  onSystemPromptChange,
  onSend,
  onStop,
  onRegenerate,
  onClear,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [showSystem, setShowSystem] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    onSend(input);
    setInput("");
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const hasMessages = messages.length > 0 || isStreaming;
  const canRegenerate = !isStreaming && messages.length >= 2;

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* System prompt */}
      <div className="border-b border-border bg-background-secondary">
        <button
          type="button"
          onClick={() => setShowSystem((v) => !v)}
          className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="font-medium">System Prompt</span>
          {systemPrompt && (
            <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-xs text-primary">
              Đã đặt
            </span>
          )}
          <span className="ml-auto text-xs">{showSystem ? "▲" : "▼"}</span>
        </button>
        {showSystem && (
          <div className="px-4 pb-3">
            <textarea
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              placeholder="Nhập system prompt (ví dụ: Bạn là trợ lý AI hữu ích...)"
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {!hasMessages && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-2 text-muted-foreground">
              <Bot className="mx-auto size-10 opacity-30" />
              <p className="text-sm">Bắt đầu cuộc trò chuyện bằng cách nhập tin nhắn bên dưới</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {/* Streaming response in progress */}
        {isStreaming && currentResponse && (
          <MessageBubble role="assistant" content={currentResponse + "▊"} />
        )}
        {isStreaming && !currentResponse && (
          <div className="flex gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent mt-0.5">
              <Bot className="size-3.5 text-foreground" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-accent px-4 py-3">
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Token usage */}
      {tokenUsage && (
        <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-xs text-muted-foreground bg-background-secondary">
          <span>Prompt: <span className="text-foreground font-medium">{tokenUsage.prompt.toLocaleString()}</span></span>
          <span className="opacity-30">|</span>
          <span>Output: <span className="text-foreground font-medium">{tokenUsage.completion.toLocaleString()}</span></span>
          <span className="opacity-30">|</span>
          <span>Tổng: <span className="text-foreground font-medium">{tokenUsage.total.toLocaleString()}</span></span>
          <span className="opacity-30">|</span>
          <span>Chi phí: <span className="text-primary font-medium">{Number(tokenUsage.costVnd).toLocaleString("vi-VN")}đ</span></span>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border p-4 space-y-2">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng)"
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 overflow-hidden"
            style={{ minHeight: "44px", maxHeight: "160px" }}
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              title="Dừng"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              <Square className="size-4 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              title="Gửi (Enter)"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="size-4" />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={!canRegenerate}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="size-3" />
            Thử lại
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={!hasMessages}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="size-3" />
            Xóa hội thoại
          </button>
        </div>
      </div>
    </div>
  );
}
