import { NextResponse } from "next/server";
import { sportmonksApi } from "@/services/sportmonks-api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action") || "matches";
    const id = url.searchParams.get("id")
      ? parseInt(url.searchParams.get("id")!)
      : undefined;
    const date =
      url.searchParams.get("date") || new Date().toISOString().split("T")[0];

    let data;

    // Fetch data based on the action
    switch (action) {
      case "matches":
        data = await sportmonksApi.getTodayMatches();
        break;
      case "odds":
        if (!id) {
          return NextResponse.json(
            { error: "Match ID is required for odds" },
            { status: 400 },
          );
        }
        data = await sportmonksApi.getMatchOdds(id);
        break;
      case "predictions":
        if (!id) {
          return NextResponse.json(
            { error: "Match ID is required for predictions" },
            { status: 400 },
          );
        }
        data = await sportmonksApi.getMatchPredictions(id);
        break;
      case "nba":
        data = await sportmonksApi.getNBAMatchData(date);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Sportmonks API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
