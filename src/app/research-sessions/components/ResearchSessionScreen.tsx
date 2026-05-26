"use client";
import { useState } from "react";
import SessionCard from "./SessionCard";
import SessionDetailPanel from "./SessionDetailPanel";
import { Plus, Search, SlidersHorizontal, Network, X } from "lucide-react";
import { useCanvasStore } from "@/src/store/canvasStore";
import { useRouter } from "next/navigation";

interface Session {
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
  papers: Array<{
    id: string;
    title: string;
    year: number;
    status: "unread" | "reviewing" | "annotated" | "connected" | "synthesized";
  }>;
  coverage: number;
  canvasId?: string;
}

const defaultSessions: Session[] = [
  {
    id: "session-001",
    title: "Transformer Architecture Survey",
    description:
      "Exploring the evolution from RNNs to modern transformer variants and their scaling properties.",
    paperCount: 8,
    insightCount: 5,
    questionCount: 3,
    tags: ["transformers", "architecture", "scaling"],
    lastAccessed: "2 hours ago",
    createdAt: "May 18, 2026",
    status: "active",
    papers: [
      {
        id: "p-s1-001",
        title: "Attention Is All You Need",
        year: 2017,
        status: "synthesized",
      },
      { id: "p-s1-002", title: "BERT", year: 2018, status: "annotated" },
      {
        id: "p-s1-003",
        title: "GPT-4 Technical Report",
        year: 2023,
        status: "reviewing",
      },
      {
        id: "p-s1-004",
        title: "Sparse Transformers",
        year: 2019,
        status: "connected",
      },
    ],
    coverage: 72,
    canvasId: "canvas-001",
  },
  {
    id: "session-002",
    title: "LLM Alignment Research",
    description:
      "Investigating RLHF, Constitutional AI, and emerging alignment techniques for large language models.",
    paperCount: 6,
    insightCount: 8,
    questionCount: 4,
    tags: ["alignment", "RLHF", "safety", "constitutional"],
    lastAccessed: "Yesterday",
    createdAt: "May 15, 2026",
    status: "active",
    papers: [
      {
        id: "p-s2-001",
        title: "Constitutional AI",
        year: 2022,
        status: "synthesized",
      },
      {
        id: "p-s2-002",
        title: "Training Language Models to Follow Instructions",
        year: 2022,
        status: "annotated",
      },
      {
        id: "p-s2-003",
        title: "RLHF: Learning to Summarize from Human Feedback",
        year: 2020,
        status: "connected",
      },
    ],
    coverage: 58,
  },
  {
    id: "session-003",
    title: "Reasoning & Prompting Techniques",
    description:
      "Chain-of-thought, tree-of-thought, and emergent reasoning capabilities at scale.",
    paperCount: 5,
    insightCount: 6,
    questionCount: 7,
    tags: ["reasoning", "prompting", "emergent", "CoT"],
    lastAccessed: "3 days ago",
    createdAt: "May 12, 2026",
    status: "active",
    papers: [
      {
        id: "p-s3-001",
        title: "Chain-of-Thought Prompting",
        year: 2022,
        status: "synthesized",
      },
      {
        id: "p-s3-002",
        title: "Tree of Thoughts",
        year: 2023,
        status: "reviewing",
      },
      {
        id: "p-s3-003",
        title: "Self-Consistency Improves CoT Reasoning",
        year: 2022,
        status: "annotated",
      },
    ],
    coverage: 65,
  },
  {
    id: "session-004",
    title: "Retrieval-Augmented Systems",
    description:
      "Non-parametric memory, RAG architectures, and knowledge-intensive NLP benchmarks.",
    paperCount: 4,
    insightCount: 3,
    questionCount: 2,
    tags: ["RAG", "retrieval", "knowledge", "NLP"],
    lastAccessed: "1 week ago",
    createdAt: "May 8, 2026",
    status: "archived",
    papers: [
      {
        id: "p-s4-001",
        title: "Retrieval-Augmented Generation",
        year: 2020,
        status: "synthesized",
      },
      {
        id: "p-s4-002",
        title: "REALM: Retrieval-Augmented LM",
        year: 2020,
        status: "connected",
      },
    ],
    coverage: 45,
  },
  {
    id: "session-005",
    title: "Multimodal Foundation Models",
    description:
      "Vision-language models, CLIP, Flamingo, and cross-modal reasoning architectures.",
    paperCount: 7,
    insightCount: 4,
    questionCount: 5,
    tags: ["multimodal", "vision", "CLIP", "VLM"],
    lastAccessed: "2 weeks ago",
    createdAt: "Apr 30, 2026",
    status: "active",
    papers: [
      {
        id: "p-s5-001",
        title: "Learning Transferable Visual Models (CLIP)",
        year: 2021,
        status: "synthesized",
      },
      {
        id: "p-s5-002",
        title: "Flamingo: Visual Language Model",
        year: 2022,
        status: "annotated",
      },
      {
        id: "p-s5-003",
        title: "GPT-4V System Card",
        year: 2023,
        status: "reviewing",
      },
    ],
    coverage: 38,
  },
  {
    id: "session-006",
    title: "Emergent Capabilities Survey",
    description:
      "Documenting and understanding discontinuous capability emergence in large language models.",
    paperCount: 3,
    insightCount: 2,
    questionCount: 6,
    tags: ["emergence", "scaling", "capabilities"],
    lastAccessed: "3 weeks ago",
    createdAt: "Apr 22, 2026",
    status: "archived",
    papers: [
      {
        id: "p-s6-001",
        title: "Emergent Abilities of Large Language Models",
        year: 2022,
        status: "annotated",
      },
      {
        id: "p-s6-002",
        title: "Beyond the Imitation Game",
        year: 2022,
        status: "reviewing",
      },
    ],
    coverage: 30,
  },
];

