import { createClient } from "../../../../../supabase/server";
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

    // Get user credits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Failed to retrieve user data:", userError);

      // Set default credits if we can't retrieve them
      const { error: updateError } = await supabase
        .from("users")
        .update({ credits: "50" })
        .eq("id", user.id);

      if (updateError) {
        console.error("Failed to set default credits:", updateError);
        return NextResponse.json({ credits: 50 });
      }

      return NextResponse.json({ credits: 50 });
    }

    const credits = userData.credits ? parseInt(userData.credits) : 50;
    return NextResponse.json({ credits });
  } catch (error) {
    console.error("Credits API error:", error);
    return NextResponse.json(
      { error: "Failed to process request", credits: 50 },
      { status: 500 },
    );
  }
}
