"use client";

import { useState } from "react";
import { Send, ChevronLeft, ChevronRight } from "lucide-react";
import { useCreateFeedback, useFeedbacks } from "@/hooks/use-feedback";
import type { FeedbackItem } from "@/hooks/use-feedback";

const ROWS_PER_PAGE = 10;

const TYPE_OPTIONS = [
  { value: "bug", label: "Báo lỗi" },
  { value: "suggestion", label: "Góp ý" },
  { value: "support", label: "Hỗ trợ" },
] as const;

const TYPE_MAP: Record<string, { label: string; cls: string }> = {
  bug: { label: "Báo lỗi", cls: "bg-destructive/10 text-destructive" },
  suggestion: { label: "Góp ý", cls: "bg-blue-500/10 text-blue-500" },
  support: { label: "Hỗ trợ", cls: "bg-amber-500/10 text-amber-500" },
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  open: { label: "Chờ xử lý", cls: "bg-amber-500/10 text-amber-500" },
  reviewed: { label: "Đã tiếp nhận", cls: "bg-blue-500/10 text-blue-500" },
  resolved: { label: "Đã xử lý", cls: "bg-emerald-500/10 text-emerald-500" },
};

function Badge({ map, value }: { map: Record<string, { label: string; cls: string }>; value: string }) {
  const s = map[value] ?? { label: value, cls: "bg-muted text-muted-foreground" };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}>{s.label}</span>;
}

export default function FeedbackPage() {
  const [type, setType] = useState("bug");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");

  const createFeedback = useCreateFeedback();
  const { data: feedbackData } = useFeedbacks(page, ROWS_PER_PAGE);

  const feedbacks = feedbackData?.data ?? [];
  const totalPages = feedbackData?.pagination?.totalPages ?? 1;

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) return;
    createFeedback.mutate(
      { type, subject: subject.trim(), message: message.trim() },
      {
        onSuccess: () => {
          setSubject("");
          setMessage("");
          setSuccessMsg("Gửi góp ý thành công!");
          setTimeout(() => setSuccessMsg(""), 3000);
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Góp ý & Hỗ trợ</h1>
        <p className="mt-1 text-sm text-muted-foreground">Báo lỗi, góp ý cải thiện, hoặc yêu cầu hỗ trợ</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-xl border border-border p-6">
          <h2 className="mb-6 text-lg font-bold text-foreground">Gửi góp ý</h2>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-foreground">Loại</label>
            <div className="flex gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    type === opt.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-muted-foreground/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-foreground">Tiêu đề</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Mô tả ngắn gọn vấn đề"
              maxLength={255}
              className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-foreground">Mô tả chi tiết</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mô tả chi tiết vấn đề, bước tái tạo lỗi, hoặc gợi ý cải thiện..."
              rows={5}
              className="w-full resize-none rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {successMsg && (
            <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-500">
              {successMsg}
            </div>
          )}

          <button
            type="button"
            disabled={!subject.trim() || !message.trim() || createFeedback.isPending}
            onClick={handleSubmit}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="size-4" />
            {createFeedback.isPending ? "Đang gửi..." : "Gửi góp ý"}
          </button>
        </div>

        {/* History */}
        <div className="rounded-xl border border-border">
          <div className="px-6 py-5">
            <h2 className="text-lg font-bold text-foreground">Lịch sử góp ý</h2>
          </div>

          <div className="divide-y divide-border">
            {feedbacks.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                Chưa có góp ý nào.
              </div>
            ) : (
              feedbacks.map((fb: FeedbackItem) => (
                <div key={fb.id} className="px-6 py-4">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge map={TYPE_MAP} value={fb.type} />
                    <Badge map={STATUS_MAP} value={fb.status} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{fb.subject}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{fb.message}</p>
                  {fb.adminNote && (
                    <div className="mt-2 rounded-md bg-muted/30 px-3 py-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Phản hồi:</span> {fb.adminNote}
                      </p>
                    </div>
                  )}
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {new Date(fb.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 border-t border-border px-6 py-3">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="px-3 text-xs text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