type SortKey = "recent" | "papers" | "insights" | "created";
type FilterKey = "all" | "active" | "archived";

export default function ResearchSessionsScreen() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    "session-001"
  );
  const [sessions, setSessions] = useState<Session[]>(defaultSessions);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionDesc, setNewSessionDesc] = useState("");

  const { createCanvas, switchCanvas, canvases } = useCanvasStore();
  const router = useRouter();

  const filtered = sessions.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.includes(search.toLowerCase()));
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "papers") return b.paperCount - a.paperCount;
    if (sort === "insights") return b.insightCount - a.insightCount;
    return 0;
  });

  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId) || null;

  const handleCreateSession = () => {
    const title = newSessionTitle.trim();
    if (!title) return;
    const canvasId = createCanvas(title);
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const newSession: Session = {
      id: `session-${Date.now()}`,
      title,
      description: newSessionDesc.trim() || "New research session.",
      paperCount: 0,
      insightCount: 0,
      questionCount: 0,
      tags: [],
      lastAccessed: "Just now",
      createdAt: dateStr,
      status: "active",
      papers: [],
      coverage: 0,
      canvasId,
    };
    setSessions((prev) => [newSession, ...prev]);
    setSelectedSessionId(newSession.id);
    setNewSessionTitle("");
    setNewSessionDesc("");
    setShowNewSessionModal(false);
  };

  const handleOpenCanvas = (session: Session) => {
    if (session.canvasId) {
      const canvas = canvases.find((c) => c.id === session.canvasId);
      if (canvas) {
        switchCanvas(session.canvasId);
      }
    }
    router.push("/");
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-8 py-5 border-b border-border flex-shrink-0">
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-semibold text-foreground mb-0.5">
              Research Sessions
            </h1>
            <p className="text-[12px] sm:text-[13px] text-muted-foreground">
              {sessions.length} sessions ·{" "}
              {sessions.reduce((a, s) => a + s.paperCount, 0)} papers total
            </p>
          </div>
          <button
            onClick={() => setShowNewSessionModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 cursor-pointer rounded-lg bg-primary text-primary-foreground text-[12px] sm:text-[13px] font-medium hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Session</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3.5 border-b border-border flex-shrink-0 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[140px] max-w-xs bg-muted rounded-lg px-3 py-2">
            <Search size={13} className="text-muted-foreground flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions..."
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder-muted-foreground outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(["all", "active", "archived"] as FilterKey[]).map((f) => (
              <button
                key={`filter-${f}`}
                onClick={() => setFilter(f)}
                className={`
                  px-2.5 sm:px-3 py-1.5 rounded-md cursor-pointer text-[11px] sm:text-[12px] font-medium transition-colors capitalize
                  ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <SlidersHorizontal size={13} className="text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="text-[12px] text-muted-foreground bg-transparent outline-none cursor-pointer hover:text-foreground transition-colors"
            >
              <option value="recent">Most recent</option>
              <option value="papers">Most papers</option>
              <option value="insights">Most insights</option>
              <option value="created">Date created</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-8 py-6">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                <Search size={20} className="text-muted-foreground" />
              </div>
              <p className="text-[14px] font-medium text-foreground mb-1">
                No sessions found
              </p>
              <p className="text-[12px] text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map((session) => (
                <SessionCard
                  key={`session-card-${session.id}`}
                  session={session}
                  selected={selectedSessionId === session.id}
                  onClick={() =>
                    setSelectedSessionId(
                      session.id === selectedSessionId ? null : session.id
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className={`
          flex-shrink-0 border-l border-border overflow-y-auto scrollbar-thin
          transition-all duration-300 ease-in-out
          ${
            selectedSession
              ? "w-72 sm:w-80 opacity-100"
              : "w-0 opacity-0 overflow-hidden"
          }
        `}
      >
        {selectedSession && (
          <SessionDetailPanel
            session={selectedSession}
            onClose={() => setSelectedSessionId(null)}
            onOpenCanvas={() => handleOpenCanvas(selectedSession)}
          />
        )}
      </div>

      {showNewSessionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNewSessionModal(false);
          }}
        >
          <div className="bg-card border border-border rounded-xl shadow-panel p-5 w-full max-w-sm animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-foreground">
                New Research Session
              </h3>
              <button
                onClick={() => setShowNewSessionModal(false)}
                className="p-1 rounded-md text-muted-foreground cursor-pointer hover:bg-muted"
              >
                <X size={14} />
              </button>
            </div>
            <input
              autoFocus
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              placeholder="Session title..."
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-[13px] text-foreground placeholder-muted-foreground outline-none focus:border-primary mb-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateSession();
                if (e.key === "Escape") setShowNewSessionModal(false);
              }}
            />
            <textarea
              value={newSessionDesc}
              onChange={(e) => setNewSessionDesc(e.target.value)}
              placeholder="Description (optional)..."
              rows={2}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-[13px] text-foreground placeholder-muted-foreground outline-none focus:border-primary mb-3 resize-none"
            />
            <p className="text-[11px] text-muted-foreground mb-3 flex items-center gap-1.5">
              <Network size={11} />A new Research Canvas will be created for
              this session.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCreateSession}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-all"
              >
                Create Session
              </button>
              <button
                onClick={() => setShowNewSessionModal(false)}
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
