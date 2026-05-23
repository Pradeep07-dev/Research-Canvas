"use client";

import { useState } from "react";
import {
  Archive,
  Clock,
  FileText,
  HelpCircle,
  Lightbulb,
  Network,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

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

  const statusColors: Record<string, string> = {
    unread: "bg-muted text-muted-foreground",
    reviewing: "bg-amber-50 text-amber-700",
    annotated: "bg-blue-50 text-blue-700",
    connected: "bg-violet-50 text-violet-700",
    synthesized: "bg-emerald-50 text-emerald-700",
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
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] sm:text-[13px] font-medium hover:bg-primary/90 transition-all active:scale-95"
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
                  px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-[12px] font-medium transition-colors capitalize
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
                <button
                  key={session.id}
                  onClick={() =>
                    setSelectedSessionId(
                      session.id === selectedSessionId ? null : session.id
                    )
                  }
                  className={`
        session-card-hover w-full text-left p-5 rounded-xl border transition-all duration-200
        ${
          selectedSessionId === session.id
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
                      <span className="text-[10px] text-muted-foreground">
                        Coverage
                      </span>
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
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-4">
              <h2 className="text-[14px] font-semibold text-foreground leading-snug">
                {selectedSession.title}
              </h2>
              <button
                onClick={() => setSelectedSessionId(null)}
                className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors flex-shrink-0"
              >
                <X size={13} />
              </button>
            </div>

            <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
              {selectedSession.description}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "Papers", value: selectedSession.paperCount },
                { label: "Insights", value: selectedSession.insightCount },
                { label: "Questions", value: selectedSession.questionCount },
                { label: "Coverage", value: `${selectedSession.coverage}%` },
              ].map((m) => (
                <div
                  key={`meta-${m.label}`}
                  className="p-2.5 rounded-lg bg-muted"
                >
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
                  {selectedSession.lastAccessed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Created
                </span>
                <span className="text-[11px] text-foreground">
                  {selectedSession.createdAt}
                </span>
              </div>
              {selectedSession.canvasId && (
                <div className="flex justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Canvas
                  </span>
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
              {selectedSession.papers.length === 0 ? (
                <p className="text-[12px] text-muted-foreground italic px-1">
                  No papers yet.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {selectedSession.papers.map((paper) => (
                    <div
                      key={`dp-${paper.id}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <FileText
                        size={12}
                        className="text-primary flex-shrink-0"
                      />
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
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-all active:scale-95">
                <Network size={13} />
                Open Canvas
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Sparkles size={13} />
                Synthesize session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
