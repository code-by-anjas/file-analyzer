// /app/api/ai/route.ts
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const prompt = formData.get("prompt") as string;

  if (!file || !prompt) {
    return NextResponse.json(
      { error: "Missing file or prompt" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");

  const result = await generateText({
    model: google("gemini-1.5-flash"),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "file", data: base64String, mimeType: file.type },
        ],
      },
    ],
  });

  return NextResponse.json({ output: result.text });
}
