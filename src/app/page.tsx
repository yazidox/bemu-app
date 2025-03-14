import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Brain,
  Cpu,
  LineChart,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[url('/bg.png')] bg-cover text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block px-6 py-2 border border-teal-500 text-teal-400 font-mono text-sm mb-6 bg-gray-900/80">
              L.U.C.I. SYSTEM v2.4.7 // INITIALIZED
            </div>

            <div className="mb-6 flex justify-center">
              <Image
                src="/logo.png"
                alt="L.U.C.I. AI Logo"
                width={200}
                height={200}
                className="drop-shadow-lg"
              />
            </div>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Advanced neural network sports prediction system with 94.7%
              accuracy rating. Access the future of sports analytics today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={user ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center px-8 py-4 bg-teal-700 border-2 border-teal-500 rounded-none text-white font-mono hover:bg-teal-600 transition-all duration-300 shadow-md"
              >
                <span className="mr-2">INITIALIZE SYSTEM</span>
                <Cpu className="w-5 h-5" />
              </Link>

          
            </div>
          </div>

          {/* Windows 89 style terminal */}
          <div className="max-w-2xl mx-auto bg-blue-900 border-4 border-gray-300 rounded-none p-0 font-mono text-sm text-white overflow-hidden shadow-lg">
            <div className="flex items-center bg-gradient-to-r from-blue-700 to-blue-900 p-1 justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 border border-gray-500 mr-2"></div>
                <span className="text-xs text-white font-bold">LUCI.EXE</span>
              </div>
              <div className="flex">
                <button className="w-6 h-5 bg-gray-300 border border-gray-500 flex items-center justify-center text-xs mr-1">
                  _
                </button>
                <button className="w-6 h-5 bg-gray-300 border border-gray-500 flex items-center justify-center text-xs mr-1">
                  □
                </button>
                <button className="w-6 h-5 bg-gray-300 border border-gray-500 flex items-center justify-center text-xs">
                  ×
                </button>
              </div>
            </div>
            <div className="terminal-text bg-black p-4">
              <p>{">>"} Initializing L.U.C.I. neural network...</p>
              <p>
                {">>"} Loading sports database...{" "}
                <span className="text-green-400">COMPLETE</span>
              </p>
              <p>{">>"} Analyzing historical match data...</p>
              <p>{">>"} Calibrating prediction algorithms...</p>
              <p>{">>"} System ready. Welcome to L.U.C.I.</p>
              <p className="blink">_</p>
            </div>
          </div>
        </div>
      </section>

      {/* Animations are now defined in globals.css */}
    </div>
  );
}
