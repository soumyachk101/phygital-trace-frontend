// frontend/src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phygital-Trace | Immutably Verify the Physical World",
  description: "Secure, tamper-proof certification for high-trust physical reality using SHA-256 and Base L2.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-white antialiased">
        <nav className="fixed top-0 left-0 right-0 z-[5000] h-20 border-b border-white/5 bg-black/80 backdrop-blur-xl">
          <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-black shadow-lg shadow-cyan-500/20">
                P
              </div>
              <span className="text-xl font-black tracking-tighter hidden sm:block">Phygital<span className="text-cyan-400">Trace</span></span>
            </a>
            
            <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              <a href="/verify" className="hover:text-cyan-400 transition-all">Verify</a>
              <a href="#how-it-works" className="hover:text-cyan-400 transition-all">Protocol</a>
              <a href="#features" className="hover:text-cyan-400 transition-all">Network</a>
              <a href="/dashboard" className="hover:text-cyan-400 transition-all">Dashboard</a>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <a href="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Log In</a>
              <a href="/register" className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-cyan-500/20 active:scale-95">
                Access Node
              </a>
            </div>
          </div>
        </nav>
        <main className="relative pt-20">
          {children}
        </main>
        <footer className="border-t border-white/5 py-12 bg-black/80">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-white/40 text-sm">
              © 2026 Phygital-Trace. All rights reserved.
            </div>
            <div className="flex gap-6 text-white/40 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
