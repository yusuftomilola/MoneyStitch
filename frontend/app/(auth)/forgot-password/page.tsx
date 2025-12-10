// frontend/app/(auth)/forgot-password/page.tsx
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your MoneyStitch account password. Enter your email address and we'll send you instructions to regain access to your account.",
  openGraph: {
    title: "Reset Your Password - MoneyStitch",
    description:
      "Forgot your password? No worries. Reset your MoneyStitch account password securely.",
    url: "/forgot-password",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
