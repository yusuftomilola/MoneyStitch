// frontend/app/(auth)/login/page.tsx
import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your MoneyStitch account to access your personalized financial dashboard, track your progress, and continue building smart money habits.",
  openGraph: {
    title: "Login to MoneyStitch",
    description:
      "Access your MoneyStitch account and continue your financial education journey.",
    url: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Login() {
  return (
    <section>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
