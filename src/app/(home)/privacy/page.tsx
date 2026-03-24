import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Operis Market",
  description: "Chính sách bảo mật của Operis Market",
};

const sections = [
  { id: "thu-thap", title: "Thông tin thu thập" },
  { id: "muc-dich", title: "Mục đích sử dụng" },
  { id: "bao-mat", title: "Bảo mật dữ liệu" },
  { id: "chia-se", title: "Chia sẻ thông tin" },
  { id: "quyen", title: "Quyền của bạn" },
  { id: "cookie", title: "Cookie" },
  { id: "lien-he", title: "Liên hệ" },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Chính sách bảo mật"
      subtitle="Cách Operis Market xử lý dữ liệu của bạn"
      updatedDate="24/03/2026"
      icon="privacy"
      sections={sections}
    >
      <section id="thu-thap">
        <h2>Thông tin thu thập</h2>
        <p>
          Khi đăng ký và sử dụng Operis Market, chúng tôi thu thập các thông
          tin sau:
        </p>
        <p className="mt-3 font-medium text-foreground">Bạn cung cấp trực tiếp:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Họ tên, email, mật khẩu khi đăng ký</li>
          <li>Thông tin hồ sơ tùy chọn: ảnh đại diện, số điện thoại, tên công ty</li>
          <li>Thông tin thanh toán: số tài khoản ngân hàng, lịch sử nạp tiền (chúng tôi không lưu trữ số thẻ hay CVV)</li>
          <li>Nội dung liên hệ hỗ trợ: email, tin nhắn, tệp đính kèm</li>
        </ul>
        <p className="mt-3 font-medium text-foreground">Thu thập tự động:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Dữ liệu API: số request, model sử dụng, thời gian gọi, mã trạng thái</li>
          <li>Địa chỉ IP, trình duyệt, hệ điều hành, thiết bị</li>
          <li>Nhật ký hoạt động: đăng nhập, trang truy cập, tạo API key, nạp tiền</li>
        </ul>
        <p className="mt-3 font-medium text-foreground">Từ bên thứ ba:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Thông tin từ Google/GitHub nếu dùng đăng nhập bên thứ ba</li>
          <li>Xác nhận giao dịch từ đối tác cổng thanh toán</li>
        </ul>
        <p className="mt-3">
          Khi bạn gọi API, dữ liệu đầu vào (prompt) được chuyển tiếp đến nhà
          cung cấp model AI để xử lý. Chúng tôi không dùng dữ liệu này để huấn
          luyện model. Mỗi nhà cung cấp có chính sách bảo mật riêng.
        </p>
      </section>

      <section id="muc-dich">
        <h2>Mục đích sử dụng</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Vận hành dịch vụ:</span>{" "}
            Xử lý request API, quản lý tài khoản, tính phí sử dụng, hiển thị thống kê
          </li>
          <li>
            <span className="font-medium text-foreground">Thanh toán:</span>{" "}
            Xử lý nạp/hoàn tiền, xuất hóa đơn, đối soát giao dịch
          </li>
          <li>
            <span className="font-medium text-foreground">Cải thiện dịch vụ:</span>{" "}
            Phân tích xu hướng sử dụng, tối ưu hiệu suất, phát triển tính năng mới
          </li>
          <li>
            <span className="font-medium text-foreground">Bảo mật:</span>{" "}
            Phát hiện gian lận, lạm dụng API, truy cập trái phép, tấn công DDoS
          </li>
          <li>
            <span className="font-medium text-foreground">Hỗ trợ:</span>{" "}
            Phản hồi yêu cầu kỹ thuật, xử lý khiếu nại
          </li>
          <li>
            <span className="font-medium text-foreground">Thông báo:</span>{" "}
            Cập nhật dịch vụ, thay đổi chính sách, bảo trì, cảnh báo bảo mật
          </li>
          <li>
            <span className="font-medium text-foreground">Pháp luật:</span>{" "}
            Tuân thủ quy định về thương mại điện tử, kế toán, thuế
          </li>
        </ul>
      </section>

      <section id="bao-mat">
        <h2>Bảo mật dữ liệu</h2>
        <p>Các biện pháp bảo mật chúng tôi áp dụng:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Mã hóa truyền tải:</span>{" "}
            TLS 1.2+ (HTTPS) cho mọi kết nối
          </li>
          <li>
            <span className="font-medium text-foreground">Mã hóa lưu trữ:</span>{" "}
            AES-256 cho dữ liệu nhạy cảm, bcrypt cho mật khẩu, hash một chiều cho API key
          </li>
          <li>
            <span className="font-medium text-foreground">Kiểm soát truy cập:</span>{" "}
            Phân quyền tối thiểu, xác thực đa yếu tố (MFA) cho hệ thống nội bộ
          </li>
          <li>
            <span className="font-medium text-foreground">Giám sát:</span>{" "}
            Hệ thống phát hiện xâm nhập 24/7, cảnh báo tự động khi có bất thường
          </li>
          <li>
            <span className="font-medium text-foreground">Sao lưu:</span>{" "}
            Sao lưu tự động hàng ngày tại vị trí địa lý riêng biệt
          </li>
        </ul>
        <p className="mt-3">
          Thời hạn lưu trữ: thông tin tài khoản giữ đến 30 ngày sau khi xóa;
          lịch sử giao dịch 5 năm (theo quy định kế toán); nhật ký API 90 ngày;
          nhật ký bảo mật 1 năm. Phát hiện lỗ hổng bảo mật xin báo qua{" "}
          <Link href="https://zalo.me/0853336668" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Zalo
          </Link>.
        </p>
      </section>

      <section id="chia-se">
        <h2>Chia sẻ thông tin</h2>
        <p>
          Chúng tôi không bán hoặc cho thuê thông tin cá nhân. Chỉ chia sẻ
          trong các trường hợp sau:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Cổng thanh toán:</span>{" "}
            SePay và ngân hàng liên kết — chỉ thông tin cần thiết để xử lý giao dịch
          </li>
          <li>
            <span className="font-medium text-foreground">Nhà cung cấp AI:</span>{" "}
            Dữ liệu đầu vào API được chuyển tiếp đến model để xử lý (không chia sẻ thông tin tài khoản)
          </li>
          <li>
            <span className="font-medium text-foreground">Hạ tầng đám mây:</span>{" "}
            Lưu trữ trên máy chủ có chứng chỉ bảo mật quốc tế
          </li>
          <li>
            <span className="font-medium text-foreground">Yêu cầu pháp lý:</span>{" "}
            Khi được yêu cầu bởi tòa án hoặc cơ quan có thẩm quyền
          </li>
          <li>
            <span className="font-medium text-foreground">Bảo vệ quyền lợi:</span>{" "}
            Khi cần bảo vệ quyền, tài sản hoặc an toàn của Operis Market và người dùng
          </li>
          <li>
            <span className="font-medium text-foreground">Chuyển giao:</span>{" "}
            Trong trường hợp sáp nhập/mua lại — bạn sẽ được thông báo trước
          </li>
        </ul>
      </section>

      <section id="quyen">
        <h2>Quyền của bạn</h2>
        <p>
          Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, bạn có quyền:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Truy cập:</span>{" "}
            Xem và tải xuống thông tin cá nhân (JSON/CSV) qua cài đặt tài khoản
          </li>
          <li>
            <span className="font-medium text-foreground">Chỉnh sửa:</span>{" "}
            Cập nhật thông tin không chính xác trực tiếp trên trang hồ sơ
          </li>
          <li>
            <span className="font-medium text-foreground">Xóa:</span>{" "}
            Yêu cầu xóa tài khoản và dữ liệu liên quan (xử lý trong 30 ngày)
          </li>
          <li>
            <span className="font-medium text-foreground">Hạn chế xử lý:</span>{" "}
            Tạm dừng xử lý dữ liệu khi chờ giải quyết khiếu nại
          </li>
          <li>
            <span className="font-medium text-foreground">Rút đồng ý:</span>{" "}
            Rút lại sự đồng ý bất kỳ lúc nào (có thể ảnh hưởng đến việc sử dụng dịch vụ)
          </li>
          <li>
            <span className="font-medium text-foreground">Khiếu nại:</span>{" "}
            Gửi khiếu nại đến cơ quan bảo vệ dữ liệu có thẩm quyền
          </li>
        </ul>
        <p className="mt-3">
          Liên hệ qua{" "}
          <Link href="https://zalo.me/0853336668" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Zalo
          </Link>{" "}
          hoặc email{" "}
          <a href="mailto:hungle@hagency.vn" className="text-primary hover:underline">
            hungle@hagency.vn
          </a>{" "}
          để thực hiện các quyền trên. Phản hồi trong 15 ngày làm việc.
        </p>
      </section>

      <section id="cookie">
        <h2>Cookie</h2>
        <p>Chúng tôi sử dụng cookie và công nghệ tương tự:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Thiết yếu:</span>{" "}
            Duy trì phiên đăng nhập, bảo mật CSRF — không thể tắt
          </li>
          <li>
            <span className="font-medium text-foreground">Chức năng:</span>{" "}
            Ghi nhớ tùy chọn giao diện (sáng/tối), ngôn ngữ, bố cục dashboard
          </li>
          <li>
            <span className="font-medium text-foreground">Phân tích:</span>{" "}
            Dữ liệu ẩn danh về cách sử dụng website để cải thiện trải nghiệm
          </li>
        </ul>
        <p className="mt-3">
          Chúng tôi không dùng cookie quảng cáo hay theo dõi bên thứ ba. Bạn
          có thể quản lý cookie qua cài đặt trình duyệt.
        </p>
      </section>

      <section id="lien-he">
        <h2>Liên hệ</h2>
        <p>Liên hệ về chính sách bảo mật:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            Zalo:{" "}
            <Link href="https://zalo.me/0853336668" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              0853 336 668
            </Link>
          </li>
          <li>
            Email:{" "}
            <a href="mailto:hungle@hagency.vn" className="text-primary hover:underline">
              hungle@hagency.vn
            </a>
          </li>
        </ul>
        <p className="mt-3">
          Phản hồi trong 15 ngày làm việc. Chính sách có thể cập nhật — thay
          đổi quan trọng sẽ thông báo 30 ngày trước khi có hiệu lực.
          Dịch vụ không dành cho người dưới 16 tuổi.
        </p>
      </section>
    </LegalPageLayout>
  );
}
