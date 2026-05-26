"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Lightbulb,
  HelpCircle,
  StickyNote,
  Layers,
  Search,
  Trash2,
  Network,
  ChevronDown,
} from "lucide-react";
import { useCanvasStore } from "@/src/store/canvasStore";
import type {
  ResearchNodeData,
  ResearchFlowNode,
  NodeType,
} from "@/src/store/canvasStore";

interface CanvasToolbarProps {
  onAiAction: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleCanvasPanel?: () => void;
  canvasTitle?: string;
}

export default function CanvasToolbar({
  onAiAction,
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleCanvasPanel,
  canvasTitle,
}: CanvasToolbarProps) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { addNode, nodes, selectedNodeId, removeNode, selectNode } =
    useCanvasStore();

  useEffect(() => {
    if (!addMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Element)) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [addMenuOpen]);

  const getNewPosition = () => {
    const count = nodes.length;
    return { x: 200 + (count % 5) * 280, y: 200 + Math.floor(count / 5) * 200 };
  };

  const handleAddNode = useCallback(
    (type: NodeType) => {
      const id = `${type}-${Date.now()}`;
      const position = getNewPosition();
      let nodeData: ResearchNodeData;

      if (type === "paper") {
        nodeData = {
          type: "paper",
          paper: {
            id,
            title: "New Research Paper",
            authors: ["Author, A."],
            year: new Date().getFullYear(),
            venue: "Venue",
            abstract: "Add your paper abstract here.",
            tags: ["research"],
            citations: 0,
            aiSummary: "Add an AI summary for this paper.",
            status: "unread",
          },
        };
      } else if (type === "insight") {
        nodeData = {
          type: "insight",
          insight: {
            id,
            content: "Add your AI insight here.",
            sourceIds: [],
            type: "synthesis",
            confidence: 0.8,
          },
        };
      } else if (type === "question") {
        nodeData = {
          type: "question",
          question: {
            id,
            text: "What is your research question?",
            relatedPaperIds: [],
            answered: false,
          },
        };
      } else if (type === "note") {
        nodeData = {
          type: "note",
          note: {
            id,
            content: "Add your note here.",
            color: "amber",
          },
        };
      } else {
        nodeData = {
          type: "cluster",
          cluster: {
            id,
            label: "New Cluster",
            paperCount: 0,
            theme: "Add theme description",
          },
        };
      }

      const newNode: ResearchFlowNode = {
        id,
        type: "researchNode",
        position,
        data: nodeData,
      };

      addNode(newNode);
      setAddMenuOpen(false);
    },
    [addNode, nodes]
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedNodeId) {
      removeNode(selectedNodeId);
      selectNode(null);
    }
  }, [selectedNodeId, removeNode, selectNode]);

  const addOptions: {
    label: string;
    icon: React.ElementType;
    color: string;
    type: NodeType;
  }[] = [
    {
      label: "Research Paper",
      icon: FileText,
      color: "text-primary",
      type: "paper",
    },
    {
      label: "AI Insight",
      icon: Lightbulb,
      color: "text-violet-500",
      type: "insight",
    },
    {
      label: "Question",
      icon: HelpCircle,
      color: "text-amber-500",
      type: "question",
    },
    { label: "Note", icon: StickyNote, color: "text-amber-600", type: "note" },
    {
      label: "Cluster",
      icon: Layers,
      color: "text-violet-600",
      type: "cluster",
    },
  ];

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-full px-4 pointer-events-none">
      {canvasTitle && (
        <button
          onClick={onToggleCanvasPanel}
          className="pointer-events-auto flex items-center cursor-pointer gap-1.5 px-3 py-1 rounded-full bg-card/90 border border-border shadow-sm text-[12px] text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
        >
          <Network size={11} />
          <span className="max-w-[160px] truncate">{canvasTitle}</span>
          <ChevronDown size={11} />
        </button>
      )}

      <div className="pointer-events-auto glass-toolbar rounded-xl shadow-toolbar flex items-center gap-0.5 px-2 py-1.5 flex-wrap justify-center">
        <ToolbarButton
          icon={Search}
          label="Search (⌘K)"
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            document.dispatchEvent(event);
          }}
        />

        <div className="w-px h-5 bg-border mx-1" />

        <div className="relative" ref={menuRef}>
          <ToolbarButton
            icon={Plus}
            label="Add node"
            onClick={() => setAddMenuOpen((prev) => !prev)}
            active={addMenuOpen}
          />
          {addMenuOpen && (
            <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-xl shadow-panel py-1.5 min-w-[180px] animate-fade-in z-50">
              {addOptions.map((opt) => (
                <button
                  key={`add-${opt.label}`}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-muted transition-colors text-[13px] text-foreground"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddNode(opt.type);
                  }}
                >
                  <opt.icon size={14} className={opt.color} />
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedNodeId && (
          <ToolbarButton
            icon={Trash2}
            label="Delete selected node (Del)"
            onClick={handleDeleteSelected}
          />
        )}

        <button
          onClick={onAiAction}
          className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-lg text-[13px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 active:scale-95"
        >
          <Sparkles size={13} />
          <span className="hidden sm:inline">Ask AI</span>
          <span className="sm:hidden">AI</span>
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton icon={ZoomOut} label="Zoom out" onClick={onZoomOut} />
        <ToolbarButton icon={ZoomIn} label="Zoom in" onClick={onZoomIn} />
        <ToolbarButton
          icon={Maximize2}
          label="Fit to view"
          onClick={onFitView}
        />
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: (e?: React.MouseEvent) => void;
  active?: boolean;
}

function ToolbarButton({
  icon: IconComp,
  label,
  onClick,
  active,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        p-2 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer
        ${
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }
      `}
    >
      {React.createElement(IconComp, { size: 15 })}
    </button>
  );
}
