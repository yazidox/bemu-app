"use client";

import { useState, useEffect } from "react";
import { SportmonksMatch } from "@/services/sportmonks-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Loader2, CircleDot, CircleUser } from "lucide-react";

export default function SportmonksMatchList() {
  const [matches, setMatches] = useState<SportmonksMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"football" | "nba">("football");

  const fetchMatches = async (type: "football" | "nba" = "football") => {
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        type === "football"
          ? "/api/sportmonks?action=matches"
          : "/api/sportmonks?action=nba";

      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch ${type} matches`);
      }

      const data = await response.json();
      setMatches(data.data || []);
    } catch (err) {
      console.error(`Error fetching ${type} matches:`, err);
      setError(
        err instanceof Error ? err.message : `Failed to fetch ${type} matches`,
      );
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(activeTab);
  }, [activeTab]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getTeams = (matchName: string) => {
    const teams = matchName.split(" vs ");
    return {
      home: teams[0],
      away: teams[1],
    };
  };

  return (
    <div className="w-full">
      <Tabs
        defaultValue="football"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700">
          <TabsTrigger
            value="football"
            className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400 font-mono"
          >
            <CircleDot className="h-4 w-4 mr-2" /> SOCCER
          </TabsTrigger>
          <TabsTrigger
            value="nba"
            className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 font-mono"
          >
            <CircleUser className="h-4 w-4 mr-2" /> NBA
          </TabsTrigger>
        </TabsList>

        {["football", "nba"].map((sport) => (
          <TabsContent key={sport} value={sport} className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
                <span className="ml-2 font-mono text-sm">
                  LOADING MATCH DATA...
                </span>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-800 p-4 rounded-md text-red-400 font-mono text-sm">
                {error}
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-md text-gray-400 font-mono text-sm text-center">
                <p>NO MATCHES FOUND</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-cyan-800 text-cyan-400 hover:bg-cyan-900/20"
                  onClick={() => fetchMatches(sport as any)}
                >
                  REFRESH DATA
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match) => {
                  const teams = getTeams(match.name);
                  return (
                    <Card
                      key={match.id}
                      className="bg-gray-800/50 border border-gray-700 hover:border-cyan-700 transition-all"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs border-cyan-800 text-cyan-400"
                          >
                            {activeTab === "football" ? "SOCCER" : "NBA"}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(match.starting_at)} -{" "}
                            {formatDate(match.starting_at)}
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-2 font-mono">
                          {match.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-2 text-center mb-3">
                          <div className="bg-gray-900/50 p-2 rounded-md">
                            <div className="text-xs text-gray-400 mb-1">
                              HOME
                            </div>
                            <div className="text-lg font-bold text-white">
                              {teams.home}
                            </div>
                          </div>
                          <div className="bg-gray-900/50 p-2 rounded-md">
                            <div className="text-xs text-gray-400 mb-1">VS</div>
                            <div className="text-lg font-bold text-white">
                              -
                            </div>
                          </div>
                          <div className="bg-gray-900/50 p-2 rounded-md">
                            <div className="text-xs text-gray-400 mb-1">
                              AWAY
                            </div>
                            <div className="text-lg font-bold text-white">
                              {teams.away}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-cyan-800 text-cyan-400 hover:bg-cyan-900/20 font-mono text-xs"
                          onClick={() => {
                            const chatInput = document.querySelector(
                              'input[placeholder="Ask L.U.C.I. about predictions..."]',
                            ) as HTMLInputElement;
                            if (chatInput) {
                              chatInput.value = `Predict the outcome of ${match.name} match`;
                              chatInput.focus();
                              // Find and click the submit button
                              const submitButton = chatInput
                                .closest("form")
                                ?.querySelector('button[type="submit"]');
                              if (submitButton) {
                                submitButton.click();
                              }
                            }
                          }}
                        >
                          REQUEST PREDICTION
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
