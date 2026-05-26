"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import CanvasToolbar from "./CanvasToolbar";
import RightContextPanel from "./RightContextPanel";
import { useCanvasStore } from "@/src/store/canvasStore";

import type { ResearchFlowNode } from "@/src/store/canvasStore";
import { Network, Plus, Trash2, X } from "lucide-react";
import { Edge, ReactFlowInstance } from "@xyflow/react";

const CanvasFlow = dynamic(() => import("./CanvasFlow"), { ssr: false });

export default function CanvasScreen() {
  const {
    rightPanelOpen,
    canvases,
    activeCanvasId,
    createCanvas,
    switchCanvas,
    deleteCanvas,
  } = useCanvasStore();
  const [aiBarOpen, setAiBarOpen] = useState(false);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance<
    ResearchFlowNode,
    Edge
  > | null>(null);
  const [showNewCanvasModal, setShowNewCanvasModal] = useState(false);
  const [newCanvasTitle, setNewCanvasTitle] = useState("");
  const [canvasPanelOpen, setCanvasPanelOpen] = useState(false);
  const router = useRouter();

  const handleZoomIn = useCallback(() => {
    flowInstance?.zoomIn({ duration: 300 });
  }, [flowInstance]);

  const handleZoomOut = useCallback(() => {
    flowInstance?.zoomOut({ duration: 300 });
  }, [flowInstance]);

  const handleFitView = useCallback(() => {
    flowInstance?.fitView({ padding: 0.15, duration: 400 });
  }, [flowInstance]);

  const handlePaneClick = useCallback(() => {
    setAiBarOpen(false);
  }, []);

  const handleAskAI = useCallback(
    (question: string) => {
      setAiBarOpen(false);
      const encoded = encodeURIComponent(question);
      router.push(`/ai-workspace?q=${encoded}`);
    },
    [router]
  );

  const handleCreateCanvas = () => {
    const title = newCanvasTitle.trim() || `New Canvas ${canvases.length + 1}`;
    createCanvas(title);
    setNewCanvasTitle("");
    setShowNewCanvasModal(false);
    setCanvasPanelOpen(false);
  };

  const activeCanvas = canvases.find((c) => c.id === activeCanvasId);

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      {canvasPanelOpen && (
        <div className="absolute left-0 top-0 h-full z-40 w-64 bg-card border-r border-border flex flex-col shadow-panel animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-[13px] font-semibold text-foreground">
              Research Canvases
            </span>
            <button
              onClick={() => setCanvasPanelOpen(false)}
              className="p-1 rounded-md cursor-pointer text-muted-foreground hover:bg-muted"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
            {canvases.map((canvas) => (
              <div
                key={canvas.id}
                className={`flex items-center gap-2 px-3 py-2.5 mx-2 rounded-lg cursor-pointer group transition-colors ${
                  canvas.id === activeCanvasId
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground"
                }`}
                onClick={() => {
                  switchCanvas(canvas.id);
                  setCanvasPanelOpen(false);
                }}
              >
                <Network size={13} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium truncate">
                    {canvas.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {canvas.nodes.length} nodes · {canvas.lastAccessed}
                  </p>
                </div>
                {canvases.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCanvas(canvas.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 cursor-pointer rounded text-muted-foreground hover:text-destructive transition-all"
                    title="Delete canvas"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border">
            <button
              onClick={() => setShowNewCanvasModal(true)}
              className="w-full flex items-center justify-center cursor-pointer gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-all"
            >
              <Plus size={13} />
              New Canvas
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 relative">
        <CanvasFlow
          onFlowReady={setFlowInstance}
          onPaneClick={handlePaneClick}
        />
        <CanvasToolbar
          onAiAction={() => setAiBarOpen(true)}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          onToggleCanvasPanel={() => setCanvasPanelOpen(!canvasPanelOpen)}
          canvasTitle={activeCanvas?.title || "Research Canvas"}
        />
      </div>

      <div
        className={`
          absolute right-0 top-0 h-full z-30 flex-shrink-0
          transition-all duration-300 ease-in-out
          ${
            rightPanelOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none"
          }
        `}
        style={{ width: 340 }}
      >
        <RightContextPanel />
      </div>

      {aiBarOpen && (
        <div
          className="absolute inset-0 z-40 flex items-end justify-center pb-8 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAiBarOpen(false);
          }}
        >
          <div
            className="animate-slide-up w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AIActionBar
              onClose={() => setAiBarOpen(false)}
              onAskAI={handleAskAI}
            />
          </div>
        </div>
      )}

      {showNewCanvasModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNewCanvasModal(false);
          }}
        >
          <div className="bg-card border border-border rounded-xl shadow-panel p-5 w-full max-w-sm animate-fade-in">
            <h3 className="text-[14px] font-semibold text-foreground mb-3">
              Create New Canvas
            </h3>
            <input
              autoFocus
              value={newCanvasTitle}
              onChange={(e) => setNewCanvasTitle(e.target.value)}
              placeholder="Canvas title..."
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-[13px] text-foreground placeholder-muted-foreground outline-none focus:border-primary mb-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateCanvas();
                if (e.key === "Escape") setShowNewCanvasModal(false);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateCanvas}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-all"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewCanvasModal(false)}
                className="flex-1 py-2 rounded-lg border border-border text-[13px] text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AIActionBar({
  onClose,
  onAskAI,
}: {
  onClose: () => void;
  onAskAI: (q: string) => void;
}) {
  const [query, setQuery] = useState("");
  const suggestions = [
    "Summarize common findings across selected papers",
    "What contradicts this cluster?",
    "Identify missing research directions",
    "Explain the relationship between these concepts",
  ];

  const handleSubmit = () => {
    const q = query.trim();
    if (q) onAskAI(q);
  };

  return (
    <div className="glass-toolbar rounded-xl shadow-toolbar px-4 py-3">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI about the canvas..."
          className="flex-1 bg-transparent text-[14px] text-foreground placeholder-muted-foreground outline-none"
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && query.trim()) handleSubmit();
          }}
        />
        <kbd
          onClick={onClose}
          className="text-[10px] text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5 cursor-pointer font-mono"
        >
          esc
        </kbd>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, i) => (
          <button
            key={`ai-suggestion-${i}`}
            onClick={() => onAskAI(s)}
            className="tag-chip bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-[11px]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
