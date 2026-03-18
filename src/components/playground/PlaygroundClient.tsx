"use client";

import { useState } from "react";
import { usePlayground, type PlaygroundParams } from "@/hooks/use-playground";
import { useModels } from "@/hooks/use-models";
import ChatPanel from "./ChatPanel";
import ParameterPanel from "./ParameterPanel";

const DEFAULT_PARAMS: PlaygroundParams = {
  model: "",
  systemPrompt: "",
  temperature: 1,
  maxTokens: 1024,
  topP: 1,
};

export default function PlaygroundClient() {
  const { messages, isStreaming, currentResponse, tokenUsage, error, send, stop, regenerate, clearMessages } =
    usePlayground();

  const { data: modelsData, isLoading: modelsLoading } = useModels({ category: "chat", limit: 100 });
  const models = modelsData?.data ?? [];

  const [params, setParams] = useState<PlaygroundParams>({
    ...DEFAULT_PARAMS,
    model: models[0]?.slug ?? "",
  });

  // Sync default model once models load
  if (!params.model && models.length > 0) {
    setParams((p) => ({ ...p, model: models[0].slug }));
  }

  const handleParamChange = (partial: Partial<PlaygroundParams>) => {
    setParams((p) => ({ ...p, ...partial }));
  };

  return (
    <div className="flex h-full min-h-0">
      <ChatPanel
        messages={messages}
        isStreaming={isStreaming}
        currentResponse={currentResponse}
        tokenUsage={tokenUsage}
        error={error}
        systemPrompt={params.systemPrompt}
        onSystemPromptChange={(v) => handleParamChange({ systemPrompt: v })}
        onSend={(input) => send(input, params)}
        onStop={stop}
        onRegenerate={() => regenerate(params)}
        onClear={clearMessages}
      />
      <ParameterPanel
        params={params}
        onChange={handleParamChange}
        models={models}
        modelsLoading={modelsLoading}
      />
    </div>
  );
}
