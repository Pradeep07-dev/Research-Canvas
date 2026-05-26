"use client";

import { FileText, Check } from "lucide-react";

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

interface PaperContextPanelProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function PaperContextPanel({
  selectedIds,
  onToggle,
}: PaperContextPanelProps) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-[13px] font-semibold text-foreground mb-0.5">
          Paper Context
        </h2>
        <p className="text-[11px] text-muted-foreground">
          {selectedIds.length} of {allPapers.length} selected
        </p>
      </div>

      <div className="space-y-1.5">
        {allPapers.map((paper) => {
          const selected = selectedIds.includes(paper.id);
          return (
            <button
              key={`ctx-${paper.id}`}
              onClick={() => onToggle(paper.id)}
              className={`
                w-full text-left p-2.5 rounded-lg border transition-all duration-150 cursor-pointer
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
  );
}
