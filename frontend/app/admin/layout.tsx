import { AuthGuard } from "@/components/auth/authGuard";
import { Navbar } from "@/components/layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard requireAuth={true} requiredRole="admin">
      <Navbar />
      <div className="pt-16">{children}</div>
    </AuthGuard>
  );
}
