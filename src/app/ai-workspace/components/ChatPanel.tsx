"use client";
import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, User, RotateCcw } from "lucide-react";
import { useChat } from "@/src/lib/hooks/useChat";
import toast from "react-hot-toast";
import { mockNodes } from "@/src/data/mockPapers";
import { PaperData } from "@/src/store/canvasStore";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const promptSuggestions = [
  "Summarize common findings across selected papers",
  "What contradicts this cluster?",
  "What research directions are missing?",
  "Explain the relationship between attention and reasoning",
  "Which paper is most foundational?",
  "What are the practical implications for LLM design?",
];

interface ChatPanelProps {
  selectedPaperIds: string[];
  initialQuestion?: string;
}

export default function ChatPanel({
  selectedPaperIds,
  initialQuestion,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-000",
      role: "assistant",
      content:
        "I have access to the selected papers. Ask me to synthesize findings, identify contradictions, or explore research gaps.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialQuestionSent = useRef(false);

  const { response, isLoading, error, sendMessage } = useChat(
    "GEMINI",
    "gemini-2.5-flash",
    true
  );

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, response]);

  const buildPaperContext = () => {
    const papers = mockNodes
      .filter(
        (n) =>
          selectedPaperIds.includes(n.id) &&
          n.data.type === "paper" &&
          n.data.paper
      )
      .map((n) => n.data.paper as PaperData);

    if (papers.length === 0) return "No papers selected.";

    return papers
      .map(
        (p) =>
          `Title: ${p.title}\nAuthors: ${p.authors.join(", ")}\nYear: ${
            p.year
          }\nVenue: ${p.venue}\nSummary: ${p.aiSummary}\nTags: ${p.tags.join(
            ", "
          )}`
      )
      .join("\n\n---\n\n");
  };

  const sendUserMessage = async (text: string) => {
    if (!text.trim() || isSending || isLoading) return;

    const userMsgId = `msg-${Date.now()}-user`;
    const assistantMsgId = `msg-${Date.now()}-assistant`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: text.trim() },
      { id: assistantMsgId, role: "assistant", content: "", isStreaming: true },
    ]);
    setInput("");
    setIsSending(true);

    const paperContext = buildPaperContext();
    const systemPrompt = `You are an AI research assistant helping analyze academic papers. You have access to the following research papers:\n\n${paperContext}\n\nProvide thoughtful, well-structured responses. Use markdown formatting with **bold** for emphasis. Be concise but thorough.`;

    const chatHistory = messages
      .filter((m) => m.id !== "msg-000")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    await sendMessage(
      [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: text.trim() },
      ],
      {
        temperature: 0.7,
        max_tokens: 1500,
        onChunk: (partial: string) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: partial,
                  }
                : m
            )
          );
        },
      }
    );
  };

  const lastAssistantMsgRef = useRef<string>("");
  useEffect(() => {
    if (response && isSending) {
      lastAssistantMsgRef.current = response;
      setMessages((prev) =>
        prev.map((m) => (m.isStreaming ? { ...m, content: response } : m))
      );
    }
  }, [response]);

  useEffect(() => {
    if (!isLoading && isSending) {
      setMessages((prev) =>
        prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
      );
      setIsSending(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (initialQuestion && !initialQuestionSent.current) {
      initialQuestionSent.current = true;
      setTimeout(() => sendUserMessage(initialQuestion), 500);
    }
  }, [initialQuestion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div>
          <h1 className="text-[15px] font-semibold text-foreground">
            AI Workspace
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Reasoning across {selectedPaperIds.length} paper
            {selectedPaperIds.length !== 1 ? "s" : ""} · Powered by Gemini
          </p>
        </div>
        <button
          onClick={() => {
            setMessages([
              {
                id: "msg-reset",
                role: "assistant",
                content:
                  "Conversation cleared. Ask me anything about the selected papers.",
              },
            ]);
            initialQuestionSent.current = false;
          }}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Clear conversation"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4 space-y-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-6 pb-3 flex flex-wrap gap-1.5">
          {promptSuggestions.slice(0, 4).map((s, i) => (
            <button
              key={`prompt-${i}`}
              onClick={() => sendUserMessage(s)}
              className="tag-chip bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-[11px]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="px-6 pb-5 flex-shrink-0">
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card shadow-card focus-within:border-primary/50 focus-within:shadow-node transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the selected papers..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-[13px] text-foreground placeholder-muted-foreground outline-none leading-relaxed max-h-32 scrollbar-thin"
            style={{ minHeight: 20 }}
          />
          <button
            onClick={() => sendUserMessage(input)}
            disabled={!input.trim() || isSending || isLoading}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95 flex-shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          ⏎ to send · Shift+⏎ for new line
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] flex items-start gap-2.5">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5">
            <p className="text-[13px] leading-relaxed">{message.content}</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
            <User size={12} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 ${
          message.isStreaming ? "animate-pulse" : ""
        }`}
      >
        <Sparkles size={12} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`prose prose-sm max-w-none text-[13px] leading-relaxed text-foreground ${
            message.isStreaming && !message.content ? "animate-pulse" : ""
          }`}
        >
          {message.content ? (
            <FormattedMessage content={message.content} />
          ) : (
            <span className="text-muted-foreground italic">Thinking...</span>
          )}
        </div>
      </div>
    </div>
  );
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={`line-${i}`} className="h-1" />;

        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong
                key={`bold-${i}-${j}`}
                className="font-semibold text-foreground"
              >
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={`text-${i}-${j}`}>{part}</span>;
        });

        return (
          <p key={`msg-line-${i}`} className="text-[13px] leading-relaxed">
            {rendered}
          </p>
        );
      })}
    </div>
  );
}
