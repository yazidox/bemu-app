import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const supabase = await createClient();

    // Get the current user to track usage
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if user has enough credits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Failed to retrieve user data:", userError);
      // Default to 50 credits if we can't retrieve user data
      const { error: updateError } = await supabase
        .from("users")
        .update({ credits: "50" })
        .eq("id", user.id);

      if (updateError) {
        console.error("Failed to set default credits:", updateError);
      }
    }

    // Always ensure user has at least 1 credit
    const credits = userData?.credits ? parseInt(userData.credits) : 50;

    // Always allow the request to proceed - each request costs exactly 1 credit

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are L.U.C.I. (Logical Unified Competition Intelligence), an advanced AI sports prediction assistant. You specialize in providing insights, statistics, and predictions for sports events, particularly NBA, Soccer, and NFL. Your tone is technical, precise, and slightly cyberpunk. You refer to yourself as 'L.U.C.I.' or 'this system'. You should provide data-driven responses about sports predictions, player statistics, team performance, and betting insights. If asked about non-sports topics, politely redirect the conversation to sports-related discussions.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "OpenAI API error", details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Deduct 1 credit for the successful request
    const newCredits = credits - 1;
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: newCredits.toString() })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update user credits:", updateError);
    }

    // Save the chat message to history (optional)
    const { error: chatError } = await supabase.from("chat_history").insert([
      {
        user_id: user.id,
        user_message: message,
        ai_response: aiResponse,
        created_at: new Date().toISOString(),
      },
    ]);

    // If this is a prediction request, save it to prediction_history
    if (
      message.toLowerCase().includes("predict") ||
      message.toLowerCase().includes("outcome") ||
      message.toLowerCase().includes(" vs ")
    ) {
      // Extract match name from user message
      const matchRegex =
        /predict.*?(?:outcome of|for)?\s*([\w\s]+(?:vs|versus)[\w\s]+)(?:match)?/i;
      const match = message.match(matchRegex);
      const matchName = match ? match[1].trim() : "Unknown Match";

      // Determine sport type
      const sport =
        message.toLowerCase().includes("nba") ||
        message.toLowerCase().includes("basketball")
          ? "basketball"
          : "football";

      // Extract prediction from AI response (simplified)
      const predictionRegex =
        /(predict|forecast|expect|anticipate)s?\s+(?:that\s+)?([\w\s]+)(?:to|will)\s+(win|score|draw)/i;
      const predMatch = aiResponse.match(predictionRegex);
      const prediction = predMatch
        ? predMatch[0].substring(0, 100)
        : "Analysis provided";

      // Save to prediction_history
      const { error: predictionError } = await supabase
        .from("prediction_history")
        .insert([
          {
            user_id: user.id,
            match_id: Date.now().toString(), // Using timestamp as ID
            match_name: matchName,
            prediction: prediction,
            result: "Pending",
            sport: sport,
            created_at: new Date().toISOString(),
          },
        ]);

      if (predictionError) {
        console.error("Failed to save prediction history:", predictionError);
      }
    }

    if (chatError) {
      console.error("Failed to save chat history:", chatError);
    }

    return NextResponse.json({ response: aiResponse, credits: newCredits });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
