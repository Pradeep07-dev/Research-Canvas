"use client";
import React, { useEffect, useRef, useState } from "react";
import { Check, FileText, RotateCcw, Send, Sparkles, User } from "lucide-react";
import toast from "react-hot-toast";

interface AIWorkspaceScreenProps {
  initialQuestion?: string;
}

const allPapers = [
  {
    id: "paper-001",
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
    tags: ["transformers", "attention"],
  },
  {
    id: "paper-002",
    title: "GPT-4 Technical Report",
    authors: "OpenAI",
    year: 2023,
    tags: ["LLM", "scaling"],
  },
  {
    id: "paper-003",
    title: "Chain-of-Thought Prompting",
    authors: "Wei et al.",
    year: 2022,
    tags: ["reasoning", "prompting"],
  },
  {
    id: "paper-004",
    title: "Retrieval-Augmented Generation",
    authors: "Lewis et al.",
    year: 2020,
    tags: ["RAG", "retrieval"],
  },
  {
    id: "paper-005",
    title: "Constitutional AI",
    authors: "Bai et al.",
    year: 2022,
    tags: ["alignment", "safety"],
  },
];

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

export default function AIWorkspaceScreen({
  initialQuestion,
}: AIWorkspaceScreenProps) {
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([
    "paper-001",
    "paper-003",
    "paper-004",
  ]);

  const togglePaper = (id: string) => {
    setSelectedPaperIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

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

  const { response, isLoading, error, sendMessage }: any = [];

  const mockNodes: any = [];
  const PaperData: any = [];

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

    sendMessage(
      [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: text.trim() },
      ],
      { temperature: 0.7, max_tokens: 1500 }
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
    <div className="flex h-full overflow-hidden bg-background">
      <div className="w-64 flex-shrink-0 border-r border-border overflow-y-auto scrollbar-thin">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-[13px] font-semibold text-foreground mb-0.5">
              Paper Context
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {selectedPaperIds.length} of {allPapers.length} selected
            </p>
          </div>

          <div className="space-y-1.5">
            {allPapers.map((paper) => {
              const selected = selectedPaperIds.includes(paper.id);
              return (
                <button
                  key={`ctx-${paper.id}`}
                  onClick={() => togglePaper(paper.id)}
                  className={`
                w-full text-left p-2.5 rounded-lg border transition-all duration-150
                ${
                  selected
                    ? "border-primary/30 bg-primary/5"
                    : "border-border hover:bg-muted"
                }
              `}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`
                  w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                  ${selected ? "bg-primary" : "border border-border bg-card"}
                `}
                    >
                      {selected && (
                        <Check size={10} className="text-primary-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-[12px] font-medium leading-snug mb-0.5 ${
                          selected ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {paper.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {paper.authors} · {paper.year}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {paper.tags.map((tag) => (
                          <span
                            key={`ptag-${paper.id}-${tag}`}
                            className="tag-chip bg-muted text-muted-foreground text-[9px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="p-3 rounded-xl bg-muted">
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText size={11} className="text-muted-foreground" />
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Coverage
                </p>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Architecture", pct: 80 },
                  { label: "Alignment", pct: 40 },
                  { label: "Prompting", pct: 60 },
                ].map((item) => (
                  <div key={`cov-${item.label}`}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[10px] text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-tabular">
                        {item.pct}%
                      </span>
                    </div>
                    <div className="h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
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
            <div className="flex items-end gap-3 p-3.5 rounded-xl border border-border bg-card shadow-card focus-within:border-primary/50 focus-within:shadow-node transition-all">
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
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
              ⏎ to send · Shift+⏎ for new line
            </p>
          </div>
        </div>
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
