import { Suspense } from "react";
import LoginPage from "./login-page";

export default function LoginRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase animate-pulse">
            Loading...
          </p>
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
