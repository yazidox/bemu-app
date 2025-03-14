import Link from "next/link";
import { ArrowUpRight, Brain, Cpu, Check } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useEffect, useState } from "react";

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    }
    loadUser();
  }, []);

  return (
    <div className="relative overflow-hidden bg-black text-white">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80')] bg-cover opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>

      {/* Animated scan line effect */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent bg-[length:100%_4px] bg-repeat-y animate-scan pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,255,255,0.1) 50%, transparent 50%)",
        }}
      ></div>

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-6 py-2 border border-cyan-500 text-cyan-400 font-mono text-sm mb-6 animate-pulse">
              L.U.C.I. SYSTEM v2.4.7 // INITIALIZED
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              L.U.C.I. AI
            </h1>

            <p className="text-xl sm:text-2xl font-light mb-4 text-cyan-100">
              Logical Unified Competition Intelligence
            </p>

            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Advanced neural network sports prediction system with 94.7%
              accuracy rating. Access the future of sports analytics today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={!loading && user ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded border border-cyan-400 text-white font-mono hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 group"
              >
                <span className="mr-2">INITIALIZE SYSTEM</span>
                <Cpu className="w-5 h-5 group-hover:animate-pulse" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center px-8 py-4 bg-transparent border border-purple-500 text-purple-400 rounded font-mono hover:bg-purple-900/20 transition-all duration-300"
              >
                SYSTEM SPECS
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-cyan-500" />
                <span>50 FREE CREDITS</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-cyan-500" />
                <span>REAL-TIME ANALYSIS</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-cyan-500" />
                <span>MULTI-SPORT COVERAGE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes scan {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 100%;
          }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
