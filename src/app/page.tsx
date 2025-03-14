import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ArrowUpRight, Brain, Cpu, LineChart, Sparkles, Trophy, Zap } from 'lucide-react';
import { createClient } from "../../supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Cyberpunk grid background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80')] bg-cover opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
        
        {/* Animated scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent bg-[length:100%_4px] bg-repeat-y animate-scan pointer-events-none" style={{backgroundImage: 'linear-gradient(to bottom, rgba(0,255,255,0.1) 50%, transparent 50%)'}}></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block px-6 py-2 border border-cyan-500 text-cyan-400 font-mono text-sm mb-6 animate-pulse">
              L.U.C.I. SYSTEM v2.4.7 // INITIALIZED
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              L.U.C.I. AI
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-4 text-cyan-100">Logical Unified Competition Intelligence</p>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Advanced neural network sports prediction system with 94.7% accuracy rating. Access the future of sports analytics today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={user ? "/dashboard" : "/sign-up"}
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
          </div>

          {/* Terminal-style animation */}
          <div className="max-w-2xl mx-auto bg-gray-900/80 border border-cyan-500/50 rounded-lg p-4 font-mono text-sm text-cyan-400 overflow-hidden">
            <div className="flex items-center mb-2 border-b border-cyan-800/50 pb-2">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs text-gray-400">luci_terminal@sports_prediction</span>
            </div>
            <div className="terminal-text">
              <p>> Initializing L.U.C.I. neural network...</p>
              <p>> Loading sports database... <span className="text-green-400">COMPLETE</span></p>
              <p>> Analyzing historical match data...</p>
              <p>> Calibrating prediction algorithms...</p>
              <p>> System ready. Welcome to L.U.C.I.</p>
              <p className="blink">_</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900 border-t border-b border-cyan-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-cyan-900/30 border border-cyan-700 text-cyan-400 font-mono text-sm mb-4">
              SYSTEM CAPABILITIES
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">ADVANCED PREDICTION ENGINE</h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-light">L.U.C.I. utilizes quantum-inspired algorithms to analyze and predict sports outcomes with unprecedented accuracy.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Brain className="w-6 h-6" />, title: "Neural Analysis", description: "Deep learning algorithms that analyze player performance, team dynamics, and historical data" },
              { icon: <LineChart className="w-6 h-6" />, title: "Trend Detection", description: "Identifies patterns invisible to human analysts with 94.7% accuracy" },
              { icon: <Sparkles className="w-6 h-6" />, title: "Real-Time Updates", description: "Continuous data processing during live games for dynamic predictions" },
              { icon: <Zap className="w-6 h-6" />, title: "Instant Results", description: "Predictions generated in milliseconds, not minutes or hours" },
              { icon: <Trophy className="w-6 h-6" />, title: "Multi-Sport Coverage", description: "Comprehensive analysis for NBA, soccer, and all major sporting events" },
              { icon: <Cpu className="w-6 h-6" />, title: "Credit System", description: "Efficient token-based access to premium predictions and insights" }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-gray-800/50 border border-cyan-900/50 rounded-lg hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm">
                <div className="text-cyan-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-mono font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-cyan-800/50 rounded-lg bg-black/30 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 text-cyan-400 font-mono">94.7%</div>
              <div className="text-gray-300 font-light">Prediction Accuracy</div>
            </div>
            <div className="p-6 border border-purple-800/50 rounded-lg bg-black/30 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 text-purple-400 font-mono">10TB+</div>
              <div className="text-gray-300 font-light">Sports Data Analyzed</div>
            </div>
            <div className="p-6 border border-blue-800/50 rounded-lg bg-black/30 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 text-blue-400 font-mono">24/7</div>
              <div className="text-gray-300 font-light">Real-Time Analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&q=80')] bg-cover opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        
        <div className="container relative mx-auto px-4 text-center z-10">
          <div className="inline-block px-4 py-1 bg-purple-900/30 border border-purple-700 text-purple-400 font-mono text-sm mb-4">
            SYSTEM ACCESS
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">READY TO SEE THE FUTURE?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Join the elite network of sports analysts and bettors who leverage L.U.C.I.'s advanced prediction capabilities.</p>
          
          <Link href={user ? "/dashboard" : "/sign-up"} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg border border-purple-500 font-mono text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 group">
            ACCESS L.U.C.I. SYSTEM
            <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
          
          <div className="mt-12 p-4 border border-cyan-800/30 rounded-lg bg-black/30 max-w-lg mx-auto">
            <p className="text-cyan-400 font-mono text-sm mb-2">// NEW USERS RECEIVE</p>
            <p className="text-2xl font-bold text-white mb-1">50 FREE PREDICTION CREDITS</p>
            <p className="text-gray-400 text-sm">Limited time offer for system evaluation purposes</p>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Animations are now defined in globals.css */}
    </div>
  );
}
