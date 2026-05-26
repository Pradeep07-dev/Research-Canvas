"use client";
import { useState } from "react";
import PaperContextPanel from "./PaperContextPanel";
import ChatPanel from "./ChatPanel";
import InsightsSidebar from "./InsightsSidebar";

interface AIWorkspaceScreenProps {
  initialQuestion?: string;
}

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

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <div className="w-64 flex-shrink-0 border-r border-border overflow-y-auto scrollbar-thin">
        <PaperContextPanel
          selectedIds={selectedPaperIds}
          onToggle={togglePaper}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <ChatPanel
          selectedPaperIds={selectedPaperIds}
          initialQuestion={initialQuestion}
        />
      </div>

      <div className="w-72 flex-shrink-0 border-l border-border overflow-y-auto scrollbar-thin">
        <InsightsSidebar />
      </div>
    </div>
  );
}
