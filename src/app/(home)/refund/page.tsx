import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Chính sách hoàn tiền | Operis Market",
  description: "Chính sách hoàn tiền của Operis Market",
};

const sections = [
  { id: "pham-vi", title: "Phạm vi áp dụng" },
  { id: "dieu-kien", title: "Điều kiện hoàn tiền" },
  { id: "khong-hoan", title: "Không hoàn tiền" },
  { id: "quy-trinh", title: "Quy trình" },
  { id: "hinh-thuc", title: "Hình thức hoàn tiền" },
  { id: "dong-tai-khoan", title: "Đóng tài khoản" },
  { id: "lien-he", title: "Liên hệ" },
];

export default function RefundPage() {
  return (
    <LegalPageLayout
      title="Chính sách hoàn tiền"
      subtitle="Điều kiện và quy trình hoàn tiền tại Operis Market"
      updatedDate="24/03/2026"
      icon="refund"
      sections={sections}
    >
      <section id="pham-vi">
        <h2>Phạm vi áp dụng</h2>
        <p>
          Chính sách này áp dụng cho tất cả giao dịch nạp tiền vào tài khoản
          Operis Market qua mọi phương thức thanh toán. Là một phần không tách
          rời của{" "}
          <a href="/terms" className="text-primary hover:underline">
            Điều khoản dịch vụ
          </a>.
        </p>
        <p className="mt-3">
          Vui lòng đọc kỹ trước khi thanh toán. Bằng việc nạp tiền, bạn xác
          nhận đã đọc và đồng ý với toàn bộ điều kiện bên dưới. Chúng tôi cam
          kết xử lý mọi yêu cầu hoàn tiền công bằng và minh bạch.
        </p>
      </section>

      <section id="dieu-kien">
        <h2>Điều kiện hoàn tiền</h2>
        <p>Bạn có thể yêu cầu hoàn tiền trong các trường hợp sau:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Lỗi hệ thống:</span>{" "}
            Bị trừ tiền ngân hàng nhưng số dư không được cộng do lỗi từ Operis Market hoặc cổng thanh toán
          </li>
          <li>
            <span className="font-medium text-foreground">Nạp trùng:</span>{" "}
            Bị trừ tiền nhiều lần cho cùng một giao dịch do lỗi kỹ thuật hoặc mạng
          </li>
          <li>
            <span className="font-medium text-foreground">Lỗi tính phí API:</span>{" "}
            Bị trừ tiền cho request lỗi server (5xx) hoặc trừ sai giá so với bảng giá công khai
          </li>
          <li>
            <span className="font-medium text-foreground">Gián đoạn dịch vụ:</span>{" "}
            API không hoạt động liên tục hơn 24 giờ — hoàn tiền tương ứng thời gian gián đoạn
          </li>
          <li>
            <span className="font-medium text-foreground">Nạp nhầm:</span>{" "}
            Nạp nhầm số tiền lớn hơn dự định — hoàn phần chênh lệch chưa sử dụng (trong 7 ngày)
          </li>
        </ul>
        <p className="mt-3">
          Yêu cầu phải gửi trong vòng 30 ngày kể từ ngày phát sinh giao dịch.
        </p>
      </section>

      <section id="khong-hoan">
        <h2>Không hoàn tiền</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Đã sử dụng:</span>{" "}
            Số dư đã dùng gọi API thành công (HTTP 2xx) không được hoàn
          </li>
          <li>
            <span className="font-medium text-foreground">Kết quả AI chủ quan:</span>{" "}
            Chất lượng sáng tạo khác nhau giữa các lần gọi là đặc tính của AI — không phải lý do hoàn tiền
          </li>
          <li>
            <span className="font-medium text-foreground">Vi phạm điều khoản:</span>{" "}
            Tài khoản bị khóa do vi phạm — số dư bị tịch thu
          </li>
          <li>
            <span className="font-medium text-foreground">Quá 30 ngày:</span>{" "}
            Yêu cầu sau 30 ngày không đảm bảo được chấp thuận
          </li>
          <li>
            <span className="font-medium text-foreground">Thay đổi ý:</span>{" "}
            Không muốn dùng nữa — có thể đóng tài khoản để hoàn số dư chưa sử dụng (xem mục 6)
          </li>
          <li>
            <span className="font-medium text-foreground">Phí bên thứ ba:</span>{" "}
            Phí ngân hàng, phí chuyển tiền phát sinh khi nạp không thuộc trách nhiệm hoàn
          </li>
        </ul>
      </section>

      <section id="quy-trinh">
        <h2>Quy trình</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Gửi yêu cầu:</span>{" "}
            Nhắn tin qua{" "}
            <Link href="https://zalo.me/0853336668" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Zalo
            </Link>{" "}
            hoặc email{" "}
            <a href="mailto:hungle@hagency.vn" className="text-primary hover:underline">
              hungle@hagency.vn
            </a>{" "}
            với tiêu đề &quot;Hoàn tiền - [Mã giao dịch]&quot;, kèm: mã giao dịch,
            ngày giờ, số tiền, lý do và ảnh chụp màn hình (nếu có)
          </li>
          <li>
            <span className="font-medium text-foreground">Xác nhận:</span>{" "}
            Nhận email xác nhận kèm mã ticket trong 24 giờ làm việc
          </li>
          <li>
            <span className="font-medium text-foreground">Xử lý:</span>{" "}
            Kiểm tra nhật ký hệ thống, đối soát giao dịch — phản hồi kết quả trong 3 ngày làm việc
          </li>
          <li>
            <span className="font-medium text-foreground">Quyết định:</span>{" "}
            Chấp thuận → thông báo số tiền và phương thức hoàn. Từ chối → nêu rõ lý do, bạn có 7 ngày bổ sung bằng chứng
          </li>
          <li>
            <span className="font-medium text-foreground">Hoàn tiền:</span>{" "}
            Thực hiện theo phương thức đã chọn (xem mục 5)
          </li>
        </ol>
        <p className="mt-3">
          Không hài lòng với kết quả? Gửi khiếu nại lần hai kèm bằng chứng
          bổ sung — xem xét bởi quản lý, phản hồi trong 5 ngày. Quyết định lần
          hai là cuối cùng.
        </p>
      </section>

      <section id="hinh-thuc">
        <h2>Hình thức hoàn tiền</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Hoàn vào số dư:</span>{" "}
            Xử lý ngay lập tức, cộng lại vào tài khoản Operis Market. Mặc định
            cho khoản dưới 200.000 VNĐ
          </li>
          <li>
            <span className="font-medium text-foreground">Hoàn về ngân hàng:</span>{" "}
            5-7 ngày làm việc, cho giao dịch từ 200.000 VNĐ trở lên. Cần cung
            cấp: tên chủ tài khoản (trùng tên đăng ký), số tài khoản, ngân hàng.
            Phí chuyển khoản do Operis Market chịu khi lỗi hệ thống
          </li>
        </ul>
        <p className="mt-3">
          Hoàn tiền ngân hàng chỉ vào tài khoản trùng tên chủ tài khoản Operis
          Market. Nếu sau 10 ngày chưa nhận tiền, liên hệ ngay kèm mã ticket.
        </p>
      </section>

      <section id="dong-tai-khoan">
        <h2>Đóng tài khoản</h2>
        <p>Khi đóng tài khoản, số dư chưa sử dụng được xử lý như sau:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Điều kiện:</span>{" "}
            Không vi phạm điều khoản, nạp tiền gần nhất trong 6 tháng, số dư từ
            50.000 VNĐ trở lên
          </li>
          <li>
            <span className="font-medium text-foreground">Phí xử lý:</span>{" "}
            5% số dư (tối thiểu 10.000, tối đa 100.000 VNĐ)
          </li>
          <li>
            <span className="font-medium text-foreground">Thời gian:</span>{" "}
            7-10 ngày làm việc. Tài khoản tạm khóa trong thời gian xử lý
          </li>
          <li>
            <span className="font-medium text-foreground">Sau khi đóng:</span>{" "}
            Dữ liệu xóa trong 30 ngày, API key thu hồi ngay. Không thể hoàn tác
          </li>
        </ul>
        <p className="mt-3">
          Gửi yêu cầu &quot;Đóng tài khoản&quot; qua{" "}
          <Link href="https://zalo.me/0853336668" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Zalo
          </Link>{" "}
          hoặc email{" "}
          <a href="mailto:hungle@hagency.vn" className="text-primary hover:underline">
            hungle@hagency.vn
          </a>{" "}
          kèm thông tin ngân hàng nhận hoàn tiền.
        </p>
      </section>

      <section id="lien-he">
        <h2>Liên hệ</h2>
        <p>
          Yêu cầu hoàn tiền hoặc thắc mắc — liên hệ qua{" "}
          <Link href="https://zalo.me/0853336668" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Zalo (0853 336 668)
          </Link>{" "}
          hoặc email{" "}
          <a href="mailto:hungle@hagency.vn" className="text-primary hover:underline">
            hungle@hagency.vn
          </a>{" "}
          — ghi rõ mã giao dịch.
        </p>
        <p className="mt-3">
          Xác nhận trong 24 giờ, kết quả trong 3-5 ngày làm việc. Chính sách
          áp dụng cùng{" "}
          <a href="/terms" className="text-primary hover:underline">
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Chính sách bảo mật
          </a>. Mâu thuẫn giữa các tài liệu → Điều khoản dịch vụ ưu tiên.
        </p>
      </section>
    </LegalPageLayout>
  );
}
