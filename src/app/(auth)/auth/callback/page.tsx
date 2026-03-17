"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      router.replace("/market");
    } else {
      router.replace("/login");
    }
  }, [success, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
