import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phygital-Trace | Verify Image Authenticity",
  description: "Camera-to-Blockchain verification platform for citizen journalists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
