"use client";
import React, { useState } from "react";
import {
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Trash2,
  Network,
  ChevronDown,
  X,
} from "lucide-react";
import { useCanvasStore } from "@/src/store/canvasStore";

export default function CanvasScreen() {
  const [showNewCanvasModal, setShowNewCanvasModal] = useState(false);
  const [newCanvasTitle, setNewCanvasTitle] = useState("");
  const [canvasPanelOpen, setCanvasPanelOpen] = useState(false);

  const { canvases, activeCanvasId, createCanvas, switchCanvas } =
    useCanvasStore();

  const handleCreateCanvas = () => {
    const title = newCanvasTitle.trim() || `New Canvas ${canvases.length + 1}`;
    createCanvas(title);
    setNewCanvasTitle("");
    setShowNewCanvasModal(false);
    setCanvasPanelOpen(false);
  };

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
              className="p-1 rounded-md text-muted-foreground hover:bg-muted"
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
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all"
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
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-all"
            >
              <Plus size={13} />
              New Canvas
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-full px-4 pointer-events-none">
        <button className="pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/90 border border-border shadow-sm text-[12px] text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
          <Network size={11} />
          <span className="max-w-[160px] truncate">Research Canvas</span>
          <ChevronDown size={11} />
        </button>

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

          <div className="w-px h-5 bg-border mx-1" />

          <ToolbarButton icon={ZoomOut} label="Zoom out" />
          <ToolbarButton icon={ZoomIn} label="Zoom in" />
          <ToolbarButton icon={Maximize2} label="Fit to view" />
        </div>
      </div>

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
        p-2 rounded-lg transition-all duration-150 active:scale-95
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
