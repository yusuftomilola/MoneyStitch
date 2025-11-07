import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function Login() {
  return (
    <section>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
