"use client";
import React, { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Search,
  ChevronDown,
} from "lucide-react";

const insights = [
  {
    id: "ins-001",
    type: "synthesis",
    title: "Attention as universal primitive",
    content:
      "All selected papers build on self-attention as the core computational primitive, suggesting it is the dominant paradigm for at least the next 5 years.",
    papers: ["Attention Is All You Need", "Chain-of-Thought", "RAG"],
    timestamp: "2 min ago",
  },
  {
    id: "ins-002",
    type: "contradiction",
    title: "Scale vs. architecture debate",
    content:
      "RAG challenges the pure scaling hypothesis: architectural choices (retrieval augmentation) may compensate for parametric scale limits.",
    papers: ["GPT-4", "RAG"],
    timestamp: "5 min ago",
  },
  {
    id: "ins-003",
    type: "gap",
    title: "Reasoning under adversarial conditions",
    content:
      "None of the selected papers adequately address whether chain-of-thought reasoning degrades under adversarial prompting or distribution shift.",
    papers: ["Chain-of-Thought"],
    timestamp: "8 min ago",
  },
  {
    id: "ins-004",
    type: "theme",
    title: "Human feedback bottleneck",
    content:
      "Both Constitutional AI and RLHF (GPT-4) identify human labeling as the primary bottleneck. Reducing this dependency is an open research direction.",
    papers: ["GPT-4", "Constitutional AI"],
    timestamp: "12 min ago",
  },
];

const insightConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ElementType }
> = {
  synthesis: {
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-100",
    icon: Sparkles,
  },
  contradiction: {
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-100",
    icon: AlertTriangle,
  },
  gap: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
    icon: Search,
  },
  theme: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    icon: Lightbulb,
  },
};

export default function InsightsSidebar() {
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("ins-001");

  const filtered =
    filter === "all" ? insights : insights.filter((i) => i.type === filter);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-[13px] font-semibold text-foreground mb-0.5">
          Generated Insights
        </h2>
        <p className="text-[11px] text-muted-foreground">
          {insights.length} insights from this session
        </p>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {["all", "synthesis", "contradiction", "gap", "theme"].map((f) => (
          <button
            key={`filter-${f}`}
            onClick={() => setFilter(f)}
            className={`
              tag-chip text-[10px] transition-all capitalize cursor-pointer
              ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((ins) => {
          const cfg = insightConfig[ins.type];
          const expanded = expandedId === ins.id;
          return (
            <div
              key={`insight-card-${ins.id}`}
              className={`rounded-xl border overflow-hidden transition-all duration-200 ${cfg.border}`}
            >
              <button
                className={`w-full p-3 text-left ${cfg.bg} hover:brightness-95 transition-all cursor-pointer`}
                onClick={() => setExpandedId(expanded ? null : ins.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <cfg.icon
                      size={12}
                      className={`${cfg.color} mt-0.5 flex-shrink-0`}
                    />
                    <p
                      className={`text-[12px] font-semibold leading-snug ${cfg.color}`}
                    >
                      {ins.title}
                    </p>
                  </div>
                  <ChevronDown
                    size={12}
                    className={`${
                      cfg.color
                    } flex-shrink-0 mt-0.5 transition-transform duration-200 ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 ml-5">
                  {ins.timestamp}
                </p>
              </button>

              {expanded && (
                <div className="p-3 bg-card border-t border-border">
                  <p className="text-[12px] text-foreground leading-relaxed mb-2.5">
                    {ins.content}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {ins.papers.map((p) => (
                      <span
                        key={`ins-paper-${ins.id}-${p}`}
                        className="tag-chip bg-muted text-muted-foreground text-[10px]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 mb-3">
          <Search size={12} className="text-amber-600" />
          <h3 className="text-[12px] font-semibold text-foreground">
            Research Gaps
          </h3>
        </div>
        <div className="space-y-2">
          {[
            "Adversarial robustness of CoT reasoning",
            "RAG + Constitutional AI composition",
            "Sub-100B CoT emergence mechanisms",
          ].map((gap, i) => (
            <div
              key={`gap-${i}`}
              className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100"
            >
              <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <p className="text-[11px] text-amber-800 leading-snug">{gap}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
