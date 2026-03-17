"use client";

import Image from "next/image";
import Link from "next/link";

const ZALO_URL = "https://zalo.me/0853336668";

export default function ZaloFloat() {
  return (
    <Link
      href={ZALO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Liên hệ qua Zalo"
      className="fixed bottom-10 right-6 size-10 sm:size-12 z-40 flex items-center justify-center rounded-full bg-[#0068FF] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
    >
      <Image
        src="/icons/zalo_icon.svg"
        alt="Zalo"
        width={40}
        height={40}
        className="size-10 sm:size-12"
      />
    </Link>
  );
}
