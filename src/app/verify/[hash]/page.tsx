// frontend/src/app/verify/[hash]/page.tsx
"use client";

import { useParams } from "next/navigation";

export default function VerificationDetail() {
  const { hash } = useParams();

  // Mock data for display
  const cert = {
    hash: hash,
    status: "CONFIRMED",
    issuedAt: "2026-03-09T08:12:44Z",
    journalist: "Sarah Vance",
    journalistHandle: "@sarah_v",
    location: "Berlin, Germany (52.5200° N, 13.4050° E)",
    imageHash: "7f83b1e2...90a1",
    sensorHash: "a2d1f930...4e2b",
    ipfsCid: "QmXoyp...7V13",
    blockchain: "Base L2 Sepolia",
    txHash: "0x8f2c...4d1e"
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-[10px] font-black text-green-500 uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Authenticity Confirmed
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Proof Details</h1>
          <p className="text-white/40 font-mono text-sm break-all">{hash}</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-lg text-sm font-bold transition-all">Download technical report</button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="glass-card overflow-hidden">
            <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Visual Asset</span>
              <span className="text-[10px] font-mono text-white/20">SHA-256: {cert.imageHash}</span>
            </div>
            <div className="h-[400px] bg-black/40 flex items-center justify-center text-white/10 font-bold uppercase tracking-widest text-xs">
               [ Secure Image Asset Preview ]
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-white font-bold mb-6 text-lg">Sensor Snapshot</h3>
            <div className="space-y-4">
              {[
                { label: "Ambient Pressure", value: "1013.25 hPa" },
                { label: "Device Integrity", value: "Verified / Locked" },
                { label: "Temporal Drift", value: "+0.002s" },
                { label: "Network Anchor", value: "base-l2-mainnet-v2" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                  <span className="text-white/40 text-sm">{item.label}</span>
                  <span className="text-white font-mono text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Data */}
        <div className="flex flex-col gap-8">
          <div className="glass-card p-8">
            <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Chain of Custody</h4>
            <div className="space-y-6">
               <div>
                  <span className="block text-xs text-white/20 mb-1">Issued By</span>
                  <span className="block text-white font-bold">{cert.journalist}</span>
                  <span className="block text-indigo-500 font-mono text-xs">{cert.journalistHandle}</span>
               </div>
               <div>
                  <span className="block text-xs text-white/20 mb-1">Origin Location</span>
                  <span className="block text-white text-sm">{cert.location}</span>
               </div>
               <div>
                  <span className="block text-xs text-white/20 mb-1">Timestamp</span>
                  <span className="block text-white text-sm font-mono">{cert.issuedAt}</span>
               </div>
            </div>
          </div>

          <div className="glass-card p-8 bg-indigo-600/5 border-indigo-500/20">
            <h4 className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6">Blockchain Registry</h4>
            <div className="space-y-4">
               <div>
                  <span className="block text-[10px] text-white/20 mb-1 uppercase">Network</span>
                  <span className="block text-white text-xs font-bold">{cert.blockchain}</span>
               </div>
               <div className="overflow-hidden">
                  <span className="block text-[10px] text-white/20 mb-1 uppercase">TX Hash</span>
                  <span className="block text-indigo-300 text-[10px] font-mono truncate">{cert.txHash}</span>
               </div>
               <div className="overflow-hidden">
                  <span className="block text-[10px] text-white/20 mb-1 uppercase">IPFS Pointer</span>
                  <span className="block text-indigo-300 text-[10px] font-mono truncate">{cert.ipfsCid}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
