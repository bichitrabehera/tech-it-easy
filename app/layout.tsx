import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SuperNova",
  description: "Build the future. Become the hero. Collaborate, innovate, and win big at SuperNova 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body className="min-h-full flex flex-col ">{children}</body>
    </html>
  );
}
