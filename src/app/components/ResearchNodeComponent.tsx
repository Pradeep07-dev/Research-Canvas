"use client";

import React, { memo } from "react";

import { Handle, Position, type NodeProps } from "@xyflow/react";

import {
  FileText,
  Lightbulb,
  HelpCircle,
  StickyNote,
  Layers,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  X,
} from "lucide-react";

import type { ResearchFlowNode } from "@/src/store/canvasStore";
import { useCanvasStore } from "@/src/store/canvasStore";

interface DeleteButtonProps {
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function DeleteButton({ onDelete }: DeleteButtonProps) {
  return (
    <button
      onClick={onDelete}
      className="absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center cursor-pointer justify-center rounded-full bg-destructive text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-600"
      title="Delete node"
    >
      <X size={10} />
    </button>
  );
}

function ResearchNodeComponent({
  data,
  selected,
  id,
}: NodeProps<ResearchFlowNode>) {
  const { removeNode, selectNode } = useCanvasStore();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    removeNode(id);
    selectNode(null);
  };

  const baseClass = `
    group relative cursor-pointer select-none rounded-xl
    shadow-node transition-all duration-200
    ${
      selected
        ? "shadow-node-selected ring-2 ring-primary ring-offset-1"
        : "hover:shadow-md"
    }
  `;

  const renderHandles = (color: string) => (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: color,
          border: "none",
          width: 8,
          height: 8,
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: color,
          border: "none",
          width: 8,
          height: 8,
        }}
      />

      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: color,
          border: "none",
          width: 8,
          height: 8,
        }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: color,
          border: "none",
          width: 8,
          height: 8,
        }}
      />
    </>
  );

  if (data.type === "paper" && data.paper) {
    const p = data.paper;

    const statusColors: Record<string, string> = {
      unread: "bg-muted text-muted-foreground",
      reviewing: "border border-amber-200 bg-amber-50 text-amber-700",
      annotated: "border border-blue-200 bg-blue-50 text-blue-700",
      connected: "border border-violet-200 bg-violet-50 text-violet-700",
      synthesized: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    };

    return (
      <div className={`${baseClass} node-paper`} style={{ width: 260 }}>
        <DeleteButton onDelete={handleDelete} />

        {renderHandles("#C4C4F0")}

        <div className="p-3.5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex flex-shrink-0 items-center gap-1.5">
              <FileText size={12} className="text-primary" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Paper
              </span>
            </div>

            <div className={`tag-chip text-[10px] ${statusColors[p.status]}`}>
              {p.status}
            </div>
          </div>

          <h3 className="mb-1.5 line-clamp-2 text-[13px] font-semibold leading-snug text-foreground">
            {p.title}
          </h3>

          <p className="mb-2 truncate text-[11px] text-muted-foreground">
            {p.authors.slice(0, 2).join(", ")}

            {p.authors.length > 2 ? " et al." : ""}

            {" · "}

            {p.year}

            {" · "}

            {p.venue}
          </p>

          <p className="mb-2.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {p.aiSummary}
          </p>

          <div className="mb-2.5 flex flex-wrap gap-1">
            {p.tags.slice(0, 3).map((tag) => (
              <span
                key={`${p.id}-${tag}`}
                className="tag-chip bg-muted text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="font-tabular text-[10px] text-muted-foreground">
              {p.citations.toLocaleString()} citations
            </span>

            <button className="text-muted-foreground transition-colors hover:text-primary">
              <ExternalLink size={11} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (data.type === "insight" && data.insight) {
    const ins = data.insight;

    const insightTypeConfig: Record<
      string,
      {
        color: string;
        icon: React.ElementType;
        label: string;
      }
    > = {
      synthesis: {
        color: "text-violet-600",
        icon: Sparkles,
        label: "Synthesis",
      },

      contradiction: {
        color: "text-rose-600",
        icon: AlertTriangle,
        label: "Contradiction",
      },

      gap: {
        color: "text-amber-600",
        icon: HelpCircle,
        label: "Gap",
      },

      theme: {
        color: "text-emerald-600",
        icon: Lightbulb,
        label: "Theme",
      },
    };

    const cfg = insightTypeConfig[ins.type] || insightTypeConfig.synthesis;

    return (
      <div className={`${baseClass} node-insight`} style={{ width: 240 }}>
        <DeleteButton onDelete={handleDelete} />

        {renderHandles("#A8A8E8")}

        <div className="p-3.5">
          <div className="mb-2 flex items-center gap-1.5">
            <cfg.icon size={12} className={cfg.color} />

            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.color}`}
            >
              AI {cfg.label}
            </span>

            <span className="ml-auto font-tabular text-[10px] text-muted-foreground">
              {Math.round(ins.confidence * 100)}%
            </span>
          </div>

          <p className="line-clamp-4 text-[12px] leading-relaxed text-foreground">
            {ins.content}
          </p>

          <p className="mt-2 text-[10px] text-muted-foreground">
            From {ins.sourceIds.length} paper
            {ins.sourceIds.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    );
  }

  if (data.type === "question" && data.question) {
    const q = data.question;

    return (
      <div className={`${baseClass} node-question`} style={{ width: 220 }}>
        <DeleteButton onDelete={handleDelete} />

        {renderHandles("#F5D89A")}

        <div className="p-3.5">
          <div className="mb-2 flex items-center gap-1.5">
            <HelpCircle size={12} className="text-amber-600" />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              Question
            </span>

            {q.answered && (
              <span className="ml-auto text-[10px] font-medium text-emerald-600">
                Answered
              </span>
            )}
          </div>

          <p className="line-clamp-3 text-[12px] leading-snug text-foreground">
            {q.text}
          </p>
        </div>
      </div>
    );
  }

  if (data.type === "note" && data.note) {
    const n = data.note;

    const noteColors: Record<string, string> = {
      amber: "border-amber-200 bg-amber-50",
      blue: "border-blue-200 bg-blue-50",
      green: "border-emerald-200 bg-emerald-50",
    };

    return (
      <div
        className={`${baseClass} border ${
          noteColors[n.color] || noteColors.amber
        }`}
        style={{ width: 200 }}
      >
        <DeleteButton onDelete={handleDelete} />

        {renderHandles("#F5D89A")}

        <div className="p-3.5">
          <div className="mb-2 flex items-center gap-1.5">
            <StickyNote size={12} className="text-amber-600" />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              Note
            </span>
          </div>

          <p className="text-[12px] leading-relaxed text-foreground">
            {n.content}
          </p>
        </div>
      </div>
    );
  }

  if (data.type === "cluster" && data.cluster) {
    const c = data.cluster;

    return (
      <div className={`${baseClass} node-cluster`} style={{ width: 180 }}>
        <DeleteButton onDelete={handleDelete} />

        {renderHandles("#D4C4F0")}

        <div className="p-3.5">
          <div className="mb-2 flex items-center gap-1.5">
            <Layers size={12} className="text-violet-600" />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">
              Cluster
            </span>
          </div>

          <p className="mb-1 text-[13px] font-semibold text-foreground">
            {c.label}
          </p>

          <p className="text-[11px] text-muted-foreground">{c.theme}</p>

          <p className="mt-1.5 text-[10px] font-medium text-violet-600">
            {c.paperCount} papers
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default memo(ResearchNodeComponent);
