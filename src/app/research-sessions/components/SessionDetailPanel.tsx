"use client";

import { X, Sparkles, FileText, Network } from "lucide-react";

interface Paper {
  id: string;
  title: string;
  year: number;
  status: "unread" | "reviewing" | "annotated" | "connected" | "synthesized";
}

interface SessionDetailPanelProps {
  session: {
    id: string;
    title: string;
    description: string;
    paperCount: number;
    insightCount: number;
    questionCount: number;
    tags: string[];
    lastAccessed: string;
    createdAt: string;
    status: "active" | "archived";
    papers: Paper[];
    coverage: number;
    canvasId?: string;
  };
  onClose: () => void;
  onOpenCanvas?: () => void;
}

const statusColors: Record<string, string> = {
  unread: "bg-muted text-muted-foreground",
  reviewing: "bg-amber-50 text-amber-700",
  annotated: "bg-blue-50 text-blue-700",
  connected: "bg-violet-50 text-violet-700",
  synthesized: "bg-emerald-50 text-emerald-700",
};

export default function SessionDetailPanel({
  session,
  onClose,
  onOpenCanvas,
}: SessionDetailPanelProps) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-4">
        <h2 className="text-[14px] font-semibold text-foreground leading-snug">
          {session.title}
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors cursor-pointer flex-shrink-0"
        >
          <X size={13} />
        </button>
      </div>

      <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
        {session.description}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: "Papers", value: session.paperCount },
          { label: "Insights", value: session.insightCount },
          { label: "Questions", value: session.questionCount },
          { label: "Coverage", value: `${session.coverage}%` },
        ].map((m) => (
          <div key={`meta-${m.label}`} className="p-2.5 rounded-lg bg-muted">
            <p className="text-[10px] text-muted-foreground mb-0.5">
              {m.label}
            </p>
            <p className="text-[16px] font-semibold text-foreground font-tabular">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-1 mb-4 pb-4 border-b border-border">
        <div className="flex justify-between">
          <span className="text-[11px] text-muted-foreground">
            Last accessed
          </span>
          <span className="text-[11px] text-foreground">
            {session.lastAccessed}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-muted-foreground">Created</span>
          <span className="text-[11px] text-foreground">
            {session.createdAt}
          </span>
        </div>
        {session.canvasId && (
          <div className="flex justify-between">
            <span className="text-[11px] text-muted-foreground">Canvas</span>
            <span className="text-[11px] text-primary flex items-center gap-1">
              <Network size={10} />
              Linked
            </span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Papers
        </p>
        {session.papers.length === 0 ? (
          <p className="text-[12px] text-muted-foreground italic px-1">
            No papers yet.
          </p>
        ) : (
          <div className="space-y-1.5">
            {session.papers.map((paper) => (
              <div
                key={`dp-${paper.id}`}
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <FileText size={12} className="text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-foreground truncate">
                    {paper.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {paper.year}
                  </p>
                </div>
                <span
                  className={`tag-chip text-[9px] flex-shrink-0 ${
                    statusColors[paper.status]
                  }`}
                >
                  {paper.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={onOpenCanvas}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-all active:scale-95"
        >
          <Network size={13} />
          Open Canvas
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Sparkles size={13} />
          Synthesize session
        </button>
      </div>
    </div>
  );
}
