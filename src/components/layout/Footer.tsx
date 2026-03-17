import Link from "next/link";

const footerLinks = [
  {
    title: "Sản phẩm",
    links: [
      { label: "AI Video API", href: "/market?category=video" },
      { label: "AI Image API", href: "/market?category=image" },
      { label: "AI Music API", href: "/market?category=music" },
      { label: "AI Chat API", href: "/market?category=chat" },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { label: "Tài liệu", href: "/docs" },
      { label: "Tham chiếu API", href: "/docs/api" },
      { label: "Bảng giá", href: "/pricing" },
      { label: "Cập nhật", href: "/updates" },
    ],
  },
  {
    title: "Công ty",
    links: [
      { label: "Giới thiệu", href: "https://operis.vn/about" },
      { label: "Liên hệ", href: "https://operis.vn/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Tuyển dụng", href: "/careers" },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { label: "Chính sách bảo mật", href: "/privacy" },
      { label: "Điều khoản dịch vụ", href: "/terms" },
      { label: "Chính sách hoàn tiền", href: "/refund" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="text-xl font-bold">
              Operis <span className="text-blue-400">Market</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Truy cập các model AI hàng đầu cho video, ảnh và nhạc thông qua
              một API duy nhất.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-semibold">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Operis Market. Bảo lưu mọi
            quyền.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Bảo mật
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Điều khoản
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
