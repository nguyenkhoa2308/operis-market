import type { Metadata } from "next";
import PlaygroundClient from "@/components/playground/PlaygroundClient";

export const metadata: Metadata = {
  title: "Playground — Operis Market",
  description: "Thử nghiệm các model AI trực tiếp trong trình duyệt",
};

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-53px)] lg:h-screen">
      <div className="shrink-0 border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">Playground</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Thử nghiệm các model AI trực tiếp — không cần API key
        </p>
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        <PlaygroundClient />
      </div>
    </div>
  );
}
