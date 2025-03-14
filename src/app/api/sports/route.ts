import { NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { sportsApi } from "@/services/sports-api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sport =
      (url.searchParams.get("sport") as "football" | "basketball" | "ufl") ||
      "football";
    const action = url.searchParams.get("action") || "matches";
    const id = url.searchParams.get("id")
      ? parseInt(url.searchParams.get("id")!)
      : undefined;
    const leagueId = url.searchParams.get("leagueId")
      ? parseInt(url.searchParams.get("leagueId")!)
      : undefined;
    const season = url.searchParams.get("season")
      ? parseInt(url.searchParams.get("season")!)
      : undefined;
    const team1Id = url.searchParams.get("team1Id")
      ? parseInt(url.searchParams.get("team1Id")!)
      : undefined;
    const team2Id = url.searchParams.get("team2Id")
      ? parseInt(url.searchParams.get("team2Id")!)
      : undefined;

    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get user credits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Failed to retrieve user data:", userError);
      return NextResponse.json(
        { error: "Failed to retrieve user data" },
        { status: 500 },
      );
    }

    const credits = userData.credits ? parseInt(userData.credits) : 50;

    // Check if user has enough credits (each API call costs 1 credit)
    if (credits < 1) {
      return NextResponse.json(
        {
          error:
            "Insufficient credits. Please purchase more credits to continue.",
        },
        { status: 402 },
      );
    }

    let data;
    let useMock =
      process.env.NODE_ENV === "development" &&
      !process.env.NEXT_PUBLIC_API_FOOTBALL_KEY;

    // Fetch data based on the action
    switch (action) {
      case "matches":
        data = useMock
          ? sportsApi.getMockMatches(sport)
          : await sportsApi.getTodayMatches(sport);
        break;
      case "odds":
        if (!id) {
          return NextResponse.json(
            { error: "Match ID is required for odds" },
            { status: 400 },
          );
        }
        data = await sportsApi.getMatchOdds(id, sport);
        break;
      case "league":
        if (!leagueId) {
          return NextResponse.json(
            { error: "League ID is required for league stats" },
            { status: 400 },
          );
        }
        data = await sportsApi.getLeagueStats(leagueId, sport);
        break;
      case "team":
        if (!id || !leagueId || !season) {
          return NextResponse.json(
            {
              error:
                "Team ID, League ID, and Season are required for team stats",
            },
            { status: 400 },
          );
        }
        data = await sportsApi.getTeamStats(id, leagueId, season, sport);
        break;
      case "h2h":
        if (!team1Id || !team2Id) {
          return NextResponse.json(
            { error: "Both team IDs are required for head-to-head stats" },
            { status: 400 },
          );
        }
        data = await sportsApi.getH2H(team1Id, team2Id, sport);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Deduct 1 credit for the successful request
    const newCredits = credits - 1;
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: newCredits.toString() })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update user credits:", updateError);
    }

    return NextResponse.json({ data, credits: newCredits });
  } catch (error) {
    console.error("Sports API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
