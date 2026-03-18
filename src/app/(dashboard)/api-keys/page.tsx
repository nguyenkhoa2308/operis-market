"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  Plus,
  Copy,
  Check,
  Pencil,
  Trash2,
  HelpCircle,
  X,
  Info,
  Save,
  Settings,
} from "lucide-react";
import {
  useApiKeys,
  useCreateApiKey,
  useDeleteApiKey,
  useRenameApiKey,
  useUpdateLimits,
  useUpdateWhitelist,
  type ApiKeyCreated,
} from "@/hooks/use-api-keys";
import { toast } from "sonner";

/* ─── Modal shell ─── */
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Close"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ─── Create API Key Modal ─── */
function CreateKeyModal({
  open,
  onClose,
  onCreate,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-foreground">Tạo API Key</h3>
      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Tên
        </label>
        <input
          type="text"
          placeholder="Nhập tên API Key"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full rounded-lg border border-border bg-background-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="cursor-pointer rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !name.trim()}
          className="cursor-pointer rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Đang tạo..." : "Tạo"}
        </button>
      </div>
    </Modal>
  );
}

/* ─── Reveal New API Key Modal ─── */
function NewKeyRevealModal({
  open,
  onClose,
  createdKey,
}: {
  open: boolean;
  onClose: () => void;
  createdKey: ApiKeyCreated | null;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!createdKey) return;
    navigator.clipboard.writeText(createdKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-foreground">API Key đã được tạo</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Sao chép API Key ngay bây giờ. Key này{" "}
        <span className="font-semibold text-destructive">chỉ hiển thị một lần</span>{" "}
        và sẽ không thể xem lại.
      </p>
      {createdKey && (
        <div className="mt-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <code className="flex-1 break-all text-xs font-medium text-foreground">
              {createdKey.key}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Copy key"
            >
              {copied ? (
                <Check className="size-4 text-emerald-500" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Đã hiểu
        </button>
      </div>
    </Modal>
  );
}

/* ─── Manage Whitelist Modal ─── */
function WhitelistModal({
  open,
  onClose,
  initialIps,
  onSave,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  initialIps: string[];
  onSave: (ips: string[]) => void;
  isPending: boolean;
}) {
  const [ips, setIps] = useState<string[]>(initialIps.length > 0 ? [...initialIps] : [""]);

  const addIp = () => {
    if (ips.length < 10) setIps([...ips, ""]);
  };
  const removeIp = (idx: number) => {
    const next = ips.filter((_, i) => i !== idx);
    setIps(next.length > 0 ? next : [""]);
  };
  const updateIp = (idx: number, val: string) => {
    const copy = [...ips];
    copy[idx] = val;
    setIps(copy);
  };

  const handleSave = () => {
    const cleaned = ips.map((ip) => ip.trim()).filter(Boolean);
    onSave(cleaned);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-foreground">Quản lý Whitelist</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Mặc định cho phép tất cả IP. Thêm tối đa 10 địa chỉ IP để giới hạn truy cập.
      </p>
      <div className="mt-5 space-y-3">
        {ips.map((ip, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập địa chỉ IP (vd: 192.168.1.1)"
              value={ip}
              onChange={(e) => updateIp(idx, e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeIp(idx)}
              className="cursor-pointer rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10"
              title="Xóa IP"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addIp}
        disabled={ips.length >= 10}
        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/40 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-4" />
        Thêm địa chỉ IP ({ips.length}/10)
      </button>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="cursor-pointer rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="cursor-pointer rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </Modal>
  );
}

/* ─── Safe-Spend Limits Modal ─── */
function SafeSpendModal({
  open,
  onClose,
  keyId,
  initialLimits,
  onSave,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  keyId: string;
  initialLimits: { hourlyLimit: number; dailyLimit: number; totalLimit: number };
  onSave: (data: { id: string; hourlyLimit: number; dailyLimit: number; totalLimit: number }) => void;
  isPending: boolean;
}) {
  const [hourly, setHourly] = useState(initialLimits.hourlyLimit ? String(initialLimits.hourlyLimit) : "");
  const [daily, setDaily] = useState(initialLimits.dailyLimit ? String(initialLimits.dailyLimit) : "");
  const [total, setTotal] = useState(initialLimits.totalLimit ? String(initialLimits.totalLimit) : "");

  const fields = [
    { label: "Giới hạn credit / giờ", value: hourly, onChange: setHourly, placeholder: "1000" },
    { label: "Giới hạn credit / ngày", value: daily, onChange: setDaily, placeholder: "5000" },
    { label: "Tổng giới hạn credit", value: total, onChange: setTotal, placeholder: "100000" },
  ];

  const handleSave = () => {
    onSave({
      id: keyId,
      hourlyLimit: parseInt(hourly, 10) || 0,
      dailyLimit: parseInt(daily, 10) || 0,
      totalLimit: parseInt(total, 10) || 0,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="size-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Safe-Spend Limits</h3>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Thiết lập giới hạn credit theo giờ và ngày để kiểm soát API
      </p>
      <div className="mt-5 space-y-5">
        {fields.map((f) => (
          <div key={f.label}>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              {f.label}
              <Info className="size-3.5 text-muted-foreground/50" />
            </label>
            <input
              type="text"
              inputMode="numeric"
              title={f.label}
              placeholder={f.placeholder}
              value={f.value}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d+$/.test(v)) f.onChange(v);
              }}
              className="w-full rounded-lg border border-border bg-background-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Đặt 0 để không giới hạn
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="cursor-pointer rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="size-4" />
          {isPending ? "Đang lưu..." : "Lưu giới hạn"}
        </button>
      </div>
    </Modal>
  );
}

/* ─── Confirm Delete Modal ─── */
function DeleteModal({
  open,
  onClose,
  keyName,
  keyId,
  onDelete,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  keyName: string;
  keyId: string;
  onDelete: (id: string) => void;
  isPending: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-foreground">Xác nhận xóa</h3>
      <p className="mt-3 text-sm text-muted-foreground">
        Bạn có chắc muốn xóa API Key{" "}
        <span className="font-semibold text-foreground">{keyName}</span>? Hành
        động này không thể hoàn tác.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="cursor-pointer rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={() => onDelete(keyId)}
          disabled={isPending}
          className="cursor-pointer rounded-lg bg-destructive px-5 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </Modal>
  );
}

/* ─── Edit Key Name Modal ─── */
function EditKeyModal({
  open,
  onClose,
  currentName,
  onSave,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (name: string) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(currentName);

  const handleSubmit = () => {
    if (!name.trim() || name.trim() === currentName) return;
    onSave(name.trim());
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-foreground">Sửa API Key</h3>
      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Tên
        </label>
        <input
          type="text"
          placeholder="Nhập tên API Key"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full rounded-lg border border-border bg-background-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="cursor-pointer rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !name.trim() || name.trim() === currentName}
          className="cursor-pointer rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </Modal>
  );
}

/* ─── Helpers ─── */
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " " + d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

/* ─── Main Page ─── */
export default function ApiKeysPage() {
  const { data: apiKeys = [], isLoading } = useApiKeys();
  const createKey = useCreateApiKey();
  const renameKey = useRenameApiKey();
  const deleteKey = useDeleteApiKey();

  const [createOpen, setCreateOpen] = useState(false);
  const [revealKey, setRevealKey] = useState<ApiKeyCreated | null>(null);
  const [revealOpen, setRevealOpen] = useState(false);
  const updateWhitelist = useUpdateWhitelist();
  const [whitelistTarget, setWhitelistTarget] = useState<{
    open: boolean;
    id: string;
    ips: string[];
  }>({ open: false, id: "", ips: [] });
  const updateLimits = useUpdateLimits();
  const [safeSpendTarget, setSafeSpendTarget] = useState<{
    open: boolean;
    id: string;
    hourlyLimit: number;
    dailyLimit: number;
    totalLimit: number;
  }>({ open: false, id: "", hourlyLimit: 0, dailyLimit: 0, totalLimit: 0 });
  const [editTarget, setEditTarget] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });
  const [deleteTarget, setDeleteTarget] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });

  const handleCreate = (name: string) => {
    createKey.mutate(name, {
      onSuccess: (data) => {
        setCreateOpen(false);
        setRevealKey(data);
        setRevealOpen(true);
        toast.success("Tạo API Key thành công");
      },
      onError: () => {
        setCreateOpen(false);
        toast.error("Không thể tạo API Key");
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteKey.mutate(id, {
      onSuccess: () => {
        setDeleteTarget({ open: false, id: "", name: "" });
        toast.success("Đã xoá API Key");
      },
      onError: () => {
        setDeleteTarget({ open: false, id: "", name: "" });
        toast.error("Không thể xoá API Key");
      },
    });
  };

  return (
    <>
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            API Keys
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border">
          {/* Card header */}
          <div className="flex items-center justify-between border-b border-border bg-background-secondary px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="text-sm font-semibold text-foreground sm:text-base">
              API Keys
            </h2>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover sm:px-4 sm:py-2 sm:text-sm"
            >
              <Plus className="size-4" />
              Tạo Key mới
            </button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              <span className="animate-pulse">Đang tải API Keys...</span>
            </div>
          )}

          {/* Mobile cards */}
          {!isLoading && (
          <div className="divide-y divide-border lg:hidden">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="space-y-3 px-4 py-4">
                {/* Name + actions */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-foreground">
                    {apiKey.name}
                  </h3>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setEditTarget({ open: true, id: apiKey.id, name: apiKey.name })
                      }
                      className="cursor-pointer rounded-md p-1.5 text-primary transition-colors hover:bg-primary/10"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ open: true, id: apiKey.id, name: apiKey.name })
                      }
                      className="cursor-pointer rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Key */}
                <div className="flex items-center gap-2">
                  <code className="whitespace-nowrap font-mono text-xs leading-none text-muted-foreground">
                    sk-{apiKey.keyPrefix}••••••••••••••••••••••••
                  </code>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>You</span>
                  <span>•</span>
                  <span>{formatDate(apiKey.createdAt)}</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWhitelistTarget({ open: true, id: apiKey.id, ips: apiKey.ipWhitelist })}
                    className="cursor-pointer rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                  >
                    Add IP
                  </button>
                  <button
                    type="button"
                    onClick={() => setSafeSpendTarget({ open: true, id: apiKey.id, hourlyLimit: apiKey.hourlyLimit, dailyLimit: apiKey.dailyLimit, totalLimit: apiKey.totalLimit })}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    Safe-Spend
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Desktop table */}
          {!isLoading && (
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Tên
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Key
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Ngày tạo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Người tạo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    IP Whitelist
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Safe-Spend Limits
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apiKeys.map((apiKey) => (
                  <tr
                    key={apiKey.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    {/* Name */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-foreground">
                      {apiKey.name}
                    </td>

                    {/* Key */}
                    <td className="px-5 py-4">
                      <code className="whitespace-nowrap font-mono text-xs leading-none text-muted-foreground">
                        sk-{apiKey.keyPrefix}••••••••••••••••••••••••
                      </code>
                    </td>

                    {/* Created Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                      {formatDate(apiKey.createdAt)}
                    </td>

                    {/* Created by */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">You</span>
                    </td>

                    {/* IP Whitelist */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="group relative">
                          <HelpCircle className="size-4 shrink-0 cursor-help text-muted-foreground/50 transition-colors group-hover:text-primary" />
                          <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl border border-border bg-popover p-3 opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                            <p className="text-sm text-foreground">
                              Mặc định cho phép tất cả IP. Thêm tối đa 10 địa
                              chỉ IP để giới hạn truy cập.
                            </p>
                            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-warning-muted px-3 py-1.5">
                              <span className="text-xs text-warning">⚠</span>
                              <span className="text-xs font-medium text-warning">
                                Chưa có IP nào trong whitelist
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setWhitelistTarget({ open: true, id: apiKey.id, ips: apiKey.ipWhitelist })}
                          className="cursor-pointer whitespace-nowrap rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                        >
                          Add IP
                        </button>
                      </div>
                    </td>

                    {/* Safe-Spend Limits */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSafeSpendTarget({ open: true, id: apiKey.id, hourlyLimit: apiKey.hourlyLimit, dailyLimit: apiKey.dailyLimit, totalLimit: apiKey.totalLimit })}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        Safe-Spend Limits
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setEditTarget({
                              open: true,
                              id: apiKey.id,
                              name: apiKey.name,
                            })
                          }
                          className="cursor-pointer rounded-md p-1.5 text-primary transition-colors hover:bg-primary/10"
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              open: true,
                              id: apiKey.id,
                              name: apiKey.name,
                            })
                          }
                          className="cursor-pointer rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateKeyModal
        key={String(createOpen)}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        isPending={createKey.isPending}
      />
      <NewKeyRevealModal
        open={revealOpen}
        onClose={() => { setRevealOpen(false); setRevealKey(null); }}
        createdKey={revealKey}
      />
      <EditKeyModal
        key={`edit-${editTarget.id}`}
        open={editTarget.open}
        onClose={() => setEditTarget({ open: false, id: "", name: "" })}
        currentName={editTarget.name}
        onSave={(name) => {
          renameKey.mutate({ id: editTarget.id, name }, {
            onSuccess: () => {
              setEditTarget({ open: false, id: "", name: "" });
              toast.success("Đã đổi tên API Key");
            },
            onError: () => {
              setEditTarget({ open: false, id: "", name: "" });
              toast.error("Không thể đổi tên API Key");
            },
          });
        }}
        isPending={renameKey.isPending}
      />
      <WhitelistModal
        key={`wl-${whitelistTarget.id}`}
        open={whitelistTarget.open}
        onClose={() => setWhitelistTarget((prev) => ({ ...prev, open: false }))}
        initialIps={whitelistTarget.ips}
        onSave={(ips) => {
          updateWhitelist.mutate({ id: whitelistTarget.id, ips }, {
            onSuccess: () => {
              setWhitelistTarget((prev) => ({ ...prev, open: false }));
              toast.success("Đã cập nhật whitelist");
            },
            onError: () => {
              toast.error("Không thể cập nhật whitelist");
            },
          });
        }}
        isPending={updateWhitelist.isPending}
      />
      <SafeSpendModal
        key={`ss-${safeSpendTarget.id}`}
        open={safeSpendTarget.open}
        onClose={() => setSafeSpendTarget((prev) => ({ ...prev, open: false }))}
        keyId={safeSpendTarget.id}
        initialLimits={{
          hourlyLimit: safeSpendTarget.hourlyLimit,
          dailyLimit: safeSpendTarget.dailyLimit,
          totalLimit: safeSpendTarget.totalLimit,
        }}
        onSave={(data) => {
          updateLimits.mutate(data, {
            onSuccess: () => {
              setSafeSpendTarget((prev) => ({ ...prev, open: false }));
              toast.success("Đã cập nhật giới hạn");
            },
            onError: () => {
              toast.error("Không thể cập nhật giới hạn");
            },
          });
        }}
        isPending={updateLimits.isPending}
      />
      <DeleteModal
        open={deleteTarget.open}
        onClose={() => setDeleteTarget({ open: false, id: "", name: "" })}
        keyName={deleteTarget.name}
        keyId={deleteTarget.id}
        onDelete={handleDelete}
        isPending={deleteKey.isPending}
      />
    </>
  );
}
