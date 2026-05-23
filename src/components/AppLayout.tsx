"use client";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Network,
  Brain,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Layers,
  Plus,
  Search,
  X,
} from "lucide-react";
import AppLogo from "./ui/AppLogo";

const navItems = [
  { label: "Research Canvas", href: "/", icon: Network, badge: null },
  { label: "AI Workspace", href: "/ai-workspace", icon: Brain, badge: "3" },
  {
    label: "Research Sessions",
    href: "/research-sessions",
    icon: Layers,
    badge: null,
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showAddPaper, setShowAddPaper] = useState(false);
  const [newPaperTitle, setNewPaperTitle] = useState("");
  const [newPaperYear, setNewPaperYear] = useState("");

  const recentPapers: any = [];
  const addRecentPaper: any = [];
  const removeRecentPaper: any = [];

  const handleAddPaper = () => {
    const title = newPaperTitle.trim();
    if (!title) return;
    const year = parseInt(newPaperYear) || new Date().getFullYear();
    addRecentPaper({
      id: `rp-${Date.now()}`,
      title,
      year,
    });
    setNewPaperTitle("");
    setNewPaperYear("");
    setShowAddPaper(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-40 md:z-auto
          transition-transform duration-300 ease-in-out
          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        <aside
          className="sidebar-transition flex flex-col h-full border-r border-border bg-card relative z-20 flex-shrink-0"
          style={{ width: collapsed ? 64 : 240 }}
        >
          <div className="flex items-center h-14 px-4 border-b border-border flex-shrink-0">
            {collapsed ? (
              <div className="flex items-center justify-center w-full">
                <AppLogo size={28} />
              </div>
            ) : (
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <AppLogo size={28} />
                <span className="font-semibold text-[15px] text-foreground tracking-tight flex-1 truncate">
                  Research Canvas
                </span>
                <button
                  onClick={() => setCollapsed(true)}
                  className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
                  title="Collapse sidebar"
                >
                  <ChevronLeft size={15} />
                </button>
              </div>
            )}
            {collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
                title="Expand sidebar"
              >
                <ChevronRight size={12} />
              </button>
            )}
          </div>

          {!collapsed && (
            <div className="px-3 py-3 border-b border-border">
              <button
                onClick={searchOpen}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-muted-foreground text-[13px] hover:bg-secondary transition-colors"
              >
                <Search size={13} />
                <span>Search papers...</span>
                <kbd className="ml-auto text-[10px] bg-background border border-border rounded px-1.5 py-0.5 font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto scrollbar-thin py-3">
            <div className="px-2 mb-4">
              {!collapsed && (
                <p className="text-[10px] font-600 uppercase tracking-widest text-muted-foreground px-2 mb-1.5">
                  Workspace
                </p>
              )}
              {navItems?.map((item) => {
                const active = pathname === item?.href;
                return (
                  <Link
                    key={`nav-${item?.href}`}
                    href={item?.href}
                    className={`
                  flex items-center gap-3 px-2.5 py-2 rounded-md mb-0.5 transition-all duration-150
                  ${
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                    title={collapsed ? item?.label : undefined}
                    onClick={(e) => {
                      if (collapsed) {
                      }
                    }}
                  >
                    <item.icon size={16} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="text-[13px] flex-1">
                          {item?.label}
                        </span>
                        {item?.badge && (
                          <span className="text-[10px] font-semibold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 leading-none">
                            {item?.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>

            {!collapsed && (
              <div className="px-2 mb-4">
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Recent Papers
                  </p>
                  <button
                    onClick={() => setShowAddPaper(!showAddPaper)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="Add paper"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {showAddPaper && (
                  <div className="mb-2 p-2 rounded-lg bg-muted border border-border">
                    <input
                      autoFocus
                      value={newPaperTitle}
                      onChange={(e) => setNewPaperTitle(e.target.value)}
                      placeholder="Paper title..."
                      className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-[12px] text-foreground placeholder-muted-foreground outline-none focus:border-primary mb-1.5"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddPaper();
                        if (e.key === "Escape") setShowAddPaper(false);
                      }}
                    />
                    <div className="flex gap-1.5">
                      <input
                        value={newPaperYear}
                        onChange={(e) => setNewPaperYear(e.target.value)}
                        placeholder="Year"
                        type="number"
                        className="w-20 bg-background border border-border rounded-md px-2 py-1.5 text-[12px] text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                      />
                      <button
                        onClick={handleAddPaper}
                        className="flex-1 bg-primary text-primary-foreground rounded-md px-2 py-1.5 text-[11px] font-medium hover:bg-primary/90 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddPaper(false)}
                        className="p-1.5 rounded-md text-muted-foreground hover:bg-background transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                )}

                {recentPapers.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground px-2.5 py-1.5 italic">
                    No papers yet. Click + to add.
                  </p>
                ) : (
                  recentPapers.map((paper: any) => (
                    <div
                      key={`recent-${paper?.id}`}
                      className="flex items-start gap-2 px-2.5 py-1.5 rounded-md hover:bg-muted transition-colors group"
                    >
                      <BookOpen
                        size={12}
                        className="flex-shrink-0 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] text-foreground truncate leading-snug">
                          {paper?.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {paper?.year}
                        </p>
                      </div>
                      <button
                        onClick={() => removeRecentPaper(paper.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-all flex-shrink-0"
                        title="Remove"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {!collapsed && (
              <div className="px-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-1.5">
                  Saved Views
                </p>
                {[
                  { id: "sv-001", label: "Alignment cluster", icon: Star },
                  {
                    id: "sv-002",
                    label: "Architecture overview",
                    icon: BookOpen,
                  },
                  { id: "sv-003", label: "Open questions", icon: Clock },
                ].map((view) => (
                  <button
                    key={`view-${view?.id}`}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <view.icon size={12} className="flex-shrink-0" />
                    <span className="text-[12px]">{view?.label}</span>
                  </button>
                ))}
              </div>
            )}
          </nav>
        </aside>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            fontSize: "13px",
            borderRadius: "10px",
          },
        }}
      />
    </div>
  );
}
