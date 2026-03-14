import VerificationPortal from "@/components/VerificationPortal";

export default function VerifyLookup() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-[10px] font-black tracking-widest text-cyan-400 mb-6 uppercase">
          Network Protocol v1.02
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">Verification <span className="premium-gradient">Engine</span></h1>
        <p className="text-white/40 max-w-xl mx-auto font-medium">Cross-reference digital artifacts with on-chain physical signatures to instantiate trust.</p>
      </div>

      <VerificationPortal />

      <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl border-t border-white/5 pt-20">
         <div className="glass-card p-10 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full transition-all group-hover:bg-cyan-500/10"></div>
            <h4 className="text-white font-black mb-4 text-xl tracking-tight">Recursive Proofing</h4>
            <p className="text-white/30 text-sm leading-relaxed font-medium">By scanning a hash, the engine recursively traces the certificate back to the physical Secure Enclave that generated the original SIG-BUNDLE.</p>
         </div>
         <div className="glass-card p-10 relative overflow-hidden group">
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full transition-all group-hover:bg-cyan-500/10"></div>
            <h4 className="text-white font-black mb-4 text-xl tracking-tight">Physical Anchoring</h4>
            <p className="text-white/30 text-sm leading-relaxed font-medium">Our protocol ensures the digital-physical link remains unbroken by hashing sensor deltas directly into the block headers of the Base L2 network.</p>
         </div>
      </div>
    </div>
  );
}
