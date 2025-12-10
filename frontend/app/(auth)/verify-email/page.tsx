// frontend/app/(auth)/verify-email/page.tsx
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Verify your email address to complete your MoneyStitch account setup and unlock all features.",
  openGraph: {
    title: "Verify Your Email - MoneyStitch",
    description:
      "Complete your MoneyStitch registration by verifying your email address.",
    url: "/verify-email",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
