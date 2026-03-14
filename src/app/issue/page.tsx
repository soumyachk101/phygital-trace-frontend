// frontend/src/app/issue/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IssueCertificate() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock processing for now
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-40 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-500 text-4xl mb-8 animate-bounce">✓</div>
        <h1 className="text-4xl font-black text-white mb-4">Certificate Issued</h1>
        <p className="text-white/40 mb-12">Your physical proof has been hashed and secured on the blockchain registry.</p>
        <button onClick={() => router.push("/dashboard")} className="btn-primary w-full py-4 font-bold">Go to My Registry</button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4">New <span className="premium-gradient">Proof</span> Capture</h1>
        <p className="text-white/40">Upload image and sensor metadata to generate an immutable physical-digital link.</p>
      </div>

      <div className="glass-card p-10 md:p-16">
        <form onSubmit={handleIssue} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-bold text-white/80">Physical Asset Image</label>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-indigo-500/40 hover:bg-white/5 transition-all cursor-pointer group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📸</div>
              <p className="text-white/30 text-sm font-medium">Drag and drop or click to upload</p>
              <p className="text-white/10 text-xs mt-2 uppercase font-bold tracking-widest">JPG, PNG, TIFF UP TO 20MB</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Location Lat</label>
               <input type="text" placeholder="e.g. 52.5200" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all" />
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Location Lng</label>
               <input type="text" placeholder="e.g. 13.4050" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Sensor Metadata Signature</label>
            <textarea placeholder="Paste JSON or raw sensor hex data..." rows={4} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-mono text-xs" />
          </div>

          <button disabled={loading} type="submit" className="btn-primary py-5 text-lg font-bold flex items-center justify-center gap-3">
             {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating SHA-256 Proof...
                </>
             ) : "Publish to Base L2"}
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-white/10 text-[10px] uppercase font-bold tracking-[0.2em] px-10">
        By clicking publish you agree that the data provided is accurate and representative of physical reality.
      </p>
    </div>
  );
}
