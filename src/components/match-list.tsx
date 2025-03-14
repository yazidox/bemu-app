"use client";

import { useState, useEffect } from "react";
import { Match } from "@/services/sports-api";
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

export default function MatchList() {
  const [matches, setMatches] = useState<{
    football: Match[];
    basketball: Match[];
    ufl: Match[];
  }>({
    football: [],
    basketball: [],
    ufl: [],
  });
  const [loading, setLoading] = useState<{
    football: boolean;
    basketball: boolean;
    ufl: boolean;
  }>({
    football: false,
    basketball: false,
    ufl: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [activeSport, setActiveSport] = useState<
    "football" | "basketball" | "ufl"
  >("football");

  const fetchMatches = async (sport: "football" | "basketball" | "ufl") => {
    setLoading((prev) => ({ ...prev, [sport]: true }));
    setError(null);

    try {
      const response = await fetch(`/api/sports?sport=${sport}&action=matches`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch ${sport} matches`);
      }

      const data = await response.json();
      setMatches((prev) => ({ ...prev, [sport]: data.data }));
    } catch (err) {
      console.error(`Error fetching ${sport} matches:`, err);
      setError(
        err instanceof Error ? err.message : `Failed to fetch ${sport} matches`,
      );
      // Use mock data in case of error
      setMatches((prev) => ({
        ...prev,
        [sport]: [],
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [sport]: false }));
    }
  };

  useEffect(() => {
    fetchMatches(activeSport);
  }, [activeSport]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getSportIcon = (sport: "football" | "basketball" | "ufl") => {
    switch (sport) {
      case "football":
        return <CircleDot className="h-4 w-4 text-cyan-400" />;
      case "basketball":
        return <CircleUser className="h-4 w-4 text-purple-400" />;
      case "ufl":
        return <Trophy className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className="w-full">
      <Tabs
        defaultValue="football"
        value={activeSport}
        onValueChange={(value) => setActiveSport(value as any)}
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-gray-700">
          <TabsTrigger
            value="football"
            className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400 font-mono"
          >
            <CircleDot className="h-4 w-4 mr-2" /> SOCCER
          </TabsTrigger>
          <TabsTrigger
            value="basketball"
            className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 font-mono"
          >
            <CircleUser className="h-4 w-4 mr-2" /> NBA
          </TabsTrigger>
          <TabsTrigger
            value="ufl"
            className="data-[state=active]:bg-yellow-900/30 data-[state=active]:text-yellow-400 font-mono"
          >
            <Trophy className="h-4 w-4 mr-2" /> UFL
          </TabsTrigger>
        </TabsList>

        {["football", "basketball", "ufl"].map((sport) => (
          <TabsContent key={sport} value={sport} className="mt-4">
            {loading[sport as keyof typeof loading] ? (
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
            ) : matches[sport as keyof typeof matches].length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-md text-gray-400 font-mono text-sm text-center">
                <p>NO MATCHES FOUND FOR TODAY</p>
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
                {matches[sport as keyof typeof matches].map((match) => (
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
                          {match.league}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(match.startTime)}
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2 font-mono">
                        {match.homeTeam} vs {match.awayTeam}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-400">
                        {match.venue || "Venue not specified"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-900/50 p-2 rounded-md">
                          <div className="text-xs text-gray-400 mb-1">HOME</div>
                          <div className="text-lg font-bold text-white">
                            {match.odds?.home
                              ? match.odds.home.toFixed(2)
                              : "-"}
                          </div>
                        </div>
                        {sport === "football" && (
                          <div className="bg-gray-900/50 p-2 rounded-md">
                            <div className="text-xs text-gray-400 mb-1">
                              DRAW
                            </div>
                            <div className="text-lg font-bold text-white">
                              {match.odds?.draw
                                ? match.odds.draw.toFixed(2)
                                : "-"}
                            </div>
                          </div>
                        )}
                        <div className="bg-gray-900/50 p-2 rounded-md col-span-1">
                          <div className="text-xs text-gray-400 mb-1">AWAY</div>
                          <div className="text-lg font-bold text-white">
                            {match.odds?.away
                              ? match.odds.away.toFixed(2)
                              : "-"}
                          </div>
                        </div>
                        {sport !== "football" && (
                          <div className="bg-gray-900/50 p-2 rounded-md">
                            <div className="text-xs text-gray-400 mb-1">
                              STATUS
                            </div>
                            <div className="text-sm font-mono text-cyan-400">
                              {match.status || "Not Started"}
                            </div>
                          </div>
                        )}
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
                            chatInput.value = `Predict the outcome of ${match.homeTeam} vs ${match.awayTeam} match`;
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
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
