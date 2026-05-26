"use client";

import { FileText, Lightbulb, HelpCircle, Clock, Archive } from "lucide-react";

interface SessionCardProps {
  session: {
    id: string;
    title: string;
    description: string;
    paperCount: number;
    insightCount: number;
    questionCount: number;
    tags: string[];
    lastAccessed: string;
    status: "active" | "archived";
    coverage: number;
  };
  selected: boolean;
  onClick: () => void;
}

export default function SessionCard({
  session,
  selected,
  onClick,
}: SessionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        session-card-hover w-full text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer
        ${
          selected
            ? "border-primary/40 bg-primary/5 shadow-node-selected"
            : "border-border bg-card hover:border-border/80"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <h3 className="text-[14px] font-semibold text-foreground leading-snug">
          {session.title}
        </h3>
        {session.status === "archived" && (
          <Archive
            size={13}
            className="text-muted-foreground flex-shrink-0 mt-0.5"
          />
        )}
      </div>

      <p className="text-[12px] text-muted-foreground leading-relaxed mb-3.5 line-clamp-2">
        {session.description}
      </p>

      <div className="flex items-center gap-4 mb-3.5">
        <div className="flex items-center gap-1.5">
          <FileText size={11} className="text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground font-tabular">
            {session.paperCount} papers
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lightbulb size={11} className="text-violet-500" />
          <span className="text-[11px] text-muted-foreground font-tabular">
            {session.insightCount} insights
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <HelpCircle size={11} className="text-amber-500" />
          <span className="text-[11px] text-muted-foreground font-tabular">
            {session.questionCount} questions
          </span>
        </div>
      </div>

      <div className="mb-3.5">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">Coverage</span>
          <span className="text-[10px] text-muted-foreground font-tabular">
            {session.coverage}%
          </span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              session.coverage > 60
                ? "bg-emerald-400"
                : session.coverage > 40
                ? "bg-amber-400"
                : "bg-border"
            }`}
            style={{ width: `${session.coverage}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {session.tags.slice(0, 3).map((tag) => (
          <span
            key={`stag-${session.id}-${tag}`}
            className="tag-chip bg-muted text-muted-foreground text-[10px]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1.5 pt-2.5 border-t border-border">
        <Clock size={11} className="text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground">
          {session.lastAccessed}
        </span>
      </div>
    </button>
  );
}
