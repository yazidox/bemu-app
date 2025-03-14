import DashboardNavbar from "@/components/dashboard-navbar";
import ChatInterface from "@/components/chat-interface";
import SportmonksMatchList from "@/components/sportmonks-match-list";
import PredictionHistory from "@/components/prediction-history";
import SportsCategories from "@/components/sports-categories";
import {
  Brain,
  Cpu,
  InfoIcon,
  LineChart,
  MessageSquare,
  UserCircle,
  Calendar,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user credits
  const { data: userData } = await supabase
    .from("users")
    .select("credits")
    .eq("id", user.id)
    .single();

  const credits = userData?.credits ? parseInt(userData.credits) : 50;

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar />
      <main className="w-full bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="inline-block px-4 py-1 bg-cyan-900/30 border border-cyan-700 text-cyan-400 font-mono text-sm mb-2 w-fit">
              SYSTEM STATUS: ONLINE
            </div>
            <h1 className="text-3xl font-bold text-white">
              L.U.C.I. DASHBOARD
            </h1>
            <div className="bg-gray-800/50 text-sm p-3 px-4 rounded-lg text-gray-300 flex gap-2 items-center border border-cyan-900/30">
              <InfoIcon size="14" className="text-cyan-400" />
              <span>
                Welcome to your L.U.C.I. AI Sports Prediction dashboard. Current
                system status: Operational
              </span>
            </div>
          </header>

          {/* Today's Matches Section */}
          <section className="bg-gray-900/70 rounded-xl p-6 border border-cyan-900/50 shadow-lg">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-cyan-900/30">
              <Calendar size={20} className="text-cyan-500" />
              <h2 className="font-mono text-lg text-white">TODAY'S MATCHES</h2>
            </div>
            <SportmonksMatchList />
          </section>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Panel - Sports Categories */}
            <div className="h-full">
              <SportsCategories />
            </div>

            {/* Center Panel - Prediction History */}
            <div className="h-full">
              <PredictionHistory />
            </div>

            {/* Right Panel - AI Chatbot */}
            <div className="bg-gray-900/70 rounded-xl p-4 border border-cyan-900/50 shadow-lg">
              <div className="h-[400px] flex flex-col border border-gray-700 bg-gray-800">
                <ChatInterface />
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <section className="bg-gray-900/70 rounded-xl p-6 border border-gray-800 shadow-lg mt-4">
            <div className="flex items-center gap-4 mb-6">
              <UserCircle size={48} className="text-cyan-500" />
              <div>
                <h2 className="font-mono text-xl text-white">USER PROFILE</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              <div className="ml-auto bg-gray-800 px-4 py-2 border border-cyan-800">
                <span className="text-cyan-400 font-mono text-sm">
                  CREDITS:{" "}
                </span>
                <span className="text-white font-mono">{credits}</span>
              </div>
            </div>
            <div className="bg-black/50 rounded-lg p-4 overflow-hidden border border-gray-800">
              <pre className="text-xs font-mono max-h-48 overflow-auto text-gray-400">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
