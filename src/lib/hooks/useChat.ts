"use client";

import { useState, useCallback } from "react";
import {
  getChatCompletion,
  getStreamingChatCompletion,
} from "@/src/lib/ai/chatCompletion";

interface ChatParameters {
  temperature?: number;
  max_tokens?: number;
  onChunk?: (partial: string) => void;
}

export function useChat(
  provider: string,
  model: string,
  streaming: boolean = true
) {
  const [response, setResponse] = useState("");
  const [fullResponse, setFullResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (messages: object[], parameters: ChatParameters = {}) => {
      setResponse("");
      setFullResponse(streaming ? [] : null);
      setIsLoading(true);
      setError(null);

      try {
        if (streaming) {
          await getStreamingChatCompletion(
            provider,
            model,
            messages,
            (chunk: any) => {
              if (typeof chunk === "string" && chunk) {
                setResponse((prev) => {
                  const updated = prev + chunk;
                  parameters.onChunk?.(updated);
                  return updated;
                });
              }
            },
            () => setIsLoading(false),
            (err: Error) => {
              setError(err);
              setIsLoading(false);
            },
            parameters
          );
        } else {
          const result = await getChatCompletion(
            provider,
            model,
            messages,
            parameters
          );
          setFullResponse(result);
          setResponse(
            result?.content || result?.choices?.[0]?.message?.content || ""
          );
          setIsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsLoading(false);
      }
    },
    [provider, model, streaming]
  );

  return { response, fullResponse, isLoading, error, sendMessage };
}
