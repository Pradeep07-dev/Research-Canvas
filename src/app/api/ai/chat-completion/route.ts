import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

type Message = {
  role: "user" | "model" | "system";
  content: string;
};

function formatErrorResponse(error: unknown) {
  return {
    error: "Gemini API Error",
    details: error instanceof Error ? error.message : String(error),
    statusCode: 500,
  };
}

function convertMessagesToPrompt(messages: Message[]) {
  return messages
    .map((message) => {
      return `${message.role.toUpperCase()}: ${message.content}`;
    })
    .join("\n\n");
}

export async function POST(request: NextRequest) {
  let body: any = {};

  try {
    body = await request.json();

    const { messages, stream = false, model = "gemini-2.5-flash" } = body;

    if (!messages?.length) {
      return NextResponse.json(
        {
          error: "Messages are required",
          details: "Request validation failed",
        },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "Gemini API key is missing",
          details: "Add GEMINI_API_KEY to .env.local",
        },
        { status: 500 }
      );
    }

    const prompt = convertMessagesToPrompt(messages);

    if (stream) {
      const response = await genAI.models.generateContentStream({
        model,
        contents: prompt,
      });

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

            for await (const chunk of response) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "chunk",
                    chunk: chunk.text,
                  })}\n\n`
                )
              );
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
            const formatted = formatErrorResponse(error);

            console.error("Streaming Error:", formatted);

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "error",
                  error: formatted.error,
                  details: formatted.details,
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

    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    return NextResponse.json({
      content: response.text,
    });
  } catch (error) {
    const formatted = formatErrorResponse(error);

    console.error("API Route Error:", formatted);

    return NextResponse.json(
      {
        error: formatted.error,
        details: formatted.details,
      },
      { status: formatted.statusCode }
    );
  }
}
