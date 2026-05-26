import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

function buildPrompt(messages: Message[]) {
  return messages
    .map((m) => {
      if (m.role === "system") {
        return `System: ${m.content}`;
      }

      if (m.role === "assistant") {
        return `Assistant: ${m.content}`;
      }

      return `User: ${m.content}`;
    })
    .join("\n\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { messages, stream = false, model = "gemini-2.5-flash" } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(messages);

    const geminiModel = genAI.getGenerativeModel({
      model,
    });

    if (stream) {
      const result = await geminiModel.generateContentStream(prompt);

      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async start(controller) {
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "start",
                })}\n\n`
              )
            );

            for await (const chunk of result.stream) {
              const text = chunk.text();

              if (text) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "chunk",
                      chunk: text,
                    })}\n\n`
                  )
                );
              }
            }

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "done",
                })}\n\n`
              )
            );

            controller.close();
          } catch (error) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "error",
                  error:
                    error instanceof Error ? error.message : "Streaming error",
                })}\n\n`
              )
            );

            controller.close();
          }
        },
      });

      return new NextResponse(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const result = await geminiModel.generateContent(prompt);

    const response = await result.response;

    return NextResponse.json({
      content: response.text(),
    });
  } catch (error) {
    console.error("Gemini Route Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
