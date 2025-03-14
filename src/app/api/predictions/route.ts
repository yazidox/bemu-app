import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
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

    // Get user predictions
    const { data: predictions, error } = await supabase
      .from("prediction_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to retrieve predictions:", error);
      return NextResponse.json(
        { error: "Failed to retrieve predictions" },
        { status: 500 },
      );
    }

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error("Predictions API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { match_id, match_name, prediction, sport } = await request.json();
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

    // Insert prediction
    const { data, error } = await supabase.from("prediction_history").insert([
      {
        user_id: user.id,
        match_id,
        match_name,
        prediction,
        result: "Pending", // Initial state
        sport,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Failed to save prediction:", error);
      return NextResponse.json(
        { error: "Failed to save prediction" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Predictions API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
