import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
