import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ | Operis Market",
  description: "Điều khoản dịch vụ của Operis Market",
};

const sections = [
  { id: "gioi-thieu", title: "Giới thiệu" },
  { id: "dich-vu", title: "Mô tả dịch vụ" },
  { id: "tai-khoan", title: "Tài khoản" },
  { id: "thanh-toan", title: "Thanh toán" },
  { id: "quy-tac", title: "Quy tắc sử dụng" },
  { id: "trach-nhiem", title: "Giới hạn trách nhiệm" },
  { id: "so-huu", title: "Sở hữu trí tuệ" },
  { id: "cham-dut", title: "Chấm dứt dịch vụ" },
  { id: "thay-doi", title: "Thay đổi điều khoản" },
  { id: "lien-he", title: "Liên hệ" },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Điều khoản dịch vụ"
      subtitle="Các điều khoản khi sử dụng Operis Market"
      updatedDate="24/03/2026"
      icon="terms"
      sections={sections}
    >
      <section id="gioi-thieu">
        <h2>Giới thiệu</h2>
        <p>
          Bằng việc đăng ký tài khoản hoặc sử dụng bất kỳ dịch vụ nào của
          Operis Market, bạn đồng ý tuân thủ toàn bộ điều khoản này. Đây là
          thỏa thuận ràng buộc giữa bạn (cá nhân hoặc tổ chức) và Operis
          Market. Nếu đại diện tổ chức, bạn xác nhận có thẩm quyền ràng buộc
          tổ chức đó.
        </p>
        <p className="mt-3">
          Bạn phải từ 16 tuổi trở lên để sử dụng dịch vụ. Nếu dưới 18 tuổi,
          cần có sự đồng ý của phụ huynh. Nếu không đồng ý, vui lòng ngừng
          sử dụng ngay.
        </p>
      </section>

      <section id="dich-vu">
        <h2>Mô tả dịch vụ</h2>
        <p>
          Operis Market là nền tảng marketplace kết nối người dùng với các model
          AI (ảnh, video, nhạc, chat) qua API gateway thống nhất:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">API Gateway:</span>{" "}
            Một điểm truy cập duy nhất cho hàng chục model AI từ nhiều nhà cung cấp
          </li>
          <li>
            <span className="font-medium text-foreground">Dashboard:</span>{" "}
            Quản lý tài khoản, API key, thống kê sử dụng, nạp tiền
          </li>
          <li>
            <span className="font-medium text-foreground">Pay-per-use:</span>{" "}
            Nạp trước, thanh toán theo lượt sử dụng dựa trên bảng giá công khai
          </li>
        </ul>
        <p className="mt-3">
          Operis Market không phải nhà phát triển model AI — chúng tôi không
          chịu trách nhiệm về chất lượng đầu ra. Chúng tôi có thể thêm, sửa
          hoặc ngừng model bất kỳ lúc nào. Thay đổi giá sẽ thông báo trước
          ít nhất 7 ngày.
        </p>
      </section>

      <section id="tai-khoan">
        <h2>Tài khoản</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Thông tin chính xác:</span>{" "}
            Cung cấp thông tin đăng ký đúng sự thật. Dùng thông tin giả có thể bị khóa tài khoản
          </li>
          <li>
            <span className="font-medium text-foreground">Bảo mật:</span>{" "}
            Bạn chịu trách nhiệm bảo mật mật khẩu và API key. Không chia sẻ, không đăng công khai
          </li>
          <li>
            <span className="font-medium text-foreground">Trách nhiệm:</span>{" "}
            Mọi hoạt động và chi phí dưới tài khoản là trách nhiệm của bạn
          </li>
          <li>
            <span className="font-medium text-foreground">Một tài khoản/người:</span>{" "}
            Không tạo nhiều tài khoản để lạm dụng ưu đãi
          </li>
          <li>
            <span className="font-medium text-foreground">Báo sự cố:</span>{" "}
            Thông báo ngay qua{" "}
            <Link href="https://zalo.me/0853336668" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Zalo
            </Link>{" "}
            nếu phát hiện truy cập trái phép hoặc API key bị lộ
          </li>
        </ul>
      </section>

      <section id="thanh-toan">
        <h2>Thanh toán</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Nạp tiền:</span>{" "}
            Qua chuyển khoản ngân hàng, VietQR và các phương thức điện tử khác
          </li>
          <li>
            <span className="font-medium text-foreground">Tính phí:</span>{" "}
            Trừ tự động sau mỗi request thành công, theo bảng giá từng model
          </li>
          <li>
            <span className="font-medium text-foreground">Giá:</span>{" "}
            Niêm yết công khai, thay đổi thông báo trước 7 ngày
          </li>
          <li>
            <span className="font-medium text-foreground">Số dư:</span>{" "}
            Không hết hạn, không chuyển nhượng, hiển thị bằng VNĐ
          </li>
          <li>
            <span className="font-medium text-foreground">Không tính phí:</span>{" "}
            Request lỗi hệ thống (5xx) hoặc lỗi đầu vào (4xx) không bị trừ tiền
          </li>
          <li>
            <span className="font-medium text-foreground">Hoàn tiền:</span>{" "}
            Theo{" "}
            <a href="/refund" className="text-primary hover:underline">
              Chính sách hoàn tiền
            </a>
          </li>
        </ul>
      </section>

      <section id="quy-tac">
        <h2>Quy tắc sử dụng</h2>
        <p>Nghiêm cấm sử dụng dịch vụ để:</p>
        <p className="mt-3 font-medium text-foreground">Nội dung:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Tạo nội dung vi phạm pháp luật Việt Nam, kích động bạo lực, chia rẽ dân tộc</li>
          <li>Tạo nội dung khiêu dâm, CSAM, hoặc kích động thù hận</li>
          <li>Tạo deepfake giả mạo danh tính người thật mà không có đồng ý</li>
          <li>Lừa đảo, phishing hoặc xâm phạm sở hữu trí tuệ</li>
        </ul>
        <p className="mt-3 font-medium text-foreground">Kỹ thuật:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Tấn công hoặc khai thác lỗ hổng hệ thống</li>
          <li>Vượt rate limit hoặc bypass biện pháp bảo mật</li>
          <li>Reverse engineering hoặc scraping ngoài API</li>
        </ul>
        <p className="mt-3 font-medium text-foreground">Thương mại:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Chia sẻ/bán API key mà không được phép</li>
          <li>Resell API mà không có thỏa thuận đối tác</li>
          <li>Tạo nhiều tài khoản lạm dụng khuyến mãi</li>
        </ul>
        <p className="mt-3">
          Vi phạm có thể dẫn đến tạm khóa hoặc chấm dứt tài khoản vĩnh viễn
          mà không hoàn tiền.
        </p>
      </section>

      <section id="trach-nhiem">
        <h2>Giới hạn trách nhiệm</h2>
        <p>
          Dịch vụ cung cấp trên cơ sở &quot;nguyên trạng&quot; (as-is):
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Không đảm bảo hoạt động liên tục 100% — có thể gián đoạn do bảo trì hoặc sự cố</li>
          <li>Kết quả AI mang tính tham khảo, chất lượng có thể khác nhau giữa các lần gọi</li>
          <li>Nhà cung cấp model có thể thay đổi hoặc ngừng model bất kỳ lúc nào</li>
        </ul>
        <p className="mt-3">
          Trách nhiệm bồi thường tối đa không vượt quá số tiền bạn đã nạp trong
          30 ngày gần nhất. Không chịu trách nhiệm về: mất doanh thu do gián
          đoạn, hậu quả từ việc dùng kết quả AI cho mục đích thương mại, thiệt
          hại do API key bị lộ vì lỗi bảo quản của bạn.
        </p>
      </section>

      <section id="so-huu">
        <h2>Sở hữu trí tuệ</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Output của bạn:</span>{" "}
            Kết quả API thuộc về bạn, tuân theo điều khoản từng model AI (một số
            model có giới hạn quyền thương mại)
          </li>
          <li>
            <span className="font-medium text-foreground">Input của bạn:</span>{" "}
            Bạn giữ toàn bộ quyền sở hữu đầu vào, chúng tôi không dùng cho mục đích khác
          </li>
          <li>
            <span className="font-medium text-foreground">Operis Market:</span>{" "}
            Thương hiệu, giao diện, mã nguồn và API design thuộc sở hữu của chúng tôi
          </li>
        </ul>
        <p className="mt-3">
          Bạn chịu trách nhiệm về tính hợp pháp của đầu vào gửi qua API và
          cam kết không vi phạm quyền sở hữu trí tuệ của bên thứ ba.
        </p>
      </section>

      <section id="cham-dut">
        <h2>Chấm dứt dịch vụ</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Tự nguyện:</span>{" "}
            Xóa tài khoản bất kỳ lúc nào, số dư xử lý theo chính sách hoàn tiền
          </li>
          <li>
            <span className="font-medium text-foreground">Tạm khóa:</span>{" "}
            Khi phát hiện hoạt động đáng ngờ — số dư giữ nguyên, không dùng được API
          </li>
          <li>
            <span className="font-medium text-foreground">Vi phạm nghiêm trọng:</span>{" "}
            Chấm dứt ngay lập tức, không hoàn trả số dư
          </li>
          <li>
            <span className="font-medium text-foreground">Không hoạt động:</span>{" "}
            Tài khoản không dùng 24 tháng có thể bị vô hiệu hóa (cảnh báo trước 30 ngày, số dư vẫn bảo toàn)
          </li>
        </ul>
        <p className="mt-3">
          Sau chấm dứt, mọi API key bị thu hồi ngay lập tức. Điều khoản về
          trách nhiệm và sở hữu trí tuệ vẫn có hiệu lực.
        </p>
      </section>

      <section id="thay-doi">
        <h2>Thay đổi điều khoản</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Thay đổi quan trọng thông báo qua email ít nhất 30 ngày trước khi có hiệu lực</li>
          <li>Thay đổi nhỏ (chỉnh sửa ngôn từ) cập nhật ngay trên trang</li>
          <li>Không đồng ý? Ngừng sử dụng và yêu cầu hoàn trả số dư trước khi điều khoản mới có hiệu lực</li>
        </ul>
        <p className="mt-3">
          Tiếp tục sử dụng sau ngày có hiệu lực đồng nghĩa chấp nhận thay đổi.
          Điều khoản điều chỉnh bởi pháp luật Việt Nam. Tranh chấp giải quyết
          qua thương lượng, sau đó là trọng tài hoặc tòa án có thẩm quyền.
        </p>
      </section>

      <section id="lien-he">
        <h2>Liên hệ</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Zalo:{" "}
            <Link href="https://zalo.me/0853336668" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              0853 336 668
            </Link>{" "}
            — phản hồi nhanh nhất
          </li>
          <li>
            Email:{" "}
            <a href="mailto:hungle@hagency.vn" className="text-primary hover:underline">
              hungle@hagency.vn
            </a>{" "}
            — phản hồi trong 2 ngày làm việc
          </li>
        </ul>
        <p className="mt-3">
          Tài liệu liên quan:{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Chính sách bảo mật
          </a>{" "}
          và{" "}
          <a href="/refund" className="text-primary hover:underline">
            Chính sách hoàn tiền
          </a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
