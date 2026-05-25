"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import GlobalSearch from "./GlobalSearch";
import { Toaster } from "react-hot-toast";
import { Menu } from "lucide-react";

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
        <Sidebar
          onSearchOpen={() => {
            setSearchOpen(true);
            setMobileSidebarOpen(false);
          }}
        />
      </div>

      <main className="flex-1 min-w-0 relative overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card md:hidden flex-shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="text-[14px] font-semibold text-foreground">
            Research Canvas
          </span>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </main>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
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
