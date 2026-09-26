import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { topic, audienceLevel = "curious" } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "A scientific topic or question is required." }, { status: 400 });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are the lead editor at Curiosity, a science discovery publication whose motto is "Curiosity, backed by science."
Your task is to transform any scientific discovery, paper, phenomenon, or question into a compelling, crystal-clear, jargon-free Curiosity breakdown.
Follow these editorial principles:
1. Avoid boring "Scientists discover..." formulas. Hook the reader with vivid physics/biology mechanics and cosmic or microscopic scale.
2. Maintain high scientific accuracy backed by real peer-reviewed physics/biology/geology, but explain complex terms using tangible real-world analogies.
3. Dedicate a standout section to "Why should I care?" that directly answers how this expands human knowledge, inspires awe, or influences medical/technological futures.
4. Level requested: ${audienceLevel}`;

    const prompt = `Break down the following scientific research topic or question into the Curiosity publication format:
Topic / Discovery: "${topic}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "An evocative, intriguing title for this discovery."
            },
            subtitle: {
              type: Type.STRING,
              description: "A one-sentence summary that highlights the central paradox or marvel."
            },
            category: {
              type: Type.STRING,
              description: "One of: Space, Earth, Life, Mind, Science, Nature, Technology, History"
            },
            categoryIcon: {
              type: Type.STRING,
              description: "An emoji matching the category"
            },
            whatDidTheySee: {
              type: Type.STRING,
              description: "Simple, vivid explanation of what was observed, measured, or proven."
            },
            whyImportant: {
              type: Type.STRING,
              description: "Explain the broader scientific significance without academic jargon."
            },
            howDidTheyDoIt: {
              type: Type.STRING,
              description: "Explain the instruments, telescopes, submersibles, lasers, or experiments used."
            },
            theFascinatingPart: {
              type: Type.STRING,
              description: "The 'wow' factor that makes someone stop and say 'That is wild!'"
            },
            whyShouldICare: {
              type: Type.STRING,
              description: "The crucial section: why this matters to ordinary people, technology, health, or our place in the cosmos."
            },
            mindBendingFact: {
              type: Type.STRING,
              description: "A quick, memorable punchy statistic or metric."
            },
            curiosityQuestion: {
              type: Type.STRING,
              description: "A provocative, wonder-inducing follow-up question for the reader to ponder."
            },
            credibleSources: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 primary journals or research institutions associated with this field (e.g., Nature, NASA, ESA, Science, Cell, arXiv)"
            }
          },
          required: [
            "title",
            "subtitle",
            "category",
            "categoryIcon",
            "whatDidTheySee",
            "whyImportant",
            "howDidTheyDoIt",
            "theFascinatingPart",
            "whyShouldICare",
            "mindBendingFact",
            "curiosityQuestion",
            "credibleSources"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: "Failed to generate curiosity breakdown." }, { status: 500 });
    }

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Error in explain API:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred while communicating with Gemini." },
      { status: 500 }
    );
  }
}
