import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FRC Design Pipeline",
  description: "Kanban-style engineering workflow tracker for FRC robotics team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0D0D0D] text-white">
        {children}
      </body>
    </html>
  );
}
