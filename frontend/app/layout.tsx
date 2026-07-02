import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "../components/AppShell";
import { SocketProvider } from "../lib/socket";
import { InstallPwaBanner } from "../components/InstallPwaBanner";

export const metadata: Metadata = {
  title: "SBI AcquireX",
  description: "Agentic AI customer acquisition platform for personalized banking journeys",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "SBI AcquireX",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1f63b5"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="AcquireX" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body>
        <SocketProvider>
          <AppShell>{children}</AppShell>
          <InstallPwaBanner />
        </SocketProvider>
      </body>
    </html>
  );
}
