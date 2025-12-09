// frontend/providers/providers.tsx
import { Toaster } from "sonner";
import ReactQueryProvider from "./ReactQueryProvider";
import { AuthInitializerProvider } from "./authInitializer";
import { AuthInitializer } from "@/lib/hooks/AuthInitializer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      {/* <AuthInitializerProvider> */}
      <AuthInitializer>
        {children}
        <Toaster richColors position="top-right" />
      </AuthInitializer>
      {/* </AuthInitializerProvider> */}
    </ReactQueryProvider>
  );
}
