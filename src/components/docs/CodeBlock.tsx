"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeTab {
  label: string;
  code: string;
  language?: string;
}

interface CodeBlockProps {
  tabs: CodeTab[];
}

export default function CodeBlock({ tabs }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0d1117] text-sm">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-1">
        <div className="flex">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-xs font-medium transition-colors ${
                activeTab === i
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="mr-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          {copied ? (
            <>
              <Check className="size-3 text-green-400" />
              <span className="text-green-400">Đã sao chép</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Sao chép
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-white/90">
        <code>{tabs[activeTab].code}</code>
      </pre>
    </div>
  );
}
