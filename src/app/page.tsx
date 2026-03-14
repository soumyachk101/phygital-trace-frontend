export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full max-w-[1400px] mx-auto px-6 pt-32 pb-40 md:pt-48 md:pb-64 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[800px] lg:w-[1400px] bg-cyan-500/10 blur-[180px] rounded-full -z-10 pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-[10px] font-black tracking-[0.3em] text-cyan-400 mb-10 animate-fade-in uppercase">
          Decentralized Truth Protocol v1.0
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-white mb-10 leading-[0.85] glow-text max-w-6xl">
          Weaponizing <span className="premium-gradient">Truth</span> <br className="hidden md:block" /> in the Age of AI.
        </h1>
        
        <p className="max-w-3xl text-base md:text-xl lg:text-2xl text-white/40 mb-16 leading-relaxed font-semibold px-4">
          The global standard for camera-to-blockchain verification. 
          Proving digital authenticity through physical sensor fingerprints and immutable L2 proof.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-32">
          <a href="/verify" className="btn-primary px-10 py-5 text-[11px] min-w-[200px]">
            Verify Digital Proof
          </a>
          <a href="/issue" className="glass-morphism text-white/80 px-10 py-5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:bg-white/5 border border-white/5 min-w-[200px] flex items-center justify-center">
            Review Network
          </a>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full border-t border-white/5 pt-20">
          {[
            { label: "Secured Artifacts", value: "240K+" },
            { label: "Sync Latency", value: "120ms" },
            { label: "Active Nodes", value: "1,200+" },
            { label: "Consensus Index", value: "99.9%" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-2 group">
              <span className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em]">{stat.label}</span>
              <span className="text-white font-black text-3xl md:text-5xl tracking-tighter group-hover:text-cyan-400 transition-colors uppercase">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Pillars */}
      <section id="features" className="w-full py-40 md:py-64 bg-[#08080a] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16 mb-40">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-10 tracking-tighter leading-tight">Anchoring Reality in <br /> Cryptography.</h2>
              <p className="text-white/40 text-lg md:text-xl leading-relaxed font-semibold max-w-2xl">
                Standard EXIF is compromised by design. We use hardware-backed signatures to bind physical sensor streams to every pixel, creating an unbreakable chain of custody.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Physical Primacy", 
                desc: "Every certificate is bound to real-world sensor bundles: GPS, Accelerometer, Gyroscope, and local RF metrics.",
                icon: "🛰️"
              },
              { 
                title: "Cryptographic Transparency", 
                desc: "Signatures are generated in the Secure Enclave and logged to Base L2, making them publicly auditable.",
                icon: "🛡️"
              },
              { 
                title: "Hardware Trust", 
                desc: "Keys never leave the hardware. We solve trust through attestation, bypassing platform intermediaries.",
                icon: "💎"
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-10 md:p-14 flex flex-col gap-8 group hover:-translate-y-3 transition-all duration-700">
                <div className="text-5xl opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">{feature.icon}</div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{feature.title}</h3>
                <p className="text-white/30 leading-relaxed font-semibold text-sm md:text-base">{feature.desc}</p>
                <div className="mt-4 flex items-center gap-3 text-[10px] font-black text-cyan-400/0 group-hover:text-cyan-400 transition-all uppercase tracking-[0.2em]">
                  Technical Specs <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Block */}
      <section id="how-it-works" className="w-full py-40 md:py-64 overflow-visible">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-card p-10 md:p-24 flex flex-col lg:flex-row items-center gap-24 relative border-white/5">
            <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            
            <div className="flex-1 w-full space-y-12">
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">Zero-Trust Capture.</h2>
              
              <div className="space-y-12">
                {[
                  { step: "01", title: "Bundle Signature", desc: "Sensors snapshot the physical environment at the exact microsecond of capture." },
                  { step: "02", title: "Recursive Hashing", desc: "Image and sensor data are recursively concatenated into a unique SHA-256 Truth ID." },
                  { step: "03", title: "Consensus Registry", desc: "The proof is anchored to Base L2 and verified across a global validator network." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group rounded-3xl transition-all">
                    <span className="text-cyan-500/10 group-hover:text-cyan-400 font-black text-4xl md:text-6xl transition-all duration-700 leading-none shrink-0">{item.step}</span>
                    <div>
                      <h4 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                      <p className="text-white/30 font-semibold text-base md:text-lg leading-relaxed max-w-md">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full relative group lg:max-w-md shrink-0">
              <div className="absolute inset-0 bg-cyan-500/10 blur-[130px] -z-10"></div>
              <div className="glass-morphism rounded-[3rem] p-12 border-white/10 relative aspect-square flex items-center justify-center">
                 <div className="flex flex-col items-center gap-12 text-cyan-400/20">
                    <div className="relative">
                      <div className="w-32 h-32 md:w-48 md:h-48 border-[12px] md:border-[16px] border-t-cyan-500/40 border-white/5 rounded-full animate-[spin_4s_linear_infinite]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-cyan-500/20 rounded-full animate-pulse filter blur-xl"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-cyan-400 rounded-lg animate-ping"></div>
                      </div>
                    </div>
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-black text-cyan-400 glow-text animate-pulse">Validator In-Sync</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-48">
        <div className="relative p-1 overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent">
          <div className="bg-[#050507] rounded-[3.4rem] px-12 py-32 md:p-40 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[200px] rounded-full pointer-events-none"></div>
            
            <h2 className="text-6xl md:text-[10rem] font-black text-white mb-16 tracking-tighter leading-[0.85] glow-text">Secure the <br /><span className="premium-gradient">Artifacts</span>.</h2>
            
            <p className="text-white/40 max-w-2xl mx-auto mb-20 text-xl md:text-2xl font-semibold leading-relaxed">
              Don't just take photos. Generate cryptographic evidence of reality. Join the global network of verified truth.
            </p>
            
            <a href="/register" className="btn-primary px-20 py-7 text-sm shadow-cyan-500/40">
              Start Your Pipeline
            </a>
          </div>
        </div>
      </section>
      
      <footer className="w-full py-20 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-white text-xs">P</div>
            <span className="text-white/20 text-xs font-black uppercase tracking-[0.4em]">Phygital-Trace / Mainnet Beta</span>
          </div>
          <div className="flex gap-12 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Base Scan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
