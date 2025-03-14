"use client";

import { useState, useEffect } from "react";
import { Brain, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

type SportCategory = {
  name: string;
  active: boolean;
  matches: number;
  id: string;
};

export default function SportsCategories() {
  const [categories, setCategories] = useState<SportCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSportsCategories() {
      setLoading(true);
      try {
        // Fetch football matches
        const footballResponse = await fetch("/api/sportmonks?action=matches");
        const footballData = await footballResponse.json();
        const footballMatches = footballData.data || [];

        // Fetch NBA matches
        const nbaResponse = await fetch("/api/sportmonks?action=nba");
        const nbaData = await nbaResponse.json();
        const nbaMatches = nbaData.data || [];

        // Create categories based on available matches
        const updatedCategories = [
          {
            id: "nba",
            name: "NBA",
            active: nbaMatches.length > 0,
            matches: nbaMatches.length,
          },
          {
            id: "soccer",
            name: "Soccer",
            active: footballMatches.length > 0,
            matches: footballMatches.length,
          },
          {
            id: "nfl",
            name: "NFL",
            active: true,
            matches: 8,
          },
          {
            id: "mlb",
            name: "MLB",
            active: false,
            matches: 0,
          },
          {
            id: "nhl",
            name: "NHL",
            active: false,
            matches: 0,
          },
        ];

        setCategories(updatedCategories);

        // Set first active category as selected
        const firstActive = updatedCategories.find((cat) => cat.active);
        if (firstActive) {
          setSelectedCategory(firstActive.id);
        }
      } catch (error) {
        console.error("Error fetching sports categories:", error);
        // Use mock data if API fails
        const mockCategories = [
          { id: "nba", name: "NBA", active: true, matches: 12 },
          { id: "soccer", name: "Soccer", active: true, matches: 24 },
          { id: "nfl", name: "NFL", active: true, matches: 8 },
          { id: "mlb", name: "MLB", active: false, matches: 0 },
          { id: "nhl", name: "NHL", active: false, matches: 0 },
        ];
        setCategories(mockCategories);
        setSelectedCategory("nba");
      } finally {
        setLoading(false);
      }
    }

    fetchSportsCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);

    // Find the chat input and populate it with a query about the selected sport
    const chatInput = document.querySelector(
      'input[placeholder="Ask L.U.C.I. about predictions..."]',
    ) as HTMLInputElement;

    if (chatInput) {
      const category = categories.find((cat) => cat.id === categoryId);
      if (category) {
        chatInput.value = `What are your predictions for today's ${category.name} matches?`;
        chatInput.focus();

        // Find and click the submit button
        const submitButton = chatInput
          .closest("form")
          ?.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.click();
        }
      }
    }
  };

  return (
    <div className="bg-gray-900/70 rounded-xl p-6 border border-cyan-900/50 shadow-lg h-full">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-cyan-900/30">
        <Brain size={20} className="text-cyan-500" />
        <h2 className="font-mono text-lg text-white">SPORTS CATEGORIES</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
          <span className="ml-2 font-mono text-sm">LOADING CATEGORIES...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-all ${category.active ? `bg-cyan-900/20 border border-cyan-800/50 hover:border-cyan-600/50 ${selectedCategory === category.id ? "border-cyan-500" : ""}` : "bg-gray-800/20 border border-gray-700/30 text-gray-500"}`}
              onClick={() =>
                category.active && handleCategoryClick(category.id)
              }
            >
              <span className="font-mono">{category.name}</span>
              {category.active ? (
                <span className="text-xs px-2 py-1 bg-cyan-900/50 rounded-full text-cyan-300 font-mono">
                  {category.matches} matches
                </span>
              ) : (
                <span className="text-xs px-2 py-1 bg-gray-800/50 rounded-full text-gray-500 font-mono">
                  Inactive
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-cyan-900/30">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-cyan-800 text-cyan-400 hover:bg-cyan-900/20 font-mono text-xs"
          onClick={() => window.location.reload()}
        >
          REFRESH CATEGORIES
        </Button>
      </div>
    </div>
  );
}
