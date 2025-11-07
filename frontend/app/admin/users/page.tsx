// app/admin/users/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#2ECC71] border-t-transparent"></div>
        <p className="mt-4 text-[#1A1A40] font-medium">Redirecting...</p>
      </div>
    </div>
  );
}
