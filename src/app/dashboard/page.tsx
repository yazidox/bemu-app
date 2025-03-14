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
    <div className="min-h-screen bg-[url('/bg.png')] text-black">
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
          {/* Header Section */}
          <header className="w-full rounded-none border-2 border-gray-500 bg-[#ece9d8] p-6 shadow-md relative z-10">
            {/* Windows title bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#000080] to-[#1084d0] flex items-center px-2 -mt-8 border-2 border-gray-500 border-b-0">
              <div className="flex items-center gap-2 text-white font-bold">
                <Cpu size={16} />
                <span>L.U.C.I. Dashboard Control Panel</span>
              </div>
              <div className="ml-auto flex">
                <button className="w-6 h-5 bg-[#c0c0c0] border border-gray-500 flex items-center justify-center text-xs mr-1">
                  _
                </button>
                <button className="w-6 h-5 bg-[#c0c0c0] border border-gray-500 flex items-center justify-center text-xs mr-1">
                  □
                </button>
                <button className="w-6 h-5 bg-[#c0c0c0] border border-gray-500 flex items-center justify-center text-xs">
                  ×
                </button>
              </div>
            </div>

            <div className="mt-2">
              <div className="inline-block px-4 py-1 bg-[#c0c0c0] border-2 border-gray-400 text-[#000080] font-mono text-sm mb-4 w-fit shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff]">
                SYSTEM STATUS: ONLINE
              </div>
              <h1 className="text-3xl font-bold text-[#000080]">
                L.U.C.I. DASHBOARD
              </h1>
              <div className="bg-white border-2 border-gray-400 text-sm p-3 px-4 rounded-none text-gray-700 flex gap-2 items-center mt-4 shadow-inner">
                <InfoIcon size="14" className="text-[#000080]" />
                <span>
                  Welcome to your L.U.C.I. AI Sports Prediction dashboard.
                  Current system status: Operational
                </span>
              </div>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="grid mt-10 grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Panel - Sports Categories */}
            <div className="rounded-none border-2 border-gray-500 bg-[#ece9d8] p-6 shadow-md relative z-10">
              {/* Windows title bar */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#000080] to-[#1084d0] flex items-center px-2 -mt-8 border-2 border-gray-500 border-b-0">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Brain size={16} />
                  <span>Sports Categories</span>
                </div>
              </div>

              <div className="mt-2">
                <SportsCategories />
              </div>
            </div>

            {/* Center Panel - Prediction History */}
            <div className="rounded-none border-2 border-gray-500 bg-[#ece9d8] p-6 shadow-md relative z-10">
              {/* Windows title bar */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#000080] to-[#1084d0] flex items-center px-2 -mt-8 border-2 border-gray-500 border-b-0">
                <div className="flex items-center gap-2 text-white font-bold">
                  <LineChart size={16} />
                  <span>Prediction History</span>
                </div>
              </div>

              <div className="mt-2">
                <PredictionHistory />
              </div>
            </div>

            {/* Right Panel - AI Chatbot */}
            <div className="rounded-none border-2 border-gray-500 bg-[#ece9d8] p-6 shadow-md relative z-10">
              {/* Windows title bar */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#000080] to-[#1084d0] flex items-center px-2 -mt-8 border-2 border-gray-500 border-b-0">
                <div className="flex items-center gap-2 text-white font-bold">
                  <MessageSquare size={16} />
                  <span>L.U.C.I. Chat Interface</span>
                </div>
              </div>

              <div className="mt-2 h-[400px] flex flex-col border-2 border-gray-400 bg-white shadow-inner">
                <ChatInterface />
              </div>
            </div>
          </div>

          {/* Today's Matches Section */}
          <section className="w-full mt-10 rounded-none border-2 border-gray-500 bg-[#ece9d8] p-6 shadow-md relative z-10">
            {/* Windows title bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#000080] to-[#1084d0] flex items-center px-2 -mt-8 border-2 border-gray-500 border-b-0">
              <div className="flex items-center gap-2 text-white font-bold">
                <Calendar size={16} />
                <span>Today's Matches</span>
              </div>
            </div>

            <div className="mt-2">
              <SportmonksMatchList />
            </div>
          </section>

          {/* User Profile Section */}
          <section className="rounded-none mt-10 border-2 border-gray-500 bg-[#ece9d8] p-6 shadow-md relative z-10">
            {/* Windows title bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#000080] to-[#1084d0] flex items-center px-2 -mt-8 border-2 border-gray-500 border-b-0">
              <div className="flex items-center gap-2 text-white font-bold">
                <UserCircle size={16} />
                <span>User Profile</span>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex items-center gap-4 mb-6">
                <UserCircle size={48} className="text-[#000080]" />
                <div>
                  <h2 className="font-mono text-xl text-[#000080]">
                    USER PROFILE
                  </h2>
                  <p className="text-sm text-gray-700">{user.email}</p>
                </div>
                <div className="ml-auto bg-[#c0c0c0] px-4 py-2 border-2 border-gray-400 shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff]">
                  <span className="text-[#000080] font-mono text-sm">
                    CREDITS:{" "}
                  </span>
                  <span className="text-black font-mono">{credits}</span>
                </div>
              </div>
              <div className="bg-white rounded-none p-4 overflow-hidden border-2 border-gray-400 shadow-inner">
                <pre className="text-xs font-mono max-h-48 overflow-auto text-gray-700">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
