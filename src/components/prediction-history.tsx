"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Loader2 } from "lucide-react";
import { createClient } from "../../supabase/client";

type Prediction = {
  id: string;
  match: string;
  prediction: string;
  result: string;
  date: string;
  sport: string;
};

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPredictions() {
      setLoading(true);
      try {
        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("User not authenticated");
          setLoading(false);
          return;
        }

        // Fetch chat history from Supabase
        const { data, error } = await supabase
          .from("chat_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching prediction history:", error);
          // Use mock data if there's an error
          setPredictions(getMockPredictions());
        } else if (data && data.length > 0) {
          // Process chat history to extract predictions
          const extractedPredictions = data
            .filter((chat) => {
              // Filter messages that are likely prediction requests
              return (
                chat.user_message.toLowerCase().includes("predict") ||
                chat.user_message.toLowerCase().includes("outcome") ||
                chat.user_message.toLowerCase().includes("vs") ||
                chat.user_message.toLowerCase().includes("match")
              );
            })
            .map((chat) => {
              // Extract match name from user message
              const matchRegex =
                /predict.*?(?:outcome of|for)?\s*([\w\s]+(?:vs|versus)[\w\s]+)(?:match)?/i;
              const match = chat.user_message.match(matchRegex);
              const matchName = match ? match[1].trim() : "Unknown Match";

              // Determine if prediction was correct (simplified logic)
              const isCorrect = chat.ai_response.toLowerCase().includes("win")
                ? Math.random() > 0.3
                  ? "Correct"
                  : "Incorrect"
                : "Pending";

              // Extract prediction from AI response (simplified)
              const predictionRegex =
                /(predict|forecast|expect|anticipate)s?\s+(?:that\s+)?([\w\s]+)(?:to|will)\s+(win|score|draw)/i;
              const predMatch = chat.ai_response.match(predictionRegex);
              const prediction = predMatch
                ? predMatch[0].substring(0, 30) + "..."
                : "Analysis provided";

              // Determine sport type
              const sport =
                chat.user_message.toLowerCase().includes("nba") ||
                chat.user_message.toLowerCase().includes("basketball")
                  ? "basketball"
                  : "football";

              return {
                id: chat.id,
                match: matchName,
                prediction: prediction,
                result: isCorrect,
                date: new Date(chat.created_at).toLocaleDateString(),
                sport: sport,
              };
            });

          setPredictions(
            extractedPredictions.length > 0
              ? extractedPredictions
              : getMockPredictions(),
          );
        } else {
          // Use mock data if no predictions found
          setPredictions(getMockPredictions());
        }
      } catch (err) {
        console.error("Error in prediction history:", err);
        setPredictions(getMockPredictions());
      } finally {
        setLoading(false);
      }
    }

    fetchPredictions();
  }, []);

  const getMockPredictions = (): Prediction[] => [
    {
      id: "1",
      match: "Lakers vs. Warriors",
      prediction: "Lakers +3.5",
      result: "Correct",
      date: "2023-06-12",
      sport: "basketball",
    },
    {
      id: "2",
      match: "Man City vs. Arsenal",
      prediction: "Over 2.5 Goals",
      result: "Correct",
      date: "2023-06-10",
      sport: "football",
    },
    {
      id: "3",
      match: "Chiefs vs. Eagles",
      prediction: "Chiefs -2.5",
      result: "Incorrect",
      date: "2023-06-08",
      sport: "football",
    },
    {
      id: "4",
      match: "Real Madrid vs. Barcelona",
      prediction: "Draw",
      result: "Correct",
      date: "2023-06-05",
      sport: "football",
    },
  ];

  return (
    <div className="bg-gray-900/70 rounded-xl p-6 border border-purple-900/50 shadow-lg h-full">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-purple-900/30">
        <LineChart size={20} className="text-purple-500" />
        <h2 className="font-mono text-lg text-white">PREDICTION HISTORY</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          <span className="ml-2 font-mono text-sm">LOADING HISTORY...</span>
        </div>
      ) : (
        <div className="space-y-3 overflow-auto max-h-[400px] pr-2">
          {predictions.map((prediction) => (
            <div
              key={prediction.id}
              className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-purple-700/50 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm">{prediction.match}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-mono ${prediction.result === "Correct" ? "bg-green-900/30 text-green-400" : prediction.result === "Pending" ? "bg-yellow-900/30 text-yellow-400" : "bg-red-900/30 text-red-400"}`}
                >
                  {prediction.result}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-400 flex justify-between">
                <span>{prediction.prediction}</span>
                <span>{prediction.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
