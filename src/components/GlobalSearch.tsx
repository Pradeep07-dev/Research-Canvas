"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  Search,
  FileText,
  Lightbulb,
  HelpCircle,
  StickyNote,
  Layers,
  X,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { mockNodes } from "@/src/data/mockPapers";
import { ResearchNodeData } from "@/src/store/canvasStore";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "paper" | "insight" | "question" | "note" | "cluster";
  href: string;
}

function getNodeResults(): SearchResult[] {
  return mockNodes.map((node) => {
    const d = node.data as ResearchNodeData;

    if (d.type === "paper" && d.paper) {
      return {
        id: node.id,
        title: d.paper.title,
        subtitle: `${d.paper.authors.slice(0, 2).join(", ")} · ${
          d.paper.year
        } · ${d.paper.venue}`,
        type: "paper",
        href: "/",
      };
    }

    if (d.type === "insight" && d.insight) {
      return {
        id: node.id,
        title: `${d.insight.content.slice(0, 60)}...`,
        subtitle: `AI ${d.insight.type} · ${Math.round(
          d.insight.confidence * 100
        )}% confidence`,
        type: "insight",
        href: "/",
      };
    }

    if (d.type === "question" && d.question) {
      return {
        id: node.id,
        title: d.question.text,
        subtitle: d.question.answered ? "Answered" : "Open question",
        type: "question",
        href: "/",
      };
    }

    if (d.type === "note" && d.note) {
      return {
        id: node.id,
        title: `${d.note.content.slice(0, 60)}...`,
        subtitle: "Note",
        type: "note",
        href: "/",
      };
    }

    if (d.type === "cluster" && d.cluster) {
      return {
        id: node.id,
        title: d.cluster.label,
        subtitle: `${d.cluster.theme} · ${d.cluster.paperCount} papers`,
        type: "cluster",
        href: "/",
      };
    }

    return {
      id: node.id,
      title: node.id,
      subtitle: "",
      type: d.type,
      href: "/",
    };
  });
}

const typeIcons: Record<string, React.ElementType> = {
  paper: FileText,
  insight: Lightbulb,
  question: HelpCircle,
  note: StickyNote,
  cluster: Layers,
};

const typeColors: Record<string, string> = {
  paper: "text-primary",
  insight: "text-violet-500",
  question: "text-amber-500",
  note: "text-amber-600",
  cluster: "text-violet-600",
};

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const allResults = useMemo(() => getNodeResults(), []);

  const results = useMemo(() => {
    if (!query.trim()) {
      return allResults.slice(0, 6);
    }

    const q = query.toLowerCase();

    return allResults
      .filter(
        (result) =>
          result.title.toLowerCase().includes(q) ||
          result.subtitle.toLowerCase().includes(q) ||
          result.type.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, allResults]);

  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timeout);
  }, [open]);

  const resetSearchState = () => {
    setQuery("");
    setActiveIndex(0);
  };

  const closeSearch = () => {
    resetSearchState();
    onClose();
  };

  const handleSelect = useCallback(
    (result: SearchResult) => {
      resetSearchState();

      onClose();

      router.push(result.href);
    },
    [onClose, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      closeSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));

      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      setActiveIndex((prev) => Math.max(prev - 1, 0));

      return;
    }

    if (e.key === "Enter" && results[activeIndex]) {
      handleSelect(results[activeIndex]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={closeSearch}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-[560px] mx-4 bg-card border border-border rounded-2xl shadow-panel overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search papers, insights, questions..."
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder-muted-foreground outline-none"
          />

          {query && (
            <button
              onClick={resetSearchState}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          <kbd className="text-[10px] text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5 font-mono flex-shrink-0">
            esc
          </kbd>
        </div>

        <div className="py-1.5 max-h-[360px] overflow-y-auto scrollbar-thin">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((result, index) => {
              const ResultIcon = typeIcons[result.type] || FileText;

              const color = typeColors[result.type] || "text-primary";

              return (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left group ${
                    index === activeIndex ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${
                      index === activeIndex ? "bg-background" : ""
                    }`}
                  >
                    <ResultIcon size={13} className={color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-foreground font-medium truncate">
                      {result.title}
                    </p>

                    <p className="text-[11px] text-muted-foreground truncate">
                      {result.subtitle}
                    </p>
                  </div>

                  <ArrowRight
                    size={13}
                    className={`text-muted-foreground transition-opacity ${
                      index === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground">
          <span>
            <kbd className="font-mono bg-muted border border-border rounded px-1 py-0.5">
              ↑↓
            </kbd>{" "}
            navigate
          </span>

          <span>
            <kbd className="font-mono bg-muted border border-border rounded px-1 py-0.5">
              ↵
            </kbd>{" "}
            select
          </span>

          <span>
            <kbd className="font-mono bg-muted border border-border rounded px-1 py-0.5">
              esc
            </kbd>{" "}
            close
          </span>
        </div>
      </div>
    </div>
  );
}
