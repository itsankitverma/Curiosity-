import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { articleTitle, articleContext, question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "A question is required." }, { status: 400 });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are a world-class science communicator at "Curiosity" (curiosity, backed by science).
You are answering a reader's question about the discovery: "${articleTitle || 'Curious Science Discovery'}".
Context: ${articleContext || 'Cutting-edge observational research'}.

Guidelines:
1. Speak with enthusiasm, deep clarity, and rigorous scientific precision.
2. Avoid dry bureaucratic textbook answers. Use engaging analogies.
3. Be concise (2 to 3 well-formed paragraphs maximum).
4. If appropriate, highlight a "Mind-bending thought" or "What we still don't know" at the end.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    const answer = response.text || "Unable to retrieve response from science communicator.";
    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Error in ask-story API:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process question." },
      { status: 500 }
    );
  }
}
