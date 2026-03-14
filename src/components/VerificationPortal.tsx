"use client";

import { useState } from "react";

export default function VerificationPortal() {
  const [hash, setHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/v1/verify/hash/${hash}`);
      const resultData = await response.json();
      
      if (resultData.success) {
        setResult({
          ...resultData.data,
          // Map backend fields to frontend expected fields if necessary
          status: resultData.data.status === "CONFIRMED" ? "VERIFIED" : resultData.data.status,
          imageUrl: resultData.data.ipfsCid ? `https://gateway.pinata.cloud/ipfs/${resultData.data.ipfsCid}` : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
          sensorMatch: {
            accelerometer: resultData.data.hasAccelerometer ? 100 : 0,
            gyroscope: resultData.data.hasGyroscope ? 100 : 0,
            gps: resultData.data.hasGps ? 100 : 0
          }
        });
      } else {
        alert(resultData.error?.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Network error. Is the backend running?");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-12">
      {/* Input Section */}
      <div className="glass-card p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full"></div>
        <div className="relative z-10 text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tighter mb-4">Verification Gateway</h2>
          <p className="text-white/40 font-medium">Input a Proof CID or upload an artifact to begin cross-chain attestation.</p>
        </div>
        
        <form onSubmit={handleVerify} className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Enter Proof Hash (0x...) or Content ID (CID)"
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isVerifying || !hash}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-white/10 disabled:text-white/20 text-black px-10 py-5 sm:py-0 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-cyan-500/20 shrink-0"
            >
              {isVerifying ? "Scanning..." : "Sync Proof"}
            </button>
          </div>
          
          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-white/5"></div>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">or batch upload</span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          
          <div className="border-2 border-dashed border-white/5 hover:border-cyan-500/20 rounded-3xl p-10 transition-all cursor-pointer group/upload bg-white/[0.01]">
            <div className="flex flex-col items-center gap-4 text-white/20 group-hover/upload:text-cyan-400/40 transition-colors">
              <span className="text-3xl">📥</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Drop RAW Artifact Here</span>
            </div>
          </div>
        </form>
      </div>

      {/* Result Section (Conditional) */}
      {result && (
        <div className="glass-card p-1 pb-16 overflow-hidden animate-fade-in">
          <div className="relative aspect-video w-full overflow-hidden">
             <img 
               src={result.imageUrl} 
               alt="Verified Proof"
               className="w-full h-full object-cover grayscale-[0.2]"
             />
             <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-full">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-black text-cyan-400 uppercase tracking-widest glow-text">Significantly Verified</span>
             </div>
          </div>

          <div className="px-8 md:px-12 pt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Capture Attestation</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Timestamp</span>
                    <span className="text-white font-mono">{result.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Coordinate</span>
                    <span className="text-white font-mono">{result.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Hardware</span>
                    <span className="text-white font-mono">{result.device}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Network Consensus</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Blockchain</span>
                    <span className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">Base Mainnet L2</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Block No.</span>
                    <span className="text-white font-mono">{result.block}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Transaction</span>
                    <a href="#" className="text-cyan-400 font-mono hover:underline">{result.txHash}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <div>
                  <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Sensor Integrity Bundle</h3>
                  <div className="space-y-6">
                    {Object.entries(result.sensorMatch).map(([key, value]: [string, any]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-white/40">{key} Accuracy</span>
                          <span className="text-cyan-400">{value}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="pt-4 space-y-4">
                  <button className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-white/5">
                    Generate Proof PDF
                  </button>
                  <button className="w-full bg-transparent text-white/40 hover:text-white py-2 font-bold text-xs uppercase tracking-widest transition-colors">
                    View Raw Metadata JSON
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
