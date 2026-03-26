import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/lib/toast";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "IdeaHub - 连接创意与实现",
  description:
    "连接有想法但不会做的人，和会做但缺方向的人。让每一个好点子都有机会变成现实。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="bg-gray-50 min-h-screen font-sans antialiased">
        <SessionProviderWrapper>
          <ToastProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ToastProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
