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
          ?.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
          submitButton.click();
        }
      }
    }
  };

  return (
    <div className="w-full">
      <div className="font-mono text-xs text-gray-700 mb-1 pl-2">
        AVAILABLE SPORTS:
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 bg-white border-2 border-gray-400 shadow-inner">
          <Loader2 className="h-8 w-8 text-[#000080] animate-spin" />
          <span className="ml-2 font-mono text-sm text-[#000080]">
            LOADING CATEGORIES...
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-2 flex justify-between items-center cursor-pointer transition-all ${
                category.active
                  ? `bg-[#ece9d8] border-2 border-gray-400 hover:border-[#000080] ${
                      selectedCategory === category.id
                        ? "border-[#000080]"
                        : ""
                    }`
                  : "bg-[#d4d0c8] border-2 border-gray-400 text-gray-500"
              }`}
              onClick={() =>
                category.active && handleCategoryClick(category.id)
              }
            >
              <span className="font-mono text-sm">{category.name}</span>
              {category.active ? (
                <span className="text-xs px-2 py-1 bg-[#c0c0c0] border border-gray-400 text-[#000080] font-mono shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff]">
                  {category.matches} matches
                </span>
              ) : (
                <span className="text-xs px-2 py-1 bg-gray-300 border border-gray-400 text-gray-600 font-mono shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff]">
                  Inactive
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-[#c0c0c0] border-2 border-gray-400 text-black hover:bg-[#d0d0d0] font-mono text-xs shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff] active:shadow-[inset_1px_1px_#707070,inset_-1px_-1px_#fff]"
          onClick={() => window.location.reload()}
        >
          REFRESH CATEGORIES
        </Button>
      </div>
    </div>
  );
}
