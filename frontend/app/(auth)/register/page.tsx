// frontend/app/(auth)/register/page.tsx
import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join MoneyStitch for free and start your journey to financial freedom. Get access to budgeting tools, financial guides, and personalized resources to build better money habits.",
  keywords: [
    "sign up",
    "create account",
    "free financial education",
    "money management tools",
    "personal finance app",
  ],
  openGraph: {
    title: "Create Your MoneyStitch Account",
    description:
      "Join thousands of users building better money habits with MoneyStitch. Sign up for free today.",
    url: "/register",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Register() {
  return (
    <section>
      <RegisterForm />
    </section>
  );
}
