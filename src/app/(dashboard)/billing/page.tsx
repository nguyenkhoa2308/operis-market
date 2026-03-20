"use client";

import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Bell,
  AlertTriangle,
  Eye,
  X,
} from "lucide-react";
import {
  useBalance,
  usePackages,
  useTransactions,
  useCreateSepayOrder,
  useSepayStatus,
  usePendingOrder,
} from "@/hooks/use-billing";
import type { SepayOrder, Transaction } from "@/hooks/use-billing";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";

const ROWS_PER_PAGE = 10;

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  completed: { label: "Thành công", cls: "bg-emerald-500/10 text-emerald-500" },
  pending: { label: "Chờ xử lý", cls: "bg-amber-500/10 text-amber-500" },
  expired: { label: "Hết hạn", cls: "bg-gray-500/10 text-gray-500" },
  failed: { label: "Thất bại", cls: "bg-destructive/10 text-destructive" },
  refunded: { label: "Hoàn tiền", cls: "bg-blue-500/10 text-blue-500" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, cls: "bg-muted text-muted-foreground" };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}>{s.label}</span>;
}

/** Format number as VND currency */
const fmtVND = (v: number | string) =>
  Number(v).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

/* ─── Modal shell (same pattern as api-keys) ─── */
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
      <div className="relative mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-xl sm:mx-0 sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Đóng"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

