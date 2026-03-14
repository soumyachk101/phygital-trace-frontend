"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCerts() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        // Warning: This endpoint requires auth in production. 
        // For now we fetch from a potential public list or specific user for demo.
        const response = await fetch(`${apiUrl}/v1/certificates/me`, {
          // Add headers/auth here when implemented
        });
        const result = await response.json();
        if (result.success) {
          setCerts(result.data.map((c: any) => ({
            ...c,
            hash: c.combinedHash.substring(0, 10) + "...",
            title: `Capture ${c.id.substring(0, 5)}`,
            date: new Date(c.issuedAt).toLocaleDateString(),
            location: c.city || "Unknown Location",
            status: c.status === "CONFIRMED" ? "ON-CHAIN" : c.status,
            thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=100&auto=format&fit=crop"
          })));
        }
      } catch (error) {
        console.error("Failed to fetch certs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-[10px] font-black tracking-widest text-cyan-400 mb-6 uppercase">
            Journalist ID: #8291-ALPHA
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Verified <span className="premium-gradient">Artifacts</span></h1>
          <p className="text-white/40 font-medium text-lg">Managing immutable evidence on the Base L2 Network.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full lg:w-auto">
          {[
            { label: "Total Proofs", value: "142", color: "text-white" },
            { label: "Trust Score", value: "98.4", color: "text-cyan-400" },
            { label: "Secured L2", value: "100%", color: "text-cyan-400" },
          ].map((stat, i) => (
            <div key={i} className="glass-card px-8 py-6 relative overflow-hidden group">
               <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-cyan-500/5 blur-2xl rounded-full group-hover:bg-cyan-500/10 transition-all"></div>
               <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2 block">{stat.label}</span>
               <span className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Filter by location or hash..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/30 font-medium"
          />
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all border border-white/5 tracking-widest uppercase">Export CSV</button>
          <button className="btn-primary px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase shadow-cyan-500/10">Capture Proof</button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-white/5 shadow-2xl">
        <div className="grid grid-cols-12 bg-white/[0.03] py-5 px-10 border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
          <div className="col-span-6 md:col-span-8 tracking-[0.4em]">Evidence Artifact / Physical Fingerprint</div>
          <div className="col-span-3 md:col-span-2">Origin Date</div>
          <div className="col-span-3 md:col-span-2 text-right">Attestation</div>
        </div>
        <div className="divide-y divide-white/5">
          {certs.map((cert, i) => (
            <div key={i} className="grid grid-cols-12 py-8 px-10 items-center hover:bg-white/[0.015] transition-all cursor-pointer group">
              <div className="col-span-6 md:col-span-8 flex items-center gap-8">
                <div className="w-16 h-16 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/5">
                  <img src={cert.thumbnail} alt={cert.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">{cert.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5 font-bold">
                    <span className="text-white/20 text-[10px] font-mono tracking-tighter">{cert.hash}</span>
                    <span className="text-white/40 text-[10px] uppercase tracking-widest">{cert.location}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-3 md:col-span-2 text-white/40 text-sm font-bold tracking-tight">{cert.date}</div>
              <div className="col-span-3 md:col-span-2 text-right">
                <span className={`inline-block px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] ${
                  cert.status === "ON-CHAIN" 
                    ? "bg-cyan-500/5 text-cyan-400 border border-cyan-500/20 glow-text" 
                    : "bg-orange-500/5 text-orange-400 border border-orange-500/20"
                }`}>
                  {cert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <button className="text-white/20 hover:text-white/50 text-xs font-black uppercase tracking-[0.4em] transition-colors">
          Initialize Multi-Chain Sync Engine
        </button>
      </div>
    </div>
  );
}
