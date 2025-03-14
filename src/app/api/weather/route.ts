import { NextResponse } from "next/server";
import { weatherApi } from "@/services/weather-api";
import { createClient } from "../../../../supabase/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const location = url.searchParams.get("location") || "London";
    const forecast = url.searchParams.get("forecast") === "true";
    const days = url.searchParams.get("days")
      ? parseInt(url.searchParams.get("days")!)
      : 3;

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
    const useMock =
      process.env.NODE_ENV === "development" &&
      !process.env.NEXT_PUBLIC_WEATHER_API_KEY;

    if (useMock) {
      data = weatherApi.getMockWeatherData(location);
    } else {
      if (forecast) {
        data = await weatherApi.getWeatherForecast(location, days);
      } else {
        data = await weatherApi.getWeatherByLocation(location);
      }
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
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
