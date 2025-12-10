// frontend/app/(auth)/reset-password/page.tsx
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Create a new password for your MoneyStitch account. Choose a strong, secure password to protect your financial data.",
  openGraph: {
    title: "Reset Your Password - MoneyStitch",
    description: "Create a new secure password for your MoneyStitch account.",
    url: "/reset-password",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
