import { Toaster } from "sonner";
import ReactQueryProvider from "./ReactQueryProvider";
import { AuthInitializerProvider } from "./authInitializer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthInitializerProvider>
        {children}
        <Toaster richColors position="top-right" />
      </AuthInitializerProvider>
    </ReactQueryProvider>
  );
}