/** Countdown hook: returns "MM:SS" string, empty when expired */
function useCountdown(expiresAt: string | undefined) {
  const target = useMemo(() => (expiresAt ? new Date(expiresAt).getTime() : 0), [expiresAt]);
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    if (!target) return;
    setRemaining(Math.max(0, target - Date.now()));
    const id = setInterval(() => {
      const left = Math.max(0, target - Date.now());
      setRemaining(left);
      if (left <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (remaining <= 0) return "";
  const m = Math.floor(remaining / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function BillingPage() {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [detailOrder, setDetailOrder] = useState<SepayOrder | null>(null);
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [draftAlerts, setDraftAlerts] = useState<number[]>([]);
  const [newThreshold, setNewThreshold] = useState("");
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  const { data: balanceData, isLoading: balanceLoading } = useBalance();
  const { data: packages = [], isLoading: packagesLoading } = usePackages();
  const { data: txData } = useTransactions(page, ROWS_PER_PAGE);
  const createOrder = useCreateSepayOrder();
  const { data: pendingOrder, refetch: refetchPending } = usePendingOrder();
  const { data: orderStatus, refetch: refetchStatus } = useSepayStatus(orderId);

  const activeOrder = createOrder.data ?? orderStatus ?? detailOrder ?? pendingOrder;
  const countdown = useCountdown(activeOrder?.expiresAt);
  const hasPending = !!pendingOrder;

  const defaultPkgId = packages.length > 0
    ? (packages.find((p) => p.badge?.toLowerCase() === "popular")?.id ?? packages[0].id)
    : "";
  const effectiveSelectedPackage = selectedPackage || defaultPkgId;
  const selectedPkg = packages.find((p) => p.id === effectiveSelectedPackage);

  /** Open QR modal for an existing pending order */
  const resumePayment = (order: SepayOrder) => {
    createOrder.reset();
    setDetailOrder(order);
    setOrderId(order.transactionId);
    setQrModalOpen(true);
  };

  // Pagination — server already paginates, no client-side slicing needed
  const totalPages = txData?.pagination?.totalPages ?? 1;
  const safePage = Math.min(page, totalPages);
  const pagedTransactions = txData?.data ?? [];
  const tierStart = (safePage - 1) * ROWS_PER_PAGE + 1;
  const tierEnd = Math.min(safePage * ROWS_PER_PAGE, txData?.pagination?.total ?? 0);

  return (
    <>
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Thanh toán
          </h1>
        </div>

        {/* Top row: Balance + Nạp tiền */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Balance Information */}
          <div className="rounded-xl border border-border p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Balance Information</h2>
              <button type="button" onClick={() => { setDraftAlerts(settings?.balanceAlerts ?? []); setAlertModalOpen(true); }} className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" title="Cài đặt cảnh báo số dư">
                <Bell className="size-5" />
              </button>
            </div>

            <div className="mb-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                {balanceLoading ? (
                  <span className="inline-block h-10 w-20 animate-pulse rounded-lg bg-muted" />
                ) : (
                  <span className="text-4xl font-bold text-foreground">{fmtVND(balanceData?.balance ?? 0)}</span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">Số dư hiện tại</span>
            </div>

            <div className="mb-5 flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
              <p className="text-sm text-muted-foreground">
                Số dư không hết hạn và có thể sử dụng bất cứ lúc nào
              </p>
            </div>

            <div className="mb-4 border-t border-border" />

            <h3 className="mb-3 text-base font-bold text-foreground">Rate Limit</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Mỗi tài khoản giới hạn 20 request mới mỗi 10 giây (≈ 100+ tác vụ đồng thời).
            </p>

            <div className="mb-4 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                <p className="text-sm text-muted-foreground">Áp dụng cho mỗi tài khoản</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                <p className="text-sm text-muted-foreground">
                  Request vượt quá giới hạn trả về HTTP 429 và không được xếp hàng
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Giới hạn này đủ cho hầu hết người dùng. Nếu bạn thường xuyên gặp lỗi 429, liên hệ
              hỗ trợ để yêu cầu tăng giới hạn.
            </p>
          </div>

          {/* Nạp tiền */}
          <div className="rounded-xl border border-border p-6">
            <h2 className="mb-6 text-lg font-bold text-foreground">Nạp tiền</h2>

            {/* Select Package */}
            <p className="mb-3 text-sm font-semibold text-foreground">Chọn gói nạp</p>
            <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {packagesLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-lg border border-border px-3 py-4">
                      <div className="mb-2 h-7 w-12 rounded bg-muted" />
                      <div className="h-4 w-20 rounded bg-muted" />
                    </div>
                  ))
                : packages.map((pkg) => {
                    const isSelected = effectiveSelectedPackage === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`relative cursor-pointer rounded-lg border px-3 py-4 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-muted-foreground/40"
                        }`}
                      >
                        {pkg.badge && (
                          <span className="absolute -right-1 -top-2 rotate-12 rounded bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            {pkg.badge}
                          </span>
                        )}
                        <div className={`text-xl font-bold ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                          {fmtVND(pkg.price)}
                        </div>
                      </button>
                    );
                  })}
            </div>

            {/* Payment Method */}
            <p className="mb-3 text-sm font-semibold text-foreground">Phương thức thanh toán</p>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/5 px-5 py-2.5 text-sm font-medium text-foreground">
                <QrCode className="size-4" />
                QR Code (SePay)
              </div>
            </div>

            {/* Pay button */}
            {hasPending ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => resumePayment(pendingOrder!)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-semibold text-white transition-colors hover:bg-amber-600 sm:rounded-full sm:text-sm"
                >
                  <QrCode className="size-4 shrink-0" />
                  <span>Tiếp tục thanh toán — {fmtVND(pendingOrder!.amountVnd)}</span>
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  Bạn đang có đơn chờ thanh toán. Hoàn tất hoặc huỷ đơn cũ để tạo đơn mới.
                </p>
              </div>
            ) : (
              <button
                type="button"
                disabled={!selectedPkg || createOrder.isPending}
                onClick={() => {
                  if (!selectedPkg) return;
                  createOrder.mutate(
                    { amount: Number(selectedPkg.price) },
                    {
                      onSuccess: (data) => {
                        setOrderId(data.transactionId);
                        setQrModalOpen(true);
                      },
                    }
                  );
                }}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-full sm:text-sm"
              >
                <QrCode className="size-4 shrink-0" />
                <span>
                  {createOrder.isPending
                    ? "Đang tạo đơn..."
                    : selectedPkg
                      ? `Thanh toán ${fmtVND(selectedPkg.price)}`
                      : "Chọn gói nạp"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="rounded-xl border border-border">
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="text-base font-bold text-foreground sm:text-lg">Lịch sử giao dịch</h2>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-border md:hidden">
            {pagedTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${tx.status === "completed" ? "text-emerald-500" : "text-muted-foreground"}`}>
                      {tx.status === "completed" ? "+" : ""}{fmtVND(tx.amountVnd)}
                    </span>
                    <StatusBadge status={tx.status} />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDetailTx(tx)}
                    className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    title="Xem chi tiết"
                  >
                    <Eye className="size-4" />
                  </button>
                  {tx.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => { setOrderId(tx.id); setQrModalOpen(true); }}
                      className="cursor-pointer rounded-md bg-amber-500/10 p-1.5 text-amber-500 transition-colors hover:bg-amber-500/20"
                      title="Thanh toán"
                    >
                      <QrCode className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {pagedTransactions.length === 0 && (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                Chưa có giao dịch nào.
              </div>
            )}
          </div>

          {/* Desktop table */}
          <table className="hidden w-full md:table">
            <thead>
              <tr className="border-y border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pagedTransactions.map((tx) => (
                <tr key={tx.id} className="transition-colors hover:bg-muted/20">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                    {new Date(tx.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${tx.status === "completed" ? "text-emerald-500" : "text-muted-foreground"}`}>
                      {tx.status === "completed" ? "+" : ""}{fmtVND(tx.amountVnd)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setDetailTx(tx)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <Eye className="size-3.5" />
                        Xem
                      </button>
                      {tx.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderId(tx.id);
                            setQrModalOpen(true);
                          }}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-500 transition-colors hover:bg-amber-500/20"
                        >
                          <QrCode className="size-3.5" />
                          Thanh toán
                        </button>
                      )}
                      {tx.status === "completed" && (
                        <button
                          type="button"
                          title="Tải hoá đơn"
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          <Download className="size-3.5" />
                          Tải về
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pagedTransactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    Chưa có giao dịch nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 sm:px-6">
              <span className="text-xs text-muted-foreground">
                {tierStart}-{tierEnd} / {txData?.pagination?.total ?? 0}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  title="Trang trước"
                  className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`size-8 cursor-pointer rounded-lg text-xs font-medium transition-colors ${
                      safePage === p
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage === totalPages}
                  title="Trang sau"
                  className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Payment Modal */}
      <Modal open={qrModalOpen} onClose={() => { setQrModalOpen(false); setOrderId(null); setDetailOrder(null); createOrder.reset(); refetchPending(); }}>
        {(() => {
          const od = createOrder.data ?? orderStatus ?? detailOrder ?? pendingOrder;
          if (!od) return (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Đang tải thông tin đơn hàng...</p>
            </div>
          );
          if (orderStatus?.status === "completed") return (
            <>
              <h3 className="text-lg font-bold text-emerald-500">Thanh toán thành công!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Số dư đã được cộng <span className="font-semibold text-emerald-500">{fmtVND(orderStatus.amountVnd)}</span>.
              </p>
              <button
                type="button"
                onClick={() => { setQrModalOpen(false); setOrderId(null); setDetailOrder(null); createOrder.reset(); refetchPending(); }}
                className="mt-5 w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Đóng
              </button>
            </>
          );
          return (
            <>
              <h3 className="text-lg font-bold text-foreground">Thanh toán qua QR Code</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Quét mã QR bên dưới để thanh toán <span className="font-semibold text-foreground">{fmtVND(od?.amountVnd ?? 0)}</span>
              </p>

              {/* QR Image */}
              <div className="mx-auto mt-4 w-[180px] rounded-xl border border-border bg-white p-4 sm:mt-5 sm:w-[240px] sm:p-5">
                <div className="flex aspect-square items-center justify-center">
                  {od?.paymentInfo?.qrCodeUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={od.paymentInfo.qrCodeUrl} alt="QR Code thanh toán" className="size-full object-contain" />
                  ) : (
                    <QrCode className="size-full text-gray-800" strokeWidth={0.6} />
                  )}
                </div>
              </div>

              {/* Transfer info */}
              <div className="mt-5 space-y-2 rounded-lg bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Ngân hàng</span>
                  <span className="text-sm font-medium text-foreground">
                    {od?.paymentInfo?.bankName || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Số tài khoản</span>
                  <span className="text-sm font-medium text-foreground">
                    {od?.paymentInfo?.accountNumber || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Chủ tài khoản</span>
                  <span className="text-sm font-medium text-foreground">
                    {od?.paymentInfo?.accountName || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Nội dung CK</span>
                  <span className="text-sm font-bold text-primary">
                    {od?.paymentInfo?.transferContent ?? od?.orderCode ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Số tiền</span>
                  <span className="text-sm font-bold text-primary">
                    {fmtVND(od?.amountVnd ?? 0)}
                  </span>
                </div>
              </div>

              {/* Payment status feedback */}
              {orderStatus?.status === "pending" && (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-500">
                  <div className="flex items-center gap-2">
                    <span className="size-2 animate-pulse rounded-full bg-amber-500" />
                    Đang chờ thanh toán...
                  </div>
                  {countdown && (
                    <span className="font-mono font-semibold">{countdown}</span>
                  )}
                </div>
              )}
              {orderStatus?.status === "expired" && (
                <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                  Đơn hàng đã hết hạn. Vui lòng tạo đơn mới.
                </div>
              )}

              {/* Check transaction button */}
              <button
                type="button"
                onClick={() => void refetchStatus()}
                className="mt-5 w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Kiểm tra giao dịch
              </button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Số dư sẽ được cộng tự động trong vòng 1-2 phút sau khi thanh toán thành công.
              </p>
            </>
          );
        })()}
      </Modal>

      {/* Transaction Detail Modal */}
      <Modal open={!!detailTx} onClose={() => setDetailTx(null)}>
        {detailTx && (
          <>
            <h3 className="text-lg font-bold text-foreground">Chi tiết giao dịch</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Mã giao dịch</span>
                <span className="max-w-[200px] truncate text-xs font-mono text-foreground">{detailTx.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Thời gian</span>
                <span className="text-sm text-foreground">
                  {new Date(detailTx.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Loại</span>
                <span className="text-sm text-foreground">{detailTx.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Số tiền</span>
                <span className={`text-sm font-semibold ${detailTx.status === "completed" ? "text-emerald-500" : "text-muted-foreground"}`}>{detailTx.status === "completed" ? "+" : ""}{fmtVND(detailTx.amountVnd)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Trạng thái</span>
                <StatusBadge status={detailTx.status} />
              </div>
              {detailTx.description && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Mô tả</span>
                  <span className="max-w-[200px] text-right text-sm text-foreground">{detailTx.description}</span>
                </div>
              )}
            </div>

            {detailTx.status === "pending" && (
              <button
                type="button"
                onClick={() => {
                  setDetailTx(null);
                  setOrderId(detailTx.id);
                  setQrModalOpen(true);
                }}
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                <QrCode className="size-4" />
                Thanh toán ngay
              </button>
            )}

            <button
              type="button"
              onClick={() => setDetailTx(null)}
              className="mt-3 w-full cursor-pointer rounded-lg border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Đóng
            </button>
          </>
        )}
      </Modal>

      {/* Balance Alert Settings Modal */}
      <Modal open={alertModalOpen} onClose={() => { setAlertModalOpen(false); setNewThreshold(""); }}>
        <h3 className="text-lg font-bold text-foreground">Cài đặt cảnh báo</h3>
        <p className="mt-2 text-sm text-foreground">
          Thiết lập tối đa 3 ngưỡng số dư (VND) để nhận thông báo qua email
        </p>
        <p className="text-xs text-muted-foreground">
          Bạn sẽ nhận email khi số dư giảm xuống dưới ngưỡng đã đặt
        </p>

        <div className="mt-5 space-y-2">
          {draftAlerts.map((threshold, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5">
              <span className="flex-1 text-sm text-foreground">{threshold.toLocaleString("vi-VN")}đ</span>
              <button
                type="button"
                onClick={() => setDraftAlerts(draftAlerts.filter((_, j) => j !== i))}
                className="cursor-pointer text-xs text-destructive hover:underline"
              >
                Xoá
              </button>
            </div>
          ))}

          {draftAlerts.length < 3 && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                placeholder="Nhập ngưỡng VND"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {draftAlerts.length < 3 && (
            <button
              type="button"
              onClick={() => {
                const val = Number(newThreshold);
                if (val > 0 && !draftAlerts.includes(val)) {
                  setDraftAlerts([...draftAlerts, val].sort((a, b) => b - a));
                  setNewThreshold("");
                }
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/40 py-3 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/5"
            >
              + Thêm cảnh báo ({draftAlerts.length}/3)
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => { setAlertModalOpen(false); setNewThreshold(""); }}
            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Huỷ
          </button>
          <button
            type="button"
            disabled={updateSettings.isPending}
            onClick={() => {
              updateSettings.mutate({ balanceAlerts: draftAlerts }, {
                onSuccess: () => { setAlertModalOpen(false); setNewThreshold(""); },
              });
            }}
            className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {updateSettings.isPending ? "Đang lưu..." : "Lưu cài đặt"}
          </button>
        </div>
      </Modal>
    </>
  );
}
