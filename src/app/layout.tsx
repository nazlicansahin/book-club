import type { Metadata, Viewport } from "next";
import { Space_Mono, Courier_Prime } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import { MobileInit } from "@/components/layout/mobile-init";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Quest Log — Book Club",
  description: "Read daily. Keep the streak alive.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quest Log",
  },
  icons: {
    icon: "/assets/icons/fire-medium.png",
    apple: "/assets/icons/fire-medium.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#08122b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${courierPrime.variable} h-full`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <MobileInit />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
