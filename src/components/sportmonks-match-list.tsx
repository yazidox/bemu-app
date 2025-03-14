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
import { Trophy, Clock, Loader2, CircleDot, CircleUser, Calendar } from "lucide-react";

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
        <TabsList className="grid w-full grid-cols-2 bg-[#c0c0c0] border-2 border-gray-400 shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff]">
          <TabsTrigger
            value="football"
            className="data-[state=active]:bg-[#ece9d8] data-[state=active]:text-[#000080] font-mono border-r border-gray-400"
          >
            SOCCER
          </TabsTrigger>
          <TabsTrigger
            value="nba"
            className="data-[state=active]:bg-[#ece9d8] data-[state=active]:text-[#000080] font-mono"
          >
        NBA
          </TabsTrigger>
        </TabsList>

        {["football", "nba"].map((sport) => (
          <TabsContent key={sport} value={sport} className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-40 bg-white border-2 border-gray-400 shadow-inner">
                <Loader2 className="h-8 w-8 text-[#000080] animate-spin" />
                <span className="ml-2 font-mono text-sm text-[#000080]">
                  LOADING MATCH DATA...
                </span>
              </div>
            ) : error ? (
              <div className="bg-white border-2 border-gray-400 p-4 shadow-inner text-red-600 font-mono text-sm">
                {error}
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-white border-2 border-gray-400 p-4 shadow-inner text-gray-700 font-mono text-sm text-center">
                <p>NO MATCHES FOUND</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-[#c0c0c0] border-2 border-gray-400 text-black hover:bg-[#d0d0d0] shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff] active:shadow-[inset_1px_1px_#707070,inset_-1px_-1px_#fff]"
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
                      className="bg-[#ece9d8] border-2 border-gray-500 rounded-none shadow-md hover:border-[#000080] transition-all"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs bg-[#c0c0c0] border-2 border-gray-400 text-[#000080] shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff] rounded-none"
                          >
                            {activeTab === "football" ? "SOCCER" : "NBA"}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-700 bg-white px-2 py-1 border border-gray-400 shadow-inner">
                            <Clock className="h-3 w-3 mr-1 text-[#000080]" />
                            {formatTime(match.starting_at)} -{" "}
                            {formatDate(match.starting_at)}
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-2 font-mono text-[#000080]">
                          {match.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-2 text-center mb-3">
                          <div className="bg-white p-2 border-2 border-gray-400 shadow-inner">
                            <div className="text-xs text-gray-700 mb-1">
                              HOME
                            </div>
                            <div className="text-lg font-bold text-[#000080]">
                              {teams.home}
                            </div>
                          </div>
                          <div className="bg-white p-2 border-2 border-gray-400 shadow-inner">
                            <div className="text-xs text-gray-700 mb-1">VS</div>
                            <div className="text-lg font-bold text-[#000080]">
                              -
                            </div>
                          </div>
                          <div className="bg-white p-2 border-2 border-gray-400 shadow-inner">
                            <div className="text-xs text-gray-700 mb-1">
                              AWAY
                            </div>
                            <div className="text-lg font-bold text-[#000080]">
                              {teams.away}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-[#c0c0c0] border-2 border-gray-400 text-black hover:bg-[#d0d0d0] font-mono text-xs shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff] active:shadow-[inset_1px_1px_#707070,inset_-1px_-1px_#fff]"
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
                                ?.querySelector('button[type="submit"]') as HTMLButtonElement;
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
