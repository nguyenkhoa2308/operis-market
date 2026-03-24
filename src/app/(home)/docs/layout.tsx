import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Docs — Operis Market",
  description:
    "Tài liệu tích hợp API Operis Market cho developers. Hướng dẫn xác thực, chat completions, streaming và danh sách models.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
