import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Node, Edge } from "reactflow";
import { mockNodes, mockEdges } from "@/src/data/mockPapers";

export type NodeType = "paper" | "insight" | "question" | "note" | "cluster";

export interface PaperData {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  abstract: string;
  tags: string[];
  citations: number;
  aiSummary: string;
  status: "unread" | "reviewing" | "annotated" | "connected" | "synthesized";
}

export interface InsightData {
  id: string;
  content: string;
  sourceIds: string[];
  type: "synthesis" | "contradiction" | "gap" | "theme";
  confidence: number;
}

export interface QuestionData {
  id: string;
  text: string;
  relatedPaperIds: string[];
  answered: boolean;
  answer?: string;
}

export interface NoteData {
  id: string;
  content: string;
  color: string;
}

export interface ClusterData {
  id: string;
  label: string;
  paperCount: number;
  theme: string;
}

export type ResearchNodeData = {
  type: NodeType;
  paper?: PaperData;
  insight?: InsightData;
  question?: QuestionData;
  note?: NoteData;
  cluster?: ClusterData;
  selected?: boolean;
};

export interface RecentPaper {
  id: string;
  title: string;
  year: number;
  venue?: string;
}

export interface CanvasSession {
  id: string;
  title: string;
  createdAt: string;
  lastAccessed: string;
  nodes: Node<ResearchNodeData>[];
  edges: Edge[];
}

export interface CanvasState {
  canvases: CanvasSession[];
  activeCanvasId: string;

  nodes: Node<ResearchNodeData>[];
  edges: Edge[];

  selectedNodeId: string | null;
  sidebarCollapsed: boolean;
  rightPanelOpen: boolean;

  recentPapers: RecentPaper[];

  setNodes: (nodes: Node<ResearchNodeData>[]) => void;

  setEdges: (edges: Edge[]) => void;

  selectNode: (id: string | null) => void;

  toggleSidebar: () => void;

  setSidebarCollapsed: (collapsed: boolean) => void;

  setRightPanel: (open: boolean) => void;

  addNode: (node: Node<ResearchNodeData>) => void;

  removeNode: (id: string) => void;

  createCanvas: (title: string) => string;

  switchCanvas: (id: string) => void;

  deleteCanvas: (id: string) => void;

  addRecentPaper: (paper: RecentPaper) => void;

  removeRecentPaper: (id: string) => void;
}

const defaultCanvas: CanvasSession = {
  id: "canvas-001",
  title: "Transformer Architecture Survey",
  createdAt: "May 18, 2026",
  lastAccessed: "Just now",
  nodes: mockNodes,
  edges: mockEdges,
};

const defaultRecentPapers: RecentPaper[] = [
  {
    id: "rp-001",
    title: "Attention Is All You Need",
    year: 2017,
    venue: "NeurIPS",
  },
  {
    id: "rp-002",
    title: "GPT-4 Technical Report",
    year: 2023,
    venue: "arXiv",
  },
  {
    id: "rp-003",
    title: "Chain-of-Thought Prompting",
    year: 2022,
    venue: "NeurIPS",
  },
  {
    id: "rp-004",
    title: "Retrieval-Augmented Generation",
    year: 2020,
    venue: "NeurIPS",
  },
];

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      canvases: [defaultCanvas],
      activeCanvasId: "canvas-001",

      nodes: mockNodes,
      edges: mockEdges,

      selectedNodeId: null,

      sidebarCollapsed: false,

      rightPanelOpen: false,

      recentPapers: defaultRecentPapers,

      setNodes: (nodes) => {
        const { activeCanvasId, canvases } = get();

        set({
          nodes,

          canvases: canvases.map((canvas) =>
            canvas.id === activeCanvasId
              ? {
                  ...canvas,
                  nodes,
                }
              : canvas
          ),
        });
      },

      setEdges: (edges) => {
        const { activeCanvasId, canvases } = get();

        set({
          edges,

          canvases: canvases.map((canvas) =>
            canvas.id === activeCanvasId
              ? {
                  ...canvas,
                  edges,
                }
              : canvas
          ),
        });
      },

      addNode: (node) => {
        const { activeCanvasId, canvases, nodes } = get();

        const newNodes = [...nodes, node];

        set({
          nodes: newNodes,

          canvases: canvases.map((canvas) =>
            canvas.id === activeCanvasId
              ? {
                  ...canvas,
                  nodes: newNodes,
                }
              : canvas
          ),
        });
      },

      removeNode: (id) => {
        const { activeCanvasId, canvases, nodes, edges } = get();

        const newNodes = nodes.filter((node) => node.id !== id);

        const newEdges = edges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );

        set({
          nodes: newNodes,
          edges: newEdges,

          canvases: canvases.map((canvas) =>
            canvas.id === activeCanvasId
              ? {
                  ...canvas,
                  nodes: newNodes,
                  edges: newEdges,
                }
              : canvas
          ),
        });
      },

      selectNode: (id) =>
        set({
          selectedNodeId: id,
          rightPanelOpen: id !== null,
        }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setSidebarCollapsed: (collapsed) =>
        set({
          sidebarCollapsed: collapsed,
        }),

      setRightPanel: (open) =>
        set({
          rightPanelOpen: open,
        }),

      createCanvas: (title) => {
        const id = `canvas-${Date.now()}`;

        const now = new Date();

        const dateStr = now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        const newCanvas: CanvasSession = {
          id,
          title,

          createdAt: dateStr,

          lastAccessed: "Just now",

          nodes: [],
          edges: [],
        };

        set((state) => ({
          canvases: [...state.canvases, newCanvas],

          activeCanvasId: id,

          nodes: [],
          edges: [],

          selectedNodeId: null,

          rightPanelOpen: false,
        }));

        return id;
      },

      switchCanvas: (id) => {
        const { canvases } = get();

        const canvas = canvases.find((canvas) => canvas.id === id);

        if (!canvas) return;

        set({
          activeCanvasId: id,

          nodes: canvas.nodes,
          edges: canvas.edges,

          selectedNodeId: null,

          rightPanelOpen: false,

          canvases: canvases.map((canvas) =>
            canvas.id === id
              ? {
                  ...canvas,
                  lastAccessed: "Just now",
                }
              : canvas
          ),
        });
      },

      deleteCanvas: (id) => {
        const { canvases, activeCanvasId } = get();

        if (canvases.length <= 1) return;

        const remainingCanvases = canvases.filter((canvas) => canvas.id !== id);

        const activeCanvas =
          activeCanvasId === id
            ? remainingCanvases[0]
            : remainingCanvases.find(
                (canvas) => canvas.id === activeCanvasId
              ) || remainingCanvases[0];

        set({
          canvases: remainingCanvases,

          activeCanvasId: activeCanvas.id,

          nodes: activeCanvas.nodes,
          edges: activeCanvas.edges,

          selectedNodeId: null,

          rightPanelOpen: false,
        });
      },

      addRecentPaper: (paper) => {
        set((state) => ({
          recentPapers: [
            paper,
            ...state.recentPapers.filter((p) => p.id !== paper.id),
          ].slice(0, 20),
        }));
      },

      removeRecentPaper: (id) => {
        set((state) => ({
          recentPapers: state.recentPapers.filter((paper) => paper.id !== id),
        }));
      },
    }),
    {
      name: "research-canvas-store",
    }
  )
);
