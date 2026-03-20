"use client";

import { useState, useRef, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface PlaygroundMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
  costVnd: number;
}

export interface PlaygroundParams {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
}

export function usePlayground() {
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (userInput: string, params: PlaygroundParams) => {
      if (!userInput.trim() || isStreaming) return;

      const userMsg: PlaygroundMessage = { role: "user", content: userInput.trim() };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setCurrentResponse("");
      setTokenUsage(null);
      setError(null);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      const apiMessages = params.systemPrompt
        ? [{ role: "system", content: params.systemPrompt }, ...updatedMessages]
        : updatedMessages;

      try {
        const response = await fetch(`${API_BASE}/chat/playground`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            model: params.model,
            messages: apiMessages,
            stream: true,
            temperature: params.temperature,
            max_tokens: params.maxTokens,
            top_p: params.topP,
          }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          const msg = (body as any).message || `Error ${response.status}`;
          setError(msg);
          setIsStreaming(false);
          // Remove the user message we just added
          setMessages(messages);
          return;
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") {
              setIsStreaming(false);
              break;
            }
            try {
              const chunk = JSON.parse(raw);
              // Final usage event from our backend
              if (chunk.cost) {
                setTokenUsage({
                  prompt: chunk.cost.promptTokens ?? 0,
                  completion: chunk.cost.completionTokens ?? 0,
                  total: (chunk.cost.promptTokens ?? 0) + (chunk.cost.completionTokens ?? 0),
                  costVnd: chunk.cost.vnd ?? 0,
                });
                continue;
              }
              const delta = chunk.choices?.[0]?.delta?.content ?? "";
              if (delta) {
                accumulated += delta;
                setCurrentResponse(accumulated);
              }
            } catch { /* skip malformed chunk */ }
          }
        }

        // Commit accumulated response to message history
        if (accumulated) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: accumulated },
          ]);
        }
        setCurrentResponse("");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Lỗi kết nối. Vui lòng thử lại.");
          setMessages(messages);
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    // If there's an in-progress response, commit it
    setCurrentResponse((prev) => {
      if (prev) {
        setMessages((msgs) => [...msgs, { role: "assistant", content: prev }]);
      }
      return "";
    });
  }, []);

  const regenerate = useCallback(
    async (params: PlaygroundParams) => {
      if (isStreaming || messages.length < 2) return;
      // Remove last assistant message and re-send last user message
      const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
      if (lastUserIdx === -1) return;
      const realIdx = messages.length - 1 - lastUserIdx;
      const lastUserMsg = messages[realIdx];
      const trimmedMessages = messages.slice(0, realIdx);
      setMessages(trimmedMessages);
      await send(lastUserMsg.content, params);
    },
    [messages, isStreaming, send],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentResponse("");
    setTokenUsage(null);
    setError(null);
  }, []);

  return {
    messages,
    isStreaming,
    currentResponse,
    tokenUsage,
    error,
    send,
    stop,
    regenerate,
    clearMessages,
  };
}
