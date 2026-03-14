// frontend/src/app/profiles/[handle]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const handle = params.handle as string;
  const [profile, setProfile] = useState<any>(null);
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        // In a real app, we'd fetch profile + certs
        // Mocking for now to show the premium UI structure
        setProfile({
          displayName: "Elena Vance",
          handle: handle,
          role: "Investigative Journalist",
          bio: "Documenting truth in high-risk environments. Focused on transparency and decentralized evidence chains.",
          stats: {
            totalArtifacts: 42,
            trustScore: 99.8,
            verificationRate: "100%"
          }
        });

        // Simulated fetching of certificates
        const response = await fetch(`http://localhost:3001/v1/verify/hash/some-mock-hash`); // Check backend is up
        // cCerts will be empty for now if backend is down, but UI will show the skeleton
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, [handle]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-black animate-pulse uppercase tracking-[0.5em]">Syncing Profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row gap-20 items-start mb-32">
        <div className="w-full md:w-1/3">
          <div className="glass-card p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-8 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-cyan-500/20">
              {profile.displayName.charAt(0)}
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{profile.displayName}</h1>
            <p className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6">@{profile.handle}</p>
            <p className="text-white/40 text-sm leading-relaxed mb-8 font-medium">{profile.bio}</p>
            
            <div className="space-y-4 border-t border-white/5 pt-8">
              {Object.entries(profile.stats).map(([key, value]: [string, any]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-white font-black tracking-tighter">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-4xl font-black text-white mb-12 tracking-tighter uppercase">Verified <span className="premium-gradient">Pipeline</span></h2>
          
          <div className="space-y-6">
            <div className="glass-card p-12 text-center border-dashed border-white/5 opacity-40">
              <span className="text-4xl mb-4 block">🧬</span>
              <p className="text-white font-black text-xs uppercase tracking-[0.4em]">Artifact Registry Offline</p>
              <p className="text-white/20 text-[10px] mt-2 font-medium">Connect backend or issue new certificates to populate this stream.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
