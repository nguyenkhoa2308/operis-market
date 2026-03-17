import type { Metadata } from "next";
import { Grandstander } from "next/font/google";
import ThemeProvider from "@/providers/ThemeProvider";
import QueryProvider from "@/lib/query-provider";
import ScrollToTopOnNavigate from "@/components/shared/ScrollToTopOnNavigate";
import { Toaster } from "sonner";

import "./globals.css";

const grandstander = Grandstander({
  variable: "--font-grandstander",
  subsets: ["latin", "vietnamese"],
});

const siteUrl = "https://operis.market";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Operis Market — AI Model Marketplace",
    template: "%s | Operis Market",
  },
  description:
    "Marketplace API cho các model AI tạo video, hình ảnh, nhạc và chat. Truy cập hơn 10 model hàng đầu qua một API duy nhất.",
  icons: { icon: "/images/logo.png" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "Operis Market",
    title: "Operis Market — AI Model Marketplace",
    description:
      "Marketplace API cho các model AI tạo video, hình ảnh, nhạc và chat.",
    images: [{ url: "/images/logo.png", width: 512, height: 512, alt: "Operis Market" }],
  },
  twitter: {
    card: "summary",
    title: "Operis Market — AI Model Marketplace",
    description:
      "Marketplace API cho các model AI tạo video, hình ảnh, nhạc và chat.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={grandstander.variable}>
      <body className="antialiased">
        <ThemeProvider>
          <QueryProvider>
            <ScrollToTopOnNavigate />
            <Toaster richColors position="top-right" />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
