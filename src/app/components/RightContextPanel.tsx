"use client";
import React, { useState } from "react";
import { useCanvasStore } from "@/src/store/canvasStore";
import { mockNodes } from "@/src/data/mockPapers";
import {
  X,
  FileText,
  Sparkles,
  Tag,
  BookOpen,
  ExternalLink,
  Lightbulb,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const tabs = ["Overview", "Summary", "Citations", "Related"];

export default function RightContextPanel() {
  const { selectedNodeId, setRightPanel } = useCanvasStore();
  const [activeTab, setActiveTab] = useState("Overview");
  const [citationsOpen, setCitationsOpen] = useState(true);

  const node = mockNodes.find((n: any) => n.id === selectedNodeId);

  if (!node) return null;

  const { data } = node;

  return (
    <div className="h-full bg-card border-l border-border flex flex-col shadow-panel">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <NodeTypeIcon type={data.type} />
          <span className="text-[13px] font-semibold text-foreground capitalize">
            {data.type}
          </span>
        </div>
        <button
          onClick={() => setRightPanel(false)}
          className="p-1.5 rounded-md text-muted-foreground cursor-pointer hover:bg-muted hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {data.type === "paper" && (
        <div className="flex items-center gap-0 px-4 border-b border-border flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={`panel-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`
                px-3 py-2.5 text-[12px] font-medium border-b-2 transition-colors -mb-px
                ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {data.type === "paper" && data.paper && (
          <PaperPanelContent
            paper={data.paper}
            activeTab={activeTab}
            citationsOpen={citationsOpen}
            setCitationsOpen={setCitationsOpen}
          />
        )}
        {data.type === "insight" && data.insight && (
          <InsightPanelContent insight={data.insight} />
        )}
        {data.type === "question" && data.question && (
          <QuestionPanelContent question={data.question} />
        )}
        {data.type === "note" && data.note && (
          <div>
            <p className="text-[13px] text-foreground leading-relaxed">
              {data.note.content}
            </p>
          </div>
        )}
        {data.type === "cluster" && data.cluster && (
          <ClusterPanelContent cluster={data.cluster} />
        )}
      </div>
    </div>
  );
}

function NodeTypeIcon({ type }: { type: string }) {
  const icons: Record<string, React.ElementType> = {
    paper: FileText,
    insight: Lightbulb,
    question: HelpCircle,
    note: BookOpen,
    cluster: Tag,
  };
  const colors: Record<string, string> = {
    paper: "text-primary",
    insight: "text-violet-600",
    question: "text-amber-600",
    note: "text-emerald-600",
    cluster: "text-violet-500",
  };
  const Icon = icons[type] || FileText;
  return <Icon size={14} className={colors[type] || "text-muted-foreground"} />;
}

function PaperPanelContent({
  paper,
  activeTab,
  citationsOpen,
  setCitationsOpen,
}: {
  paper: import("@/src/store/canvasStore").PaperData;
  activeTab: string;
  citationsOpen: boolean;
  setCitationsOpen: (v: boolean) => void;
}) {
  if (activeTab === "Overview") {
    const statusColors: Record<string, string> = {
      unread: "bg-muted text-muted-foreground",
      reviewing: "bg-amber-50 text-amber-700",
      annotated: "bg-blue-50 text-blue-700",
      connected: "bg-violet-50 text-violet-700",
      synthesized: "bg-emerald-50 text-emerald-700",
    };
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground leading-snug mb-1.5 text-balance">
            {paper.title}
          </h2>
          <p className="text-[12px] text-muted-foreground">
            {paper.authors.join(", ")} · {paper.year} · {paper.venue}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`tag-chip text-[11px] ${statusColors[paper.status]}`}
          >
            {paper.status}
          </span>
          <span className="text-[11px] text-muted-foreground font-tabular">
            {paper.citations.toLocaleString()} citations
          </span>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Abstract
          </p>
          <p className="text-[12px] text-foreground leading-relaxed">
            {paper.abstract}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Tags
          </p>
          <div className="flex flex-wrap gap-1">
            {paper.tags.map((tag: any) => (
              <span
                key={`ptag-${paper.id}-${tag}`}
                className="tag-chip bg-muted text-muted-foreground text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <ExternalLink size={12} />
          Open on arXiv
        </button>
      </div>
    );
  }

  if (activeTab === "Summary") {
    return (
      <div className="space-y-4">
        <div className="insight-gradient rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles size={13} className="text-violet-600" />
            <span className="text-[11px] font-semibold text-violet-700 uppercase tracking-wider">
              AI Summary
            </span>
          </div>
          <p className="text-[13px] text-foreground leading-relaxed">
            {paper.aiSummary}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Key Contributions
          </p>
          {[
            "Novel Transformer architecture eliminating recurrence",
            "Multi-head self-attention mechanism",
            "Positional encoding for sequence order",
            "State-of-the-art on WMT14 translation",
          ]
            .slice(0, 3)
            .map((c, i) => (
              <div key={`contrib-${i}`} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p className="text-[12px] text-foreground">{c}</p>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (activeTab === "Citations") {
    const cites = [
      {
        id: "cite-001",
        title: "BERT: Pre-training of Deep Bidirectional Transformers",
        authors: "Devlin et al.",
        year: 2018,
        count: 52341,
      },
      {
        id: "cite-002",
        title: "Language Models are Few-Shot Learners (GPT-3)",
        authors: "Brown et al.",
        year: 2020,
        count: 28943,
      },
      {
        id: "cite-003",
        title: "An Image is Worth 16×16 Words (ViT)",
        authors: "Dosovitskiy et al.",
        year: 2020,
        count: 18742,
      },
      {
        id: "cite-004",
        title: "RoBERTa: A Robustly Optimized BERT",
        authors: "Liu et al.",
        year: 2019,
        count: 14201,
      },
    ];
    return (
      <div>
        <button
          className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 hover:text-foreground transition-colors"
          onClick={() => setCitationsOpen(!citationsOpen)}
        >
          {citationsOpen ? (
            <ChevronDown size={12} />
          ) : (
            <ChevronRight size={12} />
          )}
          Cited By ({paper.citations.toLocaleString()})
        </button>
        {citationsOpen && (
          <div className="space-y-2">
            {cites.map((c) => (
              <div
                key={`cite-item-${c.id}`}
                className="p-2.5 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
              >
                <p className="text-[12px] font-medium text-foreground leading-snug mb-1">
                  {c.title}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">
                    {c.authors} · {c.year}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-tabular">
                    {c.count.toLocaleString()} cites
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "Related") {
    const related = [
      {
        id: "rel-001",
        title: "BERT: Pre-training of Deep Bidirectional Transformers",
        similarity: 0.94,
      },
      { id: "rel-002", title: "Sparse Transformers", similarity: 0.88 },
      {
        id: "rel-003",
        title: "Longformer: The Long-Document Transformer",
        similarity: 0.82,
      },
    ];
    return (
      <div className="space-y-2">
        {related.map((r) => (
          <div
            key={`rel-${r.id}`}
            className="p-3 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
          >
            <p className="text-[12px] font-medium text-foreground leading-snug mb-1.5">
              {r.title}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${r.similarity * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-tabular">
                {Math.round(r.similarity * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function InsightPanelContent({
  insight,
}: {
  insight: import("@/src/store/canvasStore").InsightData;
}) {
  const typeConfig: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    synthesis: {
      label: "Synthesis",
      color: "text-violet-700",
      bg: "bg-violet-50",
    },
    contradiction: {
      label: "Contradiction",
      color: "text-rose-700",
      bg: "bg-rose-50",
    },
    gap: { label: "Research Gap", color: "text-amber-700", bg: "bg-amber-50" },
    theme: { label: "Theme", color: "text-emerald-700", bg: "bg-emerald-50" },
  };
  const cfg = typeConfig[insight.type] || typeConfig["synthesis"];

  return (
    <div className="space-y-4">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.bg}`}
      >
        <span className={`text-[11px] font-semibold ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>
      <p className="text-[13px] text-foreground leading-relaxed">
        {insight.content}
      </p>
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Confidence
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${insight.confidence * 100}%` }}
            />
          </div>
          <span className="text-[12px] text-foreground font-semibold font-tabular">
            {Math.round(insight.confidence * 100)}%
          </span>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Source Papers
        </p>
        <p className="text-[12px] text-muted-foreground">
          {insight.sourceIds.length} papers contributed to this insight
        </p>
      </div>
    </div>
  );
}

function QuestionPanelContent({
  question,
}: {
  question: import("@/src/store/canvasStore").QuestionData;
}) {
  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
        <p className="text-[13px] text-foreground leading-relaxed">
          {question.text}
        </p>
      </div>
      {question.answered && question.answer ? (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} className="text-emerald-600" />
            <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
              AI Answer
            </p>
          </div>
          <p className="text-[12px] text-foreground leading-relaxed">
            {question.answer}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-[12px] text-muted-foreground mb-3">
            This question is unanswered. Ask AI to explore it.
          </p>
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors active:scale-95">
            <Sparkles size={12} />
            Ask AI to answer
          </button>
        </div>
      )}
    </div>
  );
}

function ClusterPanelContent({
  cluster,
}: {
  cluster: import("@/src/store/canvasStore").ClusterData;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[15px] font-semibold text-foreground mb-1">
          {cluster.label}
        </h2>
        <p className="text-[12px] text-muted-foreground">{cluster.theme}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-muted">
          <p className="text-[11px] text-muted-foreground mb-1">Papers</p>
          <p className="text-[18px] font-semibold text-foreground font-tabular">
            {cluster.paperCount}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-muted">
          <p className="text-[11px] text-muted-foreground mb-1">Connections</p>
          <p className="text-[18px] font-semibold text-foreground font-tabular">
            7
          </p>
        </div>
      </div>
      <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors">
        <Sparkles size={12} />
        Summarize cluster
      </button>
    </div>
  );
}
